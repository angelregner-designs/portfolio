# =============================================================================
# PROD ENVIRONMENT - MAIN CONFIGURATION
# =============================================================================
# Production infrastructure for Angel Portfolio:
#   - GCS bucket for image storage
#   - Artifact Registry for Docker images
#   - Workload Identity for GitHub Actions (keyless auth)
#   - Secret Manager for sensitive config
#   - Cloud Run services (api, portfolio, admin)
#
# Key differences from dev:
#   - force_destroy = false       → Protect against accidental data loss
#   - immutable_tags = true       → Prevent overwriting deployed images
#   - create_service_account      → false (Cloud Run uses Workload Identity)
#   - cors_origins                → Production domains only
#
# To apply:
#   cd terraform/environments/prod
#   terraform init
#   terraform plan
#   terraform apply
#
# After apply, add these GitHub secrets:
#   WIF_PROVIDER_PROD:        terraform output -raw workload_identity_provider
#   WIF_SERVICE_ACCOUNT_PROD: terraform output -raw github_actions_sa_email
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

variable "github_org" {
  description = "GitHub organization or username (e.g., 'angelregner-designs')"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name (e.g., 'portfolio')"
  type        = string
}

variable "domain_base" {
  description = "Base domain for prod environment (e.g., 'angelregner.com')"
  type        = string
  default     = "angelregner.com"
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
# STORAGE MODULE
# -----------------------------------------------------------------------------
# GCS bucket for image uploads.
# Key prod settings:
#   - force_destroy = false  → Prevent accidental data deletion
#   - create_service_account = false  → Cloud Run uses Workload Identity
# -----------------------------------------------------------------------------
module "storage" {
  source = "../../modules/storage"

  project_id             = var.project_id
  bucket_name            = "${var.project_id}-images" # e.g., "angelregnerportfolio-images"
  location               = "US"
  force_destroy          = false # IMPORTANT: Protect production data
  create_service_account = false # Cloud Run uses Workload Identity
  cors_origins           = ["https://admin.${var.domain_base}"]
}


# -----------------------------------------------------------------------------
# ARTIFACT REGISTRY
# -----------------------------------------------------------------------------
# Docker image storage for production.
# immutable_tags = true prevents overwriting deployed images (safety).
# -----------------------------------------------------------------------------
module "artifact_registry" {
  source = "../../modules/artifact-registry"

  project_id     = var.project_id
  location       = var.region
  repository_id  = "angel-portfolio-prod"
  description    = "Docker images for Angel Portfolio (production)"
  immutable_tags = true # IMPORTANT: Prevent overwriting deployed images
}


# -----------------------------------------------------------------------------
# WORKLOAD IDENTITY FEDERATION
# -----------------------------------------------------------------------------
# Allows GitHub Actions to authenticate to GCP without service account keys.
# -----------------------------------------------------------------------------
module "workload_identity" {
  source = "../../modules/workload-identity"

  project_id         = var.project_id
  pool_id            = "github-actions-pool-prod"
  github_org         = var.github_org
  github_repo        = var.github_repo
  service_account_id = "github-actions-prod"
}


# -----------------------------------------------------------------------------
# CLOUD RUN SERVICE ACCOUNT
# -----------------------------------------------------------------------------
# Shared service account for all Cloud Run services.
# Used when containers access GCP resources (like GCS).
# -----------------------------------------------------------------------------
resource "google_service_account" "cloud_run_sa" {
  account_id   = "cloud-run-prod"
  display_name = "Cloud Run Production Services"
  description  = "Service account for Cloud Run services in production"
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
# Store sensitive values in Secret Manager.
# Cloud Run fetches these at startup and injects as env vars.
# -----------------------------------------------------------------------------
module "secrets" {
  source = "../../modules/secrets"

  project_id   = var.project_id
  secret_names = ["prod-database-url", "prod-jwt-secret"]
  secret_values = {
    "prod-database-url" = var.database_url
    "prod-jwt-secret"   = var.jwt_secret
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
  service_name          = "api-prod"
  location              = var.region
  image                 = "${module.artifact_registry.repository_url}/api:latest"
  container_port        = 3001
  cpu                   = "1"
  memory                = "512Mi"
  min_instances         = 0 # Scale to zero when idle (can change to 1 for faster cold starts)
  max_instances         = 10
  allow_unauthenticated = true
  service_account_email = google_service_account.cloud_run_sa.email
  domain_name           = "api.${var.domain_base}"

  env_vars = [
    { name = "NODE_ENV", value = "production" },
    { name = "GCS_PROJECT_ID", value = var.project_id },
    { name = "GCS_BUCKET_NAME", value = module.storage.bucket_name },
    { name = "CORS_ORIGINS", value = "https://${var.domain_base},https://admin.${var.domain_base}" },
  ]

  secret_env_vars = [
    { name = "DATABASE_URL", secret_name = "prod-database-url", version = "latest" },
    { name = "JWT_SECRET", secret_name = "prod-jwt-secret", version = "latest" },
  ]

  depends_on = [module.secrets]
}

# Portfolio Service - Next.js frontend (SSR)
module "portfolio" {
  source = "../../modules/cloud-run"

  project_id            = var.project_id
  service_name          = "portfolio-prod"
  location              = var.region
  image                 = "${module.artifact_registry.repository_url}/portfolio:latest"
  container_port        = 3000
  cpu                   = "1"
  memory                = "512Mi"
  min_instances         = 0
  max_instances         = 10
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
  service_name          = "admin-prod"
  location              = var.region
  image                 = "${module.artifact_registry.repository_url}/admin:latest"
  container_port        = 3000
  cpu                   = "1"
  memory                = "512Mi"
  min_instances         = 0
  max_instances         = 5
  allow_unauthenticated = true
  service_account_email = google_service_account.cloud_run_sa.email
  domain_name           = "admin.${var.domain_base}"

  env_vars = [
    { name = "NODE_ENV", value = "production" },
  ]
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
  description = "For CDN setup"
  value       = module.storage.bucket_origin_hostname
}

output "bucket_origin_path" {
  description = "For CDN setup"
  value       = module.storage.bucket_origin_path
}

# --- Artifact Registry outputs ---
output "artifact_registry_url" {
  description = "URL for pushing Docker images"
  value       = module.artifact_registry.repository_url
}

# --- Workload Identity outputs (add to GitHub secrets) ---
output "workload_identity_provider" {
  description = "Add as WIF_PROVIDER_PROD secret in GitHub"
  value       = module.workload_identity.workload_identity_provider
}

output "github_actions_sa_email" {
  description = "Add as WIF_SERVICE_ACCOUNT_PROD secret in GitHub"
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

# --- DNS records (add these to your DNS provider) ---
output "api_domain_records" {
  description = "DNS records for api.angelregner.com"
  value       = module.api.domain_mapping_records
}

output "portfolio_domain_records" {
  description = "DNS records for angelregner.com"
  value       = module.portfolio.domain_mapping_records
}

output "admin_domain_records" {
  description = "DNS records for admin.angelregner.com"
  value       = module.admin.domain_mapping_records
}
