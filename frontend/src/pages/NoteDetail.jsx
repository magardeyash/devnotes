import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tag: 'General'
  });
  const [timestamps, setTimestamps] = useState({
    createdAt: null,
    updatedAt: null
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // AI Assistant States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

  // Copy State
  const [copied, setCopied] = useState(false);

  // Tab State: 'write' or 'preview'
  const [activeTab, setActiveTab] = useState('write');

  const tags = ['JavaScript', 'TypeScript', 'CSS', 'HTML', 'Python', 'General', 'DevOps', 'Database'];

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axiosInstance.get(`/notes/${id}`);
        const { title, content, tag, createdAt, updatedAt } = response.data;
        setFormData({ title, content, tag });
        setTimestamps({ createdAt, updatedAt });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch the note details');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (success) setSuccess(false);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, content, tag } = formData;

    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess(false);

      const response = await axiosInstance.put(`/notes/${id}`, {
        title,
        content,
        tag
      });

      const { updatedAt } = response.data;
      setTimestamps((prev) => ({ ...prev, updatedAt }));
      setSuccess(true);

      // Hide success banner after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  // Copy Content Handler
  const handleCopyContent = () => {
    if (!formData.content) return;
    navigator.clipboard.writeText(formData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // AI Tag Suggestion
  const handleAiSuggestTag = async () => {
    if (!formData.content && !formData.title) {
      alert('Please fill in title or content first.');
      return;
    }
    setAiLoading(true);
    try {
      const response = await axiosInstance.post('/ai/assist', {
        action: 'suggest_tag',
        title: formData.title,
        content: formData.content
      });
      setFormData((prev) => ({ ...prev, tag: response.data.suggestedTag }));
    } catch (err) {
      console.error(err);
      alert('AI tag suggestion failed.');
    } finally {
      setAiLoading(false);
    }
  };

  // AI Note Enhancer
  const handleAiEnhance = async () => {
    if (!formData.content) {
      alert('Please write some content first.');
      return;
    }
    setAiLoading(true);
    try {
      const response = await axiosInstance.post('/ai/assist', {
        action: 'enhance',
        title: formData.title,
        content: formData.content
      });
      setFormData((prev) => ({ ...prev, content: response.data.text }));
    } catch (err) {
      console.error(err);
      alert('AI enhancement failed.');
    } finally {
      setAiLoading(false);
    }
  };

  // AI Code Explainer
  const handleAiExplain = async () => {
    if (!formData.content) {
      alert('Note has no content to explain.');
      return;
    }
    setAiLoading(true);
    setAiExplanation('');
    try {
      const response = await axiosInstance.post('/ai/assist', {
        action: 'explain',
        title: formData.title,
        content: formData.content
      });
      setAiExplanation(response.data.text);
    } catch (err) {
      console.error(err);
      alert('AI explanation failed.');
    } finally {
      setAiLoading(false);
    }
  };

  // Helper to map DevNote category tags to prism syntax highlighter language keys
  const getSyntaxLanguage = (tag) => {
    if (!tag) return 'text';
    const t = tag.toLowerCase();
    if (t === 'javascript') return 'javascript';
    if (t === 'typescript') return 'typescript';
    if (t === 'css') return 'css';
    if (t === 'html') return 'html';
    if (t === 'python') return 'python';
    if (t === 'database') return 'sql';
    if (t === 'devops') return 'yaml';
    return 'text';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="status-container">
        <div className="spinner"></div>
        <p>Loading note details...</p>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="note-detail-container">
        <div className="error-box card">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="note-detail-container">
      <div className="note-detail-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary flex-center-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: '6px' }}
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>
        <h2>Edit Note</h2>
      </div>

      <div className="note-detail-card card">
        {success && <div className="success-message">Changes saved successfully!</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group flex-2">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength="100"
                disabled={saving || aiLoading}
                required
              />
            </div>

            <div className="form-group flex-1">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="tag">Category / Tag</label>
                <button
                  type="button"
                  onClick={handleAiSuggestTag}
                  className="ai-sparkle-btn"
                  disabled={saving || aiLoading}
                  title="Auto-tag this note"
                >
                  ✨ Auto-Tag
                </button>
              </div>
              <select
                id="tag"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                disabled={saving || aiLoading}
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              {/* Tab Selector Buttons */}
              <div className="tab-buttons">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'write' ? 'active' : ''}`}
                  onClick={() => setActiveTab('write')}
                >
                  Write Note
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  Highlight Preview
                </button>
              </div>

              {/* Action Buttons: Copy & AI actions */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleCopyContent}
                  className="btn btn-secondary btn-sm flex-center-btn"
                  disabled={!formData.content}
                  title="Copy snippet to clipboard"
                >
                  {copied ? (
                    <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      Copy Snippet
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleAiExplain}
                  className="ai-sparkle-btn"
                  disabled={saving || aiLoading}
                  title="Explain code using Gemini"
                >
                  ✨ Explain
                </button>
                <button
                  type="button"
                  onClick={handleAiEnhance}
                  className="ai-sparkle-btn"
                  disabled={saving || aiLoading}
                  title="Optimize code and formatting"
                >
                  ✨ AI Enhance
                </button>
              </div>
            </div>

            {activeTab === 'write' ? (
              <textarea
                id="content"
                name="content"
                rows="12"
                placeholder="Write your snippet code or notes here..."
                value={formData.content}
                onChange={handleChange}
                disabled={saving || aiLoading}
                required
              ></textarea>
            ) : (
              <div className="syntax-highlighter-wrapper">
                <SyntaxHighlighter
                  language={getSyntaxLanguage(formData.tag)}
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    padding: '16px',
                    margin: '0',
                    fontSize: '0.95rem',
                    minHeight: '270px',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {formData.content || '// Content is empty. Type something in "Write Note" tab first.'}
                </SyntaxHighlighter>
              </div>
            )}
          </div>

          {/* AI Explanation Result Box */}
          {aiExplanation && (
            <div className="ai-insights-box card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ color: 'var(--accent-primary)', margin: 0 }}>✨ AI Assistant Insights</h4>
                <button
                  type="button"
                  className="btn-icon"
                  style={{ padding: '2px 6px', fontSize: '0.8rem' }}
                  onClick={() => setAiExplanation('')}
                >
                  Dismiss
                </button>
              </div>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                {aiExplanation}
              </div>
            </div>
          )}

          <div className="note-timestamps">
            <div>
              <strong>Created:</strong> {formatDate(timestamps.createdAt)}
            </div>
            {timestamps.updatedAt && timestamps.updatedAt !== timestamps.createdAt && (
              <div>
                <strong>Last Updated:</strong> {formatDate(timestamps.updatedAt)}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={saving || aiLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || aiLoading}>
              {saving ? 'Saving...' : aiLoading ? 'AI Processing...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteDetail;
