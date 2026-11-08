variable "vpc_cidr" {
  type = string
}

variable "environment" {
  type = string
}

variable "project_name" {
  type = string
}

variable "availability_zones" {
  type = list(string)
}

variable "public_subnet_cidrs" {
  type = list(string)
}

variable "private_subnet_cidrs" {
  type = list(string)
}

variable "enable_nat_gateway" {
  type = bool
}

variable "cluster_name" {
  type = string
}
