import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NoteCard = ({ note, onDelete }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCardClick = () => {
    navigate(`/notes/${note._id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card navigation when deleting
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note._id);
    }
  };

  const handleCopyClick = (e) => {
    e.stopPropagation(); // Prevent card navigation
    navigator.clipboard.writeText(note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get tag class name for style mapping
  const getTagClass = (tag) => {
    if (!tag) return 'tag-general';
    return `tag-${tag.toLowerCase()}`;
  };

  return (
    <div className="note-card" onClick={handleCardClick}>
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
        <span className={`tag-badge ${getTagClass(note.tag)}`}>
          {note.tag}
        </span>
      </div>
      
      <p className="note-card-preview">
        {note.content.length > 150
          ? `${note.content.substring(0, 150)}...`
          : note.content}
      </p>

      <div className="note-card-footer">
        <span className="note-card-date">{formatDate(note.createdAt)}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleCopyClick}
            className="btn-icon"
            title="Copy Content"
            aria-label="Copy Content"
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
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
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
          <button
            onClick={handleDeleteClick}
            className="btn-icon btn-danger-icon"
            title="Delete Note"
            aria-label="Delete Note"
          >
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
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
