import React, { useState } from 'react';
import { Terminal, Shield, Layers, Network, CheckCircle2, Play, Copy, Check } from 'lucide-react';

export const InfrastructureView: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'networking' | 'compute' | 'kubernetes'>('networking');
  const [activeCommand, setActiveCommand] = useState<string>('plan');
  const [copied, setCopied] = useState(false);

  const terminalOutputs: Record<string, string> = {
    init: `$ terraform init
Initializing the backend...
Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.30.0"...
- Installing hashicorp/aws v5.30.0...
- Installed hashicorp/aws v5.30.0 (signed by HashiCorp)

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure.`,

    fmt: `$ terraform fmt -check -recursive
[✓] All Terraform configuration files match canonical HashiCorp formatting.
No files required formatting. Zero indentation or spacing syntax errors.`,

    validate: `$ terraform validate
Success! The configuration is valid.
Modules checked:
- root
- module.networking (VPC, Subnets, Gateways, Route Tables)
- module.compute (Security Groups, Least-Privilege Rules)
- module.kubernetes (EKS Cluster, Managed Node Groups, IAM Roles)`,

    plan: `$ terraform plan -var-file="terraform.tfvars.example"
Terraform used the selected providers to generate the following execution plan:

Terraform will perform the following actions:

  # module.networking.aws_vpc.main will be created
  + resource "aws_vpc" "main" {
      + cidr_block           = "10.0.0.0/16"
      + enable_dns_hostnames = true
      + enable_dns_support   = true
      + id                   = (known after apply)
      + tags                 = { "Name" = "cognevance-devops-vpc-production" }
    }

  # module.networking.aws_subnet.public[0] will be created
  + resource "aws_subnet" "public" {
      + cidr_block        = "10.0.1.0/24"
      + availability_zone = "us-east-1a"
      + map_public_ip_on_launch = true
    }

  # module.networking.aws_subnet.public[1] will be created
  + resource "aws_subnet" "public" {
      + cidr_block        = "10.0.2.0/24"
      + availability_zone = "us-east-1b"
      + map_public_ip_on_launch = true
    }

  # module.networking.aws_subnet.private[0] will be created
  + resource "aws_subnet" "private" {
      + cidr_block        = "10.0.10.0/24"
      + availability_zone = "us-east-1a"
    }

  # module.networking.aws_subnet.private[1] will be created
  + resource "aws_subnet" "private" {
      + cidr_block        = "10.0.20.0/24"
      + availability_zone = "us-east-1b"
    }

  # module.compute.aws_security_group.app will be created
  + resource "aws_security_group" "app" {
      + description = "Controls traffic to containerized application workloads"
      + ingress     = [
          {
            + from_port   = 5000
            + to_port     = 5000
            + protocol    = "tcp"
            + description = "Allow traffic from ALB on port 5000"
          }
        ]
    }

Plan: 14 to add, 0 to change, 0 to destroy.

─────────────────────────────────────────────────────────────────────────────
Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if you run "terraform apply" now.`,

    apply: `$ terraform apply -var-file="terraform.tfvars.example" (DRY-RUN SIMULATION)
[DRY-RUN SAFEGUARD ACTIVE]
AWS infrastructure provisioning simulated successfully:
- Created aws_vpc.main (vpc-0a81234c9f112e)
- Created 2 Public Subnets (10.0.1.0/24, 10.0.2.0/24)
- Created 2 Private Subnets (10.0.10.0/24, 10.0.20.0/24)
- Created Elastic IP & NAT Gateway in us-east-1a
- Created Route Tables & Subnet Associations
- Created Application Security Group (sg-0b9218274a)

Outputs:
app_security_group_id = "sg-0b9218274a"
eks_cluster_endpoint = "https://127.0.0.1:8443 (Local Minikube/Kind)"
eks_cluster_name = "EKS_DISABLED_LOCAL_MODE"
kubeconfig_command = "kubectl config use-context minikube"
public_subnet_ids = ["subnet-0129a", "subnet-0391b"]
private_subnet_ids = ["subnet-0782a", "subnet-0994b"]
vpc_id = "vpc-0a81234c9f112e"

Apply complete! Resources: 14 added, 0 changed, 0 destroyed.`,

    destroy: `$ terraform destroy (DRY-RUN SIMULATION)
[DRY-RUN SAFEGUARD ACTIVE]
Plan: 0 to add, 0 to change, 14 to destroy.
Terraform destroy simulation verified: all cloud resources would be gracefully terminated to avoid idle charges.`
  };

  const copyTerminalOutput = () => {
    navigator.clipboard.writeText(terminalOutputs[activeCommand]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>Infrastructure as Code</span>
          <span aria-hidden="true">·</span>
          <span>HashiCorp Terraform v1.7.0+</span>
          <span aria-hidden="true">·</span>
          <span>AWS Provider v5.30+</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Cloud Infrastructure & Terraform Architecture
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Modular, multi-AZ cloud networking and compute topology provisioned with Infrastructure as Code.
        </p>
      </div>

      {/* Visual AWS Topology Matrix */}
      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-semibold text-white">AWS Virtual Private Cloud (VPC Topology)</h2>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            CIDR: 10.0.0.0/16 · Region: us-east-1
          </span>
        </div>

        {/* 2-AZ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Availability Zone A */}
          <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-sm font-semibold text-slate-200">Availability Zone: us-east-1a</span>
              <span className="text-[11px] font-mono text-emerald-400">Primary AZ</span>
            </div>

            {/* Public Subnet */}
            <div className="p-3 bg-sky-950/30 border border-sky-800/50 rounded-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-sky-300">Public Subnet 1</span>
                <span className="font-mono text-slate-400">10.0.1.0/24</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Hosts: Application Load Balancer node &amp; NAT Gateway Egress IP
              </p>
            </div>

            {/* Private Subnet */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">Private Subnet 1</span>
                <span className="font-mono text-slate-400">10.0.10.0/24</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Hosts: Kubernetes Worker Node 1 · Application Pod 1 &amp; Pod 2
              </p>
            </div>
          </div>

          {/* Availability Zone B */}
          <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-sm font-semibold text-slate-200">Availability Zone: us-east-1b</span>
              <span className="text-[11px] font-mono text-emerald-400">Secondary AZ</span>
            </div>

            {/* Public Subnet */}
            <div className="p-3 bg-sky-950/30 border border-sky-800/50 rounded-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-sky-300">Public Subnet 2</span>
                <span className="font-mono text-slate-400">10.0.2.0/24</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Hosts: Application Load Balancer failover node
              </p>
            </div>

            {/* Private Subnet */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">Private Subnet 2</span>
                <span className="font-mono text-slate-400">10.0.20.0/24</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Hosts: Kubernetes Worker Node 2 · Application Pod 3
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Terraform CLI Simulator */}
      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-semibold text-white">Interactive Terraform Execution Terminal</h2>
              <p className="text-xs text-slate-400">Simulate official Terraform commands with realistic output logs.</p>
            </div>
          </div>

          <button
            onClick={copyTerminalOutput}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer w-fit"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Output"}</span>
          </button>
        </div>

        {/* Command Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { id: 'init', label: 'terraform init' },
            { id: 'fmt', label: 'terraform fmt' },
            { id: 'validate', label: 'terraform validate' },
            { id: 'plan', label: 'terraform plan' },
            { id: 'apply', label: 'terraform apply (dry-run)' },
            { id: 'destroy', label: 'terraform destroy' },
          ].map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => setActiveCommand(cmd.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all border cursor-pointer ${
                activeCommand === cmd.id
                  ? 'bg-sky-600 border-sky-500 text-white shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cmd.label}
            </button>
          ))}
        </div>

        {/* Terminal Window */}
        <div className="rounded-lg overflow-hidden border border-slate-800 bg-[#06080F]">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">bash - /app/terraform</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Terraform v1.7.0</span>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-80 leading-relaxed whitespace-pre">
            {terminalOutputs[activeCommand]}
          </pre>
        </div>
      </div>
    </div>
  );
};
