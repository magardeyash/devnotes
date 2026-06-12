import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="landing-hero">
        <h1 className="hero-title animate-gradient-text">
          Dev<span>Notes</span>
        </h1>
        <p className="hero-subtitle">
          The personal, secure developer snippet and notes manager built for modern workflows.
        </p>
        
        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Section */}
      <section className="landing-features">
        <h2 className="section-title">Why use DevNotes?</h2>
        
        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon icon-cyan">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </div>
            <h3>Category Tags</h3>
            <p>Organize your code snippets under specific tags (JavaScript, TypeScript, CSS, Database, and more) for easy retrieval.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon icon-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3>JWT Authentication</h3>
            <p>Your notes are fully secure and isolated. Protected with password hashing and authenticated JSON Web Tokens.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon icon-pink">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3>Gemini AI Assistant</h3>
            <p>Integrate Gemini AI to explain complex code snippets, auto-suggest tags, or enhance code formatting in one click.</p>
          </div>
        </div>
      </section>

      {/* Code Showcase Preview */}
      <section className="landing-showcase card">
        <div className="showcase-header">
          <div className="showcase-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="showcase-title">javascript_note.js</span>
        </div>
        <div className="showcase-body">
          <pre>
            <code>
{`// DevNotes saves your everyday snippets
const centerADiv = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

// Ask Gemini AI: "Suggest a Tag"
// Output -> "CSS"`}
            </code>
          </pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} DevNotes. Designed for pair-programming and developer efficiency.</p>
      </footer>
    </div>
  );
};

export default Landing;
