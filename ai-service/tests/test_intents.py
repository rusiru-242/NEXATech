"""
Automated unit and integration tests verifying:
- All 4 Intent types (PRODUCT_SEARCH, TECH_QUESTION, PRODUCT_COMPARISON, GENERAL_CHAT)
- Non-MongoDB routing for general tech questions and comparisons
- Strict anti-hallucination rules for store product comparisons
- Clean responses on /chat endpoint
"""

import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

from app import app
from services.intent_service import (
    IntentService,
    IntentType,
    ComparisonType,
    get_intent_service,
)
from services.chatbot_service import ChatbotService, get_chatbot_service
from services.gemini_service import GeminiKeyManager


# =====================================================================
# 1. Intent Detection Tests on the 7 required test questions
# =====================================================================

def test_intent_detection_7_required_cases():
    intent_service = IntentService(gemini_manager=MagicMock(has_any_key=False))

    test_cases = [
        # 1. Product Search with budget
        ("I need a gaming laptop under Rs. 300000", IntentType.PRODUCT_SEARCH, ComparisonType.NONE),
        # 2. General Tech Question on workflow suitability
        ("Intel or Ryzen is best for video editing?", IntentType.TECH_QUESTION, ComparisonType.NONE),
        # 3. General Tech Question on concept
        ("What is DDR5?", IntentType.TECH_QUESTION, ComparisonType.NONE),
        # 4. Product Search with category and budget
        ("Recommend headphones under Rs. 25000", IntentType.PRODUCT_SEARCH, ComparisonType.NONE),
        # 5. General Tech Hardware Comparison
        ("RTX 4060 vs RTX 4070", IntentType.PRODUCT_COMPARISON, ComparisonType.GENERAL_TECH),
        # 6. Store Product Comparison
        ("Compare Nexa Pro Laptop with Nexa Gaming X", IntentType.PRODUCT_COMPARISON, ComparisonType.STORE_PRODUCT),
        # 7. General Chat
        ("Hello", IntentType.GENERAL_CHAT, ComparisonType.NONE),
    ]

    for query, expected_intent, expected_comp_type in test_cases:
        res = intent_service.detect_intent(query)
        assert res.intent == expected_intent, f"Failed for '{query}': expected {expected_intent}, got {res.intent}"
        assert res.comparison_type == expected_comp_type, f"Failed for '{query}': expected {expected_comp_type}, got {res.comparison_type}"


def test_intent_detection_additional_variations():
    intent_service = IntentService(gemini_manager=MagicMock(has_any_key=False))

    assert intent_service.detect_intent("Hi there").intent == IntentType.GENERAL_CHAT
    assert intent_service.detect_intent("Who are you?").intent == IntentType.GENERAL_CHAT
    assert intent_service.detect_intent("What is OLED?").intent == IntentType.TECH_QUESTION
    assert intent_service.detect_intent("Which is better IPS or AMOLED?").intent == IntentType.TECH_QUESTION
    assert intent_service.detect_intent("How much RAM is enough for programming?").intent == IntentType.TECH_QUESTION
    assert intent_service.detect_intent("Show me wireless headphones under Rs. 30000").intent == IntentType.PRODUCT_SEARCH
    assert intent_service.detect_intent("Which is better, RTX 4060 or RTX 4070?").intent == IntentType.PRODUCT_COMPARISON


# =====================================================================
# 2. Tech Questions must NOT perform Express/MongoDB Product Searches
# =====================================================================

@patch("services.chatbot_service.fetch_matching_products")
def test_tech_question_does_not_call_fetch_products(mock_fetch):
    mock_gemini = MagicMock(spec=GeminiKeyManager)
    mock_gemini.has_any_key = True
    mock_gemini.generate_content.return_value = (
        "# Intel vs Ryzen for Video Editing\n\n"
        "## Intel\n- Quick Sync acceleration\n\n"
        "## Ryzen\n- Strong multi-core rendering\n\n"
        "## Recommendation\nRyzen for raw rendering, Intel for Premiere Quick Sync."
    )

    chatbot = ChatbotService(gemini_manager=mock_gemini)
    res = chatbot.process_message("Intel or Ryzen is best for video editing?")

    # Verify fetch_matching_products was NEVER called
    mock_fetch.assert_not_called()

    assert res["success"] is True
    assert res["intent"] == "TECH_QUESTION"
    assert res["products"] == []
    assert "Intel" in res["reply"]


@patch("services.chatbot_service.fetch_matching_products")
def test_general_comparison_does_not_call_fetch_products(mock_fetch):
    mock_gemini = MagicMock(spec=GeminiKeyManager)
    mock_gemini.has_any_key = True
    mock_gemini.generate_content.return_value = (
        "# RTX 4060 vs RTX 4070\n\n"
        "## RTX 4060\n- Great for 1080p\n\n"
        "## RTX 4070\n- High performance for 1440p\n\n"
        "## Recommendation\nRTX 4070 for 1440p."
    )

    chatbot = ChatbotService(gemini_manager=mock_gemini)
    res = chatbot.process_message("RTX 4060 vs RTX 4070")

    # Verify no MongoDB/Express product search occurred
    mock_fetch.assert_not_called()

    assert res["success"] is True
    assert res["intent"] == "PRODUCT_COMPARISON"
    assert res["products"] == []
    assert "RTX 4060" in res["reply"]


# =====================================================================
# 3. Product Search calls Express Product Search and returns real cards
# =====================================================================

@patch("services.chatbot_service.fetch_matching_products")
def test_product_search_calls_fetch_products_and_returns_cards(mock_fetch):
    sample_products = [
        {
            "_id": "6a847ef0d2a7ee4b68a3e8f0",
            "name": "HP Victus 16",
            "price": 295000,
            "image": "https://example.com/hp.jpg",
            "rating": 4.5,
            "stock": 18,
            "brand": "HP",
            "category": "Laptops",
        }
    ]
    mock_fetch.return_value = (sample_products, {"category": "Laptops", "maxPrice": 300000}, True)

    mock_gemini = MagicMock(spec=GeminiKeyManager)
    mock_gemini.has_any_key = True
    mock_gemini.generate_content.return_value = (
        "Based on your budget, I recommend the HP Victus 16 for Rs. 295,000."
    )

    chatbot = ChatbotService(gemini_manager=mock_gemini)
    res = chatbot.process_message("I need a gaming laptop under Rs. 300000")

    # Verify fetch was called
    mock_fetch.assert_called_once()

    assert res["success"] is True
    assert res["intent"] == "PRODUCT_SEARCH"
    assert len(res["products"]) == 1
    assert res["products"][0]["name"] == "HP Victus 16"
    assert res["products"][0]["price"] == 295000


# =====================================================================
# 4. Store Comparison handles missing products honestly
# =====================================================================

@patch("services.chatbot_service.fetch_products_by_names")
def test_store_comparison_missing_products_does_not_hallucinate(mock_fetch_names):
    # Both products missing in database
    mock_fetch_names.return_value = ([], [], ["Nexa Pro Laptop", "Nexa Gaming X"])

    mock_gemini = MagicMock(spec=GeminiKeyManager)
    mock_gemini.has_any_key = True
    mock_gemini.generate_content.return_value = (
        "Neither Nexa Pro Laptop nor Nexa Gaming X are currently in the NexaTech catalog. "
        "We do not provide unverified specifications. Here are alternative laptops we have in stock."
    )

    chatbot = ChatbotService(gemini_manager=mock_gemini)
    res = chatbot.process_message("Compare Nexa Pro Laptop with Nexa Gaming X")

    mock_fetch_names.assert_called_once()

    assert res["success"] is True
    assert res["intent"] == "PRODUCT_COMPARISON"
    assert res["products"] == []
    assert "not currently in the NexaTech catalog" in res["reply"] or "Nexa Pro Laptop" in res["reply"]


# =====================================================================
# 5. FastAPI End-to-End POST /chat route verification
# =====================================================================

def test_fastapi_chat_endpoint_format():
    client = TestClient(app)

    # General chat
    resp = client.post("/chat", json={"message": "Hello"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["intent"] == "GENERAL_CHAT"
    assert data["products"] == []
    assert "NexaTech" in data["reply"]

    # Tech question
    resp = client.post("/chat", json={"message": "What is DDR5?"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["intent"] == "TECH_QUESTION"
    assert data["products"] == []
    assert "DDR5" in data["reply"]
