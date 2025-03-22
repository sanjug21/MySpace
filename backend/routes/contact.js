const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const validateContact = require('../middlewares/validateContact');
const authenticateToken = require('../middlewares/authenticateToken');
const User = require('../models/User');

router.post('/add', authenticateToken, validateContact, async (req, res) => {
  try {
    const { name } = req.body;

    const existingContactName = await Contact.findOne({
      name: name,
      userId: req.user.userId,
    });

    if (existingContactName) {
      return res.status(409).json({ message: 'Contact with this name already exists' });
    }

    const newContact = new Contact({
      ...req.body,
      userId: req.user.userId,
    });

    await newContact.save();

    const user = await User.findById(req.user.userId);
    user.contacts.push(newContact);
    await user.save();

    res.status(200).json({ message: 'Contact saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.userId }).sort({ name: 1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    if (contact.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this contact' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authenticateToken, validateContact, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
   
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    if (contact.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this contact' });
    }
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    if (contact.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this contact' });
    }

    const user = await User.findById(req.user.userId);
    user.contacts = user.contacts.filter(contactId => contactId.toString() !== req.params.id);
    await user.save();

    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;