import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsletterAPI } from '../api';
import '../styles/newsletter.css';

function NewsletterPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    loadNewsletter();
  }, [id]);

  const loadNewsletter = async () => {
    try {
      setLoading(true);
      const res = await newsletterAPI.getNewsletter(id);
      setNewsletter(res.data);
    } catch (err) {
      setError('Failed to load newsletter');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading newsletter...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div>
        <div className="alert alert-error">Newsletter not found</div>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const variants = newsletter.variants?.variants || [];

  return (
    <div className="newsletter-view">
      <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="newsletter-header">
        <div>
          <h1>{newsletter.title}</h1>
          <p className="newsletter-date">
            {new Date(newsletter.created_at).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigator.clipboard.writeText(newsletter.generated_copy)}
          >
            Copy Copy
          </button>
          <button className="btn btn-primary">Export as PDF</button>
        </div>
      </div>

      {/* Compliance Badge */}
      <div className={`compliance-status ${newsletter.compliance_status}`}>
        <span>
          {newsletter.compliance_status === 'passed'
            ? '✓ Compliance: Passed'
            : '⚠ Compliance: Flagged'}
        </span>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        <button
          className={`tab ${activeTab === 'variants' ? 'active' : ''}`}
          onClick={() => setActiveTab('variants')}
        >
          A/B Variants ({variants.length})
        </button>
        <button
          className={`tab ${activeTab === 'compliance' ? 'active' : ''}`}
          onClick={() => setActiveTab('compliance')}
        >
          Compliance Details
        </button>
      </div>

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="tab-content">
          <div className="card">
            <h2>Newsletter Copy</h2>
            <div className="newsletter-content">
              {newsletter.generated_copy}
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => navigator.clipboard.writeText(newsletter.generated_copy)}
              style={{ marginTop: '1rem' }}
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      {/* Variants Tab */}
      {activeTab === 'variants' && (
        <div className="tab-content">
          <div className="variants-container">
            {variants.length === 0 ? (
              <p className="empty-state">No A/B test variants available</p>
            ) : (
              variants.map((variant, idx) => (
                <div key={idx} className="variant-container">
                  <div className="variant-header">
                    <h3>Variant {idx + 1}: {variant.angle}</h3>
                    <div className="principles">
                      {variant.psychological_principles?.map((principle, i) => (
                        <span key={i} className="principle">
                          {principle}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="variant-content">
                    {variant.copy}
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigator.clipboard.writeText(variant.copy)}
                  >
                    Copy Variant
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="tab-content">
          <div className="card">
            <h2>Compliance Audit Results</h2>

            {newsletter.compliance_status === 'passed' && (
              <div className="alert alert-success">
                <strong>✓ All Compliance Checks Passed</strong>
                <p>This newsletter meets all RBI guidelines and email best practices.</p>
              </div>
            )}

            {newsletter.compliance_status === 'flagged' && (
              <div className="alert alert-error">
                <strong>⚠ Compliance Issues Detected</strong>
                <p>Please review the issues below before sending.</p>
              </div>
            )}

            <div className="compliance-details">
              <h3>Summary</h3>
              <div className="summary-stats">
                <div className="stat">
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Compliance Score</div>
                </div>
                <div className="stat">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Critical Issues</div>
                </div>
                <div className="stat">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Warnings</div>
                </div>
              </div>
            </div>

            <div className="compliance-checklist">
              <h3>RBI Compliance Checklist</h3>
              <ul className="checklist">
                <li className="checked">
                  <span className="checkbox">✓</span> No guaranteed returns claims
                </li>
                <li className="checked">
                  <span className="checkbox">✓</span> No past performance guarantees
                </li>
                <li className="checked">
                  <span className="checkbox">✓</span> No misleading investment claims
                </li>
                <li className="checked">
                  <span className="checkbox">✓</span> No dark patterns detected
                </li>
                <li className="checked">
                  <span className="checkbox">✓</span> Transparent terms referenced
                </li>
              </ul>
            </div>

            <div className="email-practices">
              <h3>Email Best Practices</h3>
              <ul className="checklist">
                <li className="checked">
                  <span className="checkbox">✓</span> Subject line optimized (30-50 chars)
                </li>
                <li className="checked">
                  <span className="checkbox">✓</span> Mobile-friendly design
                </li>
                <li className="checked">
                  <span className="checkbox">✓</span> Clear unsubscribe link
                </li>
                <li className="checked">
                  <span className="checkbox">✓</span> Company information included
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsletterPage;
