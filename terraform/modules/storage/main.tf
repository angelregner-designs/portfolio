# =============================================================================
# STORAGE MODULE - MAIN RESOURCES
# =============================================================================
# This module creates:
#   1. A GCS bucket to store portfolio images
#   2. Public read access so anyone can view the images
#   3. (Optional) A service account + key for local development uploads
#
# Resources are the actual GCP things Terraform creates. The syntax is:
#   resource "RESOURCE_TYPE" "LOCAL_NAME" { ... }
#
# - RESOURCE_TYPE: What kind of GCP resource (from the google provider)
# - LOCAL_NAME: How we refer to this resource in other parts of the code
# =============================================================================


# -----------------------------------------------------------------------------
# THE BUCKET
# -----------------------------------------------------------------------------
# A bucket is like a folder in the cloud that stores files (called "objects").
# Files uploaded here get a public URL: https://storage.googleapis.com/BUCKET/FILENAME
# -----------------------------------------------------------------------------
resource "google_storage_bucket" "portfolio_images" {
  name          = var.bucket_name # var.X references input variables
  location      = var.location
  project       = var.project_id
  force_destroy = var.force_destroy

  # Uniform access = simpler permissions model (recommended by Google)
  # Instead of per-file permissions, the whole bucket shares the same rules
  uniform_bucket_level_access = true

  # "inherited" means: allow public access if we grant it below
  # (Google has a project-level setting that can block all public access)
  public_access_prevention = "inherited"

  # CORS (Cross-Origin Resource Sharing)
  # Browsers block requests from one domain to another by default.
  # This tells the browser: "It's OK for these origins to fetch our images"
  cors {
    origin          = var.cors_origins # e.g., ["http://localhost:3002"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["Content-Type", "Cache-Control"]
    max_age_seconds = 3600 # Browser can cache CORS response for 1 hour
  }
}


# -----------------------------------------------------------------------------
# PUBLIC READ ACCESS
# -----------------------------------------------------------------------------
# IAM (Identity and Access Management) controls who can do what.
# This grants "objectViewer" role to "allUsers" (the entire internet).
# Result: Anyone can view/download images, but only authenticated users can upload.
# -----------------------------------------------------------------------------
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.portfolio_images.name # Reference our bucket
  role   = "roles/storage.objectViewer"                # Can read objects
  member = "allUsers"                                  # Everyone on the internet
}


# -----------------------------------------------------------------------------
# SERVICE ACCOUNT (for local development only)
# -----------------------------------------------------------------------------
# A service account is a "robot account" for applications (not humans).
# Our API server authenticates as this account to upload files.
#
# The "count" trick:
#   count = condition ? 1 : 0
# If condition is true, create 1 of this resource. If false, create 0 (skip it).
# We only need this for local dev; Cloud Run uses Workload Identity instead.
# -----------------------------------------------------------------------------
resource "google_service_account" "storage_uploader" {
  count        = var.create_service_account ? 1 : 0
  account_id   = "portfolio-storage-uploader"
  display_name = "Portfolio Storage Uploader"
  project      = var.project_id
}


# -----------------------------------------------------------------------------
# GRANT UPLOAD PERMISSIONS TO SERVICE ACCOUNT
# -----------------------------------------------------------------------------
# The service account needs permission to:
#   - objectCreator: Upload new files
#   - objectAdmin: Delete files (for replacing images)
#
# Note: When using "count", we access the resource with [0] because it's now a list.
# ${...} is string interpolation - inserts the service account's email into the string.
# -----------------------------------------------------------------------------
resource "google_storage_bucket_iam_member" "uploader_create" {
  count  = var.create_service_account ? 1 : 0
  bucket = google_storage_bucket.portfolio_images.name
  role   = "roles/storage.objectCreator"
  member = "serviceAccount:${google_service_account.storage_uploader[0].email}"
}

resource "google_storage_bucket_iam_member" "uploader_admin" {
  count  = var.create_service_account ? 1 : 0
  bucket = google_storage_bucket.portfolio_images.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.storage_uploader[0].email}"
}


# -----------------------------------------------------------------------------
# SERVICE ACCOUNT KEY (JSON credentials file)
# -----------------------------------------------------------------------------
# Creates a JSON key file that the API can use to authenticate.
# This is like a password for the service account.
#
# Security note: This key is stored in Terraform state. Never commit state files!
# In production, use Workload Identity instead (no key files needed).
# -----------------------------------------------------------------------------
resource "google_service_account_key" "uploader_key" {
  count              = var.create_service_account ? 1 : 0
  service_account_id = google_service_account.storage_uploader[0].name
}
