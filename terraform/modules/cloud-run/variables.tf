# =============================================================================
# CLOUD RUN MODULE - INPUT VARIABLES
# =============================================================================

variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "service_name" {
  description = "Name of the Cloud Run service (lowercase, hyphens allowed)"
  type        = string
}

variable "location" {
  description = "Cloud Run region (e.g., us-central1). Choose based on user proximity"
  type        = string
  default     = "us-central1"
}

variable "image" {
  description = "Full container image URL (e.g., us-central1-docker.pkg.dev/project/repo/image:tag)"
  type        = string
}

variable "container_port" {
  description = "Port the container listens on. Cloud Run routes requests here"
  type        = number
  default     = 8080
}

variable "cpu" {
  description = "CPU limit per instance. Options: '1', '2', '4', '8'. More CPU = faster but costlier"
  type        = string
  default     = "1"
}

variable "memory" {
  description = "Memory limit per instance. Examples: '256Mi', '512Mi', '1Gi', '2Gi'"
  type        = string
  default     = "512Mi"
}

variable "min_instances" {
  description = "Minimum instances. 0 = scale to zero when idle (saves money, slower cold starts)"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum instances. Caps scaling to control costs during traffic spikes"
  type        = number
  default     = 10
}

variable "cpu_idle" {
  description = "Throttle CPU when not processing requests. true = cheaper, false = faster response"
  type        = bool
  default     = true
}

variable "ingress" {
  description = "Where traffic can come from: INGRESS_TRAFFIC_ALL, INGRESS_TRAFFIC_INTERNAL_ONLY, INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
  type        = string
  default     = "INGRESS_TRAFFIC_ALL"
}

variable "allow_unauthenticated" {
  description = "Allow public access without authentication. true for public APIs/websites"
  type        = bool
  default     = true
}

variable "service_account_email" {
  description = "Service account email the container runs as. Used for accessing GCP resources"
  type        = string
  default     = null
}

variable "env_vars" {
  description = "Plain-text environment variables. Use for non-sensitive config like NODE_ENV"
  type = list(object({
    name  = string
    value = string
  }))
  default = []
}

variable "secret_env_vars" {
  description = "Environment variables from Secret Manager. Use for DATABASE_URL, JWT_SECRET, etc."
  type = list(object({
    name        = string # Env var name in the container
    secret_name = string # Secret Manager secret ID
    version     = string # "latest" or specific version like "1"
  }))
  default = []
}

variable "domain_name" {
  description = "Custom domain to map (e.g., api.example.com). Set to null to skip domain mapping"
  type        = string
  default     = null
}
