"""
Gemini client and key manager service using official google-genai SDK.
Provides dual-key management with automatic failover, exponential backoff,
safe logging, and zero exposure of API keys.
"""

import logging
import random
import time
from typing import Any, Callable, Dict, Optional, Tuple

from google import genai
from google.genai import types
from google.genai.errors import APIError, ClientError, ServerError

from config.settings import settings

logger = logging.getLogger("ai_service.gemini_service")


class GeminiServiceError(Exception):
    """Base exception for Gemini service errors."""
    pass


class GeminiClientError(GeminiServiceError):
    """Raised for non-switchable client errors (e.g., 400 Bad Request)."""
    pass


class GeminiServiceUnavailableError(GeminiServiceError):
    """Raised when both primary and fallback Gemini keys fail or are unavailable."""
    pass


class GeminiKeyManager:
    """
    Manages dual Google Gemini API keys with automatic failover.

    Normal behavior:
      - Uses GEMINI_API_KEY_1 (Primary).
      - If Primary succeeds, returns response directly.

    Failover behavior:
      - If Primary receives a transient/quota error (429, RESOURCE_EXHAUSTED,
        5xx temporary errors, or primary key is unconfigured/invalid while fallback is ready),
        automatically switches to GEMINI_API_KEY_2 (Fallback).
      - Normal client errors (e.g. 400 Bad Request) do NOT switch keys.
      - If Fallback also fails, raises GeminiServiceUnavailableError.
    """

    def __init__(
        self,
        key_1: Optional[str] = None,
        key_2: Optional[str] = None,
        model: Optional[str] = None,
        client_factory: Optional[Callable[[str], Any]] = None
    ):
        self.key_1 = key_1 if key_1 is not None else settings.GEMINI_API_KEY_1.strip()
        self.key_2 = key_2 if key_2 is not None else settings.GEMINI_API_KEY_2.strip()
        self.model = model if model is not None else settings.GEMINI_MODEL.strip()

        # Custom client factory used for mocking in tests or default genai.Client
        self._client_factory = client_factory or (lambda key: genai.Client(api_key=key))
        self._client_1: Optional[Any] = None
        self._client_2: Optional[Any] = None

    @property
    def has_primary_key(self) -> bool:
        return bool(self.key_1)

    @property
    def has_fallback_key(self) -> bool:
        return bool(self.key_2)

    @property
    def has_any_key(self) -> bool:
        return self.has_primary_key or self.has_fallback_key

    def _get_client(self, key_slot: int) -> Any:
        """Lazily initialize and return the Gemini client for slot 1 or 2."""
        if key_slot == 1:
            if not self.key_1:
                raise ValueError("Primary Gemini key (GEMINI_API_KEY_1) is not configured.")
            if self._client_1 is None:
                self._client_1 = self._client_factory(self.key_1)
            return self._client_1
        elif key_slot == 2:
            if not self.key_2:
                raise ValueError("Fallback Gemini key (GEMINI_API_KEY_2) is not configured.")
            if self._client_2 is None:
                self._client_2 = self._client_factory(self.key_2)
            return self._client_2
        raise ValueError(f"Invalid key slot: {key_slot}")

    def _classify_error(self, exc: Exception) -> Tuple[bool, str]:
        """
        Classifies whether an exception is a transient/quota error that warrants key failover.

        Returns:
            (should_failover: bool, reason: str)
        """
        err_str = str(exc).lower()

        # Check APIError / ClientError / ServerError from google-genai
        if isinstance(exc, APIError):
            code = getattr(exc, "code", None)
            status_text = str(getattr(exc, "status", "")).upper()

            # HTTP 429 / Quota / Rate limit
            if code == 429 or "RESOURCE_EXHAUSTED" in status_text or "resource_exhausted" in err_str:
                return True, "HTTP 429 / RESOURCE_EXHAUSTED"

            # Server 5xx errors (temporary unavailable, timeout, internal error)
            if code in (500, 502, 503, 504) or isinstance(exc, ServerError):
                return True, f"Server Error {code} ({status_text or 'TEMPORARY_ERROR'})"

            # Key authentication / permission failure specifically for primary key recovery
            if code in (401, 403) or "API_KEY_INVALID" in status_text or "invalid api key" in err_str:
                return True, f"Key Authorization Error {code} (INVALID_OR_REVOKED_KEY)"

            # Non-switchable client errors (e.g., 400 Bad Request, invalid argument)
            if code == 400:
                return False, f"Client Error 400 (BAD_REQUEST)"

        # String matching for network / quota messages
        if any(term in err_str for term in ["429", "quota", "resource_exhausted", "rate limit"]):
            return True, "Rate Limit / Quota Exceeded"

        if any(term in err_str for term in ["503", "502", "504", "unavailable", "timed out", "timeout"]):
            return True, "Transient Network / Server Error"

        if any(term in err_str for term in ["401", "403", "api_key_invalid", "unauthenticated"]):
            return True, "Authentication / Key Error"

        # Client-side 400 errors should not switch keys
        if "400" in err_str or "bad request" in err_str or "invalid argument" in err_str:
            return False, "Bad Request"

        # Default fallback: unexpected exception
        return False, f"Non-retryable Error ({type(exc).__name__})"

    def _execute_with_backoff(
        self,
        client: Any,
        prompt: str,
        system_instruction: Optional[str] = None,
        max_retries: int = 1
    ) -> str:
        """
        Executes generate_content with exponential backoff on transient errors.
        Prevents infinite retries (capped at max_retries).
        """
        last_exc: Optional[Exception] = None

        for attempt in range(max_retries + 1):
            try:
                config = types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7,
                )
                response = client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                    config=config
                )
                if response and hasattr(response, "text") and response.text:
                    return response.text.strip()
                raise GeminiServiceError("Empty response received from Gemini model.")
            except Exception as e:
                last_exc = e
                should_failover, reason = self._classify_error(e)

                # For 429 quota exhaustion, don't waste time retrying the same exhausted key; fail over immediately
                if "429" in reason or "RESOURCE_EXHAUSTED" in reason:
                    raise e

                if should_failover and attempt < max_retries:
                    backoff_delay = (0.5 * (2 ** attempt)) + random.uniform(0.1, 0.3)
                    logger.warning(
                        f"Transient Gemini error ({reason}). Retrying in {backoff_delay:.2f}s "
                        f"(attempt {attempt + 1}/{max_retries})."
                    )
                    time.sleep(backoff_delay)
                    continue

                raise e

        if last_exc:
            raise last_exc
        raise GeminiServiceError("Failed to generate content.")

    def generate_content(
        self,
        prompt: str,
        system_instruction: Optional[str] = None
    ) -> str:
        """
        Generates content from Gemini using dual-key automatic failover.

        Flow:
        1. Attempt Primary Key (GEMINI_API_KEY_1).
        2. If Primary fails with transient/quota error, automatically switch to GEMINI_API_KEY_2.
        3. If Key 2 also fails, raise GeminiServiceUnavailableError.
        """
        # Scenario: No Gemini keys configured at all
        if not self.has_any_key:
            raise GeminiServiceUnavailableError("No Gemini API keys are configured.")

        # Scenario: Primary key is missing, but fallback key is configured
        if not self.has_primary_key:
            logger.warning("Gemini primary unavailable (GEMINI_API_KEY_1 not configured), trying fallback")
            return self._call_fallback(prompt, system_instruction)

        # Attempt Primary Key
        try:
            primary_client = self._get_client(1)
            return self._execute_with_backoff(primary_client, prompt, system_instruction, max_retries=1)

        except Exception as primary_exc:
            should_failover, reason = self._classify_error(primary_exc)

            # Check for non-switchable client errors (e.g. 400 Bad Request)
            if not should_failover:
                logger.error(
                    f"Gemini primary encounter non-switchable client error: {reason}. "
                    f"Will not switch to fallback key."
                )
                raise GeminiClientError(f"Client request error: {reason}") from primary_exc

            # Transient or quota error: switch to fallback key
            logger.warning(
                f"Gemini primary unavailable ({reason}), trying fallback"
            )

            # If fallback key is missing
            if not self.has_fallback_key:
                logger.error("Gemini fallback key (GEMINI_API_KEY_2) is not configured.")
                raise GeminiServiceUnavailableError(
                    "AI service is temporarily unavailable. Please try again later."
                ) from primary_exc

            return self._call_fallback(prompt, system_instruction)

    def _call_fallback(self, prompt: str, system_instruction: Optional[str]) -> str:
        """Executes generation against GEMINI_API_KEY_2 with safe error handling."""
        try:
            fallback_client = self._get_client(2)
            result = self._execute_with_backoff(fallback_client, prompt, system_instruction, max_retries=1)
            logger.info("Gemini fallback request succeeded.")
            return result
        except Exception as fallback_exc:
            _, reason = self._classify_error(fallback_exc)
            logger.error(
                f"Gemini fallback failed ({reason}). Both keys unavailable."
            )
            raise GeminiServiceUnavailableError(
                "AI service is temporarily unavailable. Please try again later."
            ) from fallback_exc


# Global singleton instance of GeminiKeyManager
_gemini_manager: Optional[GeminiKeyManager] = None


def get_gemini_manager() -> GeminiKeyManager:
    """Dependency provider for GeminiKeyManager."""
    global _gemini_manager
    if _gemini_manager is None:
        _gemini_manager = GeminiKeyManager()
    return _gemini_manager
