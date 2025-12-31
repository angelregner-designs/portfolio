# =============================================================================
# SECRETS MODULE - INPUT VARIABLES
# =============================================================================

variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "secrets" {
  description = "Map of secret name to secret value. Example: { 'db-url': 'mongodb://...' }"
  type        = map(string)
  sensitive   = true # Prevents values from being shown in terraform plan/apply output
}

variable "accessor_service_accounts" {
  description = "Service account emails that need access to read these secrets"
  type        = list(string)
  default     = []
}
