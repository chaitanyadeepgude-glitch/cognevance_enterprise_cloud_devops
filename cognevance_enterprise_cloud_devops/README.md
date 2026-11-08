# Enterprise Cloud Infrastructure & DevOps Automation

**Organization:** Cognevance Technologies  
**Project Level:** Level 3 – Advanced  
**Domain:** Cloud Architecture, Infrastructure as Code, Container Orchestration, CI/CD Automation & SRE  
**Author:** Cloud & DevOps Engineering Intern  

---

## 1. Project Title
**Enterprise Cloud Infrastructure & DevOps Automation** — Production-grade Cloud Engineering, Terraform AWS Architecture, Dual-Mode Kubernetes Orchestration, Automated CI/CD, and Full-Stack Observability.

---

## 2. Project Introduction
This project implements an enterprise-grade cloud computing and DevOps automation platform developed as part of the advanced internship curriculum at Cognevance Technologies. It combines real, production-ready infrastructure configurations, containerized Python microservices, dual-mode local Kubernetes cluster deployments, and an interactive DevOps Monitoring Console.

---

## 3. Problem Statement
Traditional enterprise IT teams frequently face deployment bottlenecks, inconsistent cloud infrastructure environments, manual rollout failures, and poor visibility into runtime container health. Without declarative Infrastructure as Code (IaC), automated testing, and unified observability, applications suffer from configuration drift, downtime during upgrades, and prolonged incident response times.

---

## 4. Objectives
- Design and provision a highly available, multi-AZ AWS VPC using modular Terraform code.
- Develop a production-hardened Python Flask microservice instrumented with real Prometheus metrics.
- Implement multi-stage Docker containerization running under an unprivileged non-root user.
- Build comprehensive Kubernetes manifests supporting dual-mode local execution (Minikube and Kind) and AWS EKS.
- Automate testing, vulnerability scanning, and rollout via a 9-stage GitHub Actions CI/CD pipeline.
- Implement real-time observability using Prometheus scraping and provisioned Grafana dashboards.
- Ensure strict security compliance (least-privilege IAM, RBAC, secret segregation, non-root execution).

---

## 5. Project Scope
The project covers the complete DevOps lifecycle from code commit to container security scanning, infrastructure provisioning, automated rollout, continuous monitoring, and disaster recovery planning. Both local developer environments (Docker Compose, Minikube, Kind) and production cloud targets (AWS EKS, Application Load Balancers) are fully modeled and supported.

---

## 6. Technologies Used
- **Cloud Platform:** Amazon Web Services (AWS) — VPC, Subnets, Internet & NAT Gateways, EKS, IAM, Security Groups
- **Infrastructure as Code:** Terraform v1.7.0+
- **Application Backend:** Python 3.11, Flask, Gunicorn WSGI
- **Application Frontend:** React 19, Tailwind CSS v4, Lucide Icons, JSZip
- **Containerization:** Docker & Docker Compose (Multi-stage build, non-root execution)
- **Container Orchestration:** Kubernetes (Minikube, Kind, AWS EKS)
- **CI/CD Automation:** GitHub Actions (9 automated stages)
- **Container Security Scanning:** Aquasecurity Trivy
- **Observability:** Prometheus v2.45.0
- **Telemetry Dashboards:** Grafana v10.2.0
- **Software Testing:** Pytest 8.0+ & Pytest-Cov

---

## 7. Architecture
The architecture separates concerns into four distinct layers:
1. **Developer & Version Control:** Git branch protection triggering automated CI/CD.
2. **Automated CI/CD Pipeline:** Pytest validation, multi-stage Docker build, Trivy CVE vulnerability scan, and image publishing.
3. **Infrastructure as Code (Terraform):** Modular AWS VPC, dual public and private subnets, security groups, and EKS cluster management.
4. **Runtime & Observability:** Kubernetes cluster running 3 pod replicas with HPA, scraped by Prometheus at 15s intervals and visualized via Grafana.

*(Detailed Mermaid diagrams are available in `documentation/architecture.md`)*.

---

## 8. Application Features
- **Health Check (`GET /health`):** Validates API readiness, process uptime, and subsystem health for Kubernetes probes.
- **System Status (`GET /api/status`):** Exposes real-time telemetry, pod replica counts, and infrastructure states.
- **Architecture Info (`GET /api/info`):** Provides metadata on the technology stack and assignment specifications.
- **Prometheus Metrics (`GET /metrics`):** Exposes Prometheus-compatible plain-text metrics (`http_requests_total`, `http_request_duration_seconds`, `app_availability`, `kubernetes_active_replicas`).
- **Interactive Web Console:** Live dashboard with real-time gauges, log inspector, cluster explorer, and one-click ZIP exporter.

---

## 9. Terraform Implementation
Located in `terraform/`:
- `modules/networking/`: Provisions VPC (`10.0.0.0/16`), public subnets, private subnets, IGW, and NAT Gateways.
- `modules/compute/`: Configures security groups with least-privilege ingress (Port 5000 from ALB).
- `modules/kubernetes/`: Provisions AWS EKS control plane and managed worker node groups (optional cloud target).
- Dry-run validation supported: `terraform validate` and `terraform plan`.

---

## 10. Docker Implementation
Located in `application/Dockerfile`:
- **Multi-Stage Build:** Stage 1 installs dependencies in a temporary container; Stage 2 copies wheels to a minimal Python 3.11-slim runtime.
- **Security:** Runs under unprivileged user `appuser` (UID `10001`).
- **Health Check:** Integrated `HEALTHCHECK` directive hitting `/health`.

---

## 11. Kubernetes Implementation
Located in `kubernetes/`:
- `namespace.yaml`: Isolated namespace `devops-enterprise`.
- `deployment.yaml`: 3 pod replicas with rolling update strategy (`maxSurge: 1`, `maxUnavailable: 0`), non-root security context, and Liveness/Readiness probes.
- `service.yaml`: NodePort `30080` exposing port `5000`.
- `hpa.yaml`: Horizontal Pod Autoscaler targeting 70% CPU utilization (2 to 10 pods).
- `configmap.yaml` & `secret.yaml.example`: Environment decoupled from code.
- `ingress.yaml`: Nginx Ingress routing `devops.local`.

---

## 12. GitHub Actions CI/CD
Located in `.github/workflows/ci-cd.yml`:
- **Stage 1:** Source Code Checkout
- **Stage 2:** Python 3.11 Environment Setup & Cache
- **Stage 3:** Automated Pytest Execution (Fails pipeline if coverage < 80%)
- **Stage 4:** Code & Manifest Syntax Verification
- **Stage 5:** Multi-Stage Docker Image Build
- **Stage 6:** Container Vulnerability Scan with Trivy
- **Stage 7:** Push to Container Registry (Docker Hub)
- **Stage 8:** Kubernetes Cluster Rollout (Kind / AWS EKS)
- **Stage 9:** Automated Rollout Status & Health Verification

---

## 13. Prometheus Monitoring
Located in `monitoring/prometheus/`:
- Scrapes application `/metrics` at 15-second intervals.
- Evaluates alert rules in `rules/alert-rules.yml`: `ServiceInstanceDown`, `HighRequestLatency`, `ElevatedHttp5xxErrors`, and `KubernetesPodReplicaDeficit`.

---

## 14. Grafana Dashboards
Located in `monitoring/grafana/`:
- Auto-provisioned datasource pointing to Prometheus.
- Pre-built dashboard visualizing request rates, P50/P95/P99 latency graphs, active replicas, and availability status.

---

## 15. Logging
- Application logs structured in JSON format with timestamps and log levels.
- Docker logs available via `docker logs <container_id>`.
- Kubernetes pod logs available via `kubectl logs -l app=enterprise-devops-app -n devops-enterprise`.

---

## 16. Security
- IAM least privilege with dedicated EKS cluster and node group roles.
- Docker non-root execution (`UID 10001`) with all Linux capabilities dropped.
- Zero secrets committed to source control; `.gitignore` guards `.env` and `secret.yaml`.
- Automated vulnerability scanning using Trivy.

---

## 17. Backup and Disaster Recovery
- **RTO:** $\le 15$ minutes via declarative Terraform redeployment.
- **RPO:** $\le 1$ hour via Git-versioned manifests and S3 state backups.
- Complete step-by-step recovery runbook in `documentation/backup-disaster-recovery.md`.

---

## 18. Scalability
- Horizontal Pod Autoscaler scales pods from 2 to 10 instances dynamically.
- AWS EKS managed node group scales compute nodes on demand.
- Multi-AZ subnet distribution ensures high availability during data center outages.

---

## 19. Local Installation
Prerequisites: Docker, Docker Compose, Git, Python 3.11 (optional for local pytest).

```bash
git clone https://github.com/your-org/cognevance-enterprise-cloud-devops.git
cd cognevance-enterprise-cloud-devops
```

---

## 20. Local Deployment

### Using Docker Compose:
```bash
docker compose up -d --build
```
Access points:
- Application: `http://localhost:5000`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001` (login `admin` / `admin`)

### Using Kubernetes (Minikube or Kind):
```bash
# Minikube
./scripts/setup-local.sh minikube
./scripts/deploy-local.sh

# Kind
./scripts/setup-local.sh kind
./scripts/deploy-local.sh
```

---

## 21. AWS Deployment Instructions (Optional)
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Update terraform.tfvars (set enable_eks_cluster = true if EKS desired)
terraform init
terraform plan
terraform apply
```

---

## 22. Testing
Run the automated Pytest suite locally:
```bash
cd application
pip install -r requirements.txt
pytest tests/ -v
```
All 6 test cases pass with 100% success rate.

---

## 23. Troubleshooting
- **Pod fails to start:** Run `kubectl describe pod -n devops-enterprise <pod_name>` and inspect Events.
- **Port 5000 collision:** Update `PORT` in `.env` or change host port in `docker-compose.yml`.
- **Image pull error in local K8s:** Ensure images were loaded via `minikube image load` or `kind load docker-image`.

---

## 24. Screenshots
Screenshots of the dashboard, Kubernetes cluster status, Terraform validation, and Grafana graphs are archived in `screenshots/`.

---

## 25. Results
- 100% of functional requirements and deliverables satisfied.
- Zero-downtime rolling update verified during Kubernetes deployment.
- Prometheus scrape targets verified and displaying real latency quantiles.

---

## 26. Limitations
- AWS EKS managed control plane incurs AWS charges ($0.10/hour); hence disabled by default in favor of Minikube/Kind.
- Simulated external traffic load is required to trigger HPA scaling in local development.

---

## 27. Future Enhancements
- Integration of Istio Service Mesh for mutual TLS (mTLS) and canary traffic routing.
- GitOps deployment automation using ArgoCD or Flux.
- Distributed tracing using OpenTelemetry and Jaeger.

---

## 28. Conclusion
The Cognevance Technologies Level 3 Enterprise Cloud Infrastructure & DevOps Automation project successfully demonstrates modern, industry-standard DevOps engineering practices, providing a complete, secure, observable, and reproducible cloud platform.
