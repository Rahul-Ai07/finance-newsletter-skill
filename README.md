# Premium Newsletter SaaS

A compliance-first, psychology-tested newsletter generation platform for financial services. Built on the ArthAiQ+ finance-newsletter skill.

## Features

✨ **Core Capabilities**
- 🎯 AIDA Framework implementation (Attention → Interest → Desire → Action)
- 📊 A/B Testing with psychological principles (Rational, Emotional, Urgency)
- 🛡️ RBI Compliance guardrails built-in
- 📝 5 professional templates (Educational, Market Update, Product Announcement, Promotional, Re-engagement)
- ⚡ Anti-fabrication rules prevent misleading financial claims
- 📧 Email best practices checklist

🏢 **Subscription Tiers**
- **Starter** (₹2,000/month): 5 newsletters, basic templates, single-variant A/B testing
- **Growth** (₹5,000/month): 15 newsletters, all templates, full A/B testing, API access
- **Enterprise** (Custom): Unlimited newsletters, white-label, custom integrations

🔐 **Compliance & Security**
- RBI Digital Lending Guidelines compliance
- Fair Practices Code adherence
- Dark pattern prevention
- Transparent terms requirement
- Audit trail for all generated newsletters

## Getting Started

### Quick Start (Local Development)

1. **Clone the repository**
```bash
git clone <repo-url>
cd finance-newsletter-skill
```

2. **Set up backend**
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python -m uvicorn backend.api.main:app --reload
```

3. **Set up frontend** (coming soon)
```bash
cd frontend
npm install
npm start
```

### API Documentation

Once the backend is running:
- OpenAPI docs: `http://localhost:8000/docs`
- Full API guide: See `docs/API.md`

### Example Request

```bash
curl -X POST http://localhost:8000/newsletters/generate \
  -H "Content-Type: application/json" \
  -d '{
    "audience": "Retail investors aged 25-45",
    "purpose": "Market update",
    "tone": "Professional",
    "objective": "Weekly market insights",
    "key_content": "RBI announcements, market trends",
    "compliance_notes": "RBI Guidelines compliant"
  }' \
  -G -d "user_id=demo-user-123"
```

## Architecture

```
finance-newsletter-skill/
├── backend/
│   ├── api/
│   │   ├── main.py          # FastAPI application
│   │   ├── newsletter.py    # Newsletter generation endpoints
│   │   ├── auth.py          # User authentication
│   │   └── templates.py     # Template management
│   ├── db/
│   │   ├── models.py        # SQLAlchemy models
│   │   └── __init__.py      # Database configuration
│   └── utils/
│       └── compliance.py    # RBI compliance checking
├── frontend/                # React application (scaffolding)
├── .claude/skills/          # Claude skill definitions
│   └── finance-newsletter/  # Core skill
├── docs/
│   ├── API.md              # API documentation
│   └── DEPLOYMENT.md       # Deployment guide
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Technology Stack

**Backend**
- FastAPI - Modern Python web framework
- SQLAlchemy - ORM for database interactions
- PostgreSQL - Primary database
- Claude API - LLM for newsletter generation
- Stripe - Payment processing

**Frontend** (Coming Soon)
- React - UI framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Axios - HTTP client

## Development

### Run Tests
```bash
pytest tests/
```

### Database Migrations
```bash
alembic upgrade head
```

### Code Quality
```bash
black .
flake8 .
mypy .
```

## Deployment

See `docs/DEPLOYMENT.md` for:
- Local development setup
- Docker containerization
- Cloud deployment (AWS, GCP, Heroku)
- Monitoring and scaling

## Roadmap

**Phase 1 (Current)**: MVP Backend
- [x] Newsletter generation API
- [x] Compliance audit system
- [x] User authentication
- [x] Template management
- [ ] Frontend editor interface
- [ ] Stripe payment integration

**Phase 2 (Months 4-6)**: Scale Features
- [ ] Performance analytics
- [ ] Email provider integrations (HubSpot, Braze)
- [ ] White-label API
- [ ] Benchmarking dashboard

**Phase 3**: Advanced Features
- [ ] AI-powered variant optimization
- [ ] Regulatory compliance certification
- [ ] Custom integration SDK

## API Endpoints

### Authentication
- `POST /auth/signup` - Create account
- `GET /auth/user/{id}` - Get profile
- `PUT /auth/user/{id}` - Update profile

### Newsletters
- `POST /newsletters/generate` - Generate newsletter
- `GET /newsletters/{id}` - Get newsletter
- `GET /newsletters/user/{id}` - List user newsletters

### Templates
- `GET /templates/` - List templates
- `GET /templates/{id}` - Get template
- `GET /templates/search/{query}` - Search templates

### Health
- `GET /health` - Health check
- `GET /` - API info

## Compliance

This platform enforces RBI compliance for:
- Digital Lending Guidelines
- Fair Practices Code
- Circular on Structured Digital Assets
- Consumer Protection requirements

All generated newsletters are automatically audited against these guardrails.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Proprietary - ArthAiQ+ Finance Newsletter SaaS

## Support

For issues, questions, or feedback:
- GitHub Issues: <repo-url>/issues
- Documentation: See `docs/` directory
- API Docs: `http://localhost:8000/docs`

---

**Built with ❤️ for financial services compliance**
