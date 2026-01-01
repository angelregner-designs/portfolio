# DNS Setup Guide

Configure DNS records in Cloudflare for Cloud Run custom domains.

## Overview

Cloud Run custom domain mapping requires:
1. Domain verification in Google Search Console
2. DNS records pointing to Cloud Run's load balancer
3. SSL certificate provisioning (automatic)

## Prerequisites

- Domain registered (any registrar)
- Cloudflare account (free tier works)
- Domain nameservers pointing to Cloudflare

## Step 1: Add Domain to Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click "Add Site" → enter your domain
3. Select Free plan
4. Cloudflare will show nameserver addresses (e.g., `arnold.ns.cloudflare.com`)
5. Update nameservers at your domain registrar
6. Wait for propagation (up to 24h, usually faster)

## Step 2: Verify Domain in Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property → Domain → `yourdomain.com`
3. Add TXT record in Cloudflare:

| Type | Name | Content                     | Proxy    |
|------|------|-----------------------------|----------|
| TXT  | `@`  | (provided by Google)        | DNS only |

4. Click Verify in Google Search Console

## Step 3: Get DNS Records from Terraform

After `terraform apply`, check the outputs for required records:

```bash
terraform output portfolio_domain_records
terraform output api_domain_records
terraform output admin_domain_records
```

## Step 4: Configure DNS Records in Cloudflare

**Important:** Set records to **DNS only (gray cloud)** initially for SSL provisioning.

### Root Domain (portfolio)

For root domain, use A records from terraform output:

| Type | Name | Content         | Proxy    |
|------|------|-----------------|----------|
| A    | `@`  | `216.239.32.21` | DNS only |
| A    | `@`  | `216.239.34.21` | DNS only |
| A    | `@`  | `216.239.36.21` | DNS only |
| A    | `@`  | `216.239.38.21` | DNS only |

### Subdomains (api, admin, dev)

Use CNAME records for subdomains:

| Type  | Name        | Content               | Proxy    |
|-------|-------------|-----------------------|----------|
| CNAME | `api`       | `ghs.googlehosted.com` | DNS only |
| CNAME | `admin`     | `ghs.googlehosted.com` | DNS only |
| CNAME | `www`       | `ghs.googlehosted.com` | DNS only |
| CNAME | `dev`       | `ghs.googlehosted.com` | DNS only |
| CNAME | `api.dev`   | `ghs.googlehosted.com` | DNS only |
| CNAME | `admin.dev` | `ghs.googlehosted.com` | DNS only |

## Step 5: Wait for SSL Certificates

Cloud Run automatically provisions SSL certificates after DNS is configured.

Check status:
```bash
gcloud beta run domain-mappings list --region us-central1
```

- `✔` = SSL certificate ready
- `…` = Certificate provisioning in progress (wait 15-30 min)

## Step 6: Enable Cloudflare Proxy (Optional)

After SSL certificates show `✔`, you can switch records to **Proxied (orange cloud)** for:
- CDN caching
- DDoS protection
- Analytics

**Note:** Dev subdomain CNAMEs (`api.dev`, `admin.dev`) should stay DNS only - Cloudflare's free SSL doesn't cover multi-level subdomains.

## Troubleshooting

### Certificate stuck in "pending"

- Ensure DNS records are **DNS only** (gray cloud), not Proxied
- Verify records resolve correctly:
  ```bash
  curl -s "https://dns.google/resolve?name=yourdomain.com&type=A"
  ```
- Wait 15-30 minutes after DNS is correct

### Getting redirects to old domain registrar

If you migrated from another registrar (e.g., Porkbun):
- Check for **URL forwarding** rules at old registrar and delete them
- Flush local DNS cache:
  - Linux: `sudo resolvectl flush-caches`
  - Mac: `sudo dscacheutil -flushcache`
  - Windows: `ipconfig /flushdns`

### "Domain not verified" error

1. Ensure domain is verified in Google Search Console
2. Verification must be for the exact domain (not subdomain)
3. Verification is tied to GCP project

### Testing with DNS cache bypass

Test bypassing local DNS cache:
```bash
curl -sI --resolve yourdomain.com:443:216.239.32.21 https://yourdomain.com
```
