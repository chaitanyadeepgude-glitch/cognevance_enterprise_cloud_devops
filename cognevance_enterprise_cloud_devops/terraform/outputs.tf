# ==============================================================================
# Root Terraform Outputs
# ==============================================================================

output "vpc_id" {
  description = "ID of the provisioned Virtual Private Cloud"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.networking.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.networking.private_subnet_ids
}

output "app_security_group_id" {
  description = "Security Group ID for containerized application workloads"
  value       = module.compute.app_security_group_id
}

output "eks_cluster_name" {
  description = "Name of the provisioned EKS cluster (if enabled)"
  value       = var.enable_eks_cluster ? module.kubernetes[0].cluster_name : "EKS_DISABLED_LOCAL_MODE"
}

output "eks_cluster_endpoint" {
  description = "Kubernetes API endpoint for the EKS cluster (if enabled)"
  value       = var.enable_eks_cluster ? module.kubernetes[0].cluster_endpoint : "https://127.0.0.1:8443 (Local Minikube/Kind)"
}

output "kubeconfig_command" {
  description = "Command to configure kubectl context"
  value       = var.enable_eks_cluster ? "aws eks update-kubeconfig --region ${var.aws_region} --name ${var.cluster_name}" : "kubectl config use-context minikube"
}
