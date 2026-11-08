# Terraform Infrastructure as Code (IaC) Guide
Organization: Cognevance Technologies

This guide documents the modular Terraform architecture used to provision AWS cloud resources for the Enterprise DevOps platform.

---

## 1. Directory Structure

```
terraform/
├── main.tf                    # Root composition module
├── variables.tf               # Global input variable declarations
├── outputs.tf                 # Global output declarations
├── providers.tf               # AWS provider configuration with default tags
├── versions.tf                # Required terraform and provider version locks
├── terraform.tfvars.example   # Example variable input file
└── modules/
    ├── networking/            # VPC, subnets, IGW, NAT, route tables
    ├── compute/               # Security groups and least-privilege ingress
    └── kubernetes/            # AWS EKS cluster, node groups, and IAM roles
```

---

## 2. Terraform Lifecycle Commands

Execute all commands from the `terraform/` directory:

### Step 1: Initialization
Initializes provider plugins (`hashicorp/aws`) and sets up local or remote backend state.
```bash
terraform init
```

### Step 2: Format Code
Formats all `.tf` configuration files according to official HashiCorp canonical style conventions:
```bash
terraform fmt -recursive
```

### Step 3: Validate Syntax
Performs declarative configuration validation without communicating with AWS:
```bash
terraform validate
```

### Step 4: Dry-Run Execution Plan
Generates an execution plan detailing resources to be created, modified, or destroyed:
```bash
terraform plan -var-file="terraform.tfvars.example"
```

### Step 5: Provision Infrastructure (Optional Cloud Target)
> [!WARNING]
> Only execute this command if you have explicit authorization and valid AWS credentials configured. Keep `enable_eks_cluster = false` to avoid EKS cluster hourly charges ($0.10/hour).
```bash
terraform apply -var-file="terraform.tfvars.example"
```

### Step 6: Teardown Infrastructure
Safely destroys all cloud-managed infrastructure to avoid lingering costs:
```bash
terraform destroy -var-file="terraform.tfvars.example"
```

---

## 3. Remote State Security & DynamoDB Locking

For production environments, Terraform state should be stored remotely in an Amazon S3 bucket with server-side encryption enabled and state locking handled via DynamoDB:

```hcl
terraform {
  backend "s3" {
    bucket         = "cognevance-devops-terraform-state"
    key            = "enterprise/production/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}
```

Benefits:
1. **Concurrency Protection**: DynamoDB prevents multiple engineers from running simultaneous `terraform apply` operations.
2. **Encryption at Rest**: S3 enforces AES-256 or AWS KMS encryption for sensitive output variables.
3. **Audit History**: S3 bucket versioning maintains a full audit log of previous state states.
