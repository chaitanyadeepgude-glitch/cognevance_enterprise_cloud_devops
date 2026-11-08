# Enterprise Cloud Infrastructure & DevOps Automation (Cognevance Level 3)

Design and implement a production-grade, enterprise DevOps system featuring a modular Flask backend, an interactive React-powered DevOps Operations Center dashboard, complete Terraform AWS infrastructure modules, dual-mode local Kubernetes orchestration (Minikube & Kind), automated GitHub Actions CI/CD pipeline, Prometheus/Grafana observability, security hardening, and a one-click GitHub-ready ZIP exporter.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed during clarification and will govern the project implementation:

- **Confirmed Decision 1 (Demonstration Focus)**: Full-lifecycle balanced DevOps suite featuring live monitoring metrics (`/health`, `/api/status`, `/api/info`, `/metrics`) paired with interactive simulators for Kubernetes manifests, Terraform plan inspections, CI/CD execution runs, and Prometheus metric alerts.
- **Confirmed Decision 2 (Local Kubernetes Target)**: Dual-mode support for both Minikube and Kind with automated helper scripts (`setup-local.sh`, `setup-local.bat`, `deploy-local.sh`, `cleanup.sh`) and unified manifests.
- **Confirmed Decision 3 (ZIP Export Capability)**: Built-in client-side ZIP bundler exporting the entire repository tree (`application/`, `terraform/`, `kubernetes/`, `monitoring/`, `.github/`, `scripts/`, `documentation/`, `README.md`) ready for direct `git push` to GitHub or local grading.
- **AWS Cost Governance**: AWS infrastructure provisioning via Terraform remains strictly optional and simulated/dry-run validated by default (`terraform validate`, `terraform plan`), with zero unapproved charges.

---

## 1. Overview & Core Concept

- **What It Does**: Provides an end-to-end Enterprise DevOps platform satisfying all Level 3 internship objectives for Cognevance Technologies. It combines real operational code (Flask API with Prometheus client metrics, Docker multi-stage configurations, valid Kubernetes manifests, modular Terraform AWS architecture) with an interactive web-based DevOps Command Center. The dashboard displays live system status, cluster topology, container statuses, Prometheus scrape targets, simulated CI/CD pipelines, and one-click export for repository files.
- **Target Audience / Persona**: DevOps Evaluators, Internship Supervisors, Cloud Architects, and Technical Interviewers assessing infrastructure as code, container orchestration, CI/CD automation, and site reliability engineering capabilities.
- **Key Value**: Delivers both a runnable, tested codebase for local Minikube/Kind and AWS EKS deployment, as well as an interactive live evaluation dashboard that demonstrates every phase of the cloud lifecycle without requiring paid cloud accounts.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Executive Operations Center (Main Dashboard)**: Real-time service health check, container runtime statistics, node/pod status overview, active alerts, and live Prometheus metric gauges.
2. **Infrastructure & Terraform Inspector**: Interactive AWS VPC, public/private subnet topology, security group matrix, and Terraform plan execution simulator with syntax validation.
3. **Kubernetes Cluster Explorer**: Live inspection of Namespaces, Deployments, Pods, Services, HPA, ConfigMaps, Secrets, and Ingress with YAML manifest viewer and `kubectl` command generator.
4. **DevOps Pipeline & CI/CD Studio**: Visual step-by-step pipeline runner tracking: Checkout → Lint/Test (Pytest) → Docker Build → Security Scan (Trivy) → Registry Push → K8s Deploy → Health Probe Verification.
5. **Observability Hub (Prometheus & Grafana)**: Prometheus scrape target health, metric query preview (`http_requests_total`, `request_duration_seconds`), and embedded Grafana-style dashboard views.
6. **Documentation & Architecture Center**: Interactive project report, Mermaid architecture diagrams, disaster recovery RTO/RPO plans, and testing matrices.
7. **Export & Local Deployment Suite**: One-click download of the complete codebase as a structured ZIP file with setup guides for local CLI testing.

### Visual Identity & Theme
- **Aesthetic Direction**: Utilitarian, mission-critical Enterprise Cloud Console. Clean dark slate aesthetic inspired by AWS Console and Grafana Enterprise, strictly adhering to the universal design constitution (no arbitrary pill enclosures, no ungrounded scores, no pulsing eye-candy).
- **Color Palette**:
  - Dominant Neutral Canvas (60%): `#090D16` (Deep Midnight Slate) and `#0F172A` (Surface Slate)
  - Structural Surfaces (30%): `#1E293B` (Elevated Card), `#334155` (Hairline Border `1px`), `#94A3B8` (Muted Slate Text)
  - Accent Budget (10%): High-intent action cyan/emerald accents: `#0284C7` (Sky Blue Primary CTA), `#10B981` (Nominal Health), `#F59E0B` (Warning/Attention), `#EF4444` (Critical Alert)
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` or `Manrope` for crisp, structured navigation and headers.
  - Body Prose: `Plus Jakarta Sans` / `Public Sans` for scannable 14px/15px UI copy.
  - Data & Telemetry: Monospace tabular numerals (`font-mono tabular-nums`, `JetBrains Mono`) for all IP addresses, ports, latencies, CPU percentages, and timestamps.
- **Component Styling & Layout**: Fixed 260px collapsible sidebar navigation, top breadcrumb bar with single primary export action, and a unified 1440px desktop grid with modular viewports.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Architecture within AI Studio Environment**:
  - *Chosen Approach*: Implement the real Python Flask backend files in the project repository (`application/app/routes.py`, `metrics.py`, `config.py`), while equipping the web frontend with an Express API proxy and real-time client state engine. The frontend serves the live interactive dashboard and allows live execution of simulated DevOps scenarios while exposing exact endpoints matching the Flask contract (`/health`, `/api/status`, `/api/info`, `/metrics`).
  - *Why*: Ensures seamless instant browser evaluation inside the cloud preview while providing 100% production-ready Python, Docker, Terraform, and Kubernetes code ready to be exported and run anywhere.
- **Decision 2: Dual-Mode Local Kubernetes Manifests & Automation**:
  - *Chosen Approach*: Write standardized, version-compatible Kubernetes YAML manifests (APIVersions `apps/v1`, `autoscaling/v2`, `networking.k8s.io/v1`) with environment-agnostic labels and dual-mode bash/batch launcher scripts for Minikube and Kind.
  - *Why*: Enables students and evaluators to run the exact same manifests on macOS, Linux, or Windows without requiring an AWS account or paid EKS cluster.
- **Decision 3: Complete Offline/Local Testing Verification**:
  - *Chosen Approach*: Include real Pytest test suite (`tests/test_app.py`), Terraform configuration syntax validation, Dockerfile security practices (non-root `appuser`, dumb-init, multi-stage), and Trivy vulnerability scan step in GitHub Actions.
  - *Why*: Directly satisfies the Level 3 internship evaluation rubric requiring verifiable testing and security hardening.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DevOps Automation & Cloud Architecture                   │
└─────────────────────────────────────────────────────────────────────────────┘

  [ Developer Workspace ]
             │
             ▼
  ┌───────────────────────┐
  │  Git & GitHub Repo    │
  └──────────┬────────────┘
             │ git push
             ▼
  ┌───────────────────────────────────────────────────────────────────────────┐
  │ GitHub Actions CI/CD Workflow (.github/workflows/ci-cd.yml)               │
  │  ├── 1. Checkout & Setup Python 3.11                                      │
  │  ├── 2. Run Pytest Unit & Integration Tests                               │
  │  ├── 3. Build Multi-Stage Docker Image (non-root appuser)                 │
  │  ├── 4. Vulnerability Security Scan (Trivy Scanner)                       │
  │  ├── 5. Push to Container Registry (Docker Hub / AWS ECR)                 │
  │  └── 6. Deploy to Kubernetes Cluster (Minikube / Kind / AWS EKS)          │
  └─────────────────────────────────────┬─────────────────────────────────────┘
                                        │ kubectl apply -f kubernetes/
                                        ▼
  ┌───────────────────────────────────────────────────────────────────────────┐
  │ Kubernetes Cluster (Namespace: devops-enterprise)                         │
  │                                                                           │
  │   [ Ingress Controller: devops.local ]                                    │
  │                    │                                                      │
  │                    ▼                                                      │
  │   [ Service: ClusterIP / NodePort :5000 ]                                 │
  │                    │                                                      │
  │          ┌─────────┴─────────┐                                            │
  │          ▼                   ▼                                            │
  │   [ Pod Replica 1 ]   [ Pod Replica 2 ]  <── [ Horizontal Pod Autoscaler] │
  │   (Flask App +        (Flask App +             Min: 2 / Max: 10 pods      │
  │    Prometheus Exporter)Prometheus Exporter)                               │
  │          │                   │                                            │
  │          └─────────┬─────────┘                                            │
  │                    ▼                                                      │
  │   [ ConfigMap & Secret Mounts ]                                           │
  └────────────────────┬──────────────────────────────────────────────────────┘
                       │ scrape :5000/metrics
                       ▼
  ┌───────────────────────────────────────────────────────────────────────────┐
  │ Observability & Telemetry Stack                                           │
  │  ├── Prometheus Server (Scrapes /metrics, evaluates alert-rules.yml)      │
  │  └── Grafana Dashboard (Visualizes latency, request rates, memory, CPU)   │
  └───────────────────────────────────────────────────────────────────────────┘
```

### Complete Project File Manifest to Generate
1. **Application Layer (`application/`)**:
   - `app/__init__.py`, `app/routes.py`, `app/config.py`, `app/metrics.py`
   - `templates/index.html`, `static/css/style.css`, `static/js/script.js`
   - `tests/test_app.py`, `requirements.txt`, `Dockerfile`, `.dockerignore`
2. **Infrastructure as Code (`terraform/`)**:
   - `main.tf`, `variables.tf`, `outputs.tf`, `providers.tf`, `versions.tf`, `terraform.tfvars.example`
   - `modules/networking/` (VPC, subnets, IGW, NAT, route tables)
   - `modules/compute/` (Security groups, EC2 launch templates, autoscaling)
   - `modules/kubernetes/` (EKS cluster, IAM roles, node groups)
3. **Kubernetes Manifests (`kubernetes/`)**:
   - `namespace.yaml`, `deployment.yaml`, `service.yaml`, `configmap.yaml`
   - `secret.yaml.example`, `ingress.yaml`, `hpa.yaml`, `serviceaccount.yaml`
4. **CI/CD Automation (`.github/workflows/`)**:
   - `ci-cd.yml` (Complete 9-stage pipeline with Pytest, Docker build, Trivy security scan, and K8s rollout)
5. **Observability (`monitoring/`)**:
   - `prometheus/prometheus.yml`, `prometheus/rules/alert-rules.yml`
   - `grafana/provisioning/datasources/prometheus.yml`, `grafana/dashboards/devops-dashboard.json`
6. **Automation & Scripts (`scripts/`)**:
   - `setup-local.sh`, `setup-local.bat`, `deploy-local.sh`, `cleanup.sh`
   - Root `docker-compose.yml` for unified local container execution
7. **Documentation (`documentation/` & `README.md`)**:
   - `README.md` (28 required sections complete for GitHub)
   - `project-report.md`, `architecture.md`, `terraform-guide.md`, `kubernetes-guide.md`
   - `cicd-workflow.md`, `monitoring-guide.md`, `security-documentation.md`, `backup-disaster-recovery.md`
   - `deployment-guide.md`, `testing-report.md`
8. **Interactive Web Dashboard (`src/`)**:
   - Full React + Tailwind dashboard presenting all 6 interactive consoles, manifest editors, pipeline simulators, live metrics endpoints, and 1-click ZIP exporter.
