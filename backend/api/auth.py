from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr, field_validator
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid
import os
import jwt
import logging
from functools import wraps
from collections import defaultdict
import time

from backend.db import get_db
from backend.db.models import User, SubscriptionTier

logger = logging.getLogger(__name__)

# Rate limiting: track requests per IP
request_limiter = defaultdict(list)
MAX_SIGNUP_REQUESTS_PER_HOUR = 10
MAX_VERIFY_REQUESTS_PER_HOUR = 20

router = APIRouter(prefix="/auth", tags=["auth"])
JWT_SECRET = os.getenv("JWT_SECRET", "default_secret_change_in_production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

class UserSignup(BaseModel):
    email: EmailStr
    company_name: str

    @field_validator('company_name')
    def validate_company_name(cls, v):
        if len(v) < 2 or len(v) > 255:
            raise ValueError('Company name must be between 2 and 255 characters')
        # Prevent XSS by validating input
        if any(char in v for char in ['<', '>', '"', "'"]):
            raise ValueError('Company name contains invalid characters')
        return v.strip()

class UserResponse(BaseModel):
    id: str
    email: str
    company_name: str
    subscription_tier: str
    monthly_limit: int
    newsletters_generated: int
    token: str = None

class UserUpdate(BaseModel):
    company_name: str = None
    subscription_tier: SubscriptionTier = None

    @field_validator('company_name')
    def validate_company_name(cls, v):
        if v is None:
            return v
        if len(v) < 2 or len(v) > 255:
            raise ValueError('Company name must be between 2 and 255 characters')
        if any(char in v for char in ['<', '>', '"', "'"]):
            raise ValueError('Company name contains invalid characters')
        return v.strip()

def rate_limit(max_requests: int, time_window_minutes: int):
    """Rate limiting decorator"""
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            client_ip = request.client.host
            current_time = time.time()
            cutoff_time = current_time - (time_window_minutes * 60)

            # Clean up old requests
            request_limiter[client_ip] = [
                req_time for req_time in request_limiter[client_ip]
                if req_time > cutoff_time
            ]

            # Check limit
            if len(request_limiter[client_ip]) >= max_requests:
                logger.warning(f"Rate limit exceeded for IP: {client_ip}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests. Please try again later."
                )

            request_limiter[client_ip].append(current_time)
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator

def create_access_token(user_id: str) -> str:
    """Create JWT token"""
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

async def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Verify JWT token from Authorization header and return current user"""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@router.post("/signup", response_model=UserResponse)
async def signup(request: Request, user_data: UserSignup, db: Session = Depends(get_db)):
    """Sign up a new user with rate limiting"""

    # Apply rate limiting
    client_ip = request.client.host
    current_time = time.time()
    cutoff_time = current_time - (60 * 60)  # 1 hour

    request_limiter[client_ip] = [
        req_time for req_time in request_limiter[client_ip]
        if req_time > cutoff_time
    ]

    if len(request_limiter[client_ip]) >= MAX_SIGNUP_REQUESTS_PER_HOUR:
        logger.warning(f"Signup rate limit exceeded for IP: {client_ip}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many signup attempts. Please try again later."
        )

    request_limiter[client_ip].append(current_time)

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    user = User(
        id=str(uuid.uuid4()),
        email=user_data.email,
        company_name=user_data.company_name,
        subscription_tier=SubscriptionTier.STARTER,
        monthly_limit=5
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user account"
        )

    # Generate JWT token
    token = create_access_token(user.id)

    return UserResponse(
        id=user.id,
        email=user.email,
        company_name=user.company_name,
        subscription_tier=user.subscription_tier.value,
        monthly_limit=user.monthly_limit,
        newsletters_generated=user.newsletters_generated,
        token=token
    )

@router.get("/user", response_model=UserResponse)
async def get_user(current_user: User = Depends(get_current_user)):
    """Get current user profile (requires authentication)"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        company_name=current_user.company_name,
        subscription_tier=current_user.subscription_tier.value,
        monthly_limit=current_user.monthly_limit,
        newsletters_generated=current_user.newsletters_generated
    )

@router.put("/user", response_model=UserResponse)
async def update_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile (requires authentication)"""

    user = db.query(User).filter(User.id == current_user.id).first()
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

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user"
        )

    return UserResponse(
        id=user.id,
        email=user.email,
        company_name=user.company_name,
        subscription_tier=user.subscription_tier.value,
        monthly_limit=user.monthly_limit,
        newsletters_generated=user.newsletters_generated
    )

@router.post("/verify-token")
async def verify_token(request: Request, db: Session = Depends(get_db)):
    """Verify JWT token (requires bearer token in Authorization header)"""

    # Apply rate limiting to prevent token enumeration
    client_ip = request.client.host
    current_time = time.time()
    cutoff_time = current_time - (60 * 60)  # 1 hour

    key = f"verify_{client_ip}"
    request_limiter[key] = [
        req_time for req_time in request_limiter[key]
        if req_time > cutoff_time
    ]

    if len(request_limiter[key]) >= MAX_VERIFY_REQUESTS_PER_HOUR:
        logger.warning(f"Token verification rate limit exceeded for IP: {client_ip}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many verification attempts"
        )

    request_limiter[key].append(current_time)

    # Get token from Authorization header
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")

        # Verify user still exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="User not found or inactive")

        return {"valid": True, "user_id": user_id}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
