"""
Automated Pytest Suite for Enterprise DevOps Application
Organization: Cognevance Technologies
Evaluates: Health check, Status API, Info API, Prometheus metrics, and error boundaries.
"""

import pytest
from app import create_app


@pytest.fixture
def client():
    """Create test client configured for testing environment."""
    app = create_app('testing')
    with app.test_client() as client:
        yield client


def test_index_route(client):
    """Test main index route returns 200 and HTML or JSON."""
    response = client.get('/')
    assert response.status_code == 200


def test_health_check(client):
    """Verify /health endpoint returns HTTP 200 and healthy status structure."""
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data is not None
    assert data["status"] == "healthy"
    assert data["service"] == "enterprise-devops-api"
    assert "timestamp" in data
    assert "uptime_seconds" in data
    assert data["checks"]["api_server"] == "healthy"


def test_api_status(client):
    """Verify /api/status endpoint returns real-time infrastructure state."""
    response = client.get('/api/status')
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "OPERATIONAL"
    assert data["organization"] == "Cognevance Technologies"
    assert "replicas" in data
    assert data["replicas"]["desired"] == 3
    assert data["replicas"]["ready"] == 3
    assert "telemetry" in data


def test_api_info(client):
    """Verify /api/info returns architecture and technology stack details."""
    response = client.get('/api/info')
    assert response.status_code == 200
    data = response.get_json()
    assert "technology_stack" in data
    assert "cloud" in data["technology_stack"]
    assert "iac" in data["technology_stack"]
    assert "api_endpoints" in data


def test_metrics_exposition(client):
    """Verify /metrics exposes valid Prometheus text format."""
    response = client.get('/metrics')
    assert response.status_code == 200
    assert response.mimetype.startswith('text/plain')
    content = response.data.decode('utf-8')
    assert "http_requests_total" in content
    assert "app_availability" in content
    assert "kubernetes_active_replicas" in content


def test_404_error_handler(client):
    """Verify non-existent endpoints return structured JSON 404."""
    response = client.get('/non-existent-endpoint-devops-test')
    assert response.status_code == 404
    data = response.get_json()
    assert data["status_code"] == 404
    assert "Resource not found" in data["error"]
