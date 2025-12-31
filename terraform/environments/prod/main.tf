# =============================================================================
# PROD ENVIRONMENT - MAIN CONFIGURATION
# =============================================================================
# Production configuration for the storage module.
#
# Key differences from dev:
#   - force_destroy = false       → Protect against accidental data loss
#   - create_service_account      → false (Cloud Run uses Workload Identity)
#   - cors_origins                → Real domain instead of localhost
#   - Remote state backend        → Team can share state (optional)
#
# To apply:
#   cd terraform/environments/prod
#   terraform init
#   terraform plan
#   terraform apply
# =============================================================================


# -----------------------------------------------------------------------------
# TERRAFORM SETTINGS
# -----------------------------------------------------------------------------
terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # REMOTE STATE BACKEND (optional, for team collaboration)
  # By default, Terraform stores state locally in terraform.tfstate
  # For production, you might want to store state in a GCS bucket so
  # multiple team members can run Terraform without conflicts.
  #
  # To enable:
  #   1. Create a bucket: gsutil mb gs://angelregnerportfolio-tfstate
  #   2. Uncomment the backend block below
  #   3. Run: terraform init -migrate-state
  #
  # backend "gcs" {
  #   bucket = "angelregnerportfolio-tfstate"
  #   prefix = "prod"
  # }
}


# -----------------------------------------------------------------------------
# GOOGLE PROVIDER CONFIGURATION
# -----------------------------------------------------------------------------
provider "google" {
  project = var.project_id
  region  = var.region
}


# -----------------------------------------------------------------------------
# INPUT VARIABLES
# -----------------------------------------------------------------------------
variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}


# -----------------------------------------------------------------------------
# USE THE STORAGE MODULE
# -----------------------------------------------------------------------------
# Note: create_service_account = false
#
# In production, our API runs on Cloud Run which has "Workload Identity".
# This means Cloud Run automatically gets GCP credentials - no key file needed!
# More secure because:
#   - No key files to manage or accidentally leak
#   - Keys auto-rotate
#   - Permissions tied to the Cloud Run service
# -----------------------------------------------------------------------------
module "storage" {
  source = "../../modules/storage"

  project_id             = var.project_id
  bucket_name            = "${var.project_id}-images" # e.g., "angelregnerportfolio-images"
  location               = "US"
  force_destroy          = false                             # IMPORTANT: Prevent accidental data deletion
  create_service_account = false                             # Cloud Run uses Workload Identity
  cors_origins           = ["https://admin.angelregner.com"] # Production admin domain
}


# -----------------------------------------------------------------------------
# OUTPUTS
# -----------------------------------------------------------------------------
output "bucket_name" {
  value = module.storage.bucket_name
}

output "bucket_url" {
  value = module.storage.bucket_url
}

# For Cloudflare CDN setup
output "bucket_origin_hostname" {
  value = module.storage.bucket_origin_hostname
}

output "bucket_origin_path" {
  value = module.storage.bucket_origin_path
}
