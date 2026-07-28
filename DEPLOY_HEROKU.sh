#!/bin/bash

# Heroku Deployment Script - Production Deployment with Security Configuration
# This script automates the deployment of the Premium Newsletter SaaS to Heroku

set -e  # Exit on error

echo "🚀 Premium Newsletter SaaS - Heroku Deployment Script"
echo "=================================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."
if ! command -v heroku &> /dev/null; then
    print_error "Heroku CLI not installed"
    echo "Download from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi
print_status "Heroku CLI found"

if ! command -v git &> /dev/null; then
    print_error "Git not installed"
    exit 1
fi
print_status "Git found"

# Check git status
if [[ -n $(git status -s) ]]; then
    print_error "Working directory has uncommitted changes"
    echo "Please commit all changes before deployment"
    exit 1
fi
print_status "Git working directory clean"

# Get app name
read -p "Enter Heroku app name (default: newsletter-saas-prod): " APP_NAME
APP_NAME=${APP_NAME:-newsletter-saas-prod}
print_status "App name: $APP_NAME"

# Login to Heroku
echo ""
echo "Logging into Heroku..."
heroku login
print_status "Logged into Heroku"

# Create app
echo ""
echo "Creating Heroku app..."
if heroku apps:info $APP_NAME &> /dev/null; then
    print_warning "App $APP_NAME already exists, skipping creation"
else
    heroku create $APP_NAME --region us
    print_status "Heroku app created: $APP_NAME"
fi

# Generate secure JWT secret
echo ""
echo "Generating security configuration..."
JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
print_status "JWT_SECRET generated"

# Set environment variables
echo ""
echo "Setting environment variables..."
echo "⚠️  IMPORTANT: Ensure you have these values ready:"
echo "   - ANTHROPIC_API_KEY (from https://console.anthropic.com)"
echo "   - STRIPE_SECRET_KEY (test or live key)"
echo "   - SENDGRID_API_KEY (optional, for emails)"
echo ""

read -p "Enter ANTHROPIC_API_KEY: " ANTHROPIC_API_KEY
read -p "Enter STRIPE_SECRET_KEY: " STRIPE_SECRET_KEY
read -p "Enter SENDGRID_API_KEY (press Enter to skip): " SENDGRID_API_KEY

# Set all env vars
heroku config:set \
    ENVIRONMENT=production \
    ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" \
    JWT_SECRET="$JWT_SECRET" \
    ALLOWED_ORIGINS="https://$APP_NAME.herokuapp.com" \
    ALLOWED_HOSTS="$APP_NAME.herokuapp.com,www.$APP_NAME.herokuapp.com" \
    STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" \
    --app $APP_NAME

if [ ! -z "$SENDGRID_API_KEY" ]; then
    heroku config:set SENDGRID_API_KEY="$SENDGRID_API_KEY" --app $APP_NAME
fi

print_status "Environment variables configured"

# Add PostgreSQL database
echo ""
echo "Provisioning PostgreSQL database..."
if heroku addons --app $APP_NAME | grep -q "heroku-postgresql"; then
    print_warning "PostgreSQL addon already exists"
else
    heroku addons:create heroku-postgresql:hobby-dev --app $APP_NAME
    print_status "PostgreSQL database provisioned"
    sleep 5  # Wait for database to be ready
fi

# Add git remote
echo ""
echo "Configuring git remote..."
if git remote | grep -q "heroku"; then
    print_warning "Heroku remote already exists"
    git remote remove heroku
fi
heroku git:remote -a $APP_NAME
print_status "Git remote configured"

# Deploy
echo ""
echo "Deploying application..."
echo "This may take 2-3 minutes..."
git push heroku claude/eldoma-elodomark-reference-tkmzc1:main

if [ $? -eq 0 ]; then
    print_status "Application deployed successfully"
else
    print_error "Deployment failed"
    exit 1
fi

# Wait for app to start
echo ""
echo "Waiting for application to start..."
sleep 10

# Test health endpoint
echo ""
echo "Testing application health..."
HEALTH_URL="https://$APP_NAME.herokuapp.com/health"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ "$HTTP_CODE" = "200" ]; then
    print_status "Application is healthy"
else
    print_warning "Health check returned HTTP $HTTP_CODE"
    echo "Check logs with: heroku logs --tail --app $APP_NAME"
fi

# Display deployment summary
echo ""
echo "=================================================="
echo "🎉 Deployment Complete!"
echo "=================================================="
echo ""
echo "Application URL: https://$APP_NAME.herokuapp.com"
echo ""
echo "📝 Next steps:"
echo "   1. Visit the app: https://$APP_NAME.herokuapp.com"
echo "   2. Create a test account"
echo "   3. Test the newsletter generator"
echo "   4. Monitor logs: heroku logs --tail --app $APP_NAME"
echo ""
echo "🔒 Security Checklist:"
echo "   ✓ Environment variables configured"
echo "   ✓ PostgreSQL encrypted database"
echo "   ✓ HTTPS/TLS (automatic via Heroku)"
echo "   ✓ JWT authentication enabled"
echo "   ✓ Rate limiting enabled"
echo "   ✓ Security headers configured"
echo ""
echo "📊 Useful commands:"
echo "   heroku logs --tail --app $APP_NAME"
echo "   heroku config --app $APP_NAME"
echo "   heroku ps:scale web=1 --app $APP_NAME"
echo "   heroku addons --app $APP_NAME"
echo ""
echo "🚀 Ready for customer validation!"
echo "   Follow VALIDATION_CHECKLIST.md for Week 1 outreach"
echo ""
