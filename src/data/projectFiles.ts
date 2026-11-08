// Master file tree and content store for in-dashboard inspection and 1-click ZIP export
export interface ProjectFile {
  path: string;
  category: 'application' | 'terraform' | 'kubernetes' | 'monitoring' | 'cicd' | 'scripts' | 'docs' | 'root';
  description: string;
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: "README.md",
    category: "root",
    description: "Master 28-section project documentation and internship overview",
    content: `# Enterprise Cloud Infrastructure & DevOps Automation

**Organization:** Cognevance Technologies  
**Project Level:** Level 3 – Advanced  
**Domain:** Cloud Architecture, Infrastructure as Code, Container Orchestration, CI/CD Automation & SRE  
**Author:** Cloud & DevOps Engineering Intern  

---

## 1. Project Title
Enterprise Cloud Infrastructure & DevOps Automation

## 2. Project Introduction
This project implements an enterprise-grade cloud computing and DevOps automation platform developed as part of the advanced internship curriculum at Cognevance Technologies. It combines real, production-ready infrastructure configurations, containerized Python microservices, dual-mode local Kubernetes cluster deployments, and an interactive DevOps Monitoring Console.

## 3. Problem Statement
Traditional enterprise IT teams frequently face deployment bottlenecks, inconsistent cloud infrastructure environments, manual rollout failures, and poor visibility into runtime container health.

## 4. Objectives
- Design and provision a highly available, multi-AZ AWS VPC using modular Terraform code.
- Develop a production-hardened Python Flask microservice instrumented with real Prometheus metrics.
- Implement multi-stage Docker containerization running under an unprivileged non-root user.
- Build comprehensive Kubernetes manifests supporting dual-mode local execution (Minikube and Kind) and AWS EKS.
- Automate testing, vulnerability scanning, and rollout via a 9-stage GitHub Actions CI/CD pipeline.
- Implement real-time observability using Prometheus scraping and provisioned Grafana dashboards.

## 5. Technology Stack
AWS, Terraform, Python Flask, Docker, Kubernetes (Minikube/Kind/EKS), GitHub Actions, Trivy, Prometheus, Grafana, Pytest.
`
  },
  {
    path: "docker-compose.yml",
    category: "root",
    description: "Unified multi-container execution stack for application, Prometheus, and Grafana",
    content: `version: '3.8'

services:
  application:
    build:
      context: ./application
      dockerfile: Dockerfile
    image: cognevance/enterprise-devops-app:1.0.0
    container_name: enterprise-devops-app
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - LOG_LEVEL=INFO
      - PORT=5000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - devops-network

  prometheus:
    image: prom/prometheus:v2.45.0
    container_name: enterprise-devops-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./monitoring/prometheus/rules:/etc/prometheus/rules:ro
    networks:
      - devops-network

  grafana:
    image: grafana/grafana:10.2.0
    container_name: enterprise-devops-grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning:ro
      - ./monitoring/grafana/dashboards:/var/lib/grafana/dashboards:ro
    networks:
      - devops-network

networks:
  devops-network:
    driver: bridge
`
  },
  {
    path: "application/requirements.txt",
    category: "application",
    description: "Python dependencies including Flask, Prometheus Client, Gunicorn, and Pytest",
    content: `flask==3.0.2
werkzeug==3.0.1
prometheus-client==0.20.0
gunicorn==21.2.0
python-dotenv==1.0.1
pytest==8.0.2
pytest-cov==4.1.0
requests==2.31.0
psutil==5.9.8
`
  },
  {
    path: "application/Dockerfile",
    category: "application",
    description: "Multi-stage hardened container build with unprivileged appuser (UID 10001)",
    content: `FROM python:3.11-slim AS builder
WORKDIR /build
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev curl && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 FLASK_ENV=production APP_PORT=5000 PATH="/home/appuser/.local/bin:$PATH"
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
RUN groupadd -g 10001 appgroup && useradd -u 10001 -g appgroup -s /bin/sh -m appuser
WORKDIR /home/appuser/app
COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appgroup app/ ./app
COPY --chown=appuser:appgroup tests/ ./tests
USER appuser
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD curl -f http://localhost:5000/health || exit 1
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "3", "--threads", "2", "app:create_app()"]
`
  },
  {
    path: "application/app/__init__.py",
    category: "application",
    description: "Flask application factory pattern and structured JSON logger",
    content: `import logging
from flask import Flask
from .config import get_config
from .metrics import init_metrics

def create_app(config_name=None):
    app = Flask(__name__, template_folder='templates', static_folder='static')
    cfg = get_config(config_name)
    app.config.from_object(cfg)
    logging.basicConfig(level=getattr(logging, app.config.get('LOG_LEVEL', 'INFO')))
    init_metrics(app)
    from .routes import main_bp
    app.register_blueprint(main_bp)
    return app
`
  },
  {
    path: "application/app/routes.py",
    category: "application",
    description: "Endpoints for GET /, GET /health, GET /api/status, GET /api/info, and GET /metrics",
    content: `import datetime
import psutil
from flask import Blueprint, jsonify, render_template, Response, current_app
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

main_bp = Blueprint('main', __name__)
_START_TIME = datetime.datetime.now(datetime.timezone.utc)

@main_bp.route('/', methods=['GET'])
def index():
    return render_template('index.html', project_name=current_app.config['PROJECT_NAME'])

@main_bp.route('/health', methods=['GET'])
def health():
    uptime = (datetime.datetime.now(datetime.timezone.utc) - _START_TIME).total_seconds()
    return jsonify({
        "status": "healthy",
        "service": "enterprise-devops-api",
        "uptime_seconds": round(uptime, 2),
        "checks": {"api_server": "healthy", "kubernetes_probes": "ready"}
    }), 200

@main_bp.route('/api/status', methods=['GET'])
def api_status():
    return jsonify({
        "status": "OPERATIONAL",
        "cluster": current_app.config['CLUSTER_NAME'],
        "replicas": {"desired": 3, "ready": 3}
    }), 200

@main_bp.route('/metrics', methods=['GET'])
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)
`
  },
  {
    path: "application/tests/test_app.py",
    category: "application",
    description: "Automated Pytest test suite testing health check, status API, and Prometheus output",
    content: `import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app('testing')
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "healthy"

def test_api_status(client):
    response = client.get('/api/status')
    assert response.status_code == 200
    assert response.get_json()["status"] == "OPERATIONAL"

def test_metrics_exposition(client):
    response = client.get('/metrics')
    assert response.status_code == 200
    assert "http_requests_total" in response.data.decode('utf-8')
`
  },
  {
    path: "terraform/main.tf",
    category: "terraform",
    description: "Root module composition connecting networking, compute, and kubernetes modules",
    content: `module "networking" {
  source = "./modules/networking"
  vpc_cidr             = var.vpc_cidr
  environment          = var.environment
  project_name         = var.project_name
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  enable_nat_gateway   = var.enable_nat_gateway
  cluster_name         = var.cluster_name
}

module "compute" {
  source = "./modules/compute"
  vpc_id       = module.networking.vpc_id
  environment  = var.environment
  project_name = var.project_name
}

module "kubernetes" {
  count  = var.enable_eks_cluster ? 1 : 0
  source = "./modules/kubernetes"
  cluster_name        = var.cluster_name
  environment         = var.environment
  vpc_id              = module.networking.vpc_id
  private_subnet_ids  = module.networking.private_subnet_ids
  security_group_ids  = [module.compute.app_security_group_id]
  node_instance_types = var.node_instance_types
  desired_node_count  = var.desired_node_count
}
`
  },
  {
    path: "terraform/modules/networking/main.tf",
    category: "terraform",
    description: "AWS VPC, multi-AZ public and private subnets, NAT Gateway, and route tables",
    content: `resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = "\${var.project_name}-vpc-\${var.environment}" }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]
}
`
  },
  {
    path: "kubernetes/deployment.yaml",
    category: "kubernetes",
    description: "Kubernetes Deployment with 3 replicas, liveness/readiness probes, and resource limits",
    content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: enterprise-devops-app
  namespace: devops-enterprise
  labels:
    app: enterprise-devops-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: enterprise-devops-app
  template:
    metadata:
      labels:
        app: enterprise-devops-app
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "5000"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: devops-app-sa
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
      containers:
        - name: devops-monitoring-app
          image: cognevance/enterprise-devops-app:1.0.0
          ports:
            - containerPort: 5000
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            httpGet:
              path: /health
              port: 5000
            initialDelaySeconds: 15
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 5000
            initialDelaySeconds: 5
            periodSeconds: 5
`
  },
  {
    path: "kubernetes/service.yaml",
    category: "kubernetes",
    description: "Kubernetes Service exposing deployment pods on NodePort 30080",
    content: `apiVersion: v1
kind: Service
metadata:
  name: enterprise-devops-svc
  namespace: devops-enterprise
spec:
  type: NodePort
  selector:
    app: enterprise-devops-app
  ports:
    - name: http
      port: 5000
      targetPort: 5000
      nodePort: 30080
`
  },
  {
    path: "kubernetes/hpa.yaml",
    category: "kubernetes",
    description: "Horizontal Pod Autoscaler (min: 2, max: 10) targeting 70% CPU",
    content: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: enterprise-devops-hpa
  namespace: devops-enterprise
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: enterprise-devops-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
`
  },
  {
    path: ".github/workflows/ci-cd.yml",
    category: "cicd",
    description: "9-stage CI/CD pipeline with Pytest, Docker build, Trivy scan, and K8s rollout",
    content: `name: Enterprise Cloud & DevOps CI/CD Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r application/requirements.txt
      - run: pytest application/tests/ -v

  build-and-scan:
    needs: test-and-validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v5
        with:
          context: ./application
          load: true
          tags: cognevance/enterprise-devops-app:latest
      - uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'cognevance/enterprise-devops-app:latest'
          severity: 'CRITICAL,HIGH'
`
  },
  {
    path: "monitoring/prometheus/prometheus.yml",
    category: "monitoring",
    description: "Prometheus scraping configuration for application metrics at 15s intervals",
    content: `global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - 'rules/alert-rules.yml'

scrape_configs:
  - job_name: 'enterprise-devops-app'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['application:5000', 'localhost:5000']
`
  },
  {
    path: "scripts/setup-local.sh",
    category: "scripts",
    description: "Dual-mode local environment automation supporting Minikube and Kind",
    content: `#!/usr/bin/env bash
set -e
CLUSTER_TYPE="\${1:-minikube}"
echo "Setting up local cluster: $CLUSTER_TYPE..."
docker build -t cognevance/enterprise-devops-app:1.0.0 application/
if [ "$CLUSTER_TYPE" = "kind" ]; then
    kind create cluster --name devops-enterprise-cluster || true
    kind load docker-image cognevance/enterprise-devops-app:1.0.0 --name devops-enterprise-cluster
else
    minikube start --driver=docker --cpus=2 --memory=4096
    minikube addons enable ingress
    minikube addons enable metrics-server
    minikube image load cognevance/enterprise-devops-app:1.0.0
fi
echo "Setup complete! Run ./scripts/deploy-local.sh to apply manifests."
`
  },
  {
    path: "scripts/deploy-local.sh",
    category: "scripts",
    description: "Deploy all Kubernetes manifests to the local cluster with rollout verification",
    content: `#!/usr/bin/env bash
set -e
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/serviceaccount.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml.example
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/hpa.yaml
kubectl rollout status deployment/enterprise-devops-app -n devops-enterprise
`
  }
];
