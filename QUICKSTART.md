# Quick Start Guide

Get the Premium Newsletter SaaS running locally in 10 minutes.

## Prerequisites

- Docker & Docker Compose (easiest), OR
- Python 3.9+, Node.js 16+, PostgreSQL 12+
- Git

---

## Option A: Docker (Recommended - 5 minutes)

### 1. Start Services

```bash
# Clone and navigate to repo
git clone <repo-url>
cd finance-newsletter-skill

# Set environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Start all services
docker-compose up
```

This starts:
- **Backend API**: http://localhost:8000
- **Database**: PostgreSQL on localhost:5432
- **API Docs**: http://localhost:8000/docs

### 2. Open Frontend

In a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:3000

### 3. Test the App

1. Go to http://localhost:3000
2. Sign up with email + company name
3. Click "Create Newsletter"
4. Fill in the form
5. Generate and see results!

---

## Option B: Local Development (Manual Setup - 10 minutes)

### 1. Install Dependencies

```bash
# Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
cd ..
```

### 2. Setup Database

```bash
# Create PostgreSQL database
psql -U postgres
postgres=# CREATE DATABASE newsletter_saas;
postgres=# \q
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/newsletter_saas
ANTHROPIC_API_KEY=your_api_key_here
```

### 4. Run Backend

```bash
python -m uvicorn backend.api.main:app --reload --port 8000
```

Backend runs at: http://localhost:8000

### 5. Run Frontend (New Terminal)

```bash
cd frontend
npm start
```

Frontend runs at: http://localhost:3000

---

## Running Tests

### Unit Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_api.py -v

# Run with coverage
pytest tests/ --cov=backend --cov-report=html
```

### Manual API Testing

Using curl or Postman:

```bash
# 1. Sign up
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","company_name":"Test Corp"}'

# Response includes user ID

# 2. Generate newsletter
curl -X POST "http://localhost:8000/newsletters/generate?user_id=YOUR_USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "audience": "Retail investors",
    "purpose": "market-update",
    "tone": "Professional",
    "objective": "Weekly market update",
    "key_content": "Market trends and analysis"
  }'

# 3. View API docs
# Open: http://localhost:8000/docs
```

---

## Project Structure

```
finance-newsletter-skill/
├── backend/
│   ├── api/              # FastAPI endpoints
│   │   ├── main.py       # Main application
│   │   ├── newsletter.py # Newsletter generation
│   │   ├── auth.py       # User authentication
│   │   └── templates.py  # Template management
│   ├── db/               # Database
│   │   ├── models.py     # SQLAlchemy models
│   │   └── __init__.py   # Database setup
│   └── utils/
│       └── compliance.py # RBI compliance checker
├── frontend/
│   ├── public/           # Static files
│   ├── src/
│   │   ├── pages/        # React pages
│   │   ├── styles/       # CSS files
│   │   ├── api.js        # API client
│   │   └── App.js        # Main App
│   └── package.json
├── tests/                # Test suite
├── docs/                 # Documentation
├── requirements.txt      # Python deps
├── docker-compose.yml    # Docker setup
├── Dockerfile            # Backend image
└── README.md             # Project overview
```

---

## Troubleshooting

### Database Connection Error

```
Error: could not connect to server
```

**Fix:** Ensure PostgreSQL is running and DATABASE_URL is correct

```bash
psql -U postgres -d newsletter_saas -c "SELECT 1"
```

### Port Already in Use

```
Address already in use
```

**Fix:** Change port or kill process

```bash
# Backend
lsof -i :8000
kill -9 <PID>

# Frontend
lsof -i :3000
kill -9 <PID>
```

### Missing ANTHROPIC_API_KEY

```
Error: ANTHROPIC_API_KEY not found
```

**Fix:** Add key to .env file

```bash
echo "ANTHROPIC_API_KEY=sk_..." >> .env
```

### Frontend Can't Connect to API

```
Error: Failed to fetch
```

**Fix:** Ensure backend is running and CORS is configured

```bash
# Verify backend
curl http://localhost:8000/health

# Check frontend .env if using custom URL
cat frontend/.env.local
```

---

## Next Steps

1. **Explore the API**: http://localhost:8000/docs
2. **Run the tests**: `pytest tests/ -v`
3. **Try generating newsletters**: Use the web UI at http://localhost:3000
4. **Check compliance**: Review audit results in newsletter details
5. **Read docs**: See `docs/API.md` and `docs/DEPLOYMENT.md`

---

## Common Commands

```bash
# Start everything (Docker)
docker-compose up

# Stop everything
docker-compose down

# View logs
docker-compose logs -f api
docker-compose logs -f db

# Run tests
pytest tests/ -v

# Format code
black .

# Check types
mypy backend/

# Start backend (local)
python -m uvicorn backend.api.main:app --reload

# Start frontend (local)
cd frontend && npm start

# View API docs
open http://localhost:8000/docs
```

---

## Support

- **API Issues**: Check http://localhost:8000/docs
- **Database Issues**: See `docs/DEPLOYMENT.md`
- **Frontend Issues**: Check browser console (F12)
- **Test Failures**: Run with `-v` flag for verbose output

Happy building! 🚀
