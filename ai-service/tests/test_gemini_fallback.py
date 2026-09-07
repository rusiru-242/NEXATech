"""
Automated test suite verifying Google Gemini dual-key fallback,
transient error recovery, safe logging, and edge case handling.
"""

import logging
from unittest.mock import MagicMock
import pytest
from fastapi.testclient import TestClient
from google.genai.errors import APIError

from app import app
from services.gemini_service import (
    GeminiKeyManager,
    GeminiClientError,
    GeminiServiceUnavailableError
)
from services.chatbot_service import ChatbotService


def make_mock_response(text: str):
    """Helper to mock a successful Gemini response."""
    resp = MagicMock()
    resp.text = text
    return resp


def make_api_error(code: int, status_str: str, message: str = "Error"):
    """Helper to create google.genai.errors.APIError."""
    return APIError(code, {"error": {"code": code, "message": message, "status": status_str}})


# =====================================================================
# Scenario 1: Key 1 works normally
# =====================================================================
def test_scenario_1_key_1_works():
    mock_client_1 = MagicMock()
    mock_client_1.models.generate_content.return_value = make_mock_response("Primary Gemini reply")

    mock_client_2 = MagicMock()

    def client_factory(key: str):
        if key == "test-key-1":
            return mock_client_1
        return mock_client_2

    manager = GeminiKeyManager(
        key_1="test-key-1",
        key_2="test-key-2",
        model="gemini-2.5-flash",
        client_factory=client_factory
    )

    result = manager.generate_content("Hello laptop recommendations")
    assert result == "Primary Gemini reply"
    assert mock_client_1.models.generate_content.call_count == 1
    assert mock_client_2.models.generate_content.call_count == 0


# =====================================================================
# Scenario 2: Key 1 gets 429 / RESOURCE_EXHAUSTED and Key 2 works
# =====================================================================
def test_scenario_2_key_1_gets_429_key_2_works(caplog):
    mock_client_1 = MagicMock()
    mock_client_1.models.generate_content.side_effect = make_api_error(429, "RESOURCE_EXHAUSTED", "Rate limit exceeded")

    mock_client_2 = MagicMock()
    mock_client_2.models.generate_content.return_value = make_mock_response("Fallback Gemini reply")

    def client_factory(key: str):
        if key == "test-key-1":
            return mock_client_1
        return mock_client_2

    manager = GeminiKeyManager(
        key_1="test-key-1",
        key_2="test-key-2",
        model="gemini-2.5-flash",
        client_factory=client_factory
    )

    with caplog.at_level(logging.WARNING):
        result = manager.generate_content("Need phones")

    assert result == "Fallback Gemini reply"
    assert mock_client_1.models.generate_content.call_count == 1
    assert mock_client_2.models.generate_content.call_count == 1

    # Verify safe logging was recorded without exposing secret keys
    log_text = caplog.text
    assert "Gemini primary unavailable" in log_text
    assert "trying fallback" in log_text
    assert "test-key-1" not in log_text
    assert "test-key-2" not in log_text


# =====================================================================
# Scenario 3: Key 1 fails and Key 2 fails
# =====================================================================
def test_scenario_3_both_keys_fail():
    mock_client_1 = MagicMock()
    mock_client_1.models.generate_content.side_effect = make_api_error(429, "RESOURCE_EXHAUSTED")

    mock_client_2 = MagicMock()
    mock_client_2.models.generate_content.side_effect = make_api_error(503, "UNAVAILABLE", "Server temporarily overloaded")

    def client_factory(key: str):
        if key == "test-key-1":
            return mock_client_1
        return mock_client_2

    manager = GeminiKeyManager(
        key_1="test-key-1",
        key_2="test-key-2",
        model="gemini-2.5-flash",
        client_factory=client_factory
    )

    # Key manager should raise GeminiServiceUnavailableError
    with pytest.raises(GeminiServiceUnavailableError):
        manager.generate_content("Find keyboards")

    # ChatbotService translates this to the clean user response
    chatbot = ChatbotService(gemini_manager=manager)
    res = chatbot.process_message("Find keyboards")
    assert res["success"] is False
    assert res["message"] == "AI service is temporarily unavailable. Please try again later."
    assert "test-key-1" not in str(res)
    assert "test-key-2" not in str(res)


# =====================================================================
# Scenario 4: Missing Key 1 (only Key 2 is configured)
# =====================================================================
def test_scenario_4_missing_key_1(caplog):
    mock_client_2 = MagicMock()
    mock_client_2.models.generate_content.return_value = make_mock_response("Reply from Key 2 alone")

    def client_factory(key: str):
        return mock_client_2

    manager = GeminiKeyManager(
        key_1="",  # Missing Key 1
        key_2="test-key-2",
        model="gemini-2.5-flash",
        client_factory=client_factory
    )

    with caplog.at_level(logging.WARNING):
        result = manager.generate_content("Check discounts")

    assert result == "Reply from Key 2 alone"
    assert "Gemini primary unavailable" in caplog.text
    assert "trying fallback" in caplog.text


# =====================================================================
# Scenario 5: Missing Key 2 (only Key 1 is configured)
# =====================================================================
def test_scenario_5_missing_key_2_success():
    # If Key 1 works, it succeeds normally
    mock_client_1 = MagicMock()
    mock_client_1.models.generate_content.return_value = make_mock_response("Reply from Key 1 alone")

    def client_factory(key: str):
        return mock_client_1

    manager = GeminiKeyManager(
        key_1="test-key-1",
        key_2="",  # Missing Key 2
        model="gemini-2.5-flash",
        client_factory=client_factory
    )

    result = manager.generate_content("Check shipping")
    assert result == "Reply from Key 1 alone"


def test_scenario_5_missing_key_2_failure():
    # If Key 1 fails and Key 2 is missing, raises GeminiServiceUnavailableError cleanly
    mock_client_1 = MagicMock()
    mock_client_1.models.generate_content.side_effect = make_api_error(429, "RESOURCE_EXHAUSTED")

    def client_factory(key: str):
        return mock_client_1

    manager = GeminiKeyManager(
        key_1="test-key-1",
        key_2="",  # Missing Key 2
        model="gemini-2.5-flash",
        client_factory=client_factory
    )

    with pytest.raises(GeminiServiceUnavailableError):
        manager.generate_content("Check returns")


# =====================================================================
# Scenario 6: Non-retryable 400 Bad Request does NOT switch keys
# =====================================================================
def test_scenario_6_400_does_not_switch_keys():
    mock_client_1 = MagicMock()
    mock_client_1.models.generate_content.side_effect = make_api_error(400, "INVALID_ARGUMENT", "Invalid prompt argument")

    mock_client_2 = MagicMock()

    def client_factory(key: str):
        if key == "test-key-1":
            return mock_client_1
        return mock_client_2

    manager = GeminiKeyManager(
        key_1="test-key-1",
        key_2="test-key-2",
        model="gemini-2.5-flash",
        client_factory=client_factory
    )

    with pytest.raises(GeminiClientError):
        manager.generate_content("Bad request test")

    # Ensure Key 2 was NEVER called for a 400 Bad Request
    assert mock_client_1.models.generate_content.call_count == 1
    assert mock_client_2.models.generate_content.call_count == 0


# =====================================================================
# End-to-End FastAPI Tests via TestClient
# =====================================================================
def test_health_endpoint():
    client = TestClient(app)
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert data["service"] == "NexaTech AI Shopping Microservice"
    assert "gemini_model" in data
    # Verify no secret key is exposed in /health
    assert "api_key" not in str(data).lower()


def test_chat_endpoint_rule_based_fallback():
    # When no Gemini keys configured, falls back to rule-based assistant
    client = TestClient(app)
    resp = client.post("/chat", json={"message": "Can you recommend laptops?"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "laptop" in data["reply"].lower()


def test_chat_endpoint_both_keys_fail_returns_clean_response():
    # End-to-end test when both Gemini keys fail
    from services.chatbot_service import get_chatbot_service

    mock_client_1 = MagicMock()
    mock_client_1.models.generate_content.side_effect = make_api_error(429, "RESOURCE_EXHAUSTED")

    mock_client_2 = MagicMock()
    mock_client_2.models.generate_content.side_effect = make_api_error(429, "RESOURCE_EXHAUSTED")

    def client_factory(key: str):
        if key == "key-1":
            return mock_client_1
        return mock_client_2

    manager = GeminiKeyManager(
        key_1="key-1",
        key_2="key-2",
        model="gemini-2.5-flash",
        client_factory=client_factory
    )
    mock_chatbot = ChatbotService(gemini_manager=manager)

    # Override the chatbot dependency in app
    app.dependency_overrides[get_chatbot_service] = lambda: mock_chatbot

    try:
        client = TestClient(app)
        resp = client.post("/chat", json={"message": "Hello, what are your best headphones?"})
        assert resp.status_code == 200
        data = resp.json()
        assert data == {
            "success": False,
            "message": "AI service is temporarily unavailable. Please try again later."
        }
        # Verify secret keys are NEVER leaked in response
        assert "key-1" not in str(data)
        assert "key-2" not in str(data)
    finally:
        app.dependency_overrides.clear()

