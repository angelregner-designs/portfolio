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

---

## Quick Reference: Final DNS Configuration

After setup is complete, your Cloudflare DNS should look like this:

### Production Records

| Type  | Name        | Content                | Proxy Status | Notes                          |
|-------|-------------|------------------------|--------------|--------------------------------|
| A     | `@`         | `216.239.32.21`        | DNS only     | Google's anycast LB            |
| A     | `@`         | `216.239.34.21`        | DNS only     | Google's anycast LB            |
| A     | `@`         | `216.239.36.21`        | DNS only     | Google's anycast LB            |
| A     | `@`         | `216.239.38.21`        | DNS only     | Google's anycast LB            |
| CNAME | `api`       | `ghs.googlehosted.com` | DNS only     | **Must be DNS only**           |
| CNAME | `admin`     | `ghs.googlehosted.com` | DNS only     | Can proxy after SSL ready      |
| CNAME | `www`       | `ghs.googlehosted.com` | DNS only     | Can proxy after SSL ready      |

### Dev Environment Records

| Type  | Name        | Content                | Proxy Status | Notes                          |
|-------|-------------|------------------------|--------------|--------------------------------|
| CNAME | `dev`       | `ghs.googlehosted.com` | DNS only     | Portfolio dev                  |
| CNAME | `api.dev`   | `ghs.googlehosted.com` | DNS only     | API dev                        |
| CNAME | `admin.dev` | `ghs.googlehosted.com` | DNS only     | Admin dev                      |

### Other Records (keep from registrar)

| Type | Name | Content                  | Proxy Status | Notes                          |
|------|------|--------------------------|--------------|--------------------------------|
| MX   | `@`  | `fwd1.porkbun.com`       | DNS only     | Email forwarding (priority 10) |
| MX   | `@`  | `fwd2.porkbun.com`       | DNS only     | Email forwarding (priority 20) |
| TXT  | `@`  | `google-site-verif...`   | DNS only     | Domain verification            |
| TXT  | `@`  | `v=spf1 include:...`     | DNS only     | Email SPF                      |

---

## CDN and Proxy Limitations

### Why Most Records Must Be "DNS Only"

**Cloudflare proxy does NOT work with Cloud Run's `ghs.googlehosted.com`** because:

1. Cloudflare terminates SSL at their edge
2. Cloudflare connects to Google with its own certificate
3. Google's SSL validation fails, returning 404 or connection errors

**Symptoms of incorrect proxy settings:**
- `server: openresty` in response headers (Cloudflare's edge server)
- HTTP 404 errors
- CORS failures on API endpoints

### What CDN Benefits Are Available?

| Domain           | Can Proxy? | CDN Source       | Benefits                        |
|------------------|------------|------------------|----------------------------------|
| `angelregner.com` (A records) | No  | Google Cloud CDN | Built-in to Cloud Run           |
| `api.*`          | No         | None (dynamic)   | API responses shouldn't be cached |
| `admin.*`        | Yes*       | Cloudflare       | DDoS protection, minor caching  |
| `www.*`          | Yes*       | Cloudflare       | DDoS protection, edge caching   |

*Only after SSL certificates are provisioned and if it works (test first!)

### Cloud Run's Built-in CDN

Cloud Run includes Google's global load balancer which provides:
- Automatic SSL certificates
- Global anycast routing (users connect to nearest edge)
- DDoS protection at Google's edge
- HTTP/2 and HTTP/3 support

You don't lose much by not using Cloudflare proxy.

---

## Step-by-Step Setup

### Step 1: Add Domain to Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click "Add Site" > enter your domain
3. Select Free plan
4. Cloudflare will show nameserver addresses (e.g., `arnold.ns.cloudflare.com`)
5. Update nameservers at your domain registrar
6. Wait for propagation (up to 24h, usually faster)

### Step 2: Verify Domain in Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property > Domain > `yourdomain.com`
3. Add TXT record in Cloudflare:

| Type | Name | Content              | Proxy    |
|------|------|----------------------|----------|
| TXT  | `@`  | (provided by Google) | DNS only |

4. Click Verify in Google Search Console

### Step 3: Get DNS Records from Terraform

After `terraform apply`, check the outputs:

```bash
cd terraform/environments/prod
terraform output portfolio_domain_records
terraform output api_domain_records
terraform output admin_domain_records
```

### Step 4: Configure DNS Records

**Important:** All records must be **DNS only (gray cloud)** for initial SSL provisioning.

Add the records from the Quick Reference section above.

### Step 5: Wait for SSL Certificates

Cloud Run automatically provisions SSL certificates after DNS is configured.

Check status:
```bash
gcloud beta run domain-mappings list --region us-central1
```

- `✔` = SSL certificate ready
- `...` = Certificate provisioning in progress (wait 15-30 min)

### Step 6: Test Everything

```bash
# Test portfolio
curl -sI https://angelregner.com | head -5

# Test API
curl -sI https://api.angelregner.com/health | head -5

# Test admin
curl -sI https://admin.angelregner.com | head -5
```

All should return `HTTP/2 200` with `server: Google Frontend`.

---

## Migrating from GitHub Pages

If you previously used GitHub Pages with this domain:

### Checklist

1. **GitHub repo settings**
   - Go to Settings > Pages
   - Remove custom domain or disable Pages entirely
   ```bash
   # Check current GitHub Pages status
   gh api repos/{owner}/{repo}/pages
   ```

2. **Old registrar (e.g., Porkbun)**
   - Delete all A records pointing to `185.199.x.x` (GitHub IPs)
   - Delete all AAAA records pointing to `2606:50c0:...` (GitHub IPv6)
   - Delete CNAME records pointing to `*.github.io`
   - Keep MX, TXT (SPF, verification) records

3. **Cloudflare**
   - Ensure no Page Rules or Redirect Rules forwarding to GitHub
   - Check Rules > Redirect Rules
   - Check Rules > Page Rules (legacy)

4. **Local DNS cache**
   ```bash
   # Linux
   sudo systemctl restart systemd-resolved

   # Or if using router DNS, restart router

   # Mac
   sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder

   # Windows
   ipconfig /flushdns
   ```

5. **Test with cache bypass**
   ```bash
   # Bypass local DNS and test directly against Google's IPs
   curl -sI --resolve angelregner.com:443:216.239.32.21 https://angelregner.com
   ```

### GitHub Pages IP Reference (delete these)

| Type | IPs (delete if present)                                    |
|------|-------------------------------------------------------------|
| A    | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| AAAA | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |

---

## Troubleshooting

### Certificate stuck in "pending"

- Ensure DNS records are **DNS only** (gray cloud), not Proxied
- Verify records resolve correctly:
  ```bash
  curl -s "https://dns.google/resolve?name=angelregner.com&type=A" | jq '.Answer[].data'
  ```
- Wait 15-30 minutes after DNS is correct

### API returning 404 with "server: openresty"

The API CNAME is set to Proxied. Change to **DNS only**:
1. Cloudflare Dashboard > DNS
2. Find `api` CNAME record
3. Click the orange cloud to turn it gray (DNS only)

### CORS errors on API

Usually caused by:
1. API CNAME set to Proxied (fix: set to DNS only)
2. CORS_ORIGINS env var missing the origin domain
3. Check API logs: `gcloud run services logs read api-prod --region us-central1`

### Local DNS cache not clearing

Your router may be caching DNS. Options:
1. Restart router
2. Bypass router DNS temporarily:
   ```bash
   sudo resolvectl dns wlp0s20f3 8.8.8.8 8.8.4.4
   ```
3. Test from different network (mobile hotspot)

### Testing with DNS cache bypass

```bash
# Test against Google's IPs directly
curl -sI --resolve angelregner.com:443:216.239.32.21 https://angelregner.com

# Check what public DNS sees
curl -s "https://dns.google/resolve?name=angelregner.com&type=A" | jq '.Answer[].data'

# Check your local resolution
getent ahostsv4 angelregner.com
```

### Cloudflare warning about "exposing IPs"

This warning appears because some records are DNS only while others are proxied.
**You can ignore it** - the IPs exposed (`216.239.x.x`) are Google's anycast load
balancers, not your origin server. Cloud Run requires DNS only for SSL validation.

---

## Useful Commands

```bash
# List all domain mappings and their status
gcloud beta run domain-mappings list --region us-central1

# Check specific domain mapping
gcloud beta run domain-mappings describe --domain=angelregner.com --region=us-central1

# View Cloud Run service URLs
gcloud run services list --region us-central1

# Check DNS resolution via Google DNS
curl -s "https://dns.google/resolve?name=angelregner.com&type=A" | jq .

# Check local DNS resolution
getent ahostsv4 angelregner.com
getent ahostsv6 angelregner.com

# Flush local DNS cache (Linux with systemd-resolved)
sudo resolvectl flush-caches

# Test with specific IP (bypass DNS)
curl -sI --resolve angelregner.com:443:216.239.32.21 https://angelregner.com
```
