# =============================================================================
# WORKLOAD IDENTITY FEDERATION MODULE - OUTPUTS
# =============================================================================
# These values are needed for GitHub Actions workflow configuration.
# After terraform apply, run:
#   terraform output workload_identity_provider
#   terraform output service_account_email
#
# Then add these as GitHub repository secrets.
# =============================================================================

output "workload_identity_provider" {
  description = "Full path to workload identity provider. Add this as WIF_PROVIDER secret in GitHub"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "service_account_email" {
  description = "Email of the GitHub Actions service account. Add this as WIF_SERVICE_ACCOUNT secret in GitHub"
  value       = google_service_account.github_actions.email
}

output "pool_name" {
  description = "Full resource name of the Workload Identity Pool"
  value       = google_iam_workload_identity_pool.github_pool.name
}
