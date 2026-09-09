# ============================================================
# NexaTech — Hugging Face Docker Space
# Single container: Node 20 (port 7860) + Python 3.11 (internal 8000)
# ============================================================

FROM node:20-slim AS base

# Install Python and system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ============================================================
# Stage 1: Build React frontend
# ============================================================
FROM base AS frontend-builder

WORKDIR /build/client
COPY client/package*.json ./
RUN npm ci --legacy-peer-deps
COPY client/ ./
RUN npm run build

# ============================================================
# Stage 2: Final runtime image
# ============================================================
FROM base AS runtime

WORKDIR /app

# Python AI service
COPY ai-service/requirements.txt ./ai-service/requirements.txt
RUN python3 -m venv /app/ai-service/.venv \
    && /app/ai-service/.venv/bin/pip install --upgrade pip --quiet \
    && /app/ai-service/.venv/bin/pip install -r /app/ai-service/requirements.txt --quiet
COPY ai-service/ ./ai-service/

# Node backend
COPY backend/package*.json ./backend/
RUN cd /app/backend && npm ci --omit=dev
COPY backend/ ./backend/

# React production build (from build stage)
COPY --from=frontend-builder /build/client/dist ./client/dist

# Startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose only the public port
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:7860/ 2>/dev/null || exit 1

CMD ["/app/start.sh"]
