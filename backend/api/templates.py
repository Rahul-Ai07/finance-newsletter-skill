from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

from backend.db import get_db
from backend.db.models import Template

router = APIRouter(prefix="/templates", tags=["templates"])

class TemplateResponse(BaseModel):
    id: str
    name: str
    template_type: str
    description: str
    use_cases: list

# Pre-defined templates from the finance-newsletter skill
PREDEFINED_TEMPLATES = [
    {
        "id": "educational-digest",
        "name": "Educational Digest",
        "template_type": "educational-digest",
        "description": "Share thought leadership and educational content to establish authority",
        "use_cases": ["Building trust", "Establishing expertise", "Long-term audience engagement"],
        "best_for": "Financial literacy, investment education, market insights"
    },
    {
        "id": "market-update",
        "name": "Market Update",
        "template_type": "market-update",
        "description": "Weekly/monthly market recaps and trend analysis",
        "use_cases": ["Timely market information", "Competitive positioning", "Recurring engagement"],
        "best_for": "Weekly newsletters, market recaps, trend analysis"
    },
    {
        "id": "product-announcement",
        "name": "Product Announcement",
        "template_type": "product-announcement",
        "description": "Launch announcements for new products or features",
        "use_cases": ["Product launches", "Feature announcements", "Customer updates"],
        "best_for": "New features, product launches, capability announcements"
    },
    {
        "id": "promotional",
        "name": "Promotional",
        "template_type": "promotional",
        "description": "Promotional offers, campaigns, and calls-to-action",
        "use_cases": ["Offers and incentives", "User acquisition", "Conversion focus"],
        "best_for": "Special offers, promotions, limited-time campaigns"
    },
    {
        "id": "re-engagement",
        "name": "Re-engagement",
        "template_type": "re-engagement",
        "description": "Win-back campaigns for inactive users",
        "use_cases": ["Reactivation", "Churn prevention", "Audience retention"],
        "best_for": "Inactive user recovery, win-back campaigns"
    }
]

@router.get("/", response_model=list[TemplateResponse])
async def list_templates():
    """List all available templates"""
    return [
        TemplateResponse(
            id=t["id"],
            name=t["name"],
            template_type=t["template_type"],
            description=t["description"],
            use_cases=t.get("use_cases", [])
        )
        for t in PREDEFINED_TEMPLATES
    ]

@router.get("/{template_id}")
async def get_template(template_id: str):
    """Get a specific template"""
    template = next(
        (t for t in PREDEFINED_TEMPLATES if t["id"] == template_id),
        None
    )

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    return {
        "id": template["id"],
        "name": template["name"],
        "template_type": template["template_type"],
        "description": template["description"],
        "use_cases": template.get("use_cases", []),
        "best_for": template.get("best_for", "")
    }

@router.get("/search/{query}")
async def search_templates(query: str):
    """Search templates by name or description"""
    query_lower = query.lower()
    results = [
        t for t in PREDEFINED_TEMPLATES
        if query_lower in t["name"].lower() or query_lower in t["description"].lower()
    ]

    return [
        TemplateResponse(
            id=t["id"],
            name=t["name"],
            template_type=t["template_type"],
            description=t["description"],
            use_cases=t.get("use_cases", [])
        )
        for t in results
    ]
