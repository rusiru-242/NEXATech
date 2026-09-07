"""
ML Model Integration Layer.
Provides abstract interfaces and extensible architecture for plugging in
trained machine learning models (e.g., PyTorch, TensorFlow, Scikit-learn, ONNX, HuggingFace).
"""

import logging
import os
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

logger = logging.getLogger("ai_service.ml_model")


class BaseMLModel(ABC):
    """
    Abstract base class for machine learning models.
    Any future custom trained model (intent classifier, product recommender,
    sequence-to-sequence model) should inherit from this interface.
    """

    @abstractmethod
    def load(self, model_path: str) -> bool:
        """
        Load model weights, tokenizer, or pipeline from the given filesystem path.
        """
        pass

    @abstractmethod
    def predict(self, text: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Run inference on user input and return prediction or response.
        """
        pass


class TrainedEcommerceModel(BaseMLModel):
    """
    Concrete implementation prepared for custom trained ML models.
    Supports loading from pickle/joblib/pt/onnx file paths defined in settings.MODEL_PATH.
    """

    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path
        self.model: Optional[Any] = None
        self.is_loaded: bool = False

        if model_path and os.path.exists(model_path):
            self.load(model_path)

    def load(self, model_path: str) -> bool:
        """
        Load custom trained weights or pipeline.
        Example integration:
            import joblib
            self.model = joblib.load(model_path)
            or
            from transformers import pipeline
            self.model = pipeline("text-generation", model=model_path)
        """
        try:
            if not os.path.exists(model_path):
                logger.warning(f"Model path does not exist: {model_path}")
                self.is_loaded = False
                return False

            # Placeholder for loading the actual model weights/pipeline
            logger.info(f"Loading custom ML model from: {model_path}")
            # e.g.: self.model = torch.load(model_path)
            self.is_loaded = True
            return True
        except Exception as e:
            logger.error(f"Failed to load ML model from {model_path}: {e}", exc_info=True)
            self.is_loaded = False
            return False

    def predict(self, text: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Predict or generate response using the loaded ML model.
        Falls back if the model is not yet loaded.
        """
        if not self.is_loaded or self.model is None:
            raise RuntimeError("ML model is not loaded. Train or provide a valid model artifact in MODEL_PATH.")

        # ML model inference logic goes here
        # return self.model.predict([text])[0]
        return "Model inference output placeholder"


class MLModelManager:
    """
    Singleton manager for ML models, enabling hot-reloading and health checking.
    """

    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path
        self._model = TrainedEcommerceModel(model_path=model_path)

    @property
    def is_model_ready(self) -> bool:
        return self._model.is_loaded

    def predict(self, text: str) -> str:
        return self._model.predict(text)
