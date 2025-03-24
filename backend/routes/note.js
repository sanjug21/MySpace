const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const User = require('../models/User');
const validateNote = require('../middlewares/validateNote');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/add', authenticateToken, validateNote, async (req, res) => {
  try {    
    const newNote = new Note(req.body);
    const savedNote = await newNote.save();
    const user = await User.findById(req.user.userId);
        if (user) {
            user.notes.push(savedNote._id);
            await user.save();
        }
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/', authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this note' });
    }
    res.json(note);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authenticateToken, validateNote, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this note' });
    }
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
      const note = await Note.findById(req.params.id);
      if (!note) {
          return res.status(404).json({ message: 'Note not found' });
      }
      if (note.userId.toString() !== req.user.userId) {
          return res.status(403).json({ message: 'Forbidden: You do not own this note' });
      }
      await Note.findByIdAndDelete(req.params.id);

      const user = await User.findById(req.user.userId);
      if(user){
        user.notes = user.notes.filter(noteId => noteId.toString() !== req.params.id);
        await user.save();
      }

      res.json({ message: 'Note deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});
module.exports = router;