# =============================================================================
# ARTIFACT REGISTRY MODULE - MAIN RESOURCES
# =============================================================================
# This module creates:
#   1. An Artifact Registry repository to store Docker images
#   2. (Optional) IAM binding for Cloud Run to pull images
#
# Artifact Registry is Google's recommended container registry (replaces GCR).
# GitHub Actions pushes built images here, Cloud Run pulls them to deploy.
#
# Image URL format: REGION-docker.pkg.dev/PROJECT/REPO/IMAGE:TAG
# Example: us-central1-docker.pkg.dev/myproject/my-repo/api:v1.0.0
# =============================================================================


# -----------------------------------------------------------------------------
# THE REPOSITORY
# -----------------------------------------------------------------------------
# A repository is like a namespace for Docker images.
# One repo can contain multiple images (api, portfolio, admin).
# Each image can have multiple tags (latest, v1.0.0, abc123).
# -----------------------------------------------------------------------------
resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.location
  repository_id = var.repository_id
  description   = var.description
  format        = "DOCKER"
  project       = var.project_id

  # Immutable tags prevent accidental overwrites of production images
  # For dev: false (allow overwriting "latest" tag on each deploy)
  # For prod: true (each deploy should use a unique tag like git SHA)
  docker_config {
    immutable_tags = var.immutable_tags
  }
}


# -----------------------------------------------------------------------------
# CLOUD RUN READER PERMISSION (optional)
# -----------------------------------------------------------------------------
# Grant a service account permission to pull images from this repository.
# Cloud Run needs this to download and run our container images.
#
# The "count" trick: only create this resource if a service account is provided.
# -----------------------------------------------------------------------------
resource "google_artifact_registry_repository_iam_member" "cloud_run_reader" {
  count      = var.cloud_run_service_account != null ? 1 : 0
  project    = var.project_id
  location   = var.location
  repository = google_artifact_registry_repository.docker_repo.name
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${var.cloud_run_service_account}"
}
