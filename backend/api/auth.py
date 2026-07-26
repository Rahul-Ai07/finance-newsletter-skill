from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
import os

from backend.db import get_db
from backend.db.models import User, SubscriptionTier

router = APIRouter(prefix="/auth", tags=["auth"])

class UserSignup(BaseModel):
    email: EmailStr
    company_name: str

class UserResponse(BaseModel):
    id: str
    email: str
    company_name: str
    subscription_tier: str
    monthly_limit: int
    newsletters_generated: int

class UserUpdate(BaseModel):
    company_name: str = None
    subscription_tier: SubscriptionTier = None

@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """Sign up a new user"""

    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user = User(
        id=str(uuid.uuid4()),
        email=user_data.email,
        company_name=user_data.company_name,
        subscription_tier=SubscriptionTier.STARTER,
        monthly_limit=5
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        email=user.email,
        company_name=user.company_name,
        subscription_tier=user.subscription_tier.value,
        monthly_limit=user.monthly_limit,
        newsletters_generated=user.newsletters_generated
    )

@router.get("/user/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: Session = Depends(get_db)):
    """Get user profile"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=user.id,
        email=user.email,
        company_name=user.company_name,
        subscription_tier=user.subscription_tier.value,
        monthly_limit=user.monthly_limit,
        newsletters_generated=user.newsletters_generated
    )

@router.put("/user/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_data: UserUpdate, db: Session = Depends(get_db)):
    """Update user profile"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_data.company_name:
        user.company_name = user_data.company_name

    if user_data.subscription_tier:
        user.subscription_tier = user_data.subscription_tier
        # Update monthly limits based on tier
        tier_limits = {
            SubscriptionTier.STARTER: 5,
            SubscriptionTier.GROWTH: 15,
            SubscriptionTier.ENTERPRISE: 999999
        }
        user.monthly_limit = tier_limits.get(user_data.subscription_tier, 5)

    user.updated_at = datetime.utcnow()
    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        email=user.email,
        company_name=user.company_name,
        subscription_tier=user.subscription_tier.value,
        monthly_limit=user.monthly_limit,
        newsletters_generated=user.newsletters_generated
    )

@router.post("/verify-token")
async def verify_token(token: str):
    """Verify JWT token (mock implementation)"""
    # In production, verify JWT token properly
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {"valid": True, "token": token}
