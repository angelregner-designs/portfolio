# =============================================================================
# STORAGE MODULE - OUTPUTS
# =============================================================================
# Outputs are like return values from a function. After Terraform creates
# resources, you can read these values with:
#   terraform output bucket_name
#
# Other Terraform files can also reference these when using this module:
#   module.storage.bucket_name
# =============================================================================

output "bucket_name" {
  description = "Name of the created bucket"
  value       = google_storage_bucket.portfolio_images.name
}

output "bucket_url" {
  description = "Public URL prefix for bucket objects. Append filename to get full URL."
  value       = "https://storage.googleapis.com/${google_storage_bucket.portfolio_images.name}"
}

# Useful for Cloudflare CDN setup - use this as the origin in Cloudflare
output "bucket_origin_hostname" {
  description = "GCS hostname for CDN origin config (e.g., Cloudflare CNAME target)"
  value       = "storage.googleapis.com"
}

output "bucket_origin_path" {
  description = "Path prefix to use in CDN origin config"
  value       = "/${google_storage_bucket.portfolio_images.name}"
}

output "service_account_email" {
  description = "Email of the storage uploader service account (null if not created)"
  value       = var.create_service_account ? google_service_account.storage_uploader[0].email : null
}

# The key is base64-encoded. To use it:
#   terraform output -raw service_account_key | base64 -d > gcs-key.json
#
# "sensitive = true" prevents Terraform from printing this in console logs
output "service_account_key" {
  description = "Base64-encoded service account key JSON (dev only)"
  value       = var.create_service_account ? google_service_account_key.uploader_key[0].private_key : null
  sensitive   = true
}
