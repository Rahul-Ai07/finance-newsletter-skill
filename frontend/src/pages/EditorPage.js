import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsletterAPI, templateAPI } from '../api';
import '../styles/editor.css';

function EditorPage({ user }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    audience: '',
    purpose: '',
    tone: '',
    objective: '',
    key_content: '',
    compliance_notes: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState([]);

  // Load templates on component mount
  React.useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const res = await templateAPI.listTemplates();
      setTemplates(res.data);
    } catch (err) {
      console.error('Failed to load templates', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePurposeSelect = (purpose) => {
    setFormData((prev) => ({
      ...prev,
      purpose,
    }));
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await newsletterAPI.generate(user.id, formData);
      setResult(response.data);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate newsletter');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndView = () => {
    if (result?.id) {
      navigate(`/newsletter/${result.id}`);
    }
  };

  return (
    <div className="editor">
      <div className="editor-header">
        <h1>Newsletter Editor</h1>
        <div className="step-indicator">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`step ${s === step ? 'active' : ''} ${
                s < step ? 'completed' : ''
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Step 1: Select Purpose/Template */}
      {step === 1 && (
        <div className="editor-section">
          <h2>Choose Newsletter Purpose</h2>
          <p className="section-subtitle">
            Select a template that matches your content
          </p>

          <div className="templates-grid">
            {templates.map((template) => (
              <div
                key={template.id}
                className="template-card"
                onClick={() => handlePurposeSelect(template.template_type)}
              >
                <h3>{template.name}</h3>
                <p>{template.description}</p>
                <div className="use-cases">
                  {template.use_cases?.slice(0, 2).map((useCase, idx) => (
                    <span key={idx} className="use-case-tag">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Audience & Details */}
      {step === 2 && (
        <div className="editor-section">
          <h2>Define Your Audience & Content</h2>

          <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="audience">Target Audience</label>
                <input
                  id="audience"
                  type="text"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  placeholder="e.g., Retail investors aged 25-45"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tone">Tone of Voice</label>
                <select
                  id="tone"
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select tone...</option>
                  <option value="Professional">Professional</option>
                  <option value="Friendly">Friendly & Approachable</option>
                  <option value="Technical">Technical & Detailed</option>
                  <option value="Educational">Educational</option>
                  <option value="Urgent">Urgent & Direct</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="objective">Primary Objective</label>
              <input
                id="objective"
                type="text"
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                placeholder="e.g., Educate about market trends and drive engagement"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="key_content">Key Content Points</label>
              <textarea
                id="key_content"
                name="key_content"
                value={formData.key_content}
                onChange={handleChange}
                placeholder="List the main topics, news, or insights to cover..."
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="compliance_notes">Compliance Notes (Optional)</label>
              <textarea
                id="compliance_notes"
                name="compliance_notes"
                value={formData.compliance_notes}
                onChange={handleChange}
                placeholder="Any specific compliance requirements or guardrails..."
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Continue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Review & Generate */}
      {step === 3 && (
        <div className="editor-section">
          <h2>Review & Generate</h2>

          <div className="review-summary">
            <div className="review-item">
              <h4>Template</h4>
              <p>{formData.purpose}</p>
            </div>
            <div className="review-item">
              <h4>Audience</h4>
              <p>{formData.audience}</p>
            </div>
            <div className="review-item">
              <h4>Tone</h4>
              <p>{formData.tone}</p>
            </div>
            <div className="review-item">
              <h4>Objective</h4>
              <p>{formData.objective}</p>
            </div>
          </div>

          <div className="alert alert-info">
            <strong>✓ Compliance Ready:</strong> This newsletter will be automatically
            audited against RBI compliance guidelines and email best practices.
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep(2)}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Newsletter'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && result && (
        <div className="editor-section">
          <h2>Newsletter Generated ✓</h2>

          <div className="result-container">
            {/* Compliance Status */}
            <div className={`compliance-card ${result.compliance_status.passed ? 'passed' : 'flagged'}`}>
              <h3>Compliance Status</h3>
              <p className={result.compliance_status.passed ? 'success' : 'warning'}>
                {result.compliance_status.passed
                  ? '✓ Passed All Checks'
                  : '⚠ Review Required'}
              </p>
              {result.compliance_status.violations?.length > 0 && (
                <div className="violations">
                  <h4>Issues Found:</h4>
                  <ul>
                    {result.compliance_status.violations.map((v, idx) => (
                      <li key={idx}>{v.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Generated Copy */}
            <div className="card">
              <h3>Newsletter Copy</h3>
              <div className="newsletter-preview">
                {result.generated_copy}
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => navigator.clipboard.writeText(result.generated_copy)}
              >
                Copy to Clipboard
              </button>
            </div>

            {/* Variants */}
            {result.variants?.variants?.length > 0 && (
              <div className="card">
                <h3>A/B Test Variants</h3>
                <div className="variants-grid">
                  {result.variants.variants.map((variant, idx) => (
                    <div key={idx} className="variant-card">
                      <h4>{variant.angle}</h4>
                      <div className="principles">
                        {variant.psychological_principles?.map((p, i) => (
                          <span key={i} className="principle-tag">
                            {p}
                          </span>
                        ))}
                      </div>
                      <p className="variant-copy">{variant.copy?.substring(0, 150)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setStep(1);
                setResult(null);
                setFormData({
                  audience: '',
                  purpose: '',
                  tone: '',
                  objective: '',
                  key_content: '',
                  compliance_notes: '',
                });
              }}
            >
              Create Another
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveAndView}
            >
              View Full Newsletter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditorPage;
