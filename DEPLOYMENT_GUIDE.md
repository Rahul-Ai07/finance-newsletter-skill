# 🚀 Production Deployment Guide

## Overview

This guide walks you through deploying the Premium Newsletter SaaS to production on Heroku (easiest) or AWS (more control).

**Deployment Time:** ~30-60 minutes
**Cost:** $7-50/month (depending on platform)
**Difficulty:** Intermediate

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Heroku Deployment (Recommended for MVP)](#heroku-deployment)
4. [AWS Deployment (Recommended for Scale)](#aws-deployment)
5. [Database Migration](#database-migration)
6. [Stripe Payment Setup](#stripe-payment-setup)
7. [Email Integration](#email-integration)
8. [Monitoring & Logging](#monitoring--logging)
9. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

### Required Accounts
- [ ] Heroku account (heroku.com) OR AWS account (aws.amazon.com)
- [ ] Anthropic API key (Claude API)
- [ ] Stripe account (stripe.com) for payments
- [ ] SendGrid account (sendgrid.com) for emails (optional)
- [ ] GitHub account (for deployment)

### Code Requirements
- [ ] All changes committed to git
- [ ] `.env.example` file updated
- [ ] Database migrations ready
- [ ] Tests passing locally
- [ ] No hardcoded secrets in code

### Checklist
```bash
# Verify everything is clean
git status                    # Should show "nothing to commit"
git log -1 --oneline         # Should show latest commit
npm run build                # Frontend builds without errors
pytest tests/                # Backend tests pass
```

---

## Environment Setup

### Step 1: Create Production `.env` File

**Important:** Never commit actual secrets to git. Use platform-specific secret management.

**Local reference** (`.env` - DO NOT COMMIT):
```bash
# Backend
ENVIRONMENT=production
SECRET_KEY=your-super-secret-key-generate-new
DATABASE_URL=postgresql://user:pass@host:port/dbname
ANTHROPIC_API_KEY=sk-ant-your-real-key
STRIPE_SECRET_KEY=sk_live_your-real-stripe-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-real-stripe-key
JWT_SECRET=your-jwt-secret-key
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email
SENDGRID_API_KEY=SG.your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Frontend
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_STRIPE_PUBLISHABLE=pk_live_your-stripe-key
```

### Step 2: Generate Secure Keys

```bash
# Python: Generate SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Python: Generate JWT_SECRET
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Store these securely in your deployment platform
```

### Step 3: Update Configuration Files

**Backend configuration** (`backend/config.py`):
```python
import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    environment: str = os.getenv("ENVIRONMENT", "development")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./newsletter.db")
    secret_key: str = os.getenv("SECRET_KEY", "dev-key-change-in-prod")
    jwt_secret: str = os.getenv("JWT_SECRET", "dev-jwt-change-in-prod")
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    stripe_secret_key: str = os.getenv("STRIPE_SECRET_KEY", "")
    stripe_publishable_key: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    sendgrid_api_key: str = os.getenv("SENDGRID_API_KEY", "")
    sendgrid_from_email: str = os.getenv("SENDGRID_FROM_EMAIL", "noreply@example.com")
    allowed_origins: list = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    sentry_dsn: str = os.getenv("SENTRY_DSN", "")

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## Heroku Deployment

Heroku is the easiest way to get started. It handles infrastructure, scaling, and deployments.

### Step 1: Install Heroku CLI

```bash
# Mac
brew tap heroku/brew && brew install heroku

# Windows/Linux
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Verify
heroku --version
```

### Step 2: Create Heroku App

```bash
# Login to Heroku
heroku login

# Create app
heroku create newsletter-saas-prod  # Change name to something unique

# Or if app already exists
heroku git:remote -a newsletter-saas-prod
```

### Step 3: Configure PostgreSQL Database

```bash
# Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0 -a newsletter-saas-prod

# Verify database URL was set
heroku config:get DATABASE_URL -a newsletter-saas-prod
# Output: postgres://user:pass@host:port/dbname
```

### Step 4: Set Environment Variables

```bash
# Set all production secrets
heroku config:set ENVIRONMENT=production -a newsletter-saas-prod
heroku config:set SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))") -a newsletter-saas-prod
heroku config:set JWT_SECRET=$(python -c "import secrets; print(secrets.token_urlsafe(32))") -a newsletter-saas-prod

# Add your real API keys (replace with actual keys)
heroku config:set ANTHROPIC_API_KEY=sk-ant-your-real-key -a newsletter-saas-prod
heroku config:set STRIPE_SECRET_KEY=sk_live_your-real-stripe-key -a newsletter-saas-prod
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_your-real-stripe-key -a newsletter-saas-prod
heroku config:set SENDGRID_API_KEY=SG.your-sendgrid-key -a newsletter-saas-prod
heroku config:set SENDGRID_FROM_EMAIL=noreply@yourdomain.com -a newsletter-saas-prod
heroku config:set ALLOWED_ORIGINS=https://newsletter-saas-prod.herokuapp.com -a newsletter-saas-prod
```

### Step 5: Create Procfile

Create `Procfile` in root directory:

```
web: python -m uvicorn backend.api.main:app --host 0.0.0.0 --port $PORT
release: python backend/scripts/migrate.py
worker: celery -A backend.tasks worker --loglevel=info
```

### Step 6: Update Requirements

Ensure `requirements.txt` has production dependencies:

```bash
# Add production packages
pip install gunicorn python-dotenv sentry-sdk

# Update requirements.txt
pip freeze > requirements.txt
```

### Step 7: Create Migration Script

Create `backend/scripts/migrate.py`:

```python
#!/usr/bin/env python
import os
from sqlalchemy import create_engine
from backend.db.models import Base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./newsletter.db")

# Handle PostgreSQL URL format
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)
print("✅ Database migrations completed")
```

### Step 8: Deploy to Heroku

```bash
# Commit all changes
git add .
git commit -m "Prepare for production deployment"

# Deploy to Heroku
git push heroku main  # or your branch name
# git push heroku claude/eldoma-elodomark-reference-tkmzc1:main

# Monitor deployment
heroku logs --tail -a newsletter-saas-prod
```

### Step 9: Verify Deployment

```bash
# Check dyno status
heroku ps -a newsletter-saas-prod

# Test API endpoint
curl https://newsletter-saas-prod.herokuapp.com/health

# View logs
heroku logs --tail -a newsletter-saas-prod
```

---

## AWS Deployment

For more control and scalability, deploy to AWS using ECS + RDS + S3.

### Step 1: Set Up AWS Resources

```bash
# Create RDS PostgreSQL database
aws rds create-db-instance \
  --db-instance-identifier newsletter-saas-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --allocated-storage 20 \
  --master-username admin \
  --master-user-password $(python -c "import secrets; print(secrets.token_urlsafe(16))") \
  --publicly-accessible \
  --region us-east-1
```

### Step 2: Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster --cluster-name newsletter-saas-prod

# Create task definition
# Create file: aws/ecs-task-definition.json
```

**aws/ecs-task-definition.json**:
```json
{
  "family": "newsletter-saas",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "YOUR_ECR_IMAGE_URI",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ENVIRONMENT",
          "value": "production"
        },
        {
          "name": "DATABASE_URL",
          "value": "postgresql://user:pass@rds-endpoint:5432/newsletter"
        }
      ],
      "secrets": [
        {
          "name": "ANTHROPIC_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:anthropic-api-key"
        },
        {
          "name": "STRIPE_SECRET_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:stripe-secret-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/newsletter-saas",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Step 3: Build Docker Image

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run migrations
RUN python backend/scripts/migrate.py

# Start application
CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker build -t newsletter-saas:latest .
docker tag newsletter-saas:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/newsletter-saas:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/newsletter-saas:latest
```

---

## Database Migration

### Step 1: Backup Local Database

```bash
# Export current data (if needed)
sqlite3 newsletter.db ".dump" > backup.sql
```

### Step 2: Run Production Migrations

```bash
# Heroku
heroku run python backend/scripts/migrate.py -a newsletter-saas-prod

# AWS
aws ecs run-task \
  --cluster newsletter-saas-prod \
  --task-definition newsletter-saas:1 \
  --launch-type FARGATE \
  --command python backend/scripts/migrate.py
```

### Step 3: Verify Database

```bash
# Connect to production database
psql postgresql://user:pass@host:5432/newsletter

# Check tables
\dt
# Should show: users, newsletters, templates, compliance_audits

# Verify data integrity
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM newsletters;
```

---

## Stripe Payment Setup

### Step 1: Create Stripe Account

- Sign up at stripe.com
- Complete identity verification
- Get API keys from Dashboard → Developers → API Keys

### Step 2: Configure Stripe in Backend

Create `backend/payment/stripe.py`:

```python
import stripe
from backend.config import settings

stripe.api_key = settings.stripe_secret_key

def create_subscription(user_id, tier, email):
    """Create Stripe subscription for user"""
    try:
        customer = stripe.Customer.create(
            email=email,
            metadata={"user_id": user_id}
        )
        
        subscription = stripe.Subscription.create(
            customer=customer.id,
            items=[{
                "price": get_price_id(tier)
            }],
            payment_behavior="default_incomplete",
            expand=["latest_invoice.payment_intent"]
        )
        
        return subscription
    except stripe.error.CardError as e:
        raise Exception(f"Card declined: {e}")

def get_price_id(tier):
    """Get Stripe price ID for tier"""
    prices = {
        "starter": "price_starter_live_id",
        "growth": "price_growth_live_id",
        "enterprise": "price_enterprise_live_id"
    }
    return prices.get(tier)

def handle_webhook(event):
    """Handle Stripe webhook events"""
    if event["type"] == "invoice.paid":
        # Update user subscription status
        pass
    elif event["type"] == "invoice.payment_failed":
        # Send retry email
        pass
```

### Step 3: Set Up Webhook Endpoint

```python
from fastapi import Request, HTTPException
from backend.payment.stripe import handle_webhook

@app.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            settings.stripe_webhook_secret
        )
    except ValueError:
        raise HTTPException(status_code=400)
    
    handle_webhook(event)
    return {"status": "success"}
```

### Step 4: Update Subscription Model

```python
from sqlalchemy import Column, String, DateTime

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    stripe_customer_id = Column(String)
    stripe_subscription_id = Column(String)
    stripe_price_id = Column(String)
    tier = Column(String)  # starter, growth, enterprise
    status = Column(String)  # active, inactive, cancelled
    current_period_start = Column(DateTime)
    current_period_end = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
```

---

## Email Integration

### Step 1: Set Up SendGrid

```bash
# Create account at sendgrid.com
# Get API key from Settings → API Keys

# Set environment variable
heroku config:set SENDGRID_API_KEY=SG.xxxxx -a newsletter-saas-prod
```

### Step 2: Create Email Service

Create `backend/email/sendgrid_service.py`:

```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from backend.config import settings

client = SendGridAPIClient(settings.sendgrid_api_key)

def send_email(to_email, subject, html_content):
    """Send email via SendGrid"""
    message = Mail(
        from_email=settings.sendgrid_from_email,
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )
    
    try:
        response = client.send(message)
        print(f"Email sent: {response.status_code}")
    except Exception as e:
        print(f"Email error: {e}")

def send_welcome_email(user):
    """Send welcome email to new user"""
    html = f"""
    <h1>Welcome to Newsletter SaaS!</h1>
    <p>Hi {user.company_name},</p>
    <p>Get started: <a href="https://yourdomain.com/editor">Create your first newsletter</a></p>
    """
    send_email(user.email, "Welcome to Newsletter SaaS", html)

def send_newsletter_ready_email(user, newsletter):
    """Notify user when newsletter is ready"""
    html = f"""
    <h1>Your newsletter is ready!</h1>
    <p>Hi {user.company_name},</p>
    <p><a href="https://yourdomain.com/newsletter/{newsletter.id}">View your newsletter</a></p>
    """
    send_email(user.email, f"Newsletter Ready: {newsletter.title}", html)
```

### Step 3: Integrate into User Flows

```python
from backend.email.sendgrid_service import send_welcome_email, send_newsletter_ready_email

@app.post("/auth/signup")
async def signup(email: str, company_name: str):
    user = create_user(email, company_name)
    send_welcome_email(user)  # Send welcome email
    return user

@app.post("/newsletters/generate")
async def generate_newsletter(requirements: dict):
    newsletter = create_newsletter(requirements)
    send_newsletter_ready_email(user, newsletter)  # Notify user
    return newsletter
```

---

## Monitoring & Logging

### Step 1: Set Up Error Tracking (Sentry)

```bash
# Create account at sentry.io
# Get DSN from project settings

heroku config:set SENTRY_DSN=https://xxx@sentry.io/xxx -a newsletter-saas-prod
```

**Integrate into backend** (`backend/api/main.py`):

```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=settings.sentry_dsn,
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
    environment=settings.environment
)
```

### Step 2: Set Up Logging

```python
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stdout
)

logger = logging.getLogger(__name__)

# Log important events
logger.info(f"Newsletter generated: {newsletter.id}")
logger.error(f"API error: {str(error)}")
```

### Step 3: Monitor Performance

```bash
# Heroku metrics
heroku metrics -a newsletter-saas-prod

# View logs
heroku logs --tail -a newsletter-saas-prod

# Scale dynos if needed
heroku ps:scale web=2:standard-1x -a newsletter-saas-prod
```

---

## Post-Deployment

### Step 1: Verify Everything Works

```bash
# Test health endpoint
curl https://newsletter-saas-prod.herokuapp.com/health

# Test API docs
https://newsletter-saas-prod.herokuapp.com/docs

# Test database connection
curl https://newsletter-saas-prod.herokuapp.com/debug/db-status
```

### Step 2: Set Up Custom Domain

**Heroku:**
```bash
heroku domains:add newsletter-saas.com -a newsletter-saas-prod
```

**AWS:**
- Use Route 53 to point domain to ALB
- Set up SSL certificate via ACM

### Step 3: Update Frontend API URL

**frontend/.env.production:**
```
REACT_APP_API_URL=https://api.newsletter-saas.com
REACT_APP_STRIPE_PUBLISHABLE=pk_live_your_key
```

### Step 4: Deploy Frontend

**If using Heroku:**
```bash
# Add buildpack for Node.js
heroku buildpacks:add heroku/nodejs -a newsletter-saas-prod

# Deploy
git push heroku main
```

**If using AWS:**
```bash
# Upload to S3 + CloudFront
aws s3 sync frontend/build s3://newsletter-saas-frontend/
```

### Step 5: SSL/HTTPS

**Heroku:** Automatic (free)

**AWS:**
```bash
# Request certificate in ACM
# Attach to ALB
```

### Step 6: Database Backups

**Heroku:**
```bash
# Automatic daily backups included

# Manual backup
heroku pg:backups:capture -a newsletter-saas-prod

# Download backup
heroku pg:backups:download -a newsletter-saas-prod
```

**AWS:**
- Enable automated backups in RDS console
- Set retention period (e.g., 30 days)

---

## Production Checklist

Before launching publicly:

- [ ] HTTPS/SSL enabled
- [ ] Custom domain configured
- [ ] Stripe production keys set
- [ ] Email service working
- [ ] Database backups automated
- [ ] Error tracking (Sentry) configured
- [ ] Logging set up and monitoring
- [ ] Rate limiting enabled (to prevent abuse)
- [ ] CORS properly configured
- [ ] Sensitive data not in logs
- [ ] Database connection pooling enabled
- [ ] Frontend built and deployed
- [ ] API documentation updated
- [ ] Terms of Service & Privacy Policy added
- [ ] Support email configured
- [ ] Monitoring alerts set up
- [ ] Load testing completed
- [ ] Security audit performed

---

## Troubleshooting

### Application won't start

```bash
# Check logs
heroku logs --tail -a newsletter-saas-prod

# Common issues:
# 1. Missing environment variable
# 2. Database connection failed
# 3. Missing dependency in requirements.txt
```

### Database migration fails

```bash
# Check database connection
heroku pg:info -a newsletter-saas-prod

# Manually connect and debug
heroku pg:psql -a newsletter-saas-prod
```

### High latency

```bash
# Check dyno type
heroku ps -a newsletter-saas-prod

# Upgrade dyno
heroku ps:type web=standard-1x -a newsletter-saas-prod

# Enable caching
# Add Redis addon: heroku addons:create heroku-redis:premium-0
```

### Stripe webhook not firing

```bash
# Verify webhook URL in Stripe dashboard
# URL should be: https://yourdomain.com/webhooks/stripe

# Test webhook
stripe trigger payment_intent.succeeded --account rk_test_xxxxx
```

---

## Cost Estimate

| Service | Usage | Cost |
|---------|-------|------|
| Heroku (Web Dyno) | 1x | $7-50/month |
| PostgreSQL (RDS) | Small | $15-30/month |
| SendGrid (Email) | 5,000/month | Free - $30 |
| Sentry (Error tracking) | <5 issues/month | Free |
| Stripe (Payments) | Per transaction | 2.9% + $0.30 |
| **Total** | MVP | **~$50-100/month** |

---

## Next Steps

1. ✅ Choose deployment platform (Heroku for MVP, AWS for scale)
2. ✅ Follow deployment steps
3. ✅ Configure Stripe and SendGrid
4. ✅ Set up monitoring
5. ✅ Verify everything works
6. ✅ Update customer validation plan with production URL
7. ✅ Start customer validation with live product

**You're ready to deploy!** 🚀
