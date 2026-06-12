import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('All');

  // New Note State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tag: 'General'
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // AI State
  const [aiLoading, setAiLoading] = useState(false);

  const tags = ['JavaScript', 'TypeScript', 'CSS', 'HTML', 'Python', 'General', 'DevOps', 'Database'];

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/notes');
      setNotes(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Delete note handler
  const handleDeleteNote = async (id) => {
    try {
      await axiosInstance.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete note');
    }
  };

  // Create note form inputs handler
  const handleCreateChange = (e) => {
    setNewNote({
      ...newNote,
      [e.target.name]: e.target.value
    });
    if (createError) setCreateError('');
  };

  // Create note submit handler
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const { title, content, tag } = newNote;

    if (!title || !content) {
      setCreateError('Title and content are required');
      return;
    }

    setCreateLoading(true);
    setCreateError('');

    try {
      const response = await axiosInstance.post('/notes', {
        title,
        content,
        tag
      });
      // Prepend new note to list
      setNotes([response.data, ...notes]);
      
      // Reset form
      setNewNote({
        title: '',
        content: '',
        tag: 'General'
      });
      setShowCreateForm(false);
    } catch (err) {
      console.error(err);
      setCreateError(err.response?.data?.message || 'Failed to create note');
    } finally {
      setCreateLoading(false);
    }
  };

  // AI Tag Suggestion handler
  const handleAiSuggestTag = async () => {
    if (!newNote.content && !newNote.title) {
      alert('Please fill in note title or content first so AI can analyze it.');
      return;
    }
    setAiLoading(true);
    try {
      const response = await axiosInstance.post('/ai/assist', {
        action: 'suggest_tag',
        title: newNote.title,
        content: newNote.content
      });
      const suggestedTag = response.data.suggestedTag;
      setNewNote((prev) => ({ ...prev, tag: suggestedTag }));
    } catch (err) {
      console.error(err);
      alert('AI tag suggestion failed.');
    } finally {
      setAiLoading(false);
    }
  };

  // AI Note Enhancer handler
  const handleAiEnhance = async () => {
    if (!newNote.content) {
      alert('Please add some note content first.');
      return;
    }
    setAiLoading(true);
    try {
      const response = await axiosInstance.post('/ai/assist', {
        action: 'enhance',
        title: newNote.title,
        content: newNote.content
      });
      setNewNote((prev) => ({ ...prev, content: response.data.text }));
    } catch (err) {
      console.error(err);
      alert('AI enhancement failed.');
    } finally {
      setAiLoading(false);
    }
  };

  // Filter notes client-side
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag =
      selectedTagFilter === 'All' || note.tag === selectedTagFilter;

    return matchesSearch && matchesTag;
  });

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>My DevNotes</h1>
          <p className="subtitle">Snippets & reminders for everyday coding</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`btn ${showCreateForm ? 'btn-secondary' : 'btn-primary'}`}
        >
          {showCreateForm ? 'Cancel' : 'New Note'}
        </button>
      </header>

      {/* New Note Form */}
      {showCreateForm && (
        <div className="create-note-box card">
          <h3>Create New Note</h3>
          {createError && <div className="error-message">{createError}</div>}
          
          <form onSubmit={handleCreateSubmit} className="create-note-form">
            <div className="form-row">
              <div className="form-group flex-2">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g. Center a Div or Express JWT Setup"
                  value={newNote.title}
                  onChange={handleCreateChange}
                  maxLength="100"
                  disabled={createLoading || aiLoading}
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
                    disabled={aiLoading || createLoading}
                    title="Ask AI to suggest a category tag based on title and content"
                  >
                    ✨ Auto-Tag
                  </button>
                </div>
                <select
                  id="tag"
                  name="tag"
                  value={newNote.tag}
                  onChange={handleCreateChange}
                  disabled={createLoading || aiLoading}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="content">Content (Plain text or code snippets)</label>
                <button
                  type="button"
                  onClick={handleAiEnhance}
                  className="ai-sparkle-btn"
                  disabled={aiLoading || createLoading}
                  title="Ask AI to clean up code, format style, or add comments"
                >
                  ✨ AI Enhance Code
                </button>
              </div>
              <textarea
                id="content"
                name="content"
                rows="6"
                placeholder="Write your note content here..."
                value={newNote.content}
                onChange={handleCreateChange}
                disabled={createLoading || aiLoading}
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(false)}
                disabled={createLoading || aiLoading}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createLoading || aiLoading}
              >
                {createLoading ? 'Saving...' : aiLoading ? 'AI Thinking...' : 'Save Note'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Controls */}
      <section className="search-filter-section card">
        <div className="search-bar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="search-icon"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tags">
          <span className="filter-label">Filter Tag:</span>
          <div className="tags-container">
            <button
              onClick={() => setSelectedTagFilter('All')}
              className={`filter-tag-btn ${selectedTagFilter === 'All' ? 'active' : ''}`}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTagFilter(tag)}
                className={`filter-tag-btn ${selectedTagFilter === tag ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notes Display */}
      {loading ? (
        <div className="status-container">
          <div className="spinner"></div>
          <p>Loading notes...</p>
        </div>
      ) : error ? (
        <div className="error-box card">
          <p>{error}</p>
          <button onClick={fetchNotes} className="btn btn-primary btn-sm">
            Retry
          </button>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="empty-box card">
          <h3>No Notes Found</h3>
          <p>
            {notes.length === 0
              ? "You haven't created any notes yet. Click 'New Note' to start!"
              : 'No notes match your current search queries or tag filters.'}
          </p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
