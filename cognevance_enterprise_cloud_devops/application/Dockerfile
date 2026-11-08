# ==============================================================================
# Enterprise Multi-Stage Dockerfile
# Organization: Cognevance Technologies
# Project: Enterprise Cloud Infrastructure & DevOps Automation
# ==============================================================================

# Stage 1: Build & Dependency Wheel Builder
FROM python:3.11-slim AS builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev curl && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Minimal Production Runtime
FROM python:3.11-slim AS runtime

# Set security labels and environment variables
LABEL maintainer="DevOps Team <devops@cognevance.internal>"
LABEL version="1.0.0"
LABEL description="Enterprise DevOps Monitoring Flask Microservice"

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_ENV=production \
    APP_PORT=5000 \
    PATH="/home/appuser/.local/bin:$PATH"

# Install curl for container health check
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Security Hardening: Create non-root user and group
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /bin/sh -m appuser

WORKDIR /home/appuser/app

# Copy installed Python packages from builder stage
COPY --from=builder /root/.local /home/appuser/.local

# Copy application source code with non-root ownership
COPY --chown=appuser:appgroup app/ ./app
COPY --chown=appuser:appgroup tests/ ./tests

# Switch to unprivileged non-root user
USER appuser

# Expose internal service port
EXPOSE 5000

# Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Production WSGI server command
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "3", "--threads", "2", "--timeout", "30", "--access-logfile", "-", "--error-logfile", "-", "app:create_app()"]
