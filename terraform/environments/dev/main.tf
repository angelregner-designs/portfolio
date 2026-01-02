# =============================================================================
# DEV ENVIRONMENT - MAIN CONFIGURATION
# =============================================================================
# This file configures the dev environment infrastructure:
#   - GCS bucket for image storage
#   - Artifact Registry for Docker images
#   - Workload Identity for GitHub Actions (keyless auth)
#   - Secret Manager for sensitive config
#   - Cloud Run services (api, portfolio, admin)
#
# To apply:
#   cd terraform/environments/dev
#   terraform init    # Download providers (first time only)
#   terraform plan    # Preview what will be created
#   terraform apply   # Actually create resources
#
# After apply, add these GitHub secrets:
#   WIF_PROVIDER:        terraform output -raw workload_identity_provider
#   WIF_SERVICE_ACCOUNT: terraform output -raw github_actions_sa_email
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
      source  = "hashicorp/google" # Official Google provider
      version = "~> 5.0"           # Any 5.x version
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

variable "github_org" {
  description = "GitHub organization or username (e.g., 'angelregner-designs')"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name (e.g., 'angel-portfolio')"
  type        = string
}

variable "domain_base" {
  description = "Base domain for dev environment (e.g., 'dev.angelregner.com')"
  type        = string
  default     = "dev.angelregner.com"
}

variable "database_url" {
  description = "MongoDB Atlas connection string"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret (min 32 chars recommended)"
  type        = string
  sensitive   = true
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
  bucket_name            = "${var.project_id}-images-dev" # e.g., "angelregnerportfolio-images-dev"
  location               = "US"
  force_destroy          = true # Can delete bucket even with files in it
  create_service_account = true # We need a key file for local development
  cors_origins = [
    "http://localhost:3002",            # Local admin panel
    "https://admin.${var.domain_base}", # Deployed admin panel
  ]
}


# -----------------------------------------------------------------------------
# ARTIFACT REGISTRY
# -----------------------------------------------------------------------------
# Docker image storage. GitHub Actions pushes images here, Cloud Run pulls them.
# One repository holds all 3 service images (api, portfolio, admin).
# -----------------------------------------------------------------------------
module "artifact_registry" {
  source = "../../modules/artifact-registry"

  project_id     = var.project_id
  location       = var.region
  repository_id  = "angel-portfolio-dev"
  description    = "Docker images for Angel Portfolio (dev environment)"
  immutable_tags = false # Dev can overwrite tags like "latest"
}


# -----------------------------------------------------------------------------
# WORKLOAD IDENTITY FEDERATION
# -----------------------------------------------------------------------------
# Allows GitHub Actions to authenticate to GCP without service account keys.
# Much more secure than storing JSON keys as GitHub secrets!
#
# How it works:
#   1. GitHub Actions requests OIDC token from GitHub
#   2. GCP validates the token came from our repo
#   3. GCP grants temporary credentials to push images and deploy
# -----------------------------------------------------------------------------
module "workload_identity" {
  source = "../../modules/workload-identity"

  project_id         = var.project_id
  pool_id            = "github-actions-pool-dev"
  github_org         = var.github_org
  github_repo        = var.github_repo
  service_account_id = "github-actions-dev"
}


# -----------------------------------------------------------------------------
# CLOUD RUN SERVICE ACCOUNT
# -----------------------------------------------------------------------------
# Shared service account for all Cloud Run services.
# This identity is used when the containers access GCP resources (like GCS).
# -----------------------------------------------------------------------------
resource "google_service_account" "cloud_run_sa" {
  account_id   = "cloud-run-dev"
  display_name = "Cloud Run Dev Services"
  description  = "Service account for Cloud Run services in dev environment"
  project      = var.project_id
}

# Grant Cloud Run SA permission to read/write images in the GCS bucket
resource "google_storage_bucket_iam_member" "cloud_run_storage" {
  bucket = module.storage.bucket_name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}


# -----------------------------------------------------------------------------
# SECRETS
# -----------------------------------------------------------------------------
# Store sensitive values in Secret Manager instead of environment variables.
# Cloud Run will fetch these at startup and inject as env vars.
# -----------------------------------------------------------------------------
module "secrets" {
  source = "../../modules/secrets"

  project_id   = var.project_id
  secret_names = ["dev-database-url", "dev-jwt-secret"]
  secret_values = {
    "dev-database-url" = var.database_url
    "dev-jwt-secret"   = var.jwt_secret
  }
  accessor_service_accounts = [
    google_service_account.cloud_run_sa.email,
    module.workload_identity.service_account_email,
  ]
}


# -----------------------------------------------------------------------------
# CLOUD RUN SERVICES
# -----------------------------------------------------------------------------
# Three services: API, Portfolio, Admin
# Each runs a Docker container from Artifact Registry.
#
# Note: First deploy will fail because images don't exist yet!
# After first GitHub Actions run, images will be pushed and services will work.
# -----------------------------------------------------------------------------

# API Service - Express backend
module "api" {
  source = "../../modules/cloud-run"

  project_id            = var.project_id
  service_name          = "api-dev"
  location              = var.region
  image                 = "${module.artifact_registry.repository_url}/api:latest"
  container_port        = 3001
  cpu                   = "1"
  memory                = "512Mi"
  min_instances         = 0 # Scale to zero when idle
  max_instances         = 5
  allow_unauthenticated = true
  service_account_email = google_service_account.cloud_run_sa.email
  domain_name           = "api.${var.domain_base}"

  env_vars = [
    { name = "NODE_ENV", value = "production" },
    # PORT is reserved by Cloud Run - it sets it automatically
    { name = "GCS_PROJECT_ID", value = var.project_id },
    { name = "GCS_BUCKET_NAME", value = module.storage.bucket_name },
    # CORS origins for the API
    { name = "CORS_ORIGINS", value = "https://${var.domain_base},https://admin.${var.domain_base}" },
  ]

  secret_env_vars = [
    { name = "DATABASE_URL", secret_name = "dev-database-url", version = "latest" },
    { name = "JWT_SECRET", secret_name = "dev-jwt-secret", version = "latest" },
  ]

  depends_on = [module.secrets]
}

# Portfolio Service - Next.js frontend (SSR)
module "portfolio" {
  source = "../../modules/cloud-run"

  project_id            = var.project_id
  service_name          = "portfolio-dev"
  location              = var.region
  image                 = "${module.artifact_registry.repository_url}/portfolio:latest"
  container_port        = 3000
  cpu                   = "1"
  memory                = "512Mi"
  min_instances         = 0
  max_instances         = 5
  allow_unauthenticated = true
  service_account_email = google_service_account.cloud_run_sa.email
  domain_name           = var.domain_base

  env_vars = [
    { name = "NODE_ENV", value = "production" },
  ]
}

# Admin Service - Next.js admin panel
module "admin" {
  source = "../../modules/cloud-run"

  project_id            = var.project_id
  service_name          = "admin-dev"
  location              = var.region
  image                 = "${module.artifact_registry.repository_url}/admin:latest"
  container_port        = 3000
  cpu                   = "1"
  memory                = "512Mi"
  min_instances         = 0
  max_instances         = 3
  allow_unauthenticated = true
  service_account_email = google_service_account.cloud_run_sa.email
  domain_name           = "admin.${var.domain_base}"

  env_vars = [
    { name = "NODE_ENV", value = "production" },
  ]
}


# -----------------------------------------------------------------------------
# SEED JOB
# -----------------------------------------------------------------------------
# One-time job to seed the database with initial data.
# Run manually: gcloud run jobs execute seed-dev --region=us-central1 --wait
# -----------------------------------------------------------------------------
resource "google_cloud_run_v2_job" "seed" {
  name     = "seed-dev"
  location = var.region
  project  = var.project_id

  template {
    template {
      containers {
        image   = "${module.artifact_registry.repository_url}/api:latest"
        command = ["npm"]
        args    = ["run", "seed:prod"]

        resources {
          limits = {
            cpu    = "1"
            memory = "512Mi"
          }
        }

        env {
          name = "DATABASE_URL"
          value_source {
            secret_key_ref {
              secret  = "dev-database-url"
              version = "latest"
            }
          }
        }

        env {
          name = "JWT_SECRET"
          value_source {
            secret_key_ref {
              secret  = "dev-jwt-secret"
              version = "latest"
            }
          }
        }
      }

      service_account = google_service_account.cloud_run_sa.email
      max_retries     = 3
      timeout         = "600s"
    }
  }

  depends_on = [module.secrets]
}


# -----------------------------------------------------------------------------
# OUTPUTS
# -----------------------------------------------------------------------------
# Access these with: terraform output <name>
# For sensitive values: terraform output -raw <name>
# -----------------------------------------------------------------------------

# --- Storage outputs ---
output "bucket_name" {
  description = "GCS bucket name for images"
  value       = module.storage.bucket_name
}

output "bucket_url" {
  description = "Public URL for GCS bucket"
  value       = module.storage.bucket_url
}

output "bucket_origin_hostname" {
  description = "For Cloudflare CDN setup"
  value       = module.storage.bucket_origin_hostname
}

output "bucket_origin_path" {
  description = "For Cloudflare CDN setup"
  value       = module.storage.bucket_origin_path
}

output "storage_service_account_email" {
  description = "Storage uploader service account (for local dev)"
  value       = module.storage.service_account_email
}

output "storage_service_account_key" {
  description = "Run: terraform output -raw storage_service_account_key | base64 -d > ../../../secrets/gcs-key.json"
  value       = module.storage.service_account_key
  sensitive   = true
}

# --- Artifact Registry outputs ---
output "artifact_registry_url" {
  description = "URL for pushing Docker images"
  value       = module.artifact_registry.repository_url
}

# --- Workload Identity outputs (add to GitHub secrets) ---
output "workload_identity_provider" {
  description = "Add as WIF_PROVIDER secret in GitHub"
  value       = module.workload_identity.workload_identity_provider
}

output "github_actions_sa_email" {
  description = "Add as WIF_SERVICE_ACCOUNT secret in GitHub"
  value       = module.workload_identity.service_account_email
}

# --- Cloud Run outputs ---
output "cloud_run_sa_email" {
  description = "Cloud Run service account email"
  value       = google_service_account.cloud_run_sa.email
}

output "api_url" {
  description = "API Cloud Run URL (*.run.app)"
  value       = module.api.service_url
}

output "portfolio_url" {
  description = "Portfolio Cloud Run URL (*.run.app)"
  value       = module.portfolio.service_url
}

output "admin_url" {
  description = "Admin Cloud Run URL (*.run.app)"
  value       = module.admin.service_url
}

# --- DNS records (add these to Porkbun) ---
output "api_domain_records" {
  description = "DNS records for api.dev.angelregner.com - add to Porkbun"
  value       = module.api.domain_mapping_records
}

output "portfolio_domain_records" {
  description = "DNS records for dev.angelregner.com - add to Porkbun"
  value       = module.portfolio.domain_mapping_records
}

output "admin_domain_records" {
  description = "DNS records for admin.dev.angelregner.com - add to Porkbun"
  value       = module.admin.domain_mapping_records
}
