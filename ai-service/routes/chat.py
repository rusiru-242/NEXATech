"""
Chat endpoint for the NexaTech AI shopping assistant microservice.
Supports Google Gemini dual-key fallback, safe error handling, and e-commerce recommendations.
"""

import logging
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from services.chatbot_service import ChatbotService, get_chatbot_service

logger = logging.getLogger("ai_service.routes.chat")

router = APIRouter()


class ChatRequest(BaseModel):
    """
    Chat request schema.
    Expects a JSON object containing the user's message.
    """
    message: str = Field(
        ...,
        description="The message or query sent by the user to the chatbot.",
        json_schema_extra={"example": "I need a gaming laptop under Rs. 250000"}
    )


class ChatResponse(BaseModel):
    """
    Chat response schema.
    Returns success status, detected intent, AI reply on success, matching product cards,
    and clean message on service failure.
    None fields are excluded from serialized JSON response.
    """
    success: bool = Field(..., description="Indicates whether the request was handled successfully.")
    intent: Optional[str] = Field(None, description="The detected user intent: PRODUCT_SEARCH, TECH_QUESTION, PRODUCT_COMPARISON, or GENERAL_CHAT.")
    reply: Optional[str] = Field(None, description="The AI assistant's reply on success.")
    message: Optional[str] = Field(None, description="Informative status message on failure.")
    products: Optional[List[Dict[str, Any]]] = Field(None, description="List of real matching products from MongoDB.")


@router.post(
    "/chat",
    response_model=ChatResponse,
    response_model_exclude_none=True,
    status_code=status.HTTP_200_OK,
    summary="Send message to AI Shopping Assistant",
    tags=["Chat"]
)
def chat_endpoint(
    payload: ChatRequest,
    chatbot_service: ChatbotService = Depends(get_chatbot_service)
) -> ChatResponse:
    """
    Processes incoming customer messages and returns shopping recommendations or technical advice
    accompanied by real matching product cards from MongoDB when searching products.

    Accepts:
    ```json
    {
        "message": "user message"
    }
    ```

    Returns on success:
    ```json
    {
        "success": true,
        "intent": "TECH_QUESTION",
        "reply": "...",
        "products": []
    }
    ```
    """
    try:
        trimmed_message = payload.message.strip()
        if not trimmed_message:
            return ChatResponse(
                success=True,
                intent="GENERAL_CHAT",
                reply="Hello! Welcome to NexaTech. How can I assist you with your tech questions or shopping today?",
                products=[]
            )

        # Process message via ChatbotService (handles intent routing + Express search + Gemini dual keys)
        result = chatbot_service.process_message(trimmed_message)

        if result.get("success"):
            return ChatResponse(
                success=True,
                intent=result.get("intent"),
                reply=result.get("reply"),
                products=result.get("products", [])
            )
        else:
            return ChatResponse(
                success=False,
                message=result.get("message", "AI service is temporarily unavailable. Please try again later.")
            )

    except Exception as exc:
        # Safe fallback: never expose raw internal exceptions or keys to frontend
        logger.error(f"Unexpected error in /chat endpoint: {exc}", exc_info=True)
        return ChatResponse(
            success=False,
            message="AI service is temporarily unavailable. Please try again later."
        )
