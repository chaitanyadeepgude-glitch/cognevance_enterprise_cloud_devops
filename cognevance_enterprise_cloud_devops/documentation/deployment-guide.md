# Deployment Guide (Local & Cloud)
Organization: Cognevance Technologies

This guide provides step-by-step instructions for deploying the project in different environments.

---

## Environment 1: Local Development with Docker Compose (Fastest)

Ideal for quick testing of application, Prometheus, and Grafana:

```bash
# 1. Start all containers in background
docker compose up -d --build

# 2. Verify container status
docker compose ps

# 3. Test application health endpoint
curl http://localhost:5000/health

# 4. View logs
docker compose logs -f application

# 5. Stop stack
docker compose down
```

---

## Environment 2: Local Kubernetes (Minikube or Kind)

Ideal for validating Kubernetes manifests, HPA, and Service routing:

```bash
# Option A: Minikube
./scripts/setup-local.sh minikube
./scripts/deploy-local.sh

# Option B: Kind
./scripts/setup-local.sh kind
./scripts/deploy-local.sh

# Test with port forwarding
kubectl port-forward svc/enterprise-devops-svc 5000:5000 -n devops-enterprise
curl http://localhost:5000/health
```

---

## Environment 3: AWS Cloud Deployment with Terraform & EKS (Optional)

> [!WARNING]
> Requires active AWS account and IAM permissions. Keep `enable_eks_cluster = false` in `terraform.tfvars` if testing VPC only.

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```
