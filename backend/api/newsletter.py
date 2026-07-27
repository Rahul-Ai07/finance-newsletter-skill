from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
import json
import anthropic

from backend.db import get_db
from backend.db.models import Newsletter, User, ComplianceAudit
from backend.utils.compliance import run_compliance_audit

router = APIRouter(prefix="/newsletters", tags=["newsletters"])
client = anthropic.Anthropic()

class NewsletterRequirements(BaseModel):
    audience: str
    purpose: str
    tone: str
    objective: str
    key_content: str
    compliance_notes: str = ""

class NewsletterResponse(BaseModel):
    id: str
    generated_copy: str
    variants: dict
    compliance_status: dict
    created_at: datetime

def get_newsletter_prompt(requirements: NewsletterRequirements) -> str:
    """Generate Claude prompt from requirements"""
    return f"""You are an expert financial newsletter copywriter with deep knowledge of RBI compliance, psychological principles, and A/B testing for fintech products.

User Requirements:
- Audience: {requirements.audience}
- Purpose: {requirements.purpose}
- Tone: {requirements.tone}
- Objective: {requirements.objective}
- Key Content: {requirements.key_content}
- Compliance Notes: {requirements.compliance_notes}

Using the finance-newsletter skill framework:

1. Apply the AIDA framework (Attention → Interest → Desire → Action)
2. Use the appropriate template based on purpose
3. Generate a primary newsletter draft
4. Create 3 A/B test variants using psychological principles:
   - Variant 1 (Rational/Data-driven): Use authority, social proof, specificity
   - Variant 2 (Emotional/Aspirational): Use reciprocity, connection, aspiration
   - Variant 3 (Urgency/Direct): Use loss aversion, scarcity (only if genuine)

5. Apply RBI compliance guardrails:
   - No fabricated financial claims
   - No misleading guarantees
   - No dark patterns
   - Transparent terms and conditions references

Output as JSON with:
- primary_copy: main newsletter draft
- variants: [{{angle: string, copy: string, psychological_principles: [string]}}]
- compliance_flags: any concerns found
- email_best_practices: checklist items"""

@router.post("/generate", response_model=NewsletterResponse)
async def generate_newsletter(
    requirements: NewsletterRequirements,
    user_id: str,
    db: Session = Depends(get_db)
):
    """Generate a newsletter using the finance-newsletter skill"""

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Subscription inactive")

    # Check tier limits
    if user.newsletters_generated >= user.monthly_limit:
        raise HTTPException(
            status_code=429,
            detail=f"Monthly limit ({user.monthly_limit}) reached. Upgrade to generate more."
        )

    try:
        prompt = get_newsletter_prompt(requirements)

        message = client.messages.create(
            model="claude-opus-4-1-20250805",
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = message.content[0].text

        # Parse JSON from response
        try:
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            json_str = response_text[start_idx:end_idx]
            output = json.loads(json_str)
        except (json.JSONDecodeError, ValueError):
            output = {
                "primary_copy": response_text,
                "variants": [],
                "compliance_flags": ["Unable to parse structured output"],
                "email_best_practices": []
            }

        # Run compliance audit
        compliance_audit = run_compliance_audit(output)

        # Save to database
        newsletter_id = str(uuid.uuid4())
        newsletter = Newsletter(
            id=newsletter_id,
            user_id=user_id,
            title=f"Newsletter - {datetime.utcnow().strftime('%Y-%m-%d')}",
            template_type=requirements.purpose,
            requirements=json.dumps(requirements.dict()),
            generated_copy=output.get("primary_copy", ""),
            variants=json.dumps(output.get("variants", [])),
            compliance_status="passed" if compliance_audit["passed"] else "flagged",
            compliance_details=json.dumps(compliance_audit)
        )

        db.add(newsletter)

        # Save compliance audit
        audit = ComplianceAudit(
            id=str(uuid.uuid4()),
            newsletter_id=newsletter_id,
            user_id=user_id,
            audit_results=json.dumps(compliance_audit),
            violations=json.dumps(compliance_audit.get("violations", [])),
            passed=compliance_audit["passed"]
        )

        db.add(audit)

        # Update user usage
        user.newsletters_generated += 1
        user.updated_at = datetime.utcnow()
        db.add(user)
        db.commit()

        return NewsletterResponse(
            id=newsletter_id,
            generated_copy=output.get("primary_copy", ""),
            variants={"variants": output.get("variants", [])},
            compliance_status=compliance_audit,
            created_at=newsletter.created_at
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.get("/{newsletter_id}")
async def get_newsletter(newsletter_id: str, db: Session = Depends(get_db)):
    """Retrieve a generated newsletter"""
    newsletter = db.query(Newsletter).filter(Newsletter.id == newsletter_id).first()
    if not newsletter:
        raise HTTPException(status_code=404, detail="Newsletter not found")

    return {
        "id": newsletter.id,
        "title": newsletter.title,
        "generated_copy": newsletter.generated_copy,
        "variants": json.loads(newsletter.variants),
        "compliance_status": newsletter.compliance_status,
        "created_at": newsletter.created_at
    }

@router.get("/user/{user_id}")
async def list_user_newsletters(user_id: str, db: Session = Depends(get_db)):
    """List all newsletters for a user"""
    newsletters = db.query(Newsletter).filter(Newsletter.user_id == user_id).order_by(Newsletter.created_at.desc()).all()

    return [
        {
            "id": n.id,
            "title": n.title,
            "template_type": n.template_type,
            "compliance_status": n.compliance_status,
            "created_at": n.created_at
        }
        for n in newsletters
    ]
