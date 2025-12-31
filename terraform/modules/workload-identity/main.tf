# =============================================================================
# WORKLOAD IDENTITY FEDERATION MODULE - MAIN RESOURCES
# =============================================================================
# This module creates:
#   1. Workload Identity Pool - container for external identities
#   2. Workload Identity Provider - maps GitHub OIDC tokens to GCP
#   3. Service Account - what GitHub Actions impersonates
#   4. IAM bindings - permissions for the service account
#
# WHY USE THIS?
# Traditional approach: Create a service account key (JSON file), store it as
# a GitHub secret, use it to authenticate. Problem: Keys can be stolen/leaked.
#
# Workload Identity Federation: GitHub Actions requests a short-lived token
# from GitHub's OIDC provider. GCP validates the token and grants temporary
# credentials. No long-lived secrets to manage or rotate!
#
# Flow:
#   1. GitHub Actions job requests OIDC token from GitHub
#   2. Job sends token to GCP's Security Token Service
#   3. GCP validates: "Is this token from GitHub? Is it from the right repo?"
#   4. If valid, GCP returns temporary credentials for the service account
#   5. Job uses credentials to push images, deploy to Cloud Run
# =============================================================================


# -----------------------------------------------------------------------------
# WORKLOAD IDENTITY POOL
# -----------------------------------------------------------------------------
# A pool is a container for external identity providers.
# You can have multiple providers in one pool (GitHub, GitLab, AWS, etc.).
# For simplicity, we create one pool for GitHub.
# -----------------------------------------------------------------------------
resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = var.pool_id
  project                   = var.project_id
  display_name              = "GitHub Actions Pool"
  description               = "Identity pool for GitHub Actions CI/CD"
}


# -----------------------------------------------------------------------------
# WORKLOAD IDENTITY PROVIDER
# -----------------------------------------------------------------------------
# The provider defines:
#   - Where tokens come from (GitHub's OIDC issuer)
#   - What claims to extract from the token (repo, branch, actor)
#   - Conditions for accepting tokens (only from our repo)
#
# attribute_condition: A CEL (Common Expression Language) filter.
# Only tokens matching this condition are accepted.
# We restrict to: specific GitHub org AND specific repo.
# -----------------------------------------------------------------------------
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-actions"
  project                            = var.project_id
  display_name                       = "GitHub Actions Provider"
  description                        = "OIDC provider for GitHub Actions"

  # Security: Only accept tokens from our specific repository
  # This prevents other GitHub repos from impersonating our identity
  attribute_condition = <<-EOT
    assertion.repository_owner == "${var.github_org}" &&
    assertion.repository == "${var.github_org}/${var.github_repo}"
  EOT

  # Map GitHub JWT claims to GCP attributes
  # These attributes can be used in IAM conditions for fine-grained access
  # Example: Only allow production deploys from main branch
  attribute_mapping = {
    "google.subject"       = "assertion.sub"        # Unique subject (repo:org/repo:ref:refs/heads/branch)
    "attribute.actor"      = "assertion.actor"      # GitHub username who triggered the workflow
    "attribute.repository" = "assertion.repository" # Full repo name (org/repo)
    "attribute.ref"        = "assertion.ref"        # Git ref (refs/heads/main, refs/tags/v1.0.0)
  }

  # GitHub's OIDC token endpoint
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}


# -----------------------------------------------------------------------------
# SERVICE ACCOUNT FOR GITHUB ACTIONS
# -----------------------------------------------------------------------------
# This is the GCP identity that GitHub Actions will impersonate.
# It needs permissions to: push images, deploy Cloud Run, access secrets.
# -----------------------------------------------------------------------------
resource "google_service_account" "github_actions" {
  account_id   = var.service_account_id
  display_name = "GitHub Actions Deployer"
  description  = "Service account for GitHub Actions to deploy to Cloud Run"
  project      = var.project_id
}


# -----------------------------------------------------------------------------
# ALLOW GITHUB TO IMPERSONATE THE SERVICE ACCOUNT
# -----------------------------------------------------------------------------
# This is the key binding: it allows the Workload Identity principal
# (GitHub Actions from our repo) to "act as" this service account.
#
# Principal format:
#   principalSet://iam.googleapis.com/POOL_NAME/attribute.repository/ORG/REPO
#
# This says: "Any GitHub Actions workflow from ORG/REPO can use this SA"
# -----------------------------------------------------------------------------
resource "google_service_account_iam_member" "workload_identity_user" {
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_org}/${var.github_repo}"
}


# -----------------------------------------------------------------------------
# SERVICE ACCOUNT PERMISSIONS
# -----------------------------------------------------------------------------
# Grant the service account the permissions it needs for CI/CD operations.
# These are project-level roles (apply to all resources in the project).
# -----------------------------------------------------------------------------

# Can deploy and manage Cloud Run services
resource "google_project_iam_member" "cloud_run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Can push Docker images to Artifact Registry
resource "google_project_iam_member" "artifact_registry_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Can act as other service accounts (needed to assign SA to Cloud Run services)
resource "google_project_iam_member" "service_account_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Can read secrets from Secret Manager (to pass to Cloud Run as env vars)
resource "google_project_iam_member" "secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}
