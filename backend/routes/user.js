const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateUser = require('../middlewares/validateUser');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/signup', validateUser, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign(
        { userId: user._id, name: user.name, pic: user.pic },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(200).json({ message: 'Login successful', token, user: { _id: user._id, email: user.email, name: user.name } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.userId !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/details', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.userId !== id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const foundUser = await User.findById(id).populate('posts');
    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ foundUser });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/:id/update', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.userId !== id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
