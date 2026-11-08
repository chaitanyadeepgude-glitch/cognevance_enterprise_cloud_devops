# Enterprise Cloud Infrastructure & DevOps Automation
## Final Engineering Internship Project Report — Level 3 Advanced

**Organization:** Cognevance Technologies  
**Project Domain:** Cloud Architecture, Infrastructure as Code, Container Orchestration, CI/CD & SRE  
**Project Level:** Level 3 – Advanced  
**Date:** March 2026  

---

### Executive Summary

In contemporary cloud engineering, enterprise software systems must guarantee continuous delivery, zero-downtime scalability, resilient fault isolation, and deep operational observability. This project delivers an enterprise-grade cloud infrastructure and DevOps automation ecosystem designed for Cognevance Technologies.

The project demonstrates:
1. **Modular Infrastructure as Code**: Reusable Terraform modules provisioning an AWS VPC across multiple Availability Zones, public and private subnets, NAT Gateways, least-privilege security groups, and an optional managed AWS EKS Kubernetes cluster.
2. **Containerization & Hardening**: Multi-stage Docker builds based on unprivileged non-root users (`UID 10001`), dumb-init process handling, and automated container vulnerability scanning with Trivy.
3. **Container Orchestration**: Dual-mode local Kubernetes implementation (supporting both Minikube and Kind) with production-ready manifests: Namespace isolation, Multi-replica Deployments, Services, ConfigMaps, Secrets, Ingress, Horizontal Pod Autoscalers (HPA), and robust Liveness/Readiness probes.
4. **Automated CI/CD Workflow**: A 9-stage GitHub Actions pipeline enforcing automated Pytest testing with code coverage, syntax validation, Docker builds, image scanning, container registry publishing, and automated Kubernetes rollout validation.
5. **Observability & SRE**: Prometheus metric collection scraping application endpoints (`/metrics`), evaluating latency/error alert rules, and automated Grafana dashboard provisioning.
6. **Disaster Recovery & Security**: Clear RTO/RPO targets, multi-AZ resilience, state isolation, and zero hardcoded credentials.

---

### Problem Statement

Legacy enterprise application deployments often suffer from:
- Inconsistent manual provisioning leading to infrastructure configuration drift.
- Lack of automated testing prior to containerization resulting in regression bugs in production.
- Monolithic deployment processes with noticeable downtime during upgrades.
- Opaque operational metrics with zero visibility into request latencies, memory pressure, or pod restarts.
- High security risks from running containers as root and storing plain-text credentials in version control.

### Objectives & Deliverables

- **Objective 1**: Implement a 12-factor Python Flask microservice providing `/health`, `/api/status`, `/api/info`, and `/metrics`.
- **Objective 2**: Develop modular Terraform architecture with clean separation between networking, compute, and Kubernetes control planes.
- **Objective 3**: Author verified Kubernetes manifests with declarative rolling updates and horizontal autoscaling.
- **Objective 4**: Design an end-to-end GitHub Actions pipeline with automated unit testing and security gating.
- **Objective 5**: Provision Prometheus metrics collection and Grafana dashboard visualization.
- **Objective 6**: Provide 100% executable local demonstration scripts that do not require cloud expenses while offering optional AWS EKS deployment.

---

### Key Metrics & Implementation Highlights

| Area | Implementation Standard | Result / Verification |
| :--- | :--- | :--- |
| **Backend Service** | Python 3.11 / Flask / Gunicorn | Passed 6 unit tests with 100% pass rate |
| **Container Security** | Non-root `appuser` (UID 10001) | Dropped all Linux capabilities |
| **IaC Modules** | Terraform AWS provider v5.30+ | 3 decoupled modules (Network, Compute, K8s) |
| **Orchestration** | Kubernetes 1.29 (Minikube / Kind) | 3 Replicas + HPA (2 to 10 pods) |
| **CI/CD Pipeline** | GitHub Actions (9 Stages) | Automated Pytest + Trivy vulnerability gating |
| **Observability** | Prometheus v2.45 + Grafana v10.2 | Real-time P95 latency & request rate dashboards |
