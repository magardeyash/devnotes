const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// All endpoints here are protected by protect middleware (which is mounted in server.js)

// @desc    Get all notes for logged-in user
// @route   GET /api/notes
// @access  Private
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Fetch notes error:', error.message);
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
});

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, content, tag } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = new Note({
      title,
      content,
      tag: tag || 'General',
      user: req.user.id
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Create note error:', error.message);
    res.status(500).json({ message: 'Server error while creating note' });
  }
});

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.id || req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Make sure note belongs to user
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this note' });
    }

    res.json(note);
  } catch (error) {
    console.error('Fetch single note error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(500).json({ message: 'Server error while fetching note' });
  }
});

// @desc    Update a note by ID
// @route   PUT /api/notes/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tag } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Make sure note belongs to user
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this note' });
    }

    // Update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tag !== undefined) note.tag = tag;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    console.error('Update note error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(500).json({ message: 'Server error while updating note' });
  }
});

// @desc    Delete a note by ID
// @route   DELETE /api/notes/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Make sure note belongs to user
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(500).json({ message: 'Server error while deleting note' });
  }
});

module.exports = router;
