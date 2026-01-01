# Production Deployment Guide

Deploy the production environment to GCP Cloud Run.

**Prerequisites:** Complete the dev environment setup first. This guide assumes you have:
- GCP project with APIs enabled
- Domain verified in Google Search Console
- GitHub repository with admin access

## Step 1: Set Up Production Database

1. Create a **dedicated production cluster** in MongoDB Atlas (M10+ recommended for production)
2. Create a database user with readWrite permissions
3. Get connection string: Database → Connect → Drivers
4. Add Cloud Run IP ranges to Access List (or `0.0.0.0/0` if using dynamic IPs)

Connection string format:
```
mongodb+srv://USER:PASSWORD@prod-cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

## Step 2: Configure Terraform Variables

```bash
cd terraform/environments/prod

# Create terraform.tfvars from example
cp terraform.tfvars.example terraform.tfvars

# Edit with production values
nano terraform.tfvars
```

Required values:
```hcl
project_id   = "angelregnerportfolio"
region       = "us-central1"
github_org   = "angelregner-designs"
github_repo  = "portfolio"
domain_base  = "angelregner.com"
database_url = "mongodb+srv://user:pass@prod-cluster.mongodb.net/portfolio?retryWrites=true&w=majority"
jwt_secret   = "your-production-secret-min-32-chars"
```

Generate a new JWT secret for production (different from dev!):
```bash
openssl rand -base64 32
```

## Step 3: Apply Terraform

```bash
terraform init
terraform plan    # Review changes carefully
terraform apply   # Create resources
```

This creates:
- GCS bucket: `angelregnerportfolio-images`
- Artifact Registry: `angel-portfolio-prod`
- Workload Identity for GitHub Actions
- Secret Manager secrets
- Cloud Run services (will fail until images exist)
- Domain mappings

## Step 4: Configure GitHub Secrets

Get the Workload Identity values:
```bash
terraform output -raw workload_identity_provider
terraform output -raw github_actions_sa_email
```

Add to GitHub (Repository → Settings → Secrets and variables → Actions):

| Secret | Value |
|--------|-------|
| `WIF_PROVIDER_PROD` | Output from `workload_identity_provider` |
| `WIF_SERVICE_ACCOUNT_PROD` | Output from `github_actions_sa_email` |

## Step 5: Configure GitHub Environment

The CD workflow requires manual approval before deploying to production.

1. Go to Repository → Settings → Environments
2. Click "New environment"
3. Name: `production`
4. Configure protection rules:
   - Check "Required reviewers"
   - Add yourself or team members as reviewers
   - Optionally: "Wait timer" (e.g., 5 minutes)
5. Save protection rules

## Step 6: Configure DNS

Add DNS records to your DNS provider:

| Type | Name | Value |
|------|------|-------|
| CNAME | `api` | `ghs.googlehosted.com.` |
| CNAME | `admin` | `ghs.googlehosted.com.` |

For the root domain (`angelregner.com`):
- If using Cloudflare: Use CNAME flattening
- If using other providers: Check if ALIAS/ANAME records are supported
- Alternative: Use `www.angelregner.com` with CNAME and redirect root to www

SSL certificates are auto-provisioned (15-30 min after DNS propagates).

## Step 7: First Deployment

Merge to main branch to trigger the production CD workflow:

```bash
git checkout main
git merge develop
git push origin main
```

Or use GitHub UI to merge a PR from `develop` to `main`.

**Important:** The workflow will pause at the deploy stage and wait for manual approval.

1. Go to Repository → Actions
2. Find "CD - Deploy to Production" workflow
3. Click "Review deployments"
4. Select "production" environment
5. Click "Approve and deploy"

## Step 8: Seed the Production Database

After the first successful deployment:

```bash
# Run the seed job
gcloud run jobs execute seed-prod --region=us-central1 --wait

# Verify seeding
gcloud logging read "resource.type=cloud_run_job AND resource.labels.job_name=seed-prod" --limit=10
```

**Note:** Change the default passwords immediately after seeding!

## Step 9: Verify Deployment

```bash
# Check services are running
gcloud run services list --region us-central1 --filter="SERVICE_NAME:*prod*"

# Test API health
curl https://api.angelregner.com/health

# Check domain mappings
gcloud run domain-mappings list --region us-central1
```

## Post-Deployment Checklist

- [ ] Change default user passwords
- [ ] Verify all three domains are accessible with HTTPS
- [ ] Test login on admin panel
- [ ] Upload a test image to verify GCS integration
- [ ] Set up monitoring/alerting in GCP Console
- [ ] Consider setting `min_instances = 1` for API to avoid cold starts

## Troubleshooting

### Terraform apply fails

- Check database_url and jwt_secret are not empty
- Ensure you have GCP permissions (Project Owner or Editor)

### Workflow fails at authentication

- Verify `WIF_PROVIDER_PROD` and `WIF_SERVICE_ACCOUNT_PROD` secrets
- Check the GitHub org/repo in terraform.tfvars matches your repository

### Domain mapping stuck on "pending"

- Verify domain in Google Search Console
- Check DNS records are correct
- Wait for SSL provisioning (up to 30 min)

### 502/503 errors after deployment

- Check Cloud Run logs: `gcloud run services logs read api-prod --region us-central1`
- Verify secrets are accessible: Check Secret Manager permissions
- Ensure MongoDB Atlas allows connections

### Root domain not working

Root domains can't use CNAME. Options:
1. Use Cloudflare with CNAME flattening
2. Use a DNS provider that supports ALIAS/ANAME
3. Redirect root to `www.angelregner.com`
