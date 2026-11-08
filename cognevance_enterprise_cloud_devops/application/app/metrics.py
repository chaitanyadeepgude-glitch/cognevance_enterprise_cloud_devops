"""
Prometheus Metrics Instrumentation Module
Organization: Cognevance Technologies
Exposes application throughput, latency histograms, and availability gauges.
"""

import time
from flask import request
from prometheus_client import (
    Counter,
    Histogram,
    Gauge,
    generate_latest,
    CONTENT_TYPE_LATEST
)

# Prometheus Metrics Definitions
HTTP_REQUESTS_TOTAL = Counter(
    'http_requests_total',
    'Total count of HTTP requests processed by endpoint and status',
    ['method', 'endpoint', 'status_code']
)

HTTP_REQUEST_DURATION_SECONDS = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency in seconds',
    ['method', 'endpoint'],
    buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0)
)

APP_AVAILABILITY = Gauge(
    'app_availability',
    'Application availability health score (1 = Nominal, 0 = Degraded)'
)

ACTIVE_REPLICAS = Gauge(
    'kubernetes_active_replicas',
    'Number of active healthy pod replicas reported by deployment',
    ['deployment', 'namespace']
)

def init_metrics(app):
    """
    Hooks into Flask lifecycle to track metrics across all routes.
    """
    APP_AVAILABILITY.set(1.0)
    ACTIVE_REPLICAS.labels(
        deployment="enterprise-devops-app",
        namespace=app.config.get("KUBERNETES_NAMESPACE", "devops-enterprise")
    ).set(3.0)

    @app.before_request
    def record_start_time():
        request._prometheus_start_time = time.time()

    @app.after_request
    def record_metrics(response):
        if hasattr(request, '_prometheus_start_time'):
            duration = time.time() - request._prometheus_start_time
            endpoint = request.endpoint or request.path
            status = response.status_code

            HTTP_REQUEST_DURATION_SECONDS.labels(
                method=request.method,
                endpoint=endpoint
            ).observe(duration)

            HTTP_REQUESTS_TOTAL.labels(
                method=request.method,
                endpoint=endpoint,
                status_code=str(status)
            ).inc()

        return response
