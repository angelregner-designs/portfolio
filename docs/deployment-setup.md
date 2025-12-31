# Deployment Setup Guide

Step-by-step guide to deploy the dev environment to GCP Cloud Run.

## Prerequisites

1. **GCP Project** with billing enabled
2. **MongoDB Atlas** cluster (free tier M0 works for dev)
3. **Domain** verified in Google Search Console
4. **GitHub repository** with admin access (for secrets)

## Step 1: Enable GCP APIs

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com
```

## Step 2: Set Up MongoDB Atlas

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create database user with readWrite permissions
4. Get connection string: Database → Connect → Drivers
5. Add `0.0.0.0/0` to IP Access List (Cloud Run has dynamic IPs)

Connection string format:
```
mongodb+srv://USER:PASSWORD@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

## Step 3: Verify Domain Ownership

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property → Domain → `angelregner.com`
3. Add TXT record to Porkbun (provided by Google)
4. Wait for verification (can take up to 24 hours)

## Step 4: Apply Terraform

```bash
cd terraform/environments/dev

# Create terraform.tfvars from example
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
# IMPORTANT: database_url and jwt_secret are sensitive!
nano terraform.tfvars
```

Example `terraform.tfvars`:
```hcl
project_id   = "angelregnerportfolio"
region       = "us-central1"
github_org   = "angelregner-designs"
github_repo  = "angel-portfolio"
domain_base  = "dev.angelregner.com"
database_url = "mongodb+srv://user:pass@cluster.mongodb.net/portfolio?retryWrites=true&w=majority"
jwt_secret   = "your-32-char-random-string-here"
```

Generate JWT secret:
```bash
openssl rand -base64 32
```

Apply Terraform:
```bash
terraform init
terraform plan    # Review changes
terraform apply   # Create resources
```

## Step 5: Configure GitHub Secrets

After Terraform apply, get the values:

```bash
terraform output workload_identity_provider
terraform output github_actions_sa_email
```

Add to GitHub:
1. Go to Repository → Settings → Secrets and variables → Actions
2. Add repository secrets:

| Secret | Value |
|--------|-------|
| `WIF_PROVIDER` | Output from `workload_identity_provider` |
| `WIF_SERVICE_ACCOUNT` | Output from `github_actions_sa_email` |

## Step 6: Configure DNS

See [docs/dns-setup.md](./dns-setup.md) for Porkbun DNS configuration.

## Step 7: First Deployment

Push to develop branch to trigger the CD workflow:

```bash
git checkout develop
git push origin develop
```

Monitor deployment:
1. Go to Repository → Actions
2. Watch "CD - Deploy to Dev" workflow

First deploy may take 5-10 minutes to build all images.

## Step 8: Verify Deployment

After workflow completes:

```bash
# Check Cloud Run services
gcloud run services list --region us-central1

# Test API health endpoint
curl https://api.dev.angelregner.com/health
```

## Troubleshooting

### Workflow fails at authentication

- Verify `WIF_PROVIDER` and `WIF_SERVICE_ACCOUNT` secrets are correct
- Check Workload Identity pool was created: `terraform output workload_identity_provider`

### Cloud Run deploy fails

- First deploy fails if images don't exist yet - this is expected
- Check Artifact Registry has images: `gcloud artifacts docker images list $REGISTRY`

### Domain mapping pending

- Verify domain ownership in Google Search Console
- Check DNS records are correct (see dns-setup.md)
- SSL certificates can take 15-30 minutes to provision

### API returns 500 errors

- Check Cloud Run logs: `gcloud run services logs read api-dev --region us-central1`
- Verify DATABASE_URL is correct in Secret Manager
- Ensure MongoDB Atlas allows connections from `0.0.0.0/0`
