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

# Cloudflare CDN (optional but recommended)
cloudflare_zone_id   = ""  # Get from Cloudflare Dashboard > domain > Overview
cloudflare_api_token = ""  # Create token with Cache Purge permission
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

| Secret                     | Value                                      |
|----------------------------|--------------------------------------------|
| `WIF_PROVIDER_PROD`        | Output from `workload_identity_provider`   |
| `WIF_SERVICE_ACCOUNT_PROD` | Output from `github_actions_sa_email`      |
| `GA_ID_PROD`               | Google Analytics 4 Measurement ID (optional) |

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

## Step 6: Configure Cloudflare CDN

Using Cloudflare provides CDN caching, DDoS protection, and handles the root domain issue.

1. **Add site to Cloudflare:**
   - Go to Cloudflare Dashboard → Add Site
   - Enter `angelregner.com`
   - Select Free plan (sufficient for this use case)

2. **Update nameservers:**
   - Cloudflare will show two nameservers (e.g., `xxx.ns.cloudflare.com`)
   - Update these at your domain registrar
   - Wait for propagation (can take up to 24h)

3. **Configure DNS records in Cloudflare:**

   **Important:** Set records to **DNS only (gray cloud)** initially for SSL certificate provisioning.

   For root domain, use A records (get IPs from `terraform output portfolio_domain_records`):

   | Type  | Name    | Content             | Proxy    |
   |-------|---------|---------------------|----------|
   | A     | `@`     | `216.239.32.21`     | DNS only |
   | A     | `@`     | `216.239.34.21`     | DNS only |
   | A     | `@`     | `216.239.36.21`     | DNS only |
   | A     | `@`     | `216.239.38.21`     | DNS only |
   | CNAME | `api`   | `ghs.googlehosted.com` | DNS only |
   | CNAME | `admin` | `ghs.googlehosted.com` | DNS only |
   | CNAME | `www`   | `ghs.googlehosted.com` | DNS only |

   After SSL certificates are provisioned (~15-30 min), you can optionally switch to Proxied (orange cloud) for CDN benefits.

4. **Get credentials for cache purge:**
   - **Zone ID:** Dashboard → domain → Overview → right sidebar
   - **API Token:** My Profile → API Tokens → Create Token → Custom
     - Permission: Zone → Cache Purge → Purge
     - Zone Resources: Include → Specific Zone → angelregner.com

5. **Add to terraform.tfvars:**
   ```hcl
   cloudflare_zone_id   = "your-zone-id"
   cloudflare_api_token = "your-api-token"
   ```

6. **Re-apply Terraform** to update secrets:
   ```bash
   terraform apply
   ```

SSL certificates are auto-provisioned by both Cloudflare (edge) and Google (origin).

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
- [ ] Verify Cloudflare CDN is working (check response headers for `cf-cache-status`)
- [ ] Test cache purge by updating content in admin and verifying portfolio updates
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
- Ensure DNS records are set to **DNS only** (gray cloud) in Cloudflare - Google needs direct access for SSL verification
- Check DNS records resolve correctly: `curl -s "https://dns.google/resolve?name=yourdomain.com&type=A"`
- Wait for SSL provisioning (up to 30 min)
- After SSL is provisioned, you can switch to Proxied

### Old domain registrar interfering

If you migrated DNS to Cloudflare from another registrar (e.g., Porkbun):
- Check for **URL forwarding** rules at old registrar and delete them
- Porkbun's "pixie proxy" or redirect service can intercept traffic even after DNS migration
- Flush local DNS cache: `sudo resolvectl flush-caches` (Linux) or `ipconfig /flushdns` (Windows)

### 502/503 errors after deployment

- Check Cloud Run logs: `gcloud run services logs read api-prod --region us-central1`
- Verify secrets are accessible: Check Secret Manager permissions
- Ensure MongoDB Atlas allows connections

### Cache not updating after content changes

- Verify `CLOUDFLARE_ZONE_ID` and `CLOUDFLARE_API_TOKEN` are set in Secret Manager
- Check API logs for "Cloudflare cache purge failed" errors
- Manually purge via Cloudflare Dashboard → Caching → Purge Everything
