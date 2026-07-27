import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import json

from backend.api.main import app
from backend.db.models import Base, User, SubscriptionTier
from backend.db import get_db

# Test database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_and_teardown():
    """Setup and teardown for each test"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

class TestHealth:
    def test_health_check(self):
        """Test health endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        assert "name" in response.json()

class TestAuth:
    def test_signup_new_user(self):
        """Test user signup"""
        response = client.post("/auth/signup", json={
            "email": "test@example.com",
            "company_name": "Test Corp"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["company_name"] == "Test Corp"
        assert data["subscription_tier"] == "starter"
        assert data["monthly_limit"] == 5

    def test_signup_duplicate_email(self):
        """Test duplicate email rejection"""
        # Create first user
        client.post("/auth/signup", json={
            "email": "duplicate@example.com",
            "company_name": "First Corp"
        })

        # Try to create with same email
        response = client.post("/auth/signup", json={
            "email": "duplicate@example.com",
            "company_name": "Second Corp"
        })
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"]

    def test_get_user_profile(self):
        """Test get user profile"""
        # Create user
        signup_response = client.post("/auth/signup", json={
            "email": "profile@example.com",
            "company_name": "Profile Corp"
        })
        user_id = signup_response.json()["id"]

        # Get profile
        response = client.get(f"/auth/user/{user_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "profile@example.com"
        assert data["company_name"] == "Profile Corp"

    def test_update_user_profile(self):
        """Test update user profile"""
        # Create user
        signup_response = client.post("/auth/signup", json={
            "email": "update@example.com",
            "company_name": "Original Corp"
        })
        user_id = signup_response.json()["id"]

        # Update profile
        response = client.put(f"/auth/user/{user_id}", json={
            "company_name": "Updated Corp"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["company_name"] == "Updated Corp"

    def test_upgrade_subscription(self):
        """Test subscription tier upgrade"""
        # Create user
        signup_response = client.post("/auth/signup", json={
            "email": "upgrade@example.com",
            "company_name": "Growth Corp"
        })
        user_id = signup_response.json()["id"]

        # Upgrade to Growth
        response = client.put(f"/auth/user/{user_id}", json={
            "subscription_tier": "growth"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["subscription_tier"] == "growth"
        assert data["monthly_limit"] == 15

class TestTemplates:
    def test_list_templates(self):
        """Test list templates"""
        response = client.get("/templates/")
        assert response.status_code == 200
        templates = response.json()
        assert len(templates) == 5
        assert any(t["name"] == "Educational Digest" for t in templates)

    def test_get_template(self):
        """Test get specific template"""
        response = client.get("/templates/educational-digest")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "educational-digest"
        assert data["name"] == "Educational Digest"

    def test_get_nonexistent_template(self):
        """Test get non-existent template"""
        response = client.get("/templates/nonexistent")
        assert response.status_code == 404

    def test_search_templates(self):
        """Test search templates"""
        response = client.get("/templates/search/market")
        assert response.status_code == 200
        results = response.json()
        assert len(results) > 0
        assert any("Market" in t["name"] for t in results)

class TestNewsletterGeneration:
    def test_generate_newsletter_success(self):
        """Test successful newsletter generation"""
        # Create user
        signup_response = client.post("/auth/signup", json={
            "email": "newsletter@example.com",
            "company_name": "Newsletter Corp"
        })
        user_id = signup_response.json()["id"]

        # Generate newsletter
        response = client.post(
            "/newsletters/generate?user_id=" + user_id,
            json={
                "audience": "Retail investors aged 25-45",
                "purpose": "Market update",
                "tone": "Professional",
                "objective": "Weekly market insights",
                "key_content": "Market trends and analysis",
                "compliance_notes": "RBI compliant"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "generated_copy" in data
        assert "variants" in data
        assert "compliance_status" in data

    def test_generate_newsletter_user_not_found(self):
        """Test newsletter generation for non-existent user"""
        response = client.post(
            "/newsletters/generate?user_id=nonexistent",
            json={
                "audience": "Test",
                "purpose": "Test",
                "tone": "Test",
                "objective": "Test",
                "key_content": "Test"
            }
        )
        assert response.status_code == 404

    def test_newsletter_tier_limit(self):
        """Test tier-based limit enforcement"""
        # Create starter user (5 limit)
        signup_response = client.post("/auth/signup", json={
            "email": "limit@example.com",
            "company_name": "Limit Corp"
        })
        user_id = signup_response.json()["id"]

        # Try to exceed limit (mock by setting to 0)
        db = TestingSessionLocal()
        user = db.query(User).filter(User.id == user_id).first()
        user.newsletters_generated = 5
        user.monthly_limit = 5
        db.commit()
        db.close()

        # Should fail
        response = client.post(
            "/newsletters/generate?user_id=" + user_id,
            json={
                "audience": "Test",
                "purpose": "Test",
                "tone": "Test",
                "objective": "Test",
                "key_content": "Test"
            }
        )
        assert response.status_code == 429

    def test_get_newsletter(self):
        """Test retrieve generated newsletter"""
        # Create user and generate newsletter
        signup_response = client.post("/auth/signup", json={
            "email": "retrieve@example.com",
            "company_name": "Retrieve Corp"
        })
        user_id = signup_response.json()["id"]

        gen_response = client.post(
            "/newsletters/generate?user_id=" + user_id,
            json={
                "audience": "Test",
                "purpose": "Test",
                "tone": "Test",
                "objective": "Test",
                "key_content": "Test"
            }
        )
        newsletter_id = gen_response.json()["id"]

        # Retrieve it
        response = client.get(f"/newsletters/{newsletter_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == newsletter_id

    def test_list_user_newsletters(self):
        """Test list user's newsletters"""
        # Create user and generate 2 newsletters
        signup_response = client.post("/auth/signup", json={
            "email": "list@example.com",
            "company_name": "List Corp"
        })
        user_id = signup_response.json()["id"]

        for i in range(2):
            client.post(
                "/newsletters/generate?user_id=" + user_id,
                json={
                    "audience": f"Test {i}",
                    "purpose": "Test",
                    "tone": "Test",
                    "objective": "Test",
                    "key_content": "Test"
                }
            )

        # List them
        response = client.get(f"/newsletters/user/{user_id}")
        assert response.status_code == 200
        newsletters = response.json()
        assert len(newsletters) >= 2

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
