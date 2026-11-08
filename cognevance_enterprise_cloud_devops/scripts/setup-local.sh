#!/usr/bin/env bash
# ==============================================================================
# Local Environment Setup Script (Minikube & Kind Dual-Mode)
# Organization: Cognevance Technologies
# ==============================================================================

set -e

CLUSTER_TYPE="${1:-minikube}" # Default to minikube; pass 'kind' for Kind cluster
CLUSTER_NAME="devops-enterprise-cluster"

echo "======================================================================"
echo "Cognevance Technologies - Local DevOps Environment Setup"
echo "Target Cluster Engine: $CLUSTER_TYPE"
echo "======================================================================"

# Check Docker prerequisite
if ! command -v docker &> /dev/null; then
    echo "[-] Error: Docker is not installed or not in PATH."
    exit 1
fi

echo "[+] Step 1: Building Flask Application Docker image..."
docker build -t cognevance/enterprise-devops-app:1.0.0 -f application/Dockerfile application/
docker tag cognevance/enterprise-devops-app:1.0.0 cognevance/enterprise-devops-app:latest

if [ "$CLUSTER_TYPE" = "kind" ]; then
    echo "[+] Step 2: Setting up Kind Kubernetes cluster..."
    if ! command -v kind &> /dev/null; then
        echo "[-] Error: kind CLI is not installed. Please install Kind."
        exit 1
    fi

    # Create Kind cluster if it doesn't already exist
    if ! kind get clusters | grep -q "$CLUSTER_NAME"; then
        echo "[+] Creating Kind cluster '$CLUSTER_NAME'..."
        kind create cluster --name "$CLUSTER_NAME"
    else
        echo "[*] Kind cluster '$CLUSTER_NAME' already exists."
    fi

    echo "[+] Loading Docker image into Kind cluster..."
    kind load docker-image cognevance/enterprise-devops-app:1.0.0 --name "$CLUSTER_NAME"
    kind load docker-image cognevance/enterprise-devops-app:latest --name "$CLUSTER_NAME"

else
    echo "[+] Step 2: Setting up Minikube Kubernetes cluster..."
    if ! command -v minikube &> /dev/null; then
        echo "[-] Error: minikube CLI is not installed."
        exit 1
    fi

    if ! minikube status | grep -q "Running"; then
        echo "[+] Starting Minikube..."
        minikube start --driver=docker --cpus=2 --memory=4096
    else
        echo "[*] Minikube is already active."
    fi

    echo "[+] Enabling Minikube addons: ingress and metrics-server..."
    minikube addons enable ingress
    minikube addons enable metrics-server

    echo "[+] Loading Docker image into Minikube..."
    minikube image load cognevance/enterprise-devops-app:1.0.0
    minikube image load cognevance/enterprise-devops-app:latest
fi

echo "======================================================================"
echo "[✓] Local Kubernetes environment initialized successfully!"
echo "Next step: Run ./scripts/deploy-local.sh to apply Kubernetes manifests."
echo "======================================================================"
