# Kubernetes Container Orchestration Guide
Organization: Cognevance Technologies

This guide provides operational runbooks for managing and validating the application workloads on Kubernetes (Minikube, Kind, or AWS EKS).

---

## 1. Kubernetes Manifest Architecture

All declarative manifests reside in the `kubernetes/` directory:

| Manifest | Kind | Purpose |
| :--- | :--- | :--- |
| `namespace.yaml` | `Namespace` | Logical boundary (`devops-enterprise`) for workload isolation |
| `serviceaccount.yaml` | `ServiceAccount` | Least-privilege identity with API token automount disabled |
| `configmap.yaml` | `ConfigMap` | Non-sensitive runtime variables (`PORT`, `LOG_LEVEL`) |
| `secret.yaml.example` | `Secret` | Base64-encoded credentials template (`SECRET_KEY`) |
| `deployment.yaml` | `Deployment` | 3 pod replicas with rolling updates, probes, and resource constraints |
| `service.yaml` | `Service` | NodePort (30080) and internal cluster routing on port 5000 |
| `hpa.yaml` | `HorizontalPodAutoscaler` | Dynamic autoscaling between 2 and 10 pods based on 70% CPU target |
| `ingress.yaml` | `Ingress` | Nginx Ingress routing for `devops.local` host |

---

## 2. Cluster Validation Commands

### Inspect Cluster Health
```bash
# Verify worker nodes are Ready
kubectl get nodes -o wide

# Check namespace creation
kubectl get namespaces

# List all resources in the enterprise namespace
kubectl get all -n devops-enterprise
```

### Inspect Pods & Deployments
```bash
# View active pods, IP allocations, and node assignments
kubectl get pods -n devops-enterprise -o wide

# Check rolling update status
kubectl rollout status deployment/enterprise-devops-app -n devops-enterprise

# Inspect container health probes and event logs
kubectl describe pod -l app=enterprise-devops-app -n devops-enterprise
```

### Pod Log Streaming
```bash
# Stream logs from all deployment pods simultaneously
kubectl logs -f -l app=enterprise-devops-app -n devops-enterprise --tail=50
```

### Health Probes & Auto-Recovery
The deployment implements dual health probes:
1. **Liveness Probe**: `GET /health` on port 5000 every 10 seconds. If 3 consecutive probes fail, Kubernetes terminates the unhealthy container and launches a replacement.
2. **Readiness Probe**: `GET /health` on port 5000 every 5 seconds. Traffic from `enterprise-devops-svc` is only routed once the container responds with HTTP 200.

### Local Port Forwarding
To interact with the service directly on your workstation:
```bash
kubectl port-forward svc/enterprise-devops-svc 5000:5000 -n devops-enterprise
```
Visit `http://localhost:5000` or `http://localhost:5000/metrics`.
