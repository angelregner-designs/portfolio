# =============================================================================
# CLOUD RUN MODULE - OUTPUTS
# =============================================================================

output "service_url" {
  description = "Cloud Run service URL (*.run.app). Available immediately after deploy"
  value       = google_cloud_run_v2_service.service.uri
}

output "service_name" {
  description = "Cloud Run service name"
  value       = google_cloud_run_v2_service.service.name
}

output "service_id" {
  description = "Full resource ID of the Cloud Run service"
  value       = google_cloud_run_v2_service.service.id
}

output "latest_revision" {
  description = "Name of the latest deployed revision"
  value       = google_cloud_run_v2_service.service.latest_ready_revision
}

output "domain_mapping_records" {
  description = "DNS records needed for custom domain. Add these to your DNS provider (Porkbun)"
  value       = var.domain_name != null ? google_cloud_run_domain_mapping.domain[0].status[0].resource_records : []
}
