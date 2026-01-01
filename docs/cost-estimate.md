# Infrastructure Cost Estimate

Monthly cost estimates for dev and production environments.

**Pricing as of:** January 2025
**Region:** us-central1

## Summary

| Category              | Dev (Monthly) | Prod (Monthly) |
|-----------------------|---------------|----------------|
| Cloud Run             | ~$0           | ~$0-2          |
| Cloud Storage         | ~$0           | ~$0-1          |
| Artifact Registry     | ~$0-1         | ~$0-1          |
| Secret Manager        | ~$0           | ~$0            |
| MongoDB Atlas         | $0 (M0)       | $0 (M0)        |
| Cloudflare            | $0            | $0             |
| Domain                | —             | ~$12/year      |
| **Total**             | **~$0-1**     | **~$0-5**      |

> **Current setup:** Using free tiers across the board with minimal traffic. Most months will cost $0-5.

## Cloud Run

**Pricing model:** Pay per request + CPU/memory time

| Resource        | Price                    |
|-----------------|--------------------------|
| CPU             | $0.00002400/vCPU-second  |
| Memory          | $0.00000250/GiB-second   |
| Requests        | $0.40/million            |
| Free tier       | 2M requests, 360K vCPU-sec, 180K GiB-sec/month |

### Dev Environment (3 services)

| Service       | Config                          | Est. Monthly |
|---------------|---------------------------------|--------------|
| api-dev       | 1 vCPU, 512MB, 0-5 instances    | ~$0-2        |
| portfolio-dev | 1 vCPU, 512MB, 0-5 instances    | ~$0-2        |
| admin-dev     | 1 vCPU, 512MB, 0-3 instances    | ~$0-1        |

**Note:** Scale-to-zero + low traffic = mostly free tier coverage.

### Prod Environment (3 services)

| Service        | Config                          | Est. Monthly |
|----------------|---------------------------------|--------------|
| api-prod       | 1 vCPU, 512MB, 0-10 instances   | ~$2-15       |
| portfolio-prod | 1 vCPU, 512MB, 0-10 instances   | ~$2-10       |
| admin-prod     | 1 vCPU, 512MB, 0-5 instances    | ~$1-5        |

**Factors affecting cost:**
- Traffic volume (requests/month)
- Cold start frequency (scale-to-zero tradeoff)
- Response time (longer = more CPU-seconds)

**Cost optimization tips:**
- Keep `min_instances = 0` for scale-to-zero
- Use `cpu_idle = true` (already set) to throttle idle CPU
- Consider `min_instances = 1` for api-prod if cold starts hurt UX (adds ~$15-20/mo)

## Cloud Storage

**Pricing model:** Storage + operations + egress

| Resource              | Price                    |
|-----------------------|--------------------------|
| Standard storage      | $0.020/GB/month          |
| Class A ops (write)   | $0.05/10K operations     |
| Class B ops (read)    | $0.004/10K operations    |
| Egress (to internet)  | $0.12/GB (first 10TB)    |
| Free tier             | 5GB storage, 50K Class A, 50K Class B, 1GB egress |

### Estimate

| Bucket              | Storage Est. | Egress Est. | Monthly    |
|---------------------|--------------|-------------|------------|
| images-dev          | <1 GB        | <1 GB       | ~$0        |
| images (prod)       | 1-10 GB      | 5-20 GB     | ~$1-5      |

**Note:** Cloudflare CDN caches images, reducing GCS egress significantly.

## Artifact Registry

**Pricing model:** Storage + egress

| Resource            | Price                    |
|---------------------|--------------------------|
| Storage             | $0.10/GB/month           |
| Egress (same region)| Free                     |
| Egress (internet)   | $0.12/GB                 |

### Estimate

| Repository            | Images | Est. Size | Monthly |
|-----------------------|--------|-----------|---------|
| angel-portfolio-dev   | 3      | ~3-5 GB   | ~$0.50  |
| angel-portfolio-prod  | 3      | ~3-5 GB   | ~$0.50  |

**Note:** Prod uses immutable tags, so old versions accumulate. Consider cleanup policy.

## Secret Manager

**Pricing model:** Per secret + per access

| Resource            | Price                    |
|---------------------|--------------------------|
| Active secret       | $0.06/version/month      |
| Access operations   | $0.03/10K                |
| Free tier           | 6 active versions, 10K accesses |

### Estimate

| Environment | Secrets | Est. Monthly |
|-------------|---------|--------------|
| Dev         | 2       | ~$0.12       |
| Prod        | 4       | ~$0.24       |

**Total:** ~$0.36/month (likely covered by free tier)

## MongoDB Atlas

**External service** - not GCP billing

| Tier | Specs                      | Monthly Cost |
|------|----------------------------|--------------|
| M0   | Free, shared, 512MB        | $0           |
| M10  | Dedicated, 2GB RAM, 10GB   | $57          |
| M20  | Dedicated, 4GB RAM, 20GB   | $140         |

### Current Setup

| Environment | Tier | Monthly |
|-------------|------|---------|
| Dev         | M0   | $0      |
| Prod        | M0   | $0      |

**M0 limitations:**
- 512MB storage limit
- Shared cluster (variable performance)
- No backups (manual export only)
- No dedicated support

**When to upgrade to M10 ($57/mo):**
- Storage exceeds 512MB
- Need automated backups
- Performance becomes inconsistent
- Business-critical uptime requirements

## Cloudflare

**Free tier includes:**
- DNS management
- CDN (caching)
- DDoS protection
- SSL certificates (single-level subdomains)
- Basic analytics

**Paid features not needed:**
- Advanced Certificate Manager ($10/mo) - only needed for `*.dev.angelregner.com`

**Monthly cost:** $0

## Domain Registration

Annual cost varies by registrar:
- `.com` domain: ~$10-15/year

**Monthly equivalent:** ~$1/month

## Workload Identity Federation

**Free** - no direct cost. Uses OIDC tokens from GitHub Actions.

## Cost Scenarios

### Current: Free Tier (minimal traffic)

| Service           | Monthly |
|-------------------|---------|
| Cloud Run         | $0      |
| Cloud Storage     | $0      |
| Artifact Registry | $0-1    |
| Secret Manager    | $0      |
| MongoDB Atlas M0  | $0      |
| Cloudflare        | $0      |
| **Total**         | **~$0-1** |

Covered by free tiers:
- Cloud Run: 2M requests, 360K vCPU-sec/month
- GCS: 5GB storage, 1GB egress
- Secret Manager: 6 versions, 10K accesses
- MongoDB: 512MB storage

### Growth: Exceeding Free Tiers (1K-10K visitors/month)

| Service           | Monthly |
|-------------------|---------|
| Cloud Run         | $5-15   |
| Cloud Storage     | $1-3    |
| Artifact Registry | $1-2    |
| Secret Manager    | $0      |
| MongoDB Atlas M0  | $0      |
| Cloudflare        | $0      |
| **Total**         | **~$7-20** |

### Scale: Dedicated Resources (50K+ visitors/month)

| Service           | Monthly  |
|-------------------|----------|
| Cloud Run         | $50-100  |
| Cloud Storage     | $10-20   |
| Artifact Registry | $3       |
| Secret Manager    | $1       |
| MongoDB Atlas M10 | $57      |
| Cloudflare        | $0       |
| **Total**         | **~$120-180** |

## Cost Optimization Checklist

- [x] Scale-to-zero enabled (`min_instances = 0`)
- [x] CPU throttling enabled (`cpu_idle = true`)
- [x] Cloudflare CDN reduces GCS egress
- [x] MongoDB M0 for both environments
- [x] Using all available free tiers
- [ ] Set up Artifact Registry cleanup policy for old images
- [ ] Monitor usage to stay within free tiers

## AWS Comparison

Equivalent architecture on AWS for cost comparison.

### Service Mapping

| GCP Service          | AWS Equivalent           | Notes                           |
|----------------------|--------------------------|----------------------------------|
| Cloud Run            | App Runner or ECS Fargate| App Runner is closer analogy    |
| Cloud Storage        | S3                       | Nearly identical pricing        |
| Artifact Registry    | ECR                      | Similar pricing                 |
| Secret Manager       | Secrets Manager          | AWS is more expensive           |
| Workload Identity    | IAM OIDC Provider        | Both free                       |
| Domain Mapping       | Route 53 + ACM           | Route 53 has hosting fee        |

### AWS Cost Estimate (Production)

#### App Runner (Cloud Run equivalent)

| Resource        | Price                    |
|-----------------|--------------------------|
| Provisioned     | $0.007/GB-hour memory    |
| Active          | $0.064/vCPU-hour         |
| Requests        | $1.00/million            |

**3 services (1 vCPU, 512MB each):**
- Provisioned memory: 1.5GB × 730hrs × $0.007 = ~$7.67/mo
- Active CPU (est. 10% active): 3 vCPU × 73hrs × $0.064 = ~$14/mo
- Requests (100K): ~$0.10
- **App Runner total:** ~$22-35/mo

**Note:** App Runner doesn't scale to zero like Cloud Run. For true scale-to-zero, use Lambda + API Gateway.

#### Lambda + API Gateway (serverless alternative)

| Resource              | Price                    |
|-----------------------|--------------------------|
| Lambda requests       | $0.20/million            |
| Lambda duration       | $0.0000166667/GB-second  |
| API Gateway requests  | $1.00/million (REST)     |
| Free tier             | 1M requests, 400K GB-sec |

**Estimate for similar traffic:**
- Often cheaper than App Runner for low traffic
- Cold starts more noticeable than Cloud Run
- Requires code changes (Lambda handlers)
- **Lambda total:** ~$5-20/mo

#### ECS Fargate (container alternative)

| Resource        | Price                    |
|-----------------|--------------------------|
| vCPU            | $0.04048/hour            |
| Memory          | $0.004445/GB-hour        |

**3 services (1 vCPU, 512MB, always-on):**
- CPU: 3 × $0.04048 × 730 = ~$88.65/mo
- Memory: 1.5GB × $0.004445 × 730 = ~$4.87/mo
- **Fargate total:** ~$94/mo (no scale-to-zero!)

**Note:** Fargate is expensive for low-traffic apps. Use spot instances or Lambda for cost savings.

#### S3 (Cloud Storage equivalent)

| Resource              | Price                    |
|-----------------------|--------------------------|
| Standard storage      | $0.023/GB/month          |
| PUT/POST requests     | $0.005/1K                |
| GET requests          | $0.0004/1K               |
| Egress                | $0.09/GB (first 10TB)    |

**Estimate:** ~$1-5/mo (slightly more than GCS)

#### ECR (Artifact Registry equivalent)

| Resource            | Price                    |
|---------------------|--------------------------|
| Storage             | $0.10/GB/month           |
| Data transfer       | Standard AWS rates       |

**Estimate:** ~$1-3/mo (similar to GCP)

#### Secrets Manager

| Resource            | Price                    |
|---------------------|--------------------------|
| Per secret          | $0.40/month              |
| API calls           | $0.05/10K                |

**4 secrets:** $1.60/mo (GCP is ~$0.24)

#### Route 53 (DNS)

| Resource            | Price                    |
|---------------------|--------------------------|
| Hosted zone         | $0.50/month              |
| Queries             | $0.40/million            |

**Estimate:** ~$0.50-1/mo (Cloudflare is free)

#### RDS or DocumentDB (MongoDB equivalent)

| Service      | Specs                    | Monthly      |
|--------------|--------------------------|--------------|
| DocumentDB   | db.t3.medium (2 vCPU)    | ~$115        |
| MongoDB Atlas| M10 (on AWS)             | ~$57         |

**Note:** MongoDB Atlas on AWS costs the same. DocumentDB is AWS-native but pricier.

### AWS Total Comparison

| Scenario              | GCP (Current) | AWS (App Runner) | AWS (Fargate) |
|-----------------------|---------------|------------------|---------------|
| Free tier (current)   | ~$0-1         | ~$25-40          | ~$95-110      |
| Growth (1K-10K)       | ~$7-20        | ~$40-70          | ~$100-130     |
| Scale (50K+)          | ~$120-180     | ~$180-250        | ~$250-350     |

### Why GCP is Cheaper for This Project

1. **Cloud Run scale-to-zero** - App Runner charges for provisioned capacity even when idle
2. **Free tier** - GCP's Cloud Run free tier is more generous
3. **Secret Manager** - GCP is ~85% cheaper per secret
4. **DNS** - Using Cloudflare (free) vs Route 53 ($0.50/zone)
5. **Egress** - GCP slightly cheaper for storage egress

### When AWS Might Be Better

- Already have AWS infrastructure/expertise
- Need AWS-specific services (Cognito, Amplify, etc.)
- Want Lambda for extreme scale-to-zero (but requires code changes)
- Enterprise support requirements

## Monitoring Costs

View costs in GCP Console:
```bash
# Open billing reports
open https://console.cloud.google.com/billing

# Or via CLI
gcloud billing accounts list
gcloud billing projects describe PROJECT_ID
```

Set up budget alerts:
1. GCP Console → Billing → Budgets & alerts
2. Create budget for project
3. Set threshold alerts (50%, 90%, 100%)
