# =============================================================================
# SECRETS MODULE - OUTPUTS
# =============================================================================

output "secret_ids" {
  description = "Map of secret names to their full resource IDs"
  value       = { for k, v in google_secret_manager_secret.secret : k => v.id }
}

output "secret_names" {
  description = "Map of secret names to their secret IDs (for use in Cloud Run env vars)"
  value       = { for k, v in google_secret_manager_secret.secret : k => v.secret_id }
}

output "secret_versions" {
  description = "Map of secret names to their latest version IDs"
  value       = { for k, v in google_secret_manager_secret_version.version : k => v.id }
}
