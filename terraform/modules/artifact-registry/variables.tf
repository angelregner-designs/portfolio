# =============================================================================
# ARTIFACT REGISTRY MODULE - INPUT VARIABLES
# =============================================================================
# Variables are inputs to the module. When calling this module, you provide
# values for these variables. Think of them like function parameters.
#
# Syntax:
#   variable "NAME" {
#     type        = string | number | bool | list(...) | map(...)
#     description = "What this variable is for"
#     default     = "optional default value"
#   }
# =============================================================================

variable "project_id" {
  description = "GCP project ID where the repository will be created"
  type        = string
}

variable "location" {
  description = "Region for the repository (e.g., us-central1). Should match Cloud Run region for faster pulls"
  type        = string
  default     = "us-central1"
}

variable "repository_id" {
  description = "ID for the Artifact Registry repository (lowercase, hyphens allowed)"
  type        = string
}

variable "description" {
  description = "Human-readable description of what this repository stores"
  type        = string
  default     = "Docker images repository"
}

variable "immutable_tags" {
  description = "Prevent tag overwrites. Use false for dev (overwrite 'latest'), true for prod (unique tags only)"
  type        = bool
  default     = false
}

variable "cloud_run_service_account" {
  description = "Service account email that needs read access (Cloud Run SA). Set to null to skip IAM binding"
  type        = string
  default     = null
}
