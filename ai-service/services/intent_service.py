"""
Intent Detection Service for NexaTech AI Shopping Assistant.
Classifies customer queries into:
- PRODUCT_SEARCH: Shopping queries requiring Express API / MongoDB product search.
- TECH_QUESTION: General technology and computing questions answered via Gemini.
- PRODUCT_COMPARISON: Hardware and product comparisons (General Tech vs Store Products).
- GENERAL_CHAT: Greetings and assistant persona queries.
"""

import json
import logging
import re
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple

from pydantic import BaseModel, Field

from .gemini_service import GeminiKeyManager, get_gemini_manager

logger = logging.getLogger("ai_service.intent_service")


class IntentType(str, Enum):
    PRODUCT_SEARCH = "PRODUCT_SEARCH"
    TECH_QUESTION = "TECH_QUESTION"
    PRODUCT_COMPARISON = "PRODUCT_COMPARISON"
    GENERAL_CHAT = "GENERAL_CHAT"


class ComparisonType(str, Enum):
    NONE = "NONE"
    GENERAL_TECH = "GENERAL_TECH"
    STORE_PRODUCT = "STORE_PRODUCT"


class IntentResult(BaseModel):
    intent: IntentType = Field(..., description="Detected high-level intent")
    comparison_type: ComparisonType = Field(
        ComparisonType.NONE,
        description="For PRODUCT_COMPARISON: GENERAL_TECH or STORE_PRODUCT"
    )
    compared_items: List[str] = Field(
        default_factory=list,
        description="List of extracted item names being compared"
    )
    confidence: float = Field(1.0, description="Detection confidence score")


INTENT_CLASSIFICATION_SYSTEM_INSTRUCTION = """
You are an accurate Intent Classifier for the NexaTech AI Shopping and Technology Assistant.
Classify the user message into EXACTLY ONE of the following 4 intents:

1. PRODUCT_SEARCH:
The user wants to find, browse, buy, or get recommendations for products in the NexaTech store catalog.
Examples:
- "I need a gaming laptop under Rs. 300000"
- "Recommend a phone with a good camera"
- "Show me wireless headphones under Rs. 30000"
- "I need a laptop for programming"
- "Recommend headphones under Rs. 25000"
- "Do you have any 144Hz monitors?"

2. TECH_QUESTION:
The user is asking a general technology, computing, hardware, or component question, seeking an explanation, definition, advice on sizing/specs, or asking which tech platform is better for a workload.
Examples:
- "Intel or Ryzen is best for video editing?"
- "Intel or Ryzen is better for video editing?"
- "What is the difference between DDR4 and DDR5?"
- "What is DDR5?"
- "Is RTX 4060 good for gaming?"
- "What does OLED mean?"
- "Which is better IPS or AMOLED?"
- "How much RAM is enough for programming?"

3. PRODUCT_COMPARISON:
The user wants a direct comparison between two or more specific products, models, or components (A vs B, compare X and Y, which is better: A or B, should I buy A or B).
Examples:
- "RTX 4060 vs RTX 4070"
- "Which is better, RTX 4060 or RTX 4070?"
- "Should I buy i5 or Ryzen 5?"
- "Compare these two laptops"
- "Compare Nexa Pro Laptop with Nexa Gaming X"

4. GENERAL_CHAT:
The user is greeting, saying goodbye, or asking about the assistant's identity and capabilities.
Examples:
- "Hello"
- "Hi"
- "Hey"
- "Who are you?"
- "What can you do?"
- "Good morning"

Respond ONLY with a valid JSON object matching this schema:
{
  "intent": "PRODUCT_SEARCH" | "TECH_QUESTION" | "PRODUCT_COMPARISON" | "GENERAL_CHAT",
  "comparison_type": "NONE" | "GENERAL_TECH" | "STORE_PRODUCT",
  "compared_items": ["item1", "item2"]
}
"""


class IntentService:
    """
    Hybrid intent detector combining high-speed pattern recognition with
    Gemini LLM-based classification and fail-safe offline rules.
    """

    def __init__(self, gemini_manager: Optional[GeminiKeyManager] = None):
        self.gemini_manager = gemini_manager or get_gemini_manager()

    def detect_intent(self, message: str) -> IntentResult:
        """
        Classifies the user message into one of the 4 supported intents.
        """
        cleaned = message.strip()
        if not cleaned:
            return IntentResult(
                intent=IntentType.GENERAL_CHAT,
                comparison_type=ComparisonType.NONE
            )

        # 1. Check high-confidence fast patterns first (instant & deterministic)
        rule_result = self._rule_based_classify(cleaned)
        if rule_result and rule_result.confidence >= 0.95:
            logger.info(
                f"Fast rule-based intent match: '{cleaned}' -> {rule_result.intent} "
                f"(comparison_type={rule_result.comparison_type})"
            )
            return rule_result

        # 2. Use Gemini LLM classification if configured
        if self.gemini_manager.has_any_key:
            try:
                llm_result = self._classify_with_gemini(cleaned)
                if llm_result:
                    logger.info(
                        f"Gemini LLM intent match: '{cleaned}' -> {llm_result.intent} "
                        f"(comparison_type={llm_result.comparison_type})"
                    )
                    return llm_result
            except Exception as e:
                logger.warning(f"Gemini intent classification error: {e}. Falling back to rule-based.")

        # 3. Fallback to rule-based classification
        fallback_result = self._rule_based_classify(cleaned) or IntentResult(
            intent=IntentType.TECH_QUESTION,
            comparison_type=ComparisonType.NONE
        )
        logger.info(f"Fallback intent match: '{cleaned}' -> {fallback_result.intent}")
        return fallback_result

    def _rule_based_classify(self, text: str) -> Optional[IntentResult]:
        """
        Deterministic regex and keyword-based classification covering standard phrases.
        """
        lower = text.lower().strip()

        # A. GENERAL_CHAT
        # Pure greetings or identity inquiries
        is_greeting = bool(re.search(
            r"^(hello|hi|hey|howdy|greetings|namaste|ayubowan)(\s+(there|everyone|all|nexatech|assistant|friend))?[!., ]*$",
            lower
        )) or bool(re.search(
            r"^(good\s*(morning|afternoon|evening|day))(\s+(there|everyone|all|nexatech|assistant))?[!., ]*$",
            lower
        ))
        is_identity = bool(re.search(
            r"\b(who are you|what are you|what can you do|your name|what is your name|tell me about yourself)\b",
            lower
        ))
        is_polite = bool(re.search(r"^(thanks|thank you|bye|goodbye)[!., ]*$", lower))

        if is_greeting or is_identity or is_polite:
            return IntentResult(
                intent=IntentType.GENERAL_CHAT,
                comparison_type=ComparisonType.NONE,
                confidence=1.0
            )

        # B. PRODUCT_SEARCH
        # Keywords indicating a shopping request: "need", "recommend", "show me", "suggest", "looking for", "find"
        # + category / budget keywords
        has_search_verb = bool(re.search(
            r"\b(i\s*need|recommend|show\s*me|suggest|looking\s*for|find\s*me|where\s*to\s*buy|search\s*for)\b",
            lower
        ))
        has_category = bool(re.search(
            r"\b(laptop|laptops|phone|phones|smartphone|smartphones|headphone|headphones|earphone|earphones|"
            r"airpods|earbuds|monitor|monitors|keyboard|keyboards|mouse|mice|tablet|tablets|camera|cameras)\b",
            lower
        ))
        has_price_constraint = bool(re.search(
            r"(?:under|below|less than|max|budget)\s*(?:rs\.?|lkr|\$)?\s*[0-9]+",
            lower
        ))

        # Explicit search: "Recommend headphones under Rs. 25000", "I need a gaming laptop under Rs. 300000"
        if has_search_verb and (has_category or has_price_constraint):
            return IntentResult(
                intent=IntentType.PRODUCT_SEARCH,
                comparison_type=ComparisonType.NONE,
                confidence=0.98
            )

        # "I need a laptop for programming"
        if re.search(r"\b(i\s*need|want\s*to\s*buy|looking\s*for)\s+(?:a\s+)?[a-z\s]+(laptop|phone|headphone|monitor)\b", lower):
            return IntentResult(
                intent=IntentType.PRODUCT_SEARCH,
                comparison_type=ComparisonType.NONE,
                confidence=0.98
            )

        # C. TECH_QUESTION specific workload or definition patterns
        # e.g., "Intel or Ryzen is best for video editing?", "Which is better IPS or AMOLED?", "What is DDR5?"
        is_workload_question = bool(re.search(
            r"\b(is\s+(?:best|better|good)\s+for\s+(?:video\s*editing|gaming|programming|coding|rendering|music|photo\s*editing))\b",
            lower
        ))
        is_concept_definition = bool(re.search(
            r"^(what\s+is\s+|what\s+does\s+.*\s+mean|how\s+does\s+.*\s+work|why\s+is\s+|explain\s+)",
            lower
        ))
        is_ram_sizing = bool(re.search(
            r"\b(how\s*much\s*ram|how\s*much\s*storage|is\s+[a-z0-9\s]+\s+good\s+for\s+gaming)\b",
            lower
        ))
        is_tech_difference = bool(re.search(
            r"\b(difference\s+between\s+(?:ddr[345]|ips|amoled|oled|lcd|ssd|hdd|pcie|wifi|bluetooth))\b",
            lower
        ))
        is_display_question = bool(re.search(
            r"\b(which\s+is\s+better\s+(?:ips\s+or\s+amoled|oled\s+or\s+ips|lcd\s+or\s+oled))\b",
            lower
        ))

        if is_workload_question or is_concept_definition or is_ram_sizing or is_tech_difference or is_display_question:
            return IntentResult(
                intent=IntentType.TECH_QUESTION,
                comparison_type=ComparisonType.NONE,
                confidence=0.98
            )

        # D. PRODUCT_COMPARISON
        # Patterns like: "RTX 4060 vs RTX 4070", "Compare Nexa Pro Laptop with Nexa Gaming X", "Which is better, RTX 4060 or RTX 4070?", "Should I buy i5 or Ryzen 5?"
        is_vs = bool(re.search(r"\b(vs|versus)\b", lower))
        starts_compare = lower.startswith("compare ") or "compare these" in lower or "compare the" in lower
        is_which_better_hardware = bool(re.search(
            r"\b(which\s+is\s+better,?\s+|should\s+i\s+buy\s+)(rtx|gtx|intel|ryzen|core\s*i[3579]|i[3579]|macbook|iphone|galaxy)\b",
            lower
        ))

        if is_vs or starts_compare or is_which_better_hardware:
            comp_type, items = self._extract_comparison_details(text)
            return IntentResult(
                intent=IntentType.PRODUCT_COMPARISON,
                comparison_type=comp_type,
                compared_items=items,
                confidence=0.95
            )

        # Catch-all general price search like "headphones under Rs 25000" without explicit verb
        if has_category and has_price_constraint:
            return IntentResult(
                intent=IntentType.PRODUCT_SEARCH,
                comparison_type=ComparisonType.NONE,
                confidence=0.90
            )

        return None

    def _extract_comparison_details(self, text: str) -> Tuple[ComparisonType, List[str]]:
        """
        Determines whether a comparison is between store products or general hardware tech,
        and extracts the item names.
        """
        lower = text.lower()
        items: List[str] = []

        # Check for store product comparison patterns:
        # e.g., "Compare Nexa Pro Laptop with Nexa Gaming X", "Compare Product A and Product B"
        comp_match = re.search(
            r"(?:compare)\s+(?:the\s+)?(.+?)\s+(?:with|and|to)\s+(.+)",
            text,
            re.IGNORECASE
        )
        if comp_match:
            item1 = comp_match.group(1).strip()
            item2 = comp_match.group(2).strip()
            # Clean trailing punctuation
            item2 = re.sub(r"[?!.]+$", "", item2).strip()
            items = [item1, item2]

        # Check for "X vs Y"
        elif " vs " in lower or " versus " in lower:
            parts = re.split(r"\s+(?:vs\.?|versus)\s+", text, flags=re.IGNORECASE)
            if len(parts) >= 2:
                item1 = parts[0].strip()
                item2 = re.sub(r"[?!.]+$", "", parts[1]).strip()
                # If there was a prefix like "Which is better," clean it
                item1 = re.sub(r"^(which is better,?\s*|compare\s+)", "", item1, flags=re.IGNORECASE).strip()
                items = [item1, item2]

        # Check for "Which is better, X or Y?" or "Should I buy X or Y?"
        elif " or " in lower:
            or_match = re.search(
                r"(?:which\s+is\s+better,?\s+|should\s+i\s+buy\s+)(.+?)\s+or\s+(.+)",
                text,
                re.IGNORECASE
            )
            if or_match:
                item1 = or_match.group(1).strip()
                item2 = re.sub(r"[?!.]+$", "", or_match.group(2)).strip()
                items = [item1, item2]

        # Classify as STORE_PRODUCT if items explicitly mention laptops, phones, nexa, monitors, or brands with model names
        has_store_markers = bool(re.search(
            r"\b(laptop|pro\s*laptop|gaming\s*x|phone|monitor|headphone|nexa)\b",
            lower
        ))

        comp_type = ComparisonType.STORE_PRODUCT if has_store_markers else ComparisonType.GENERAL_TECH
        return comp_type, items

    def _classify_with_gemini(self, text: str) -> Optional[IntentResult]:
        """
        Uses Gemini LLM to classify intent with JSON schema.
        """
        prompt = f"USER MESSAGE: \"{text}\"\nClassify this message into one of the 4 intents."
        response_text = self.gemini_manager.generate_content(
            prompt=prompt,
            system_instruction=INTENT_CLASSIFICATION_SYSTEM_INSTRUCTION
        )

        # Parse JSON output from Gemini
        clean_text = response_text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text[7:]
        if clean_text.startswith("```"):
            clean_text = clean_text[3:]
        if clean_text.endswith("```"):
            clean_text = clean_text[:-3]
        clean_text = clean_text.strip()

        data = json.loads(clean_text)
        raw_intent = data.get("intent", "").upper().strip()
        raw_comp_type = data.get("comparison_type", "NONE").upper().strip()
        compared_items = data.get("compared_items", [])

        intent_map = {
            "PRODUCT_SEARCH": IntentType.PRODUCT_SEARCH,
            "TECH_QUESTION": IntentType.TECH_QUESTION,
            "PRODUCT_COMPARISON": IntentType.PRODUCT_COMPARISON,
            "GENERAL_CHAT": IntentType.GENERAL_CHAT,
        }

        comp_type_map = {
            "GENERAL_TECH": ComparisonType.GENERAL_TECH,
            "STORE_PRODUCT": ComparisonType.STORE_PRODUCT,
            "NONE": ComparisonType.NONE,
        }

        if raw_intent in intent_map:
            return IntentResult(
                intent=intent_map[raw_intent],
                comparison_type=comp_type_map.get(raw_comp_type, ComparisonType.NONE),
                compared_items=compared_items,
                confidence=0.99
            )

        return None


# Global singleton instance
_intent_service: Optional[IntentService] = None


def get_intent_service() -> IntentService:
    """Dependency provider for IntentService."""
    global _intent_service
    if _intent_service is None:
        _intent_service = IntentService()
    return _intent_service
