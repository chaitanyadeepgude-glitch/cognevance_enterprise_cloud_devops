import React, { useState } from 'react';
import { BookOpen, Copy, Check, FileText } from 'lucide-react';
import { PROJECT_FILES } from '../data/projectFiles';

export const DocumentationView: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<string>('project-report.md');
  const [copied, setCopied] = useState<boolean>(false);

  const docs = [
    { id: 'project-report.md', title: 'Internship Project Report', desc: 'Comprehensive Level 3 Advanced Project Report for Cognevance Technologies.' },
    { id: 'architecture.md', title: 'Architecture & Diagrams', desc: 'Mermaid diagrams for CI/CD, AWS VPC topology, Kubernetes networking, and telemetry.' },
    { id: 'terraform-guide.md', title: 'Terraform IaC Guide', desc: 'Modular AWS Terraform code, execution commands, and S3 remote state locking.' },
    { id: 'kubernetes-guide.md', title: 'Kubernetes Guide', desc: 'Minikube/Kind runbook, manifest breakdown, probes, and kubectl commands.' },
    { id: 'cicd-workflow.md', title: 'CI/CD Pipeline Guide', desc: '9-stage GitHub Actions breakdown, Trivy vulnerability scanning, and secrets.' },
    { id: 'monitoring-guide.md', title: 'Monitoring & Observability', desc: 'Prometheus metrics, PromQL queries, and Grafana dashboard provisioning.' },
    { id: 'security-documentation.md', title: 'Security Architecture', desc: 'Defense-in-depth matrix, non-root containers, and IAM least-privilege.' },
    { id: 'backup-disaster-recovery.md', title: 'Backup & Disaster Recovery', desc: 'RTO/RPO objectives, multi-AZ resilience, and redeployment runbooks.' },
    { id: 'testing-report.md', title: 'Testing & Verification Report', desc: 'Pytest 100% pass rate, Docker hardening audit, and manifest validation.' },
    { id: 'README.md', title: 'Master README (28 Sections)', desc: 'Official 28-section submission README for GitHub repository.' },
  ];

  const docContents: Record<string, string> = {
    'project-report.md': `# Enterprise Cloud Infrastructure & DevOps Automation
## Final Engineering Internship Project Report — Level 3 Advanced

**Organization:** Cognevance Technologies
**Project Domain:** Cloud Architecture, Infrastructure as Code, Container Orchestration, CI/CD & SRE
**Project Level:** Level 3 – Advanced

### Executive Summary
This project delivers an enterprise-grade cloud infrastructure and DevOps automation ecosystem designed for Cognevance Technologies.

The project demonstrates:
1. Modular Infrastructure as Code using Terraform AWS provider v5.30+
2. Containerization & Hardening with unprivileged non-root users (UID 10001)
3. Dual-mode local Kubernetes implementation (supporting both Minikube and Kind)
4. 9-stage GitHub Actions automated CI/CD pipeline with Pytest and Trivy
5. Real-time observability using Prometheus and Grafana
6. Disaster Recovery & Security with clear RTO (15 min) and RPO (1 hr) targets

### Key Implementation Matrix
- Backend Service: Python 3.11 / Flask / Gunicorn (6 Pytest cases passed)
- Container Security: Non-root appuser, dropped all capabilities
- IaC Modules: 3 decoupled modules (Network, Compute, Kubernetes)
- Orchestration: Kubernetes 1.29 (3 Replicas + HPA 2 to 10 pods)
- Observability: Prometheus scraping at 15s intervals, Grafana dashboard`,

    'architecture.md': `# Cloud Architecture & DevOps Automation Diagrams

## End-to-End DevOps Lifecycle Pipeline
Developer Git Commit -> GitHub Repo -> GitHub Actions (Pytest, Lint, Docker Build, Trivy Scan, Registry Push, K8s Rollout) -> Kubernetes Pods -> Prometheus Metrics -> Grafana Dashboard

## AWS Cloud Infrastructure (Terraform Provisioned)
- VPC: 10.0.0.0/16 across us-east-1a and us-east-1b
- Public Subnets (10.0.1.0/24, 10.0.2.0/24) hosting ALB and NAT Gateways
- Private Subnets (10.0.10.0/24, 10.0.20.0/24) hosting EKS worker nodes and application pods
- Security Groups: Least-privilege ingress strictly from ALB on port 5000

## Kubernetes Pod Networking & Telemetry
- Namespace: devops-enterprise
- Pods: 3 replicas with rolling updates and dual probes (/health)
- Horizontal Pod Autoscaler targeting 70% CPU utilization
- Prometheus scrapes /metrics on port 5000 every 15s`,

    'terraform-guide.md': `# Terraform Infrastructure as Code (IaC) Guide

## Lifecycle Commands
- terraform init: Initializes AWS provider and modules
- terraform fmt -check -recursive: Ensures canonical code formatting
- terraform validate: Performs static syntax and argument validation
- terraform plan: Computes dry-run execution plan without making changes
- terraform apply: Deploys infrastructure to AWS (keep optional to prevent charges)
- terraform destroy: Teardown all resources gracefully

## Remote State Security
For production teams, store state in Amazon S3 with AES-256 encryption and configure state locking via Amazon DynamoDB table.`,

    'kubernetes-guide.md': `# Kubernetes Container Orchestration Guide

## Manifest Architecture
- namespace.yaml: Boundary devops-enterprise
- serviceaccount.yaml: Least-privilege identity without auto-token mount
- configmap.yaml & secret.yaml.example: Decoupled environment configuration
- deployment.yaml: 3 replicas, liveness/readiness probes, resource limits
- service.yaml: Exposes port 5000 on NodePort 30080
- hpa.yaml: Scales pods dynamically from 2 to 10 instances
- ingress.yaml: Nginx Ingress routing for devops.local

## Cluster Inspection Commands
- kubectl get nodes -o wide
- kubectl get pods -n devops-enterprise -o wide
- kubectl get all -n devops-enterprise
- kubectl rollout status deployment/enterprise-devops-app -n devops-enterprise`,

    'cicd-workflow.md': `# CI/CD Automation & GitHub Actions Runbook

## 9-Stage Pipeline Workflow
1. Source Code Checkout (actions/checkout@v4)
2. Setup Python 3.11 Runtime (actions/setup-python@v5)
3. Automated Pytest Unit Tests (80% coverage threshold)
4. Code Validation & Python Bytecode Compilation
5. Docker Multi-Stage Image Build
6. Trivy Container Vulnerability Scanning
7. Container Registry Publish (Docker Hub)
8. Kubernetes Cluster Rollout (Minikube / Kind / AWS EKS)
9. Deployment Verification & Health Probe Validation`,

    'monitoring-guide.md': `# Prometheus & Grafana Monitoring Guide

## Metrics Instrumentation
The Flask microservice exposes:
- http_requests_total (Counter by method, endpoint, status_code)
- http_request_duration_seconds (Histogram across 10 latency buckets)
- app_availability (Binary gauge 1 = nominal, 0 = degraded)
- kubernetes_active_replicas (Gauge tracking pod count)

## PromQL Queries
- Overall Request Rate: sum(rate(http_requests_total[1m]))
- P95 Latency: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) * 1000
- Error Rate: sum(rate(http_requests_errors_total[5m])) / sum(rate(http_requests_total[5m])) * 100`,

    'security-documentation.md': `# Enterprise DevOps Security Architecture

## Defense-in-Depth Controls
- Container Security: Non-root user appuser (UID 10001); dropped all Linux capabilities
- Vulnerability Scanning: Trivy scanner gates image publishing on CRITICAL CVEs
- Least Privilege RBAC: ServiceAccount automountServiceAccountToken = false
- Network Isolation: Application workloads reside strictly in private subnets
- Credential Protection: Zero hardcoded secrets in source control`,

    'backup-disaster-recovery.md': `# Backup and Disaster Recovery (DR) Strategy

## Metrics
- Recovery Point Objective (RPO): <= 1 hour
- Recovery Time Objective (RTO): <= 15 minutes

## Disaster Recovery Runbook
1. Verify Terraform state from remote S3 backend
2. Run terraform apply -auto-approve
3. Configure kubectl context (aws eks update-kubeconfig)
4. Deploy Kubernetes manifests: kubectl apply -f kubernetes/
5. Verify application health probe: curl -f http://<ALB_ENDPOINT>/health`,

    'testing-report.md': `# Comprehensive Testing & Verification Report

## Pytest Execution Results
- test_index_route: PASSED
- test_health_check: PASSED
- test_api_status: PASSED
- test_api_info: PASSED
- test_metrics_exposition: PASSED
- test_404_error_handler: PASSED
Summary: 6 passed in 0.42s (100% Pass Rate).

## Security & IaC Validation
- Dockerfile: Non-root execution confirmed (UID 10001)
- Terraform: terraform validate returned Success
- Kubernetes: kubectl apply --dry-run=client passed with zero schema errors`,

    'README.md': PROJECT_FILES.find(f => f.path === 'README.md')?.content || ''
  };

  const copyDoc = () => {
    navigator.clipboard.writeText(docContents[selectedDoc] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>Internship Documentation</span>
          <span aria-hidden="true">·</span>
          <span>Cognevance Technologies</span>
          <span aria-hidden="true">·</span>
          <span>10 Detailed Runbooks</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Project Documentation &amp; Architecture Guides
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Complete engineering guides covering cloud architecture, Terraform IaC, Kubernetes, CI/CD, and SRE.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document Selector Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {docs.map((doc) => {
            const isSelected = selectedDoc === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-950/70 border-sky-600 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-medium truncate">{doc.title}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1 pl-5.5 truncate">
                  {doc.id}
                </div>
              </button>
            );
          })}
        </div>

        {/* Document Reader */}
        <div className="lg:col-span-3 p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-white">
                {docs.find(d => d.id === selectedDoc)?.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">documentation/{selectedDoc}</p>
            </div>
            <button
              onClick={copyDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Markdown"}</span>
            </button>
          </div>

          <pre className="p-4 bg-[#06080F] border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-[600px] leading-relaxed whitespace-pre-wrap">
            {docContents[selectedDoc] || "Loading documentation..."}
          </pre>
        </div>
      </div>
    </div>
  );
};
