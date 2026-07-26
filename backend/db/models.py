from sqlalchemy import Column, String, Integer, DateTime, Boolean, Enum as SQLEnum, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class SubscriptionTier(str, enum.Enum):
    STARTER = "starter"
    GROWTH = "growth"
    ENTERPRISE = "enterprise"

class Newsletter(Base):
    __tablename__ = "newsletters"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    title = Column(String)
    template_type = Column(String)
    requirements = Column(Text)
    generated_copy = Column(Text)
    variants = Column(Text)  # JSON stored as text
    compliance_status = Column(String, default="pending")
    compliance_details = Column(Text)  # JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    company_name = Column(String)
    subscription_tier = Column(SQLEnum(SubscriptionTier), default=SubscriptionTier.STARTER)
    stripe_customer_id = Column(String, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    monthly_limit = Column(Integer, default=5)
    newsletters_generated = Column(Integer, default=0)
    reset_date = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Template(Base):
    __tablename__ = "templates"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    template_type = Column(String)  # educational-digest, market-update, etc.
    description = Column(Text)
    content = Column(Text)
    use_cases = Column(Text)  # JSON array
    created_at = Column(DateTime, default=datetime.utcnow)

class ComplianceAudit(Base):
    __tablename__ = "compliance_audits"

    id = Column(String, primary_key=True, index=True)
    newsletter_id = Column(String, index=True)
    user_id = Column(String, index=True)
    audit_results = Column(Text)  # JSON
    violations = Column(Text)  # JSON array
    passed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
