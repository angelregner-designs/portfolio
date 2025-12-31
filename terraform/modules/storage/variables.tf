# =============================================================================
# STORAGE MODULE - INPUT VARIABLES
# =============================================================================
# Variables are like function parameters. When another file uses this module,
# it passes values for these variables. Think of it like:
#   createStorage(project_id="myproject", bucket_name="mybucket", ...)
#
# Variables with "default" are optional; others are required.
# =============================================================================

variable "project_id" {
  description = "GCP project ID (find this in Google Cloud Console)"
  type        = string
}

variable "bucket_name" {
  description = "Name of the GCS bucket - must be globally unique across ALL of Google Cloud"
  type        = string
}

variable "location" {
  description = "Where to store data. 'US' = multi-region (replicated across US data centers)"
  type        = string
  default     = "US"
}

variable "force_destroy" {
  description = "If true, terraform can delete the bucket even if it has files in it. Use true for dev (easy cleanup), false for prod (protect data)."
  type        = bool
  default     = false
}

variable "create_service_account" {
  description = "Create a service account for uploading files. Only needed for local dev - Cloud Run uses Workload Identity instead."
  type        = bool
  default     = false
}

variable "cors_origins" {
  description = "Which domains can fetch images from this bucket. Browsers block cross-origin requests unless the server explicitly allows them."
  type        = list(string)
  default     = []
}
