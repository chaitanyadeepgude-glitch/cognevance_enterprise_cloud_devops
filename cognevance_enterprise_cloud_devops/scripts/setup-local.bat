@echo off
REM ==============================================================================
REM Local Environment Setup Script for Windows
REM Organization: Cognevance Technologies
REM ==============================================================================

echo ======================================================================
echo Cognevance Technologies - Local DevOps Environment Setup (Windows)
echo ======================================================================

echo [+] Building Docker image...
docker build -t cognevance/enterprise-devops-app:1.0.0 -f application/Dockerfile application/
docker tag cognevance/enterprise-devops-app:1.0.0 cognevance/enterprise-devops-app:latest

echo [+] Starting Minikube cluster...
minikube start --driver=docker --cpus=2 --memory=4096
minikube addons enable ingress
minikube addons enable metrics-server

echo [+] Loading image into Minikube...
minikube image load cognevance/enterprise-devops-app:1.0.0
minikube image load cognevance/enterprise-devops-app:latest

echo ======================================================================
echo [OK] Setup completed! Next run deploy-local.sh in Git Bash or apply manifests:
echo kubectl apply -f kubernetes/
echo ======================================================================
