# Heroku Deployment Guide - Production Ready

## 📋 Pre-Deployment Checklist

Before deploying to Heroku, ensure you have:

- [ ] **Heroku Account** - Create at https://www.heroku.com/
- [ ] **Heroku CLI** - Download from https://devcenter.heroku.com/articles/heroku-cli
- [ ] **API Keys Ready:**
  - [ ] Anthropic API Key (from https://console.anthropic.com)
  - [ ] Stripe Secret Key (test or live)
  - [ ] SendGrid API Key (optional, for email notifications)
- [ ] **All code committed** - No uncommitted changes in git
- [ ] **Branch:** `claude/eldoma-elodomark-reference-tkmzc1`

---

## 🚀 Quick Deployment (Automated)

### Option A: Using the Deployment Script (Recommended)

**On your local machine:**

```bash
# Clone the repository
git clone https://github.com/Rahul-Ai07/finance-newsletter-skill.git
cd finance-newsletter-skill

# Make script executable
chmod +x DEPLOY_HEROKU.sh

# Run deployment script
./DEPLOY_HEROKU.sh
```

The script will:
1. Check prerequisites (Heroku CLI, git)
2. Create Heroku app
3. Generate secure JWT_SECRET
4. Prompt for API keys (secure input)
5. Set all environment variables
6. Provision PostgreSQL database
7. Deploy code
8. Verify deployment
9. Display application URL

---

## 🔧 Manual Deployment (Step-by-Step)

### Step 1: Install Heroku CLI

**On macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**On Ubuntu/Debian:**
```bash
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
```

**On Windows:**
Download from https://devcenter.heroku.com/articles/heroku-cli

Verify installation:
```bash
heroku --version
```

### Step 2: Login to Heroku

```bash
heroku login
```

This opens your browser for authentication.

### Step 3: Create Heroku App

```bash
heroku create newsletter-saas-prod --region us
```

**Note:** Replace `newsletter-saas-prod` with your preferred app name (must be unique globally on Heroku).

Your app will be available at: `https://newsletter-saas-prod.herokuapp.com`

### Step 4: Generate Secure JWT Secret

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output - you'll need this in the next step.

### Step 5: Set Environment Variables

Set all environment variables in Heroku dashboard or via CLI:

```bash
heroku config:set \
  ENVIRONMENT=production \
  ANTHROPIC_API_KEY=sk_... \
  JWT_SECRET=<paste_generated_secret_here> \
  ALLOWED_ORIGINS=https://newsletter-saas-prod.herokuapp.com \
  ALLOWED_HOSTS=newsletter-saas-prod.herokuapp.com \
  STRIPE_SECRET_KEY=sk_test_... \
  SENDGRID_API_KEY=SG.... \
  --app newsletter-saas-prod
```

**Replace values:**
- `sk_...` → Your actual Anthropic API key
- `<paste_generated_secret_here>` → JWT secret from Step 4
- `sk_test_...` → Your Stripe secret key (test or live)
- `SG....` → Your SendGrid API key (optional)

### Step 6: Provision PostgreSQL Database

```bash
heroku addons:create heroku-postgresql:hobby-dev --app newsletter-saas-prod
```

The PostgreSQL database URL will automatically be set as `DATABASE_URL` environment variable.

### Step 7: Configure Git Remote

```bash
heroku git:remote -a newsletter-saas-prod
```

### Step 8: Deploy Application

```bash
git push heroku claude/eldoma-elodomark-reference-tkmzc1:main
```

This pushes your code to Heroku and automatically:
- Detects Python buildpack
- Installs dependencies from requirements.txt
- Builds the frontend
- Starts the application

**Wait for deployment to complete** (2-3 minutes).

### Step 9: Verify Deployment

Check application logs:
```bash
heroku logs --tail --app newsletter-saas-prod
```

Test health endpoint:
```bash
curl https://newsletter-saas-prod.herokuapp.com/health
```

Expected response:
```json
{
  "status": "ok",
  "version": "0.1.0",
  "timestamp": "2026-01-28T10:30:45.123456"
}
```

### Step 10: Open Application

```bash
heroku open --app newsletter-saas-prod
```

Or visit: `https://newsletter-saas-prod.herokuapp.com`

---

## 🔐 Security Configuration Details

### Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `ENVIRONMENT` | Deployment mode | `production` |
| `ANTHROPIC_API_KEY` | Claude API key | `sk_...` |
| `JWT_SECRET` | Token signing key | Generated 32-char random |
| `DATABASE_URL` | PostgreSQL connection | Auto-set by Heroku |
| `ALLOWED_ORIGINS` | CORS whitelist | `https://app.heroku.com` |
| `ALLOWED_HOSTS` | Host header validation | `app.heroku.com` |
| `STRIPE_SECRET_KEY` | Payment processing | `sk_test_...` or `sk_live_...` |
| `SENDGRID_API_KEY` | Email sending (optional) | `SG...` |

### Security Features Deployed

✅ **Authentication:**
- JWT HS256 tokens with 24-hour expiration
- Bearer token authentication on all protected endpoints
- Automatic token refresh on `/auth/verify-token`

✅ **Rate Limiting:**
- 10 signup attempts per IP per hour
- 20 token verification attempts per IP per hour
- Prevents brute force and account enumeration

✅ **Headers & Protocols:**
- HSTS (HTTP Strict Transport Security)
- Content Security Policy
- X-Frame-Options (prevents clickjacking)
- X-XSS-Protection
- Trusted Host middleware

✅ **Input Validation:**
- Email validation (RFC 5322)
- String length limits
- XSS prevention (reject HTML/special chars)

✅ **Error Handling:**
- Generic production error messages (no sensitive data)
- Detailed development error messages
- Server-side logging of all errors

✅ **Database:**
- PostgreSQL encrypted connections
- Automatic daily backups (Heroku)
- Foreign key constraints
- Indexed columns for performance

---

## 📊 Monitoring & Logs

### View Real-Time Logs

```bash
heroku logs --tail --app newsletter-saas-prod
```

### Filter Logs by Type

```bash
# API errors
heroku logs --source app --app newsletter-saas-prod

# Database connections
heroku logs --source heroku-postgres --app newsletter-saas-prod

# Platform messages
heroku logs --source heroku --app newsletter-saas-prod
```

### Common Log Messages

✅ **Good - Application Started:**
```
2026-01-28T10:30:45 app[web.1]: Application started in production mode
```

⚠️ **Warning - Rate Limit Hit:**
```
2026-01-28T10:31:12 app[web.1]: WARNING - Rate limit exceeded for IP: 192.168.1.1
```

❌ **Error - Database Connection:**
```
2026-01-28T10:32:00 app[web.1]: ERROR - Cannot connect to database
```

---

## 🧪 Testing Deployment

### 1. Test Signup (Rate Limiting)

```bash
# First signup - should succeed
curl -X POST https://newsletter-saas-prod.herokuapp.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test1@example.com","company_name":"Test Company"}'

# Response should include token
{
  "id": "uuid-here",
  "email": "test1@example.com",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 2. Test Newsletter Generation

```bash
# Use token from signup
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGc..."

curl -X POST https://newsletter-saas-prod.herokuapp.com/api/newsletters/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "audience": "Retail investors",
    "purpose": "market-update",
    "tone": "Professional",
    "objective": "Weekly market trends",
    "key_content": "RBI policy changes"
  }'
```

### 3. Test Authentication

```bash
# Without token - should fail
curl -X GET https://newsletter-saas-prod.herokuapp.com/api/auth/user

# With token - should succeed
curl -X GET https://newsletter-saas-prod.herokuapp.com/api/auth/user \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Test Rate Limiting

```bash
# Try 11 signups from same IP in quick succession
# 11th attempt should return 429 Too Many Requests
for i in {1..11}; do
  curl -X POST https://newsletter-saas-prod.herokuapp.com/api/auth/signup \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test$i@example.com\",\"company_name\":\"Test $i\"}"
done
```

---

## 🚨 Troubleshooting

### Issue: "Application Error" Page

**Cause:** Startup error or configuration missing

**Solution:**
```bash
# Check logs
heroku logs --tail --app newsletter-saas-prod

# Verify environment variables
heroku config --app newsletter-saas-prod

# Check app status
heroku ps --app newsletter-saas-prod
```

### Issue: 502 Bad Gateway

**Cause:** Server crashed or resource exhausted

**Solution:**
```bash
# Restart dyno
heroku ps:restart web --app newsletter-saas-prod

# Check available resources
heroku ps --app newsletter-saas-prod

# Check logs for errors
heroku logs --tail --app newsletter-saas-prod
```

### Issue: Database Connection Error

**Cause:** PostgreSQL not provisioned or connection string wrong

**Solution:**
```bash
# Check if addon is provisioned
heroku addons --app newsletter-saas-prod

# Check DATABASE_URL is set
heroku config:get DATABASE_URL --app newsletter-saas-prod

# Recreate if needed
heroku addons:destroy heroku-postgresql --app newsletter-saas-prod --confirm
heroku addons:create heroku-postgresql:hobby-dev --app newsletter-saas-prod
```

### Issue: CORS Errors in Frontend

**Cause:** ALLOWED_ORIGINS not configured correctly

**Solution:**
```bash
# Update ALLOWED_ORIGINS
heroku config:set ALLOWED_ORIGINS=https://newsletter-saas-prod.herokuapp.com --app newsletter-saas-prod

# If frontend is on different domain
heroku config:set ALLOWED_ORIGINS=https://app.heroku.com,https://newsletter-saas-prod.herokuapp.com --app newsletter-saas-prod
```

---

## 📈 Scaling & Performance

### Default Configuration

- **Dyno Type:** Standard-1x (512 MB RAM, $50/month)
- **Dyno Quantity:** 1
- **Database:** PostgreSQL Hobby Dev (free, limited features)

### Scaling for More Traffic

```bash
# Add more web dynos (auto-scaling)
heroku ps:scale web=2 --app newsletter-saas-prod

# Upgrade dyno type (more RAM)
heroku ps:type Standard-2x --app newsletter-saas-prod

# Upgrade database for production
heroku addons:create heroku-postgresql:standard-0 --app newsletter-saas-prod
```

---

## 🔄 Continuous Deployment

### Deploy New Changes

```bash
# Commit changes locally
git add .
git commit -m "Your commit message"

# Push to GitHub
git push origin claude/eldoma-elodomark-reference-tkmzc1

# Deploy to Heroku
git push heroku claude/eldoma-elodomark-reference-tkmzc1:main
```

### Revert Deployment

```bash
# View release history
heroku releases --app newsletter-saas-prod

# Rollback to previous release
heroku rollback v10 --app newsletter-saas-prod
```

---

## 📞 Support & Maintenance

### Daily Operations

```bash
# Monitor live logs
heroku logs --tail --app newsletter-saas-prod

# Check dyno status
heroku ps --app newsletter-saas-prod

# View metrics
heroku metrics --app newsletter-saas-prod
```

### Weekly Maintenance

- Review security logs (look for rate limit violations)
- Check database size: `heroku pg:info --app newsletter-saas-prod`
- Backup database: `heroku pg:backups:capture --app newsletter-saas-prod`
- Review errors in logs

### Monthly Tasks

- Update dependencies (security patches)
- Review performance metrics
- Plan scaling if needed
- Review customer validation metrics

---

## ✅ Post-Deployment Checklist

After deployment succeeds:

- [ ] Application accessible at public URL
- [ ] Health check endpoint returns 200
- [ ] Can signup with valid email
- [ ] Can generate newsletter with valid token
- [ ] Rate limiting blocks 11th request
- [ ] Invalid tokens return 401
- [ ] Database backups working
- [ ] Logs accessible
- [ ] HTTPS enforced (auto via Heroku)
- [ ] Security headers present

**To verify headers:**
```bash
curl -I https://newsletter-saas-prod.herokuapp.com
```

Look for:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=...`

---

## 🎯 Next Steps

1. **Customer Validation Week 1:**
   - Follow VALIDATION_CHECKLIST.md
   - Send 15-20 LinkedIn outreach messages
   - Target fintech marketing leaders

2. **Switch to Live Stripe Keys:**
   - Update `STRIPE_SECRET_KEY` to live key when ready
   - Update `STRIPE_PUBLISHABLE_KEY` in frontend

3. **Add Custom Domain:**
   ```bash
   heroku domains:add newsletter.example.com --app newsletter-saas-prod
   ```

4. **Set up Monitoring:**
   - Optional: Add Sentry (error tracking)
   - Optional: Add Datadog (performance monitoring)

---

## 📚 Additional Resources

- [Heroku Python Buildpack](https://devcenter.heroku.com/articles/python-support)
- [PostgreSQL on Heroku](https://devcenter.heroku.com/articles/heroku-postgresql)
- [Heroku Deployment Best Practices](https://devcenter.heroku.com/articles/procfile)
- [Security on Heroku](https://devcenter.heroku.com/articles/production-check)

---

**Deployment Date:** 2026-01-28  
**Application Status:** Production Ready ✅  
**Last Updated:** Version 1.0
