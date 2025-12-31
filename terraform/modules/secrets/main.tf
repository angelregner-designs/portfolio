# =============================================================================
# SECRETS MODULE - MAIN RESOURCES
# =============================================================================
# This module creates:
#   1. Secret Manager secrets - secure storage for sensitive values
#   2. Secret versions - the actual secret values
#   3. IAM bindings - which service accounts can access the secrets
#
# WHAT IS SECRET MANAGER?
# Secret Manager is Google's secure storage for sensitive data like:
#   - Database connection strings
#   - API keys
#   - JWT signing secrets
#   - OAuth client secrets
#
# Benefits over environment variables:
#   - Encrypted at rest and in transit
#   - Audit logging of access
#   - Version history (can roll back)
#   - Not visible in Cloud Console UI
#   - Can rotate secrets without redeploying
#
# How Cloud Run uses secrets:
#   1. Secret is stored in Secret Manager
#   2. Cloud Run service is configured to reference the secret
#   3. At startup, Cloud Run fetches the secret and injects it as an env var
#   4. Your code reads it like any other env var: process.env.DATABASE_URL
# =============================================================================


# -----------------------------------------------------------------------------
# SECRETS
# -----------------------------------------------------------------------------
# Creates Secret Manager secret resources (containers for secret values).
# The for_each loop creates one secret per name in the list.
#
# We use secret_names (non-sensitive) for iteration, and look up
# values from secret_values (sensitive) separately.
# -----------------------------------------------------------------------------
resource "google_secret_manager_secret" "secret" {
  for_each  = toset(var.secret_names)
  secret_id = each.key # The secret name (e.g., "dev-database-url")
  project   = var.project_id

  # Replication: Where the secret is stored
  # "auto" lets Google choose optimal regions based on your usage
  # For production, you might want "user_managed" with specific regions
  replication {
    auto {}
  }
}


# -----------------------------------------------------------------------------
# SECRET VERSIONS (the actual values)
# -----------------------------------------------------------------------------
# Each secret can have multiple versions. Cloud Run can reference:
#   - "latest": Always use the most recent version
#   - "1", "2", etc.: Use a specific version (for rollback safety)
#
# When you update a secret value, a new version is created automatically.
# Old versions are kept for rollback purposes.
# -----------------------------------------------------------------------------
resource "google_secret_manager_secret_version" "version" {
  for_each    = toset(var.secret_names)
  secret      = google_secret_manager_secret.secret[each.key].id
  secret_data = var.secret_values[each.key] # Look up value from the sensitive map

  # Note: Terraform stores this in state. Ensure state is encrypted/protected!
}


# -----------------------------------------------------------------------------
# IAM BINDINGS (who can access the secrets)
# -----------------------------------------------------------------------------
# Grant service accounts permission to read secret values.
# Cloud Run's service account needs this to inject secrets as env vars.
#
# The setproduct function creates all combinations of secrets x service accounts.
# Example: 2 secrets + 2 service accounts = 4 IAM bindings
# -----------------------------------------------------------------------------
resource "google_secret_manager_secret_iam_member" "accessor" {
  for_each = {
    for pair in setproduct(var.secret_names, var.accessor_service_accounts) :
    "${pair[0]}-${pair[1]}" => {
      secret = pair[0]
      sa     = pair[1]
    }
  }

  project   = var.project_id
  secret_id = google_secret_manager_secret.secret[each.value.secret].secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${each.value.sa}"
}
