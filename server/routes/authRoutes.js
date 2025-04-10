const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // ✅ fixed "controlllers" typo

const User = require('../models/User');

// Get all users (only for testing/debugging)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching all users' });
  }
});

// Get users without password (for UI)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users' });
  }
});

// Register & Login routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;
