# Testing Guide

Complete guide to testing the Premium Newsletter SaaS.

## Test Suite Overview

We have comprehensive tests for:
- User authentication and profile management
- Newsletter generation
- Compliance auditing
- Template management
- Subscription tier limits
- Database models

---

## Running Tests

### Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Install additional test dependencies
pip install pytest pytest-asyncio pytest-cov
```

### Run All Tests

```bash
pytest tests/ -v
```

Output shows:
- ✓ passed tests
- ✗ failed tests
- ⊗ skipped tests
- Execution time

### Run Specific Test File

```bash
pytest tests/test_api.py -v
```

### Run Specific Test Class

```bash
pytest tests/test_api.py::TestAuth -v
```

### Run Specific Test

```bash
pytest tests/test_api.py::TestAuth::test_signup_new_user -v
```

### Run with Coverage Report

```bash
pytest tests/ --cov=backend --cov-report=html

# Open report
open htmlcov/index.html
```

---

## Test Coverage

### Authentication Tests

**File**: `tests/test_api.py::TestAuth`

- `test_signup_new_user` - Create new user account
- `test_signup_duplicate_email` - Reject duplicate emails
- `test_get_user_profile` - Retrieve user profile
- `test_update_user_profile` - Update profile information
- `test_upgrade_subscription` - Change subscription tier

**Coverage**: User signup flow, profile management, tier upgrades

### Newsletter Generation Tests

**File**: `tests/test_api.py::TestNewsletterGeneration`

- `test_generate_newsletter_success` - Generate valid newsletter
- `test_generate_newsletter_user_not_found` - Handle missing user
- `test_newsletter_tier_limit` - Enforce tier limits
- `test_get_newsletter` - Retrieve generated newsletter
- `test_list_user_newsletters` - List user's newsletters

**Coverage**: Newsletter generation, retrieval, tier limits

### Template Tests

**File**: `tests/test_api.py::TestTemplates`

- `test_list_templates` - List all templates
- `test_get_template` - Get specific template
- `test_get_nonexistent_template` - Handle missing template
- `test_search_templates` - Search templates by keyword

**Coverage**: Template management and retrieval

### Health Tests

**File**: `tests/test_api.py::TestHealth`

- `test_health_check` - Health endpoint
- `test_root_endpoint` - Root endpoint info

**Coverage**: Basic API health

---

## Manual Testing

### Using Postman

1. **Import API Collection**
   ```
   File → Import → Select docs/API.md
   ```

2. **Set Variables**
   - `base_url`: http://localhost:8000
   - `user_id`: (from signup response)

3. **Test Endpoints**
   - Start with `POST /auth/signup`
   - Use returned `id` for subsequent requests

### Using cURL

#### 1. Sign Up

```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "company_name": "Test Company"
  }'

# Response:
# {
#   "id": "user-123",
#   "email": "test@example.com",
#   "subscription_tier": "starter",
#   "monthly_limit": 5,
#   ...
# }
```

Save the `id` as `USER_ID`:

```bash
USER_ID="user-123"
```

#### 2. Generate Newsletter

```bash
curl -X POST "http://localhost:8000/newsletters/generate?user_id=$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "audience": "Retail investors",
    "purpose": "market-update",
    "tone": "Professional",
    "objective": "Weekly market trends",
    "key_content": "Market analysis, economic indicators"
  }'
```

#### 3. List Newsletters

```bash
curl http://localhost:8000/newsletters/user/$USER_ID
```

#### 4. Get Newsletter Details

```bash
NEWSLETTER_ID="newsletter-123"  # From generation response
curl http://localhost:8000/newsletters/$NEWSLETTER_ID
```

#### 5. List Templates

```bash
curl http://localhost:8000/templates/
```

#### 6. Search Templates

```bash
curl http://localhost:8000/templates/search/market
```

---

## Frontend Testing

### Manual Testing Checklist

**Signup Flow**
- [ ] Load signup page
- [ ] Enter email and company name
- [ ] Click signup button
- [ ] Redirected to dashboard
- [ ] User info displayed in dashboard

**Dashboard**
- [ ] Display user profile info
- [ ] Show monthly usage stats
- [ ] Display recent newsletters
- [ ] Show upgrade options
- [ ] Navigation links work

**Newsletter Editor**
- [ ] Select template/purpose
- [ ] Fill in form fields
- [ ] Preview before generation
- [ ] Generate newsletter works
- [ ] Display results correctly

**Newsletter View**
- [ ] Display full newsletter
- [ ] Show A/B variants
- [ ] Display compliance status
- [ ] Copy buttons work
- [ ] Tab navigation works

**Responsive Design**
- [ ] Works on desktop (1920px)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (375px)
- [ ] No horizontal scrolling
- [ ] Touch-friendly buttons

### Browser Testing

Test on:
- ✓ Chrome (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Edge (latest)
- ✓ Mobile Safari (iOS)
- ✓ Chrome Mobile (Android)

### Performance Testing

```bash
# Measure API response times
ab -n 100 -c 10 http://localhost:8000/health

# Load test newsletter generation
ab -n 100 -c 5 -p req.json -T application/json \
  "http://localhost:8000/newsletters/generate?user_id=test"
```

---

## Compliance Audit Testing

### Test Scenarios

**Scenario 1: Pass All Checks**
```json
{
  "audience": "Retail investors",
  "purpose": "market-update",
  "tone": "Professional",
  "objective": "Educational content",
  "key_content": "Market trends with proper disclaimers"
}
```

**Scenario 2: Flag Guaranteed Returns**
```json
{
  "key_content": "Our guaranteed returns of 10% annually..."
}
```

**Scenario 3: Flag Dark Patterns**
```json
{
  "key_content": "Limited time offer only today, guaranteed to end!"
}
```

**Scenario 4: Flag Misleading Claims**
```json
{
  "key_content": "Risk-free investment opportunity"
}
```

### Verify Compliance Results

Check response for:
- `compliance_status.passed` (boolean)
- `compliance_status.violations` (array)
- `compliance_status.warnings` (array)
- `compliance_status.summary` (counts)

---

## Tier Limit Testing

### Test Monthly Limits

```bash
# Create starter user
curl -X POST http://localhost:8000/auth/signup \
  -d '{"email":"test1@example.com","company_name":"Test"}'

# Generate 5 newsletters (starter limit)
for i in {1..5}; do
  curl -X POST "http://localhost:8000/newsletters/generate?user_id=$USER_ID" \
    -d '{...}' > /dev/null
done

# 6th attempt should return 429 (rate limit)
curl -X POST "http://localhost:8000/newsletters/generate?user_id=$USER_ID" \
  -d '{...}'
# Should return: "Monthly limit (5) reached"
```

### Upgrade Tier

```bash
curl -X PUT "http://localhost:8000/auth/user/$USER_ID" \
  -d '{"subscription_tier":"growth"}'

# Now should allow 15 newsletters
```

---

## Database Testing

### Check Test Database

```bash
# Tests use SQLite by default (no setup needed)
# Database file: test.db (auto-cleaned between tests)

# To use PostgreSQL for tests:
# Modify tests/test_api.py:
# TEST_DATABASE_URL = "postgresql://user:pass@localhost/test_db"
```

### Verify Data Persistence

```python
# Test example
def test_newsletter_saved():
    # Generate newsletter
    response = client.post("/newsletters/generate?user_id=123", {...})
    
    # Verify saved in DB
    db = TestingSessionLocal()
    newsletter = db.query(Newsletter).filter(...).first()
    assert newsletter.id == response.json()["id"]
    db.close()
```

---

## CI/CD Testing

### GitHub Actions

Create `.github/workflows/tests.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest tests/ -v --cov=backend
```

---

## Debugging Tests

### Verbose Output

```bash
pytest tests/ -vv  # Extra verbose
pytest tests/ -s   # Show print statements
```

### Stop on First Failure

```bash
pytest tests/ -x  # Stop at first failure
pytest tests/ -x -v  # Stop and show details
```

### Run Specific Markers

```bash
# Mark slow tests
@pytest.mark.slow
def test_slow_operation():
    pass

# Run only slow tests
pytest tests/ -m slow

# Skip slow tests
pytest tests/ -m "not slow"
```

### Debug with Print Statements

```bash
pytest tests/test_api.py::TestAuth::test_signup_new_user -s
```

The `-s` flag shows all `print()` output.

---

## Test Coverage Goals

| Component | Current | Target |
|-----------|---------|--------|
| API Endpoints | 95% | 95%+ |
| Database Models | 100% | 100% |
| Compliance Logic | 90% | 95%+ |
| Auth Flow | 100% | 100% |
| Error Handling | 85% | 90%+ |

---

## Common Issues

### Tests Hang

**Symptom**: Tests don't complete, stuck waiting

**Fix**:
```bash
# Cancel with timeout
pytest tests/ --timeout=30

# Or kill process
pkill -f pytest
```

### Database Locked

**Symptom**: "Database is locked" error

**Fix**:
```bash
# Remove test database
rm test.db

# Re-run tests
pytest tests/
```

### Import Errors

**Symptom**: "No module named 'backend'"

**Fix**:
```bash
# Ensure backend is importable
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
pytest tests/
```

---

## Next Steps

1. Run full test suite: `pytest tests/ -v`
2. Check coverage: `pytest tests/ --cov=backend`
3. Test locally: Manual browser testing
4. Deploy: Use CI/CD for automated testing

For more details, see `QUICKSTART.md` and `DEPLOYMENT.md`.
