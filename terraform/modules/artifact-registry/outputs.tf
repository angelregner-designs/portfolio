# =============================================================================
# ARTIFACT REGISTRY MODULE - OUTPUTS
# =============================================================================
# Outputs expose values from this module to the calling code.
# After running the module, you can access these with: module.NAME.OUTPUT
#
# Example: module.artifact_registry.repository_url
#
# Outputs are useful for:
#   - Passing values to other modules/resources
#   - Displaying important info after terraform apply
#   - Storing values for scripts or CI/CD pipelines
# =============================================================================

output "repository_id" {
  description = "The repository ID (name)"
  value       = google_artifact_registry_repository.docker_repo.repository_id
}

output "repository_url" {
  description = "Full URL for pushing/pulling images (e.g., us-central1-docker.pkg.dev/PROJECT/REPO)"
  value       = "${var.location}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker_repo.repository_id}"
}

output "repository_name" {
  description = "Full resource name of the repository"
  value       = google_artifact_registry_repository.docker_repo.name
}
