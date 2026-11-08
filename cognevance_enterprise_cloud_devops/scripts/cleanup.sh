#!/usr/bin/env bash
# ==============================================================================
# Local Teardown & Resource Cleanup Script
# Organization: Cognevance Technologies
# ==============================================================================

set -e

NAMESPACE="devops-enterprise"
CLUSTER_NAME="devops-enterprise-cluster"

echo "======================================================================"
echo "Cleaning up local DevOps resources..."
echo "======================================================================"

# Delete Kubernetes resources
if command -v kubectl &> /dev/null; then
    echo "[+] Deleting Kubernetes namespace $NAMESPACE..."
    kubectl delete namespace "$NAMESPACE" --ignore-not-found=true
fi

# Stop Docker Compose if active
if [ -f "docker-compose.yml" ]; then
    echo "[+] Stopping Docker Compose stack..."
    docker compose down -v --remove-orphans 2>/dev/null || true
fi

# Optional Kind cleanup
if command -v kind &> /dev/null; then
    if kind get clusters | grep -q "$CLUSTER_NAME"; then
        echo "[+] Deleting Kind cluster '$CLUSTER_NAME'..."
        kind delete cluster --name "$CLUSTER_NAME"
    fi
fi

echo "======================================================================"
echo "[✓] Cleanup complete. Local environment is reset."
echo "======================================================================"
