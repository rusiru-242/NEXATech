#!/bin/bash
# ============================================================
# NexaTech startup script — Hugging Face Docker Space
# FastAPI: 127.0.0.1:8000 (internal only)
# Node:    0.0.0.0:7860  (public)
# ============================================================
set -e

echo "[start.sh] Starting NexaTech services..."

# Start FastAPI AI service in background (internal only)
echo "[start.sh] Starting FastAPI AI service on 127.0.0.1:8000..."
cd /app/ai-service
/app/ai-service/.venv/bin/uvicorn app:app --host 127.0.0.1 --port 8000 &
FASTAPI_PID=$!
echo "[start.sh] FastAPI started (PID: $FASTAPI_PID)"

# Brief wait to let FastAPI initialize before Node starts
sleep 3

# Start Node/Express in foreground (keeps container alive)
echo "[start.sh] Starting Node/Express on 0.0.0.0:7860..."
cd /app/backend
PORT=7860 node server.js
