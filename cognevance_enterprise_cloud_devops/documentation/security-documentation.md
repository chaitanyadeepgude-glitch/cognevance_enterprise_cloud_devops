# Enterprise DevOps Security Architecture
Organization: Cognevance Technologies

This document specifies the security controls and defense-in-depth principles implemented across the platform.

---

## 1. Security Matrix

| Layer | Security Control | Technical Implementation |
| :--- | :--- | :--- |
| **Container** | Non-Root User | Run as `appuser` (UID `10001`); no sudo privileges |
| **Container** | Capability Dropping | `drop: ["ALL"]` in Kubernetes container securityContext |
| **Container** | Image Scanning | Trivy vulnerability scan in GitHub Actions Stage 6 |
| **Kubernetes** | Least Privilege Identity | ServiceAccount token automount disabled (`automountServiceAccountToken: false`) |
| **Kubernetes** | Secret Segregation | API salts and credentials segregated into `Secret` objects, not stored in source |
| **Network** | VPC Segmentation | Private subnets for worker nodes; public subnets for ingress only |
| **Network** | Security Groups | Inbound restricted to port 5000 only from ALB security group |
| **IaC** | Credential Protection | No hardcoded AWS access keys; dynamic IAM instance roles used |
| **CI/CD** | Workflow Permissions | Explicit least-privilege token permissions (`contents: read`) |

---

## 2. Dockerfile Hardening Details

- **Multi-stage builds**: Build tools (gcc, build-essential) are contained strictly within the temporary `builder` image and omitted from the final runtime image, drastically reducing the container attack surface.
- **Unprivileged user**: Root access inside a container increases the risk of container escape vulnerabilities. Creating `appuser` ensures isolation.
- **No secret baking**: Secrets, `.env` files, and local logs are strictly filtered via `.dockerignore`.
