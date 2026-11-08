#!/usr/bin/env bash
# ==============================================================================
# Local Kubernetes Deployment Script
# Organization: Cognevance Technologies
# ==============================================================================

set -e

NAMESPACE="devops-enterprise"

echo "======================================================================"
echo "Deploying Enterprise DevOps Resources to Kubernetes ($NAMESPACE)"
echo "======================================================================"

echo "[+] Step 1: Creating Namespace..."
kubectl apply -f kubernetes/namespace.yaml

echo "[+] Step 2: Creating ServiceAccount..."
kubectl apply -f kubernetes/serviceaccount.yaml

echo "[+] Step 3: Applying ConfigMap and Secrets..."
kubectl apply -f kubernetes/configmap.yaml
if [ -f "kubernetes/secret.yaml" ]; then
    kubectl apply -f kubernetes/secret.yaml
else
    echo "[!] Note: kubernetes/secret.yaml not found. Generating default test secret..."
    kubectl apply -f kubernetes/secret.yaml.example
fi

echo "[+] Step 4: Deploying Microservice Deployment & Service..."
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml

echo "[+] Step 5: Applying Autoscaler (HPA) and Ingress..."
kubectl apply -f kubernetes/hpa.yaml
kubectl apply -f kubernetes/ingress.yaml

echo "[+] Step 6: Verifying Deployment Rollout..."
kubectl rollout status deployment/enterprise-devops-app -n "$NAMESPACE" --timeout=120s

echo "======================================================================"
echo "Current Cluster Resources:"
echo "======================================================================"
kubectl get all -n "$NAMESPACE"

echo ""
echo "[✓] Deployment completed successfully!"
echo "To access service via port-forward:"
echo "kubectl port-forward svc/enterprise-devops-svc 5000:5000 -n $NAMESPACE"
