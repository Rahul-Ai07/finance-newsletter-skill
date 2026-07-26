# Premium Newsletter SaaS API Documentation

## Overview
This API powers the Premium Newsletter SaaS platform, providing endpoints for newsletter generation, compliance auditing, template management, and user account management.

**Base URL**: `http://localhost:8000/api/v1` (or your deployment URL)

## Authentication
Currently using simple user_id based authentication. For production, implement OAuth 2.0 or JWT tokens.

## Endpoints

### Health & Info
- `GET /health` - Health check
- `GET /` - API information

### Authentication & Users
- `POST /auth/signup` - Create new user account
- `GET /auth/user/{user_id}` - Get user profile
- `PUT /auth/user/{user_id}` - Update user profile
- `POST /auth/verify-token` - Verify JWT token

### Newsletters
- `POST /newsletters/generate` - Generate a new newsletter
  - Request body: `NewsletterRequirements`
  - Returns: `NewsletterResponse` with generated copy, variants, compliance status
  
- `GET /newsletters/{newsletter_id}` - Retrieve a specific newsletter
  
- `GET /newsletters/user/{user_id}` - List all newsletters for a user

### Templates
- `GET /templates/` - List all available templates
- `GET /templates/{template_id}` - Get template details
- `GET /templates/search/{query}` - Search templates

## Request/Response Models

### NewsletterRequirements
```json
{
  "audience": "Retail investors aged 25-45",
  "purpose": "Market update and investment insights",
  "tone": "Professional yet approachable",
  "objective": "Weekly market trends and actionable insights",
  "key_content": "RBI rate decisions, market volatility, portfolio recommendations",
  "compliance_notes": "RBI Digital Lending Guidelines compliant"
}
```

### NewsletterResponse
```json
{
  "id": "uuid",
  "generated_copy": "Email newsletter content...",
  "variants": {
    "variants": [
      {
        "angle": "Rational/Data-driven",
        "copy": "Variant copy...",
        "psychological_principles": ["Authority", "Social Proof"]
      }
    ]
  },
  "compliance_status": {
    "passed": true,
    "violations": [],
    "warnings": [],
    "summary": { ... }
  },
  "created_at": "2024-01-15T10:30:00"
}
```

### UserSignup
```json
{
  "email": "user@company.com",
  "company_name": "FinTech Corp"
}
```

## Subscription Tiers & Limits

| Tier | Monthly Cost | Newsletters/Month | Features |
|------|-------------|------------------|----------|
| Starter | ₹2,000 | 5 | Basic templates, single-variant A/B testing |
| Growth | ₹5,000 | 15 | All templates, full A/B testing, API access |
| Enterprise | Custom | Unlimited | White-label, custom integrations, dedicated support |

## Error Handling

All errors return JSON with status code and detail:

```json
{
  "detail": "Error message"
}
```

Common error codes:
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden (e.g., subscription inactive)
- `404` - Not found
- `429` - Too many requests (tier limit reached)
- `500` - Internal server error

## Rate Limiting

Rate limits apply based on subscription tier:
- **Starter**: 5 requests/month for newsletter generation
- **Growth**: 15 requests/month for newsletter generation
- **Enterprise**: Unlimited

## Examples

### Generate Newsletter
```bash
curl -X POST http://localhost:8000/newsletters/generate \
  -H "Content-Type: application/json" \
  -d '{
    "audience": "Retail investors",
    "purpose": "Market update",
    "tone": "Professional",
    "objective": "Weekly insights",
    "key_content": "Market trends"
  }' \
  -G -d "user_id=user-123"
```

### Get User Profile
```bash
curl -X GET http://localhost:8000/auth/user/user-123
```

### List Templates
```bash
curl -X GET http://localhost:8000/templates/
```

## Webhook Events (Future)
- `newsletter.generated` - Newsletter generated successfully
- `newsletter.compliance_failed` - Compliance audit failed
- `user.subscription_changed` - User subscription tier changed

## Rate Limit Headers
```
X-RateLimit-Limit: 15
X-RateLimit-Remaining: 10
X-RateLimit-Reset: 1705316400
```
