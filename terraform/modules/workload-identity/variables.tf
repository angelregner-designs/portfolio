# =============================================================================
# WORKLOAD IDENTITY FEDERATION MODULE - INPUT VARIABLES
# =============================================================================

variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "pool_id" {
  description = "Workload Identity Pool ID (lowercase, hyphens allowed, 4-32 chars)"
  type        = string
  default     = "github-actions-pool"
}

variable "github_org" {
  description = "GitHub organization or username (e.g., 'angelregner-designs')"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name without org (e.g., 'angel-portfolio')"
  type        = string
}

variable "service_account_id" {
  description = "ID for the GitHub Actions service account (lowercase, 6-30 chars)"
  type        = string
  default     = "github-actions-deployer"
}
