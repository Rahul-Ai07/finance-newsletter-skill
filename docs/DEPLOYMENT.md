# Deployment Guide

## Local Development Setup

### Prerequisites
- Python 3.9+
- PostgreSQL 12+
- Node.js 16+ (for frontend)
- pip, virtualenv

### Backend Setup

1. **Clone the repository**
```bash
git clone <repo-url>
cd finance-newsletter-skill
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up database**
```bash
# Create .env file from example
cp .env.example .env

# Edit .env with your database credentials
# Then create database and run migrations
psql -U postgres -c "CREATE DATABASE newsletter_saas;"
```

5. **Run migrations** (if using Alembic)
```bash
# Tables are created automatically via SQLAlchemy in main.py
# For production, use Alembic for version control
```

6. **Start backend server**
```bash
python -m uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8000
```

Server runs at: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## Docker Deployment

### Build Backend Image

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build and Run

```bash
# Build image
docker build -t newsletter-saas:latest .

# Run container with environment variables
docker run -d \
  -e DATABASE_URL="postgresql://user:pass@db:5432/newsletter_saas" \
  -e ANTHROPIC_API_KEY="your_key" \
  -e STRIPE_SECRET_KEY="your_key" \
  -p 8000:8000 \
  --name newsletter-api \
  newsletter-saas:latest
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: newsletter_saas
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/newsletter_saas
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
    depends_on:
      - db
    command: uvicorn backend.api.main:app --host 0.0.0.0 --port 8000

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:8000

volumes:
  db_data:
```

Run with: `docker-compose up`

---

## Cloud Deployment (AWS/GCP/Heroku)

### Heroku Deployment

1. **Install Heroku CLI**
```bash
brew tap heroku/brew && brew install heroku
```

2. **Create Heroku app**
```bash
heroku create newsletter-saas-prod
heroku addons:create heroku-postgresql:standard-0
```

3. **Set environment variables**
```bash
heroku config:set ANTHROPIC_API_KEY="your_key"
heroku config:set STRIPE_SECRET_KEY="your_key"
```

4. **Add Procfile**
```
web: uvicorn backend.api.main:app --host 0.0.0.0 --port $PORT
```

5. **Deploy**
```bash
git push heroku main
```

### AWS ECS Deployment

1. **Push to ECR**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

docker tag newsletter-saas:latest <account>.dkr.ecr.us-east-1.amazonaws.com/newsletter-saas:latest

docker push <account>.dkr.ecr.us-east-1.amazonaws.com/newsletter-saas:latest
```

2. **Create ECS Task Definition** (use the ECR image URL)

3. **Create ECS Service** with load balancer (ALB)

4. **RDS Database** - Create PostgreSQL database instance

5. **Secrets Manager** - Store API keys securely

---

## Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `ANTHROPIC_API_KEY` - Anthropic API key
- `STRIPE_SECRET_KEY` - Stripe API key

**Optional:**
- `ALLOWED_ORIGINS` - CORS origins (default: localhost)
- `ENVIRONMENT` - Environment type (development/production)
- `DEBUG` - Debug mode (True/False)
- `LOG_LEVEL` - Logging level (DEBUG/INFO/WARNING/ERROR)

---

## Database Migrations (Using Alembic)

```bash
# Install Alembic
pip install alembic

# Initialize migrations
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial schema"

# Apply migrations
alembic upgrade head
```

---

## Monitoring & Logging

### Application Logging
- Logs to stdout/stderr (collected by Docker/cloud platform)
- Structured logging recommended for production

### Monitoring
- Health check endpoint: `GET /health`
- Application metrics: Use Prometheus + Grafana
- Database performance: Use PostgreSQL monitoring tools

### Error Tracking
- Sentry integration (recommended)
```python
import sentry_sdk
sentry_sdk.init("https://...@sentry.io/...")
```

---

## Production Checklist

- [ ] Database backups configured
- [ ] API rate limiting enabled
- [ ] HTTPS/TLS configured
- [ ] CORS properly restricted
- [ ] Secret keys rotated
- [ ] Monitoring and alerting set up
- [ ] Error tracking configured
- [ ] Database migrations tested
- [ ] Load balancer health checks configured
- [ ] Auto-scaling configured
- [ ] Logs centralized
- [ ] Database connection pooling tuned
- [ ] API documentation updated
- [ ] Disaster recovery plan documented

---

## Scaling Considerations

### Database
- Use read replicas for scaled reads
- Connection pooling with PgBouncer
- Query optimization and indexing

### Application
- Horizontal scaling behind load balancer
- Cache layer (Redis) for frequently accessed data
- Background job queue (Celery) for async tasks

### API
- CDN for static assets
- API gateway for rate limiting
- Request queuing for burst traffic
