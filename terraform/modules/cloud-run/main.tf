# =============================================================================
# CLOUD RUN MODULE - MAIN RESOURCES
# =============================================================================
# This module creates:
#   1. A Cloud Run service - runs your containerized application
#   2. IAM policy - controls who can invoke the service (public or authenticated)
#   3. (Optional) Domain mapping - connect a custom domain
#
# WHAT IS CLOUD RUN?
# Cloud Run is a serverless container platform. You give it a Docker image,
# it runs it, scales it automatically, and you pay only when it's handling requests.
#
# Key concepts:
#   - Service: Your application (e.g., "api", "portfolio")
#   - Revision: A specific version of your service (immutable snapshot)
#   - Instance: A running container handling requests
#
# Scaling:
#   - min_instances = 0: Scale to zero when no traffic (saves money)
#   - max_instances: Caps how many containers can run (controls costs)
#   - Cloud Run auto-scales between min and max based on traffic
# =============================================================================


# -----------------------------------------------------------------------------
# CLOUD RUN SERVICE
# -----------------------------------------------------------------------------
# The main resource that runs your container. Uses v2 API for latest features.
# -----------------------------------------------------------------------------
resource "google_cloud_run_v2_service" "service" {
  name     = var.service_name
  location = var.location
  project  = var.project_id

  # Ingress controls where traffic can come from:
  #   - INGRESS_TRAFFIC_ALL: Accept traffic from internet (most common)
  #   - INGRESS_TRAFFIC_INTERNAL_ONLY: Only from within GCP
  #   - INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER: Only via load balancer
  ingress = var.ingress

  # Template defines what to run and how to run it
  # Each deploy creates a new "revision" based on this template
  template {
    # Service account the container runs as (for accessing other GCP services)
    service_account = var.service_account_email

    # Scaling configuration
    scaling {
      min_instance_count = var.min_instances # 0 = scale to zero when idle
      max_instance_count = var.max_instances
    }

    containers {
      # Docker image to run (from Artifact Registry)
      # Example: us-central1-docker.pkg.dev/myproject/myrepo/api:abc123
      image = var.image

      # CPU and memory limits
      resources {
        limits = {
          cpu    = var.cpu    # e.g., "1" = 1 vCPU
          memory = var.memory # e.g., "512Mi" = 512 MB RAM
        }
        # cpu_idle = true: CPU is throttled when not processing requests (cheaper)
        # cpu_idle = false: CPU stays allocated (faster cold starts, more expensive)
        cpu_idle = var.cpu_idle
      }

      # Port the container listens on
      # Cloud Run routes incoming requests to this port
      ports {
        container_port = var.container_port
      }

      # Environment variables (plain text, visible in Cloud Console)
      # Use this for non-sensitive config like NODE_ENV, API URLs
      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.value.name
          value = env.value.value
        }
      }

      # Environment variables from Secret Manager (secure)
      # Secret values are injected at runtime, not visible in Cloud Console
      dynamic "env" {
        for_each = var.secret_env_vars
        content {
          name = env.value.name
          value_source {
            secret_key_ref {
              secret  = env.value.secret_name # Secret Manager secret name
              version = env.value.version     # "latest" or specific version number
            }
          }
        }
      }
    }
  }

  # Traffic routing: send all traffic to the latest revision
  # You can also do traffic splitting for canary deployments
  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}


# -----------------------------------------------------------------------------
# PUBLIC ACCESS (IAM)
# -----------------------------------------------------------------------------
# By default, Cloud Run services require authentication.
# For public websites/APIs, we grant "allUsers" the invoker role.
#
# Options:
#   - allow_unauthenticated = true: Anyone on internet can access (public API/website)
#   - allow_unauthenticated = false: Requires Google authentication (internal services)
# -----------------------------------------------------------------------------
resource "google_cloud_run_v2_service_iam_member" "invoker" {
  count    = var.allow_unauthenticated ? 1 : 0
  project  = var.project_id
  location = var.location
  name     = google_cloud_run_v2_service.service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}


# -----------------------------------------------------------------------------
# CUSTOM DOMAIN MAPPING (optional)
# -----------------------------------------------------------------------------
# Maps a custom domain to your Cloud Run service.
# Prerequisites:
#   1. Verify domain ownership in Google Search Console
#   2. Add DNS records (CNAME pointing to ghs.googlehosted.com)
#
# After applying, check the domain_mapping_records output for required DNS records.
# SSL certificates are automatically provisioned by Google.
# -----------------------------------------------------------------------------
resource "google_cloud_run_domain_mapping" "domain" {
  count    = var.domain_name != null ? 1 : 0
  location = var.location
  name     = var.domain_name
  project  = var.project_id

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.service.name
  }
}
