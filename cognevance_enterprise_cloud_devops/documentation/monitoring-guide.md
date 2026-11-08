# Prometheus & Grafana Monitoring Guide
Organization: Cognevance Technologies

This guide documents the observability stack that provides end-to-end monitoring for the application and Kubernetes infrastructure.

---

## 1. Metrics Instrumentation Architecture

The Flask backend microservice utilizes the `prometheus_client` library to generate standardized Prometheus exposition metrics at `/metrics`.

### Key Metrics Collected

1. **`http_requests_total`** (Counter): Tracks total incoming requests partitioned by HTTP method, endpoint handler, and response status code.
2. **`http_request_duration_seconds`** (Histogram): Records request processing durations across standard second buckets (5ms, 10ms, 25ms, 50ms, 100ms, 250ms, 500ms, 1s, 2.5s, 5s).
3. **`app_availability`** (Gauge): Binary health signal (`1` = Nominal, `0` = Degraded).
4. **`kubernetes_active_replicas`** (Gauge): Number of active pods reporting in the deployment.

---

## 2. Useful PromQL Queries

Use these queries in the Prometheus Console (`http://localhost:9090`):

```promql
# Overall request rate (requests per second)
sum(rate(http_requests_total[1m]))

# P95 Request Latency across all endpoints
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) * 1000

# Error rate percentage (HTTP 5xx / total requests)
sum(rate(http_requests_errors_total[5m])) / sum(rate(http_requests_total[5m])) * 100

# Active pod count
kubernetes_active_replicas{deployment="enterprise-devops-app"}
```

---

## 3. Grafana Access & Dashboard Import

When running Docker Compose (`docker compose up -d`):
1. Navigate to Grafana at `http://localhost:3001` (or port mapped).
2. Login with credentials: `admin` / `admin`.
3. The Prometheus data source is **automatically provisioned** via `monitoring/grafana/provisioning/datasources/prometheus.yml`.
4. The dashboard is auto-loaded from `monitoring/grafana/dashboards/devops-dashboard.json`.
