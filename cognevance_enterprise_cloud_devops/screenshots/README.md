# Screenshot & Execution Evidence Catalog
Organization: Cognevance Technologies

Capture screenshots in this directory when documenting live demonstration runs for internship submission.

### Recommended Evidence Captures:
1. `01-dashboard-overview.png`: Main Enterprise DevOps Monitoring Console showing healthy cluster status and telemetry cards.
2. `02-docker-build.png`: Terminal output from multi-stage Docker build verifying non-root user setup.
3. `03-docker-compose-running.png`: `docker compose ps` displaying healthy application, prometheus, and grafana containers.
4. `04-kubernetes-pods.png`: `kubectl get all -n devops-enterprise` showing 3 active pods and services.
5. `05-hpa-status.png`: `kubectl get hpa -n devops-enterprise` displaying target CPU utilization.
6. `06-terraform-plan.png`: Terminal output of `terraform plan` detailing VPC and subnet provisioning.
7. `07-github-actions-success.png`: GitHub Actions web console showing green checkmarks across all 9 stages.
8. `08-trivy-security-scan.png`: Output of Trivy security scanner reporting 0 critical CVEs.
9. `09-prometheus-targets.png`: Prometheus web console (`http://localhost:9090/targets`) showing endpoint UP.
10. `10-grafana-dashboard.png`: Grafana visualization console displaying throughput and latency charts.
