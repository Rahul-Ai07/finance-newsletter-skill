import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import '../styles/auth.css';

function SignupPage({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    company_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.signup(formData.email, formData.company_name);
      const { id } = response.data;

      // Store user ID in localStorage
      localStorage.setItem('userId', id);

      // Update app state
      setUser({ id });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome to Newsletter SaaS</h1>
        <p className="subtitle">
          Compliance-first newsletter generation for financial services
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company_name">Company Name</label>
            <input
              id="company_name"
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Your Company Ltd."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <div className="features">
          <h3>Why Choose Us?</h3>
          <ul>
            <li>✅ RBI Compliance Built-in</li>
            <li>✅ A/B Testing with Psychology</li>
            <li>✅ Email Best Practices</li>
            <li>✅ 5 Professional Templates</li>
            <li>✅ Compliance Audit Trail</li>
          </ul>
        </div>

        <div className="pricing-preview">
          <h3>Subscription Plans</h3>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h4>Starter</h4>
              <p className="price">₹2,000/mo</p>
              <ul>
                <li>5 newsletters/month</li>
                <li>Basic templates</li>
              </ul>
            </div>
            <div className="pricing-card">
              <h4>Growth</h4>
              <p className="price">₹5,000/mo</p>
              <ul>
                <li>15 newsletters/month</li>
                <li>All templates</li>
                <li>API access</li>
              </ul>
            </div>
            <div className="pricing-card">
              <h4>Enterprise</h4>
              <p className="price">Custom</p>
              <ul>
                <li>Unlimited newsletters</li>
                <li>White-label</li>
                <li>Dedicated support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
