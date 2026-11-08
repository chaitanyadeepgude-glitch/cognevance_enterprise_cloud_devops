# ==============================================================================
# Root Terraform Variables
# ==============================================================================

variable "aws_region" {
  description = "Target AWS Region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment tier (development, staging, production)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Base naming prefix for all cloud resources"
  type        = string
  default     = "cognevance-devops"
}

variable "vpc_cidr" {
  description = "CIDR block for the enterprise VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of Availability Zones for high availability"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (ALB & NAT Gateways)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (Application & EKS Nodes)"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnet outbound internet access"
  type        = bool
  default     = true
}

variable "enable_eks_cluster" {
  description = "Controls whether AWS EKS cluster is provisioned (optional cloud target)"
  type        = bool
  default     = false
}

variable "cluster_name" {
  description = "Name of the EKS Kubernetes cluster"
  type        = string
  default     = "devops-enterprise-cluster"
}

variable "node_instance_types" {
  description = "EC2 instance types for EKS managed node group"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "desired_node_count" {
  description = "Desired number of Kubernetes worker nodes"
  type        = number
  default     = 2
}
