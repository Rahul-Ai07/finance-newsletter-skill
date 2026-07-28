# Security Policy & Implementation Guide

## Overview

This document outlines the security measures implemented in the Premium Newsletter SaaS platform to protect user data and maintain compliance with industry best practices.

---

## 🔒 Implemented Security Controls

### 1. **Authentication & Authorization**

#### JWT Token-Based Authentication
- ✅ JWT (HS256) tokens issued upon signup
- ✅ 24-hour token expiration
- ✅ Bearer token authentication via `Authorization` header
- ✅ Token verification on all protected endpoints
- ✅ Secure token storage in browser localStorage

**Implementation:**
```python
# backend/api/auth.py
- create_access_token(): Generates JWT with expiration
- get_current_user(): Validates token and returns authenticated user
```

#### User Authorization
- ✅ Ownership verification on all resource endpoints
- ✅ Users can only access their own newsletters
- ✅ Users can only update their own profiles
- ✅ Account status verification (is_active check)

**Example:**
```python
# newsletter.py - Line 72-78
if newsletter.user_id != current_user.id:
    raise HTTPException(status_code=403, detail="Not authorized")
```

---

### 2. **Rate Limiting & DoS Protection**

#### Signup Rate Limiting
- ✅ Max 10 signup attempts per IP per hour
- ✅ Prevents account enumeration attacks
- ✅ Per-IP tracking using client.host

#### Token Verification Rate Limiting
- ✅ Max 20 verification attempts per IP per hour
- ✅ Prevents brute force token guessing
- ✅ Separate tracking from signup attempts

**Implementation:**
```python
# backend/api/auth.py - Lines 56-76
- request_limiter dict tracks requests by IP
- Timestamp-based expiration window cleanup
- HTTP 429 Too Many Requests response
```

---

### 3. **Input Validation & Sanitization**

#### Field Validation
- ✅ Email validation using pydantic EmailStr
- ✅ Company name length validation (2-255 chars)
- ✅ XSS prevention: reject HTML/special characters in strings
- ✅ String field max length enforcement (1000 chars)

**Example:**
```python
# backend/api/auth.py - Lines 31-39
@field_validator('company_name')
def validate_company_name(cls, v):
    if len(v) < 2 or len(v) > 255:
        raise ValueError(...)
    if any(char in v for char in ['<', '>', '"', "'"]):
        raise ValueError('Company name contains invalid characters')
    return v.strip()
```

#### Database Injection Prevention
- ✅ SQLAlchemy ORM prevents SQL injection
- ✅ Parameterized queries throughout
- ✅ No raw SQL strings with user input

---

### 4. **Secure Headers & CORS**

#### Security Headers (Added via middleware)
- ✅ `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- ✅ `X-XSS-Protection: 1; mode=block` - Enable XSS protection
- ✅ `X-Frame-Options: DENY` - Prevent clickjacking
- ✅ `Content-Security-Policy` - Restrict resource loading
- ✅ `Strict-Transport-Security` - HSTS (production only)
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `Permissions-Policy` - Disable unnecessary APIs

**Implementation:**
```python
# backend/api/main.py - Lines 60-87
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    # ... add all security headers
```

#### CORS Configuration
- ✅ Whitelist allowed origins via `ALLOWED_ORIGINS` env var
- ✅ Restrict methods to GET, POST, PUT, DELETE
- ✅ Only allow necessary headers (Content-Type, Authorization)
- ✅ Preflight cache (3600 seconds)

**Configuration:**
```python
# backend/api/main.py - Lines 44-52
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
CORSMiddleware(
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=3600,
)
```

---

### 5. **API Security**

#### Error Handling
- ✅ Generic error messages in production
- ✅ Detailed errors only in development
- ✅ No sensitive details exposed (API keys, database info)
- ✅ All exceptions logged server-side for debugging

**Example:**
```python
# backend/api/main.py - Lines 119-130
if os.getenv("ENVIRONMENT") == "production":
    detail = "Internal server error"  # Generic
else:
    detail = str(exc)  # Detailed
```

#### API Documentation Security
- ✅ Swagger UI disabled in production (`/docs` unavailable)
- ✅ ReDoc disabled in production (`/redoc` unavailable)
- ✅ OpenAPI schema disabled in production

**Configuration:**
```python
app = FastAPI(
    docs_url="/api/docs" if os.getenv("ENVIRONMENT") == "development" else None,
    redoc_url="/api/redoc" if os.getenv("ENVIRONMENT") == "development" else None,
)
```

#### Sensitive Data Protection
- ✅ API keys never logged
- ✅ Anthropic API errors caught and sanitized
- ✅ Database connection strings in env vars (never in code)
- ✅ JWT secret in env vars (never in code)

---

### 6. **Database Security**

#### Connection Security
- ✅ PostgreSQL over encrypted connections (Heroku default)
- ✅ No plaintext passwords in connection strings
- ✅ Environment variable-based configuration
- ✅ Support for SQLite in development only

#### Data Integrity
- ✅ Foreign key constraints via SQLAlchemy relationships
- ✅ Unique email constraint on User table
- ✅ Indexed columns for efficient querying
- ✅ Timestamps on all entities (created_at, updated_at)

---

### 7. **Frontend Security**

#### XSS Prevention
- ✅ React's built-in XSS protection (escaped by default)
- ✅ No innerHTML usage without sanitization
- ✅ Input validation before API submission

#### Secure Storage
- ✅ JWT tokens stored in localStorage (same-domain only)
- ✅ No sensitive data in cookies (CSRF-safe)
- ✅ Token cleared on logout
- ✅ Auto-logout on 401 Unauthorized

**Implementation:**
```javascript
// frontend/src/api.js - Lines 24-31
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/';  // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

#### HTTPS Enforcement
- ✅ Heroku provides automatic SSL/TLS
- ✅ HSTS header set in production
- ✅ All API requests use HTTPS in production

---

### 8. **Logging & Monitoring**

#### Request Logging
- ✅ All HTTP requests logged with method, path, client IP
- ✅ Response status logged
- ✅ Error stacktraces logged server-side only
- ✅ Rate limit violations logged as warnings

**Implementation:**
```python
# backend/api/main.py - Lines 102-108
logger.info(f"{request.method} {request.url.path} from {request.client.host}")
```

#### Security Event Logging
- ✅ Authentication failures logged
- ✅ Authorization failures logged
- ✅ Rate limit violations logged
- ✅ Invalid token attempts logged

---

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] **Environment Variables Set:**
  - [ ] `ANTHROPIC_API_KEY` - Valid API key
  - [ ] `DATABASE_URL` - PostgreSQL connection string
  - [ ] `JWT_SECRET` - 32+ character random string
  - [ ] `STRIPE_SECRET_KEY` - Stripe test/live key
  - [ ] `ALLOWED_ORIGINS` - Only trusted domains
  - [ ] `ALLOWED_HOSTS` - Only trusted hostnames
  - [ ] `ENVIRONMENT` - Set to "production"

- [ ] **Database Security:**
  - [ ] PostgreSQL database created
  - [ ] Strong password set (generated)
  - [ ] SSL connections enabled
  - [ ] Backups configured

- [ ] **API Keys Secured:**
  - [ ] API keys never in git (check git history)
  - [ ] All keys in Heroku config vars only
  - [ ] Keys rotated if ever exposed
  - [ ] Unused keys deleted

- [ ] **Heroku Configuration:**
  - [ ] Dyno type: Standard-1x (minimum)
  - [ ] Auto-scaling enabled if traffic expected
  - [ ] PostgreSQL add-on provisioned
  - [ ] Environment variables set in dashboard

- [ ] **Frontend Configuration:**
  - [ ] `REACT_APP_API_URL` points to API domain
  - [ ] Build process completes without warnings
  - [ ] No sensitive data in build artifacts

- [ ] **Monitoring:**
  - [ ] Logs accessible via `heroku logs --tail`
  - [ ] Error tracking configured (optional: Sentry)
  - [ ] Performance monitoring enabled

---

## 🚨 Security Best Practices for Operations

### Token Management
```bash
# Generate secure JWT_SECRET
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Password Security (if added in future)
- Use `passlib` with bcrypt for hashing
- Never store plaintext passwords
- Implement password reset via email tokens

### Secrets Rotation
- Rotate `JWT_SECRET` every 90 days
- Rotate API keys every 6 months
- Immediately rotate if suspected compromise

### Access Control
- Use Heroku's Collaborator features for team access
- Never share production credentials
- Use dedicated service accounts for CI/CD

### Incident Response
1. Check logs: `heroku logs --tail -p web`
2. Look for suspicious patterns (rate limiting, auth failures)
3. Rotate compromised credentials immediately
4. Review git history for exposed secrets
5. Update security groups if applicable

---

## 🔗 Dependencies & Vulnerabilities

### Key Security Dependencies
- **pyjwt** (2.13.0) - Token management
- **cryptography** (41.0.7) - Encryption support
- **sqlalchemy** (2.0.23) - ORM injection prevention
- **pydantic** (2.5.0) - Input validation

### Vulnerability Management
```bash
# Check for vulnerabilities
pip install safety
safety check

# Update all packages regularly
pip list --outdated
pip install --upgrade [package-name]
```

---

## 📞 Security Contact

For security vulnerabilities, please report privately:
- Email: security@newsletter-saas.dev (when established)
- Do not open public GitHub issues for security bugs
- Allow 48 hours for initial response

---

## Compliance & Standards

This application implements controls aligned with:
- ✅ OWASP Top 10 (2023)
- ✅ NIST Cybersecurity Framework
- ✅ RBI Digital Lending Guidelines
- ✅ Data Protection Best Practices (GDPR-ready)

---

## Future Security Enhancements

- [ ] Rate limiting service (Redis)
- [ ] Web Application Firewall (Cloudflare)
- [ ] Sentry error tracking
- [ ] Automated vulnerability scanning (Dependabot)
- [ ] IP whitelisting for API
- [ ] Two-factor authentication (2FA)
- [ ] OAuth 2.0 integration
- [ ] Encryption at rest for sensitive data
- [ ] Regular security audits
- [ ] Penetration testing (quarterly)

---

**Last Updated:** 2026-01-28  
**Version:** 1.0  
**Status:** Production Ready
