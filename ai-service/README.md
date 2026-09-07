# NexaTech AI Shopping Microservice

FastAPI-powered AI shopping assistant microservice for the NexaTech MERN e-commerce platform.

## Architecture Overview

```
ai-service/
├── app.py                # Application entrypoint & CORS configuration
├── requirements.txt      # Python dependencies
├── .env.example          # Template environment configuration
├── .env                  # Local environment file (ignored by git)
├── .gitignore            # Git ignore rules for python/artifacts
├── config/
│   ├── __init__.py
│   └── settings.py       # Pydantic Settings and environment validation
├── routes/
│   ├── __init__.py
│   ├── health.py         # GET /health
│   └── chat.py           # POST /chat
└── services/
    ├── __init__.py
    ├── ai_service.py     # Intent parsing and shopping assistant logic
    └── ml_model.py       # Pluggable ML model loader and interface
```

## Quick Start

### 1. Create a Virtual Environment (Recommended)

```bash
cd ai-service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Review and adjust settings:
- `PORT`: Service port (default `8000`)
- `CORS_ORIGINS`: Allowed origins (default `["http://localhost:5173"]`)
- `AI_API_KEY`: Server-side API key for LLM integration (never exposed to client)
- `MODEL_PATH`: Filesystem path to trained ML model weights
- `MODEL_TYPE`: `rule_based`, `ml_model`, or `llm`

### 4. Run the Service

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
# Or directly via python:
python app.py
```

Swagger API Documentation is available at:
`http://localhost:8000/docs`

---

## API Endpoints

### 1. Health Check
- **Endpoint**: `GET /health`
- **Response**:
```json
{
  "status": "ok",
  "service": "NexaTech AI Shopping Microservice",
  "version": "1.0.0",
  "environment": "development",
  "model_type": "rule_based"
}
```

### 2. Shopping Chat
- **Endpoint**: `POST /chat`
- **Request Body**:
```json
{
  "message": "Can you recommend a laptop for programming?"
}
```
- **Response Body**:
```json
{
  "success": true,
  "reply": "Looking for a computer or laptop? At NexaTech we feature high-performance laptops..."
}
```

---

## Adding a Trained Machine Learning Model Later

The microservice includes an extensible ML architecture in `services/ml_model.py`:
1. Train your model (Scikit-Learn, PyTorch, HuggingFace, etc.) and save the weights/pipeline (e.g. `models/shopping_classifier.pkl`).
2. Place the model file in `ai-service/models/`.
3. Set `MODEL_PATH=models/shopping_classifier.pkl` and `MODEL_TYPE=ml_model` in `ai-service/.env`.
4. Update `TrainedEcommerceModel.load()` and `TrainedEcommerceModel.predict()` in `services/ml_model.py` to match your model's pipeline.
