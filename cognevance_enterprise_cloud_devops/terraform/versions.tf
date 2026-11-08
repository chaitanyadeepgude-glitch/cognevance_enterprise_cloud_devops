# ==============================================================================
# Terraform Version and Provider Requirements
# Organization: Cognevance Technologies
# ==============================================================================

terraform {
  required_version = ">= 1.5.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30.0"
    }
  }

  # Remote backend configuration template (configure via CLI or backend.hcl)
  # backend "s3" {
  #   bucket         = "cognevance-devops-terraform-state"
  #   key            = "enterprise/prod/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "terraform-state-lock"
  #   encrypt        = true
  # }
}
