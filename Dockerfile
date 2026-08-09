# ==============================================================================
# PRABU ARVIND M PORTFOLIO - PRODUCTION DOCKERFILE FOR GOOGLE CLOUD RUN
# ==============================================================================

FROM python:3.12-slim as base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080 \
    APP_HOME=/app

WORKDIR $APP_HOME

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements & install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY app/ ./app/
COPY static/ ./static/
COPY index.html .
COPY README.md .

# Create non-root user for security
RUN useradd -m -u 1000 appuser && \
    mkdir -p /app/app/data /tmp/app_data && \
    chown -R appuser:appuser /app /tmp/app_data

USER appuser

# Expose Cloud Run PORT
EXPOSE 8080

# Healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Start FastAPI application using Uvicorn
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --workers 2
