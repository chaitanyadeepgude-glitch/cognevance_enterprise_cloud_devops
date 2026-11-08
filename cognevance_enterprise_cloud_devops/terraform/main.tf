# ==============================================================================
# Root Infrastructure Composition
# Organization: Cognevance Technologies
# ==============================================================================

# Module 1: Networking (VPC, Subnets, Route Tables, Gateways)
module "networking" {
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

# Module 2: Compute & Security Groups
module "compute" {
  source = "./modules/compute"

  vpc_id       = module.networking.vpc_id
  environment  = var.environment
  project_name = var.project_name
}

# Module 3: Managed Kubernetes Cluster (Optional AWS EKS)
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
