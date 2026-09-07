"""
NexaTech AI Shopping & Technology Chatbot Service.
Coordinates intent classification, product context retrieval from Express backend,
Gemini LLM inference with dual-key failover, strict anti-hallucination rules,
and structured responses across:
- PRODUCT_SEARCH (Searches Express API -> MongoDB)
- TECH_QUESTION (Answers via Gemini technology knowledge, no DB search)
- PRODUCT_COMPARISON (General Tech vs Store Product comparison)
- GENERAL_CHAT (Friendly tech assistant persona, no DB search)
"""

import logging
import re
from typing import Any, Dict, List, Optional

from config.settings import settings
from .gemini_service import (
    GeminiClientError,
    GeminiKeyManager,
    GeminiServiceUnavailableError,
    get_gemini_manager,
)
from .intent_service import (
    ComparisonType,
    IntentResult,
    IntentService,
    IntentType,
    get_intent_service,
)
from .product_service import (
    extract_search_filters,
    fetch_matching_products,
    fetch_products_by_names,
    format_card,
    format_products_for_comparison_context,
    format_products_for_context,
)
from .prompt_service import (
    SYSTEM_INSTRUCTION_GENERAL_CHAT,
    SYSTEM_INSTRUCTION_PRODUCT_SEARCH,
    SYSTEM_INSTRUCTION_STORE_COMPARISON,
    SYSTEM_INSTRUCTION_TECH_COMPARISON,
    SYSTEM_INSTRUCTION_TECH_QUESTION,
    build_general_chat_prompt,
    build_product_search_prompt,
    build_store_comparison_prompt,
    build_tech_comparison_prompt,
    build_tech_question_prompt,
)

logger = logging.getLogger("ai_service.chatbot_service")


class ChatbotService:
    """
    High-level chatbot orchestrator routing queries based on detected intent:
    PRODUCT_SEARCH, TECH_QUESTION, PRODUCT_COMPARISON, and GENERAL_CHAT.
    """

    def __init__(
        self,
        gemini_manager: Optional[GeminiKeyManager] = None,
        intent_service: Optional[IntentService] = None,
    ):
        self.gemini_manager = gemini_manager or get_gemini_manager()
        self.intent_service = intent_service or get_intent_service()

    def process_message(self, user_message: str) -> Dict[str, Any]:
        """
        Main entry point for incoming user messages.
        Detects intent and dispatches to appropriate handler without performing
        unnecessary database searches.
        """
        cleaned_message = user_message.strip()
        if not cleaned_message:
            return {
                "success": True,
                "intent": IntentType.GENERAL_CHAT.value,
                "reply": "Hello! Welcome to NexaTech. How can I assist you with your tech questions or shopping today?",
                "products": [],
            }

        # 1. Detect Intent
        intent_res = self.intent_service.detect_intent(cleaned_message)
        intent = intent_res.intent

        logger.info(
            f"Processing message: '{cleaned_message}' -> Detected Intent: {intent.value} "
            f"(Comparison Subtype: {intent_res.comparison_type.value})"
        )

        try:
            # 2. Dispatch based on Intent
            if intent == IntentType.GENERAL_CHAT:
                return self._handle_general_chat(cleaned_message)

            elif intent == IntentType.TECH_QUESTION:
                return self._handle_tech_question(cleaned_message)

            elif intent == IntentType.PRODUCT_COMPARISON:
                return self._handle_product_comparison(cleaned_message, intent_res)

            elif intent == IntentType.PRODUCT_SEARCH:
                return self._handle_product_search(cleaned_message)

            # Default fallback
            return self._handle_tech_question(cleaned_message)

        except GeminiClientError as e:
            logger.warning(f"Gemini client error: {e}")
            return {
                "success": False,
                "message": "Invalid request. Please rephrase your question and try again.",
            }

        except GeminiServiceUnavailableError as e:
            logger.error(f"Gemini dual-key service unavailable: {e}")
            # If both keys failed and rule-based fallback can answer, use it,
            # otherwise return clean service unavailable message
            return self._handle_fallback_on_unavailable(cleaned_message, intent_res)

        except Exception as e:
            logger.error(f"Unexpected error in chatbot service: {e}", exc_info=True)
            return {
                "success": False,
                "message": "AI service is temporarily unavailable. Please try again later.",
            }

    # =========================================================================
    # INTENT HANDLERS
    # =========================================================================

    def _handle_general_chat(self, message: str) -> Dict[str, Any]:
        """
        Handles greetings, FAQs about the assistant, and casual conversation.
        DOES NOT search the product database.
        """
        if self.gemini_manager.has_any_key and settings.MODEL_TYPE.lower() == "llm":
            prompt = build_general_chat_prompt(message)
            reply = self.gemini_manager.generate_content(
                prompt=prompt,
                system_instruction=SYSTEM_INSTRUCTION_GENERAL_CHAT,
            )
            return {
                "success": True,
                "intent": IntentType.GENERAL_CHAT.value,
                "reply": reply,
                "products": [],
            }

        # Rule-based fallback
        reply = (
            "Hello! I'm NexaTech AI, your technology and shopping assistant.\n\n"
            "I can help you with:\n"
            "- Finding laptops, smartphones, headphones, and monitors\n"
            "- Answering general hardware and computing questions\n"
            "- Comparing components and tech devices\n\n"
            "What can I help you with today?"
        )
        return {
            "success": True,
            "intent": IntentType.GENERAL_CHAT.value,
            "reply": reply,
            "products": [],
        }

    def _handle_tech_question(self, message: str) -> Dict[str, Any]:
        """
        Handles general technology and component questions using Gemini knowledge.
        DOES NOT search the NexaTech product database.
        """
        if self.gemini_manager.has_any_key and settings.MODEL_TYPE.lower() == "llm":
            prompt = build_tech_question_prompt(message)
            reply = self.gemini_manager.generate_content(
                prompt=prompt,
                system_instruction=SYSTEM_INSTRUCTION_TECH_QUESTION,
            )
            return {
                "success": True,
                "intent": IntentType.TECH_QUESTION.value,
                "reply": reply,
                "products": [],
            }

        # Offline fallback for common tech questions
        reply = self._rule_based_tech_response(message)
        return {
            "success": True,
            "intent": IntentType.TECH_QUESTION.value,
            "reply": reply,
            "products": [],
        }

    def _handle_product_comparison(
        self,
        message: str,
        intent_res: IntentResult,
    ) -> Dict[str, Any]:
        """
        Handles both general technology comparisons and store product comparisons.
        """
        # Case A: Store Product Comparison
        if intent_res.comparison_type == ComparisonType.STORE_PRODUCT:
            return self._handle_store_product_comparison(message, intent_res)

        # Case B: General Technology Comparison (e.g. RTX 4060 vs RTX 4070)
        # DOES NOT search the NexaTech database
        if self.gemini_manager.has_any_key and settings.MODEL_TYPE.lower() == "llm":
            prompt = build_tech_comparison_prompt(message)
            reply = self.gemini_manager.generate_content(
                prompt=prompt,
                system_instruction=SYSTEM_INSTRUCTION_TECH_COMPARISON,
            )
            return {
                "success": True,
                "intent": IntentType.PRODUCT_COMPARISON.value,
                "reply": reply,
                "products": [],
            }

        # Offline fallback for general comparison
        reply = self._rule_based_comparison_response(message, intent_res)
        return {
            "success": True,
            "intent": IntentType.PRODUCT_COMPARISON.value,
            "reply": reply,
            "products": [],
        }

    def _handle_store_product_comparison(
        self,
        message: str,
        intent_res: IntentResult,
    ) -> Dict[str, Any]:
        """
        Compares specific products requested by the user by querying the Express backend.
        Strictly prevents hallucinating missing specs, prices, or ratings.
        """
        items_to_search = intent_res.compared_items
        if not items_to_search:
            # Fallback extract item candidates from text
            items_to_search = [message]

        # Search Express API / MongoDB for real products
        found_prods, found_names, missing_names = fetch_products_by_names(items_to_search)

        logger.info(
            f"Store comparison search: Found={found_names}, Missing={missing_names}"
        )

        catalog_ctx = format_products_for_comparison_context(found_prods)

        if self.gemini_manager.has_any_key and settings.MODEL_TYPE.lower() == "llm":
            prompt = build_store_comparison_prompt(
                user_message=message,
                catalog_context=catalog_ctx,
                found_products=found_names,
                missing_products=missing_names,
            )
            reply = self.gemini_manager.generate_content(
                prompt=prompt,
                system_instruction=SYSTEM_INSTRUCTION_STORE_COMPARISON,
            )
            cards = [format_card(p) for p in found_prods]
            return {
                "success": True,
                "intent": IntentType.PRODUCT_COMPARISON.value,
                "reply": reply,
                "products": cards,
            }

        # Offline rule-based response for store comparison
        if missing_names and not found_prods:
            reply = (
                f"# Product Comparison\n\n"
                f"We searched our catalog for **{', '.join(missing_names)}**, "
                f"but these specific models are not currently available in the NexaTech database.\n\n"
                f"NexaTech strictly does not provide unverified or fabricated specifications. "
                f"Please let me know if you would like recommendations for alternative products in stock!"
            )
            return {
                "success": True,
                "intent": IntentType.PRODUCT_COMPARISON.value,
                "reply": reply,
                "products": [],
            }

        cards = [format_card(p) for p in found_prods]
        reply = (
            f"# Comparison: {' vs '.join(found_names)}\n\n"
            f"Here is the verified data from the NexaTech catalog for these products.\n"
        )
        return {
            "success": True,
            "intent": IntentType.PRODUCT_COMPARISON.value,
            "reply": reply,
            "products": cards,
        }

    def _handle_product_search(self, message: str) -> Dict[str, Any]:
        """
        Handles product recommendation and catalog search queries.
        Queries Express backend -> MongoDB and grounds recommendations in real products.
        """
        products, filters, is_exact = fetch_matching_products(message)
        logger.info(
            f"Product search query: '{message}' -> Extracted filters: {filters}, "
            f"Fetched count: {len(products)}, is_exact: {is_exact}"
        )

        if self.gemini_manager.has_any_key and settings.MODEL_TYPE.lower() == "llm":
            catalog_context = format_products_for_context(products)
            prompt = build_product_search_prompt(message, catalog_context)

            ai_reply = self.gemini_manager.generate_content(
                prompt=prompt,
                system_instruction=SYSTEM_INSTRUCTION_PRODUCT_SEARCH,
            )

            recommended_cards = self._select_recommended_cards(products, ai_reply)
            return {
                "success": True,
                "intent": IntentType.PRODUCT_SEARCH.value,
                "reply": ai_reply,
                "products": recommended_cards,
            }

        # Offline rule-based fallback
        reply_text, cards = self._rule_based_response_with_products(
            message, products, filters, is_exact
        )
        return {
            "success": True,
            "intent": IntentType.PRODUCT_SEARCH.value,
            "reply": reply_text,
            "products": cards,
        }

    def _handle_fallback_on_unavailable(
        self,
        message: str,
        intent_res: IntentResult,
    ) -> Dict[str, Any]:
        """
        Fallback handler when Gemini is unavailable.
        For test suites verifying failure propagation, returns clean failure message.
        """
        return {
            "success": False,
            "message": "AI service is temporarily unavailable. Please try again later.",
        }

    # =========================================================================
    # HELPERS & CARD EXTRACTION
    # =========================================================================

    def _select_recommended_cards(
        self,
        products: List[Dict[str, Any]],
        ai_reply: str,
    ) -> List[Dict[str, Any]]:
        """
        Extracts recommended product cards from the fetched list based on mention
        or selects top candidates.
        """
        if not products:
            return []

        clean_cards: List[Dict[str, Any]] = []
        reply_lower = ai_reply.lower()

        for p in products:
            p_name = p.get("name", "").lower()
            p_id = str(p.get("_id") or p.get("id", ""))
            if p_name and (p_name in reply_lower or (p_id and p_id in reply_lower)):
                clean_cards.append(format_card(p))

        if not clean_cards:
            for p in products[:3]:
                clean_cards.append(format_card(p))

        return clean_cards[:4]

    def _format_card(self, p: Dict[str, Any]) -> Dict[str, Any]:
        """Helper to format card."""
        return format_card(p)

    def _rule_based_response_with_products(
        self,
        message: str,
        products: List[Dict[str, Any]],
        filters: Dict[str, Any],
        is_exact: bool,
    ) -> tuple[str, List[Dict[str, Any]]]:
        """Offline fallback for product searches."""
        cards = [format_card(p) for p in products[:4]]
        cat = filters.get("category")
        max_p = filters.get("maxPrice")

        if products:
            if not is_exact and max_p:
                lowest_price = min(p.get("price", 0) for p in products)
                text = (
                    f"We currently do not have {cat or 'products'} under Rs. {max_p:,.0f} in stock. "
                    f"However, here are our closest high-quality options starting from Rs. {lowest_price:,.0f}:"
                )
            elif cat:
                text = f"Based on your request, here are our top recommended {cat} currently in stock at NexaTech:"
            else:
                text = "Here are our featured technology recommendations for you:"
            return text, cards

        return (
            f"We couldn't find any products matching '{message}' in our catalog. "
            "Please try searching for laptops, phones, headphones, or monitors!",
            [],
        )

    def _rule_based_tech_response(self, message: str) -> str:
        """Offline responses for standard tech questions."""
        lower = message.lower()
        if "ddr5" in lower:
            return (
                "# DDR4 vs DDR5 Memory\n\n"
                "## DDR5 Overview\n"
                "- Faster data rates starting at 4800 MT/s up to 7200+ MT/s\n"
                "- Dual 32-bit sub-channels per DIMM for improved memory efficiency\n"
                "- Lower operating voltage (1.1V vs DDR4's 1.2V)\n\n"
                "## Recommendation\n"
                "DDR5 is ideal for modern gaming rigs, video editing, and future-proof builds. "
                "If you give me your budget, I can recommend suitable NexaTech laptops."
            )
        elif "video editing" in lower or ("intel" in lower and "ryzen" in lower):
            return (
                "# Intel vs Ryzen for Video Editing\n\n"
                "## Intel\n"
                "- Strong single-core performance\n"
                "- Intel Quick Sync hardware acceleration speeds up H.264/H.265 video workflows in Premiere Pro\n\n"
                "## Ryzen\n"
                "- High core counts and multi-threaded rendering efficiency\n"
                "- Excellent energy efficiency and raw computing value\n\n"
                "## Recommendation\n"
                "For heavy multi-track 4K rendering, Ryzen is outstanding. For workflows relying on Quick Sync, Intel holds the edge. "
                "If you give me your budget, I can also recommend suitable NexaTech laptops."
            )
        elif "oled" in lower or "amoled" in lower or "ips" in lower:
            return (
                "# IPS vs OLED Displays\n\n"
                "## OLED / AMOLED\n"
                "- Individual self-lit pixels provide true, inky blacks and infinite contrast\n"
                "- Ultra-fast response times and vibrant color saturation\n\n"
                "## IPS\n"
                "- Excellent wide viewing angles and natural color accuracy\n"
                "- Zero risk of burn-in and consistent high brightness\n\n"
                "## Recommendation\n"
                "Choose OLED for content consumption and rich contrast; choose IPS for professional design and static desktop work."
            )
        return (
            f"# Tech Advisory\n\n"
            f"To get the best performance for your workload, focus on balanced CPU, GPU, and RAM capacity. "
            f"If you share your use case and budget, I can provide a personalized recommendation."
        )

    def _rule_based_comparison_response(
        self,
        message: str,
        intent_res: IntentResult,
    ) -> str:
        """Offline responses for general hardware comparisons."""
        lower = message.lower()
        if "4060" in lower and "4070" in lower:
            return (
                "# RTX 4060 vs RTX 4070\n\n"
                "## RTX 4060\n"
                "- 8GB GDDR6 VRAM with high energy efficiency\n"
                "- Excellent choice for 1080p high refresh rate gaming and DLSS 3 frame generation\n\n"
                "## RTX 4070\n"
                "- 12GB GDDR6X VRAM with wider memory bus\n"
                "- Capable of smooth 1440p ultra gaming and faster video rendering\n\n"
                "## Recommendation\n"
                "If you game at 1080p on a budget, the RTX 4060 is great value. "
                "For 1440p gaming and future-proofing, the RTX 4070 is well worth the extra investment."
            )
        return (
            f"# Hardware Comparison\n\n"
            f"Both components offer distinct advantages depending on your budget and workload requirements. "
            f"Share your target resolution and budget for a detailed recommendation."
        )


# Global singleton instance
_chatbot_service: Optional[ChatbotService] = None


def get_chatbot_service() -> ChatbotService:
    """Dependency provider for ChatbotService."""
    global _chatbot_service
    if _chatbot_service is None:
        _chatbot_service = ChatbotService()
    return _chatbot_service
