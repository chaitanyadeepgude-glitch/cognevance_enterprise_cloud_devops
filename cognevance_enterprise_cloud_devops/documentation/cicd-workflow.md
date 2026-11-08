# CI/CD Automation & GitHub Actions Runbook
Organization: Cognevance Technologies

This document explains the 9-stage CI/CD pipeline defined in `.github/workflows/ci-cd.yml`.

---

## 1. Pipeline Stages Overview

```
[ Developer Commit ]
       │
       ▼
1. Source Checkout (actions/checkout@v4)
       │
       ▼
2. Environment Setup (actions/setup-python@v5, Python 3.11)
       │
       ▼
3. Automated Testing (Pytest unit & coverage checks)
       │
       ▼
4. Code Validation (Python compilation & manifest lint)
       │
       ▼
5. Docker Multi-Stage Build (docker/build-push-action@v5)
       │
       ▼
6. Container Vulnerability Scan (aquasecurity/trivy-action)
       │
       ▼
7. Container Registry Publish (Docker Hub / AWS ECR)
       │
       ▼
8. Kubernetes Cluster Rollout (helm/kind-action / AWS EKS)
       │
       ▼
9. Rollout Status & Health Verification (kubectl rollout status)
```

---

## 2. GitHub Secrets Setup

To enable automated image publishing and AWS deployment, configure the following secrets in GitHub Repository Settings (`Settings -> Secrets and variables -> Actions`):

| Secret Name | Description | Example / Format |
| :--- | :--- | :--- |
| `DOCKERHUB_USERNAME` | Docker Hub username | `cognevancedevops` |
| `DOCKERHUB_TOKEN` | Personal Access Token (PAT) with Read/Write | `dckr_pat_...` |
| `AWS_ACCESS_KEY_ID` | IAM User Access Key (for optional AWS EKS) | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | IAM Secret Key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |

> [!NOTE]
> When secrets are not configured, the pipeline gracefully skips the remote registry push stage and proceeds with local verification, ensuring student submissions never fail due to missing cloud credentials.

---

## 3. Container Security Gate: Trivy Vulnerability Scanning

Stage 6 executes Trivy to scan the newly built container image for Known Vulnerabilities and Exposures (CVEs).
- Scans both OS packages and application dependencies.
- Filters out unfixed CVEs (`--ignore-unfixed`).
- Focuses on `CRITICAL` and `HIGH` severity issues.
