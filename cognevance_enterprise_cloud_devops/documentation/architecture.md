# Cloud Architecture & DevOps Automation Diagrams
Organization: Cognevance Technologies

This document outlines the architectural blueprint, data flow, and networking topologies across the Enterprise Cloud and DevOps environment.

---

## 1. End-to-End DevOps Lifecycle Pipeline

The diagram below illustrates the developer lifecycle from code commit to automated testing, container scanning, registry publishing, and Kubernetes rollout.

```mermaid
graph TD
    A[Developer Git Commit] -->|git push| B[GitHub Repository]
    B -->|Webhook Trigger| C[GitHub Actions Workflow]
    
    subgraph "CI/CD Automation Pipeline"
        C --> D[Stage 1: Source Code Checkout]
        D --> E[Stage 2: Setup Python 3.11 Runtime]
        E --> F[Stage 3: Run Pytest & Coverage Check]
        F --> G[Stage 4: Python Syntax Validation]
        G --> H[Stage 5: Docker Multi-Stage Image Build]
        H --> I[Stage 6: Trivy Container Vulnerability Scan]
        I --> J[Stage 7: Push Image to Docker Hub / ECR]
        J --> K[Stage 8: Deploy Manifests to Kubernetes]
        K --> L[Stage 9: Automated Rollout & Health Check]
    end

    subgraph "Kubernetes Cluster (Minikube / Kind / AWS EKS)"
        L --> M[Rolling Update Deployment: 3 Replicas]
        M --> N[Liveness & Readiness Probes Verified]
    end

    subgraph "Telemetry & Observability"
        M -->|Exposes /metrics| O[Prometheus Server]
        O -->|Alert Rules Evaluated| P[Alertmanager]
        O -->|Metrics Query| Q[Grafana Dashboard]
    end
```

---

## 2. AWS Cloud Infrastructure Architecture (Terraform Provisioned)

The cloud architecture is designed across two Availability Zones for high availability and fault isolation.

```mermaid
graph TB
    Internet([Public Internet / Clients]) --> IGW[AWS Internet Gateway]

    subgraph "AWS Region: us-east-1"
        subgraph "VPC: 10.0.0.0/16 (Cognevance Enterprise VPC)"
            
            subgraph "Availability Zone us-east-1a"
                subgraph "Public Subnet 1: 10.0.1.0/24"
                    ALB1[Application Load Balancer Node]
                    NAT1[NAT Gateway us-east-1a]
                end
                subgraph "Private Subnet 1: 10.0.10.0/24"
                    K8S_Node1[EKS Worker Node 1]
                    Pod1[DevOps App Pod 1]
                    Pod2[DevOps App Pod 2]
                end
            end

            subgraph "Availability Zone us-east-1b"
                subgraph "Public Subnet 2: 10.0.2.0/24"
                    ALB2[Application Load Balancer Node]
                end
                subgraph "Private Subnet 2: 10.0.20.0/24"
                    K8S_Node2[EKS Worker Node 2]
                    Pod3[DevOps App Pod 3]
                end
            end

        end

        subgraph "AWS Managed Control Plane"
            EKS_Master[AWS EKS API Server v1.29]
            CloudWatch[CloudWatch Audit & Control Plane Logs]
        end
    end

    IGW --> ALB1
    IGW --> ALB2
    ALB1 --> Pod1
    ALB1 --> Pod2
    ALB2 --> Pod3
    K8S_Node1 --> NAT1
    NAT1 --> IGW
    EKS_Master -.-> K8S_Node1
    EKS_Master -.-> K8S_Node2
    EKS_Master --> CloudWatch
```

---

## 3. Kubernetes Pod Networking & Observability Architecture

```mermaid
graph LR
    Client[Client / Ingress Request] -->|Host: devops.local| ING[Nginx Ingress Controller]
    ING -->|Port 5000| SVC[Kubernetes Service: NodePort 30080]
    
    subgraph "Namespace: devops-enterprise"
        SVC --> PodA[Pod 1: IP 10.244.1.12]
        SVC --> PodB[Pod 2: IP 10.244.2.18]
        SVC --> PodC[Pod 3: IP 10.244.1.15]

        CM[(ConfigMap: enterprise-devops-config)] -.-> PodA
        CM -.-> PodB
        CM -.-> PodC

        SEC[(Secret: enterprise-devops-secret)] -.-> PodA
        SEC -.-> PodB
        SEC -.-> PodC

        HPA[Horizontal Pod Autoscaler] -->|Metrics CPU & Mem| PodA
        HPA --> PodB
        HPA --> PodC
    end

    PROM[Prometheus Scraper] -->|HTTP GET /metrics| PodA
    PROM -->|HTTP GET /metrics| PodB
    PROM -->|HTTP GET /metrics| PodC
    GRAF[Grafana Console] -->|PromQL Queries| PROM
```
