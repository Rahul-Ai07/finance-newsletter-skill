import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, newsletterAPI } from '../api';
import '../styles/dashboard.css';

function DashboardPage({ user }) {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [profileRes, newslettersRes] = await Promise.all([
        authAPI.getUser(user.id),
        newsletterAPI.listUserNewsletters(user.id),
      ]);

      setUserProfile(profileRes.data);
      setNewsletters(newslettersRes.data || []);
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  const tierLimits = {
    starter: 5,
    growth: 15,
    enterprise: 999999,
  };

  const limit = tierLimits[userProfile?.subscription_tier] || 5;
  const usage = userProfile?.newsletters_generated || 0;
  const percentUsed = (usage / limit) * 100;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="btn btn-primary" onClick={() => navigate('/editor')}>
          + Create Newsletter
        </button>
      </div>

      {/* User Profile Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Account Overview</h2>
        </div>
        <div className="card-body">
          <div className="profile-grid">
            <div className="profile-item">
              <label>Email</label>
              <p>{userProfile?.email}</p>
            </div>
            <div className="profile-item">
              <label>Company</label>
              <p>{userProfile?.company_name}</p>
            </div>
            <div className="profile-item">
              <label>Subscription Tier</label>
              <p>
                <span className={`badge badge-${userProfile?.subscription_tier}`}>
                  {userProfile?.subscription_tier?.toUpperCase()}
                </span>
              </p>
            </div>
            <div className="profile-item">
              <label>Member Since</label>
              <p>
                {userProfile?.created_at
                  ? new Date(userProfile.created_at).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Monthly Usage</h2>
        </div>
        <div className="card-body">
          <div className="usage-container">
            <div className="usage-info">
              <p>
                <strong>{usage}</strong> / <strong>{limit}</strong> newsletters generated
              </p>
              {limit < 999999 && (
                <p className="usage-note">
                  Resets on the 1st of next month
                </p>
              )}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              ></div>
            </div>
          </div>

          {usage >= limit && limit < 999999 && (
            <div className="alert alert-info" style={{ marginTop: '1rem' }}>
              You've reached your monthly limit. Upgrade to continue.
            </div>
          )}
        </div>
      </div>

      {/* Recent Newsletters */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Newsletters</h2>
          {newsletters.length > 0 && (
            <span className="badge badge-blue">{newsletters.length} total</span>
          )}
        </div>
        <div className="card-body">
          {newsletters.length === 0 ? (
            <p className="empty-state">
              No newsletters yet.{' '}
              <button
                className="link-btn"
                onClick={() => navigate('/editor')}
              >
                Create your first one
              </button>
            </p>
          ) : (
            <div className="newsletters-list">
              {newsletters.map((newsletter) => (
                <div key={newsletter.id} className="newsletter-item">
                  <div className="newsletter-info">
                    <h4>{newsletter.title}</h4>
                    <p className="newsletter-meta">
                      Template: {newsletter.template_type} •{' '}
                      {new Date(newsletter.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="newsletter-status">
                    <span
                      className={`badge badge-${
                        newsletter.compliance_status === 'passed' ? 'green' : 'yellow'
                      }`}
                    >
                      {newsletter.compliance_status}
                    </span>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/newsletter/${newsletter.id}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tier Comparison */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Upgrade Options</h2>
        </div>
        <div className="card-body">
          <div className="tier-grid">
            <div className="tier-option">
              <h4>Starter</h4>
              <p className="tier-price">₹2,000/month</p>
              <ul>
                <li>5 newsletters/month</li>
                <li>Basic templates</li>
                <li>Single-variant A/B testing</li>
                <li>Email support</li>
              </ul>
              {userProfile?.subscription_tier === 'starter' && (
                <p className="current-plan">Current Plan</p>
              )}
            </div>

            <div className="tier-option recommended">
              <span className="ribbon">RECOMMENDED</span>
              <h4>Growth</h4>
              <p className="tier-price">₹5,000/month</p>
              <ul>
                <li>15 newsletters/month</li>
                <li>All templates + custom</li>
                <li>Full A/B testing</li>
                <li>API access</li>
                <li>Priority support</li>
              </ul>
              {userProfile?.subscription_tier === 'growth' && (
                <p className="current-plan">Current Plan</p>
              )}
            </div>

            <div className="tier-option">
              <h4>Enterprise</h4>
              <p className="tier-price">Custom</p>
              <ul>
                <li>Unlimited newsletters</li>
                <li>White-label</li>
                <li>Custom integrations</li>
                <li>Dedicated manager</li>
                <li>VIP support</li>
              </ul>
              {userProfile?.subscription_tier === 'enterprise' && (
                <p className="current-plan">Current Plan</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
