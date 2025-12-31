# =============================================================================
# SECRETS MODULE - INPUT VARIABLES
# =============================================================================

variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "secret_names" {
  description = "List of secret names to create (not sensitive, used for iteration)"
  type        = list(string)
}

variable "secret_values" {
  description = "Map of secret name to value. Keys must match secret_names"
  type        = map(string)
  sensitive   = true
}

variable "accessor_service_accounts" {
  description = "Service account emails that need access to read these secrets"
  type        = list(string)
  default     = []
}
