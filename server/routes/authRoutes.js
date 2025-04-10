// server/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // ✅ updated spelling

const User = require('../models/User');

// Get all users (test route)
router.get('/all', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get users excluding passwords
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users' });
  }
});

// Auth routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;
