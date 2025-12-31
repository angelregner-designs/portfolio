# =============================================================================
# DEV ENVIRONMENT - MAIN CONFIGURATION
# =============================================================================
# This file configures the storage module for local development.
#
# To apply:
#   cd terraform/environments/dev
#   terraform init    # Download providers (first time only)
#   terraform plan    # Preview what will be created
#   terraform apply   # Actually create resources
#
# To get the service account key:
#   terraform output -raw service_account_key | base64 -d > ../../../gcs-key.json
# =============================================================================


# -----------------------------------------------------------------------------
# TERRAFORM SETTINGS
# -----------------------------------------------------------------------------
# Declares which version of Terraform and which "providers" (plugins) we need.
# Providers are how Terraform talks to cloud APIs - we use the google provider.
# -----------------------------------------------------------------------------
terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"  # Official Google provider
      version = "~> 5.0"            # Any 5.x version
    }
  }
}


# -----------------------------------------------------------------------------
# GOOGLE PROVIDER CONFIGURATION
# -----------------------------------------------------------------------------
# Tells the Google provider which project and region to use.
# Authentication: Uses your gcloud CLI credentials by default.
# Run "gcloud auth application-default login" if you haven't already.
# -----------------------------------------------------------------------------
provider "google" {
  project = var.project_id
  region  = var.region
}


# -----------------------------------------------------------------------------
# INPUT VARIABLES
# -----------------------------------------------------------------------------
# Values come from terraform.tfvars (or command line -var flags)
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
# Modules are reusable chunks of Terraform code. This calls our storage module
# and passes dev-specific settings.
#
# Key differences from prod:
#   - force_destroy = true     → Easy to delete and recreate
#   - create_service_account   → Creates key file for local Docker
#   - cors_origins             → localhost for local admin panel
# -----------------------------------------------------------------------------
module "storage" {
  source = "../../modules/storage"

  project_id             = var.project_id
  bucket_name            = "${var.project_id}-images-dev"  # e.g., "angelregnerportfolio-images-dev"
  location               = "US"
  force_destroy          = true   # Can delete bucket even with files in it
  create_service_account = true   # We need a key file for local development
  cors_origins           = ["http://localhost:3002"]  # Local admin panel
}


# -----------------------------------------------------------------------------
# OUTPUTS
# -----------------------------------------------------------------------------
# Pass through the module's outputs so we can access them from the CLI
# -----------------------------------------------------------------------------
output "bucket_name" {
  value = module.storage.bucket_name
}

output "bucket_url" {
  value = module.storage.bucket_url
}

output "service_account_email" {
  value = module.storage.service_account_email
}

# After terraform apply, export the key with:
#   terraform output -raw service_account_key | base64 -d > ../../../gcs-key.json
output "service_account_key" {
  description = "Run: terraform output -raw service_account_key | base64 -d > ../../../gcs-key.json"
  value       = module.storage.service_account_key
  sensitive   = true
}
