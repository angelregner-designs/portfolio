# DNS Setup Guide

Configure DNS records in Porkbun for Cloud Run custom domains.

## Overview

Cloud Run custom domain mapping requires:
1. Domain verification in Google Search Console
2. CNAME records pointing to Cloud Run's load balancer

## Step 1: Verify Domain (if not done)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property → Domain → `angelregner.com`
3. Add TXT record to Porkbun:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| TXT | @ | (provided by Google) | 300 |

4. Click Verify in Google Search Console
5. Wait for verification (usually minutes, up to 24 hours)

## Step 2: Get DNS Records from Terraform

After `terraform apply`, the required DNS records are in the outputs:

```bash
cd terraform/environments/dev
terraform output api_domain_records
terraform output portfolio_domain_records
terraform output admin_domain_records
```

The records will look like:
```
[
  {
    "name" = ""
    "rrdata" = "ghs.googlehosted.com."
    "type" = "CNAME"
  }
]
```

## Step 3: Add CNAME Records in Porkbun

1. Log in to [Porkbun](https://porkbun.com)
2. Go to Domain Management → angelregner.com → DNS Records
3. Add these CNAME records:

### Dev Environment

| Type | Host | Answer | TTL |
|------|------|--------|-----|
| CNAME | dev | ghs.googlehosted.com | 300 |
| CNAME | api.dev | ghs.googlehosted.com | 300 |
| CNAME | admin.dev | ghs.googlehosted.com | 300 |

**Important:** The "Answer" must include the trailing dot: `ghs.googlehosted.com.`

## Step 4: Wait for DNS Propagation

DNS changes typically propagate in 5-30 minutes.

Check propagation:
```bash
# Check if CNAME is set
dig dev.angelregner.com CNAME

# Expected output includes:
# dev.angelregner.com.  300  IN  CNAME  ghs.googlehosted.com.
```

## Step 5: Wait for SSL Certificates

Cloud Run automatically provisions SSL certificates via Google-managed certificates.

Check certificate status:
```bash
gcloud run domain-mappings describe \
  --domain dev.angelregner.com \
  --region us-central1 \
  --format 'yaml(status)'
```

Certificate provisioning takes 15-30 minutes after DNS propagates.

## Troubleshooting

### Certificate stuck in "pending"

Common causes:
1. **DNS not propagated** - Wait longer or check with `dig`
2. **Wrong CNAME value** - Must be exactly `ghs.googlehosted.com.`
3. **CAA record blocking** - Check for CAA records

Check CAA records:
```bash
dig angelregner.com CAA
```

If CAA records exist, add:
```
0 issue "pki.goog"
```

### Domain mapping shows "CertificatePending"

This is normal for the first 15-30 minutes. If it persists:

1. Delete and recreate the mapping:
```bash
gcloud run domain-mappings delete \
  --domain dev.angelregner.com \
  --region us-central1

# Then re-run terraform apply
terraform apply
```

2. Verify domain ownership is still valid in Google Search Console

### "Domain not verified" error

1. Ensure domain is verified in Google Search Console
2. The verification must be for the exact domain (`angelregner.com`)
3. Verification is tied to GCP project - ensure you're using the right project

### HTTPS works but HTTP doesn't redirect

Cloud Run automatically redirects HTTP to HTTPS. If it doesn't:
- Clear browser cache
- Try incognito mode
- Wait for DNS cache to expire

## Production Domains (Future)

When setting up production, add these records:

| Type | Host | Answer | TTL |
|------|------|--------|-----|
| CNAME | @ or root | (use A record instead) | 300 |
| CNAME | api | ghs.googlehosted.com | 300 |
| CNAME | admin | ghs.googlehosted.com | 300 |

**Note:** Root/apex domains (@) cannot use CNAME. For production, you may need:
- A load balancer with a static IP, or
- Porkbun's ALIAS/ANAME record (if supported), or
- Use `www.angelregner.com` with a redirect from the apex
