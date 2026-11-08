# ==============================================================================
# AWS Provider Configuration
# Organization: Cognevance Technologies
# Uses IAM roles / environment-based authentication without hardcoded keys.
# ==============================================================================

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Enterprise Cloud Infrastructure & DevOps Automation"
      Organization = "Cognevance Technologies"
      Environment = var.environment
      ManagedBy   = "Terraform"
      CostCenter  = "DevOps-Internship-L3"
    }
  }
}
