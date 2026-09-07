"""
AI Service wrapper for NexaTech E-Commerce.
Delegates to ChatbotService and MLModelManager while preserving backwards-compatible interfaces.
"""

import logging
from typing import Optional
from config.settings import settings
from .chatbot_service import ChatbotService, get_chatbot_service
from .ml_model import MLModelManager

logger = logging.getLogger("ai_service.ai_service")


class AIService:
    """
    Main business logic service for generating AI shopping assistant responses.
    Delegates to ChatbotService (for Gemini dual-key fallback or rule-based)
    and supports MLModelManager when MODEL_TYPE is 'ml_model'.
    """

    def __init__(
        self,
        chatbot_service: Optional[ChatbotService] = None,
        model_manager: Optional[MLModelManager] = None
    ):
        self.chatbot_service = chatbot_service or get_chatbot_service()
        self.model_manager = model_manager or MLModelManager(model_path=settings.MODEL_PATH)
        logger.info(
            f"AIService initialized with MODEL_TYPE='{settings.MODEL_TYPE}', "
            f"ML model loaded={self.model_manager.is_model_ready}"
        )

    def generate_response(self, user_message: str) -> str:
        """
        Processes the user message and generates an AI response string.
        """
        # If custom ML model is selected and loaded
        if settings.MODEL_TYPE.lower() == "ml_model" and self.model_manager.is_model_ready:
            try:
                return self.model_manager.predict(user_message)
            except Exception as e:
                logger.error(f"Error in ML model prediction: {e}", exc_info=True)

        result = self.chatbot_service.process_message(user_message)
        if result.get("success"):
            return result.get("reply", "")
        return result.get("message", "AI service is temporarily unavailable. Please try again later.")


# Singleton instance for dependency injection
_ai_service_instance: Optional[AIService] = None


def get_ai_service() -> AIService:
    """Dependency provider for FastAPI routes."""
    global _ai_service_instance
    if _ai_service_instance is None:
        _ai_service_instance = AIService()
    return _ai_service_instance
