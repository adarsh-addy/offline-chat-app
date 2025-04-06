const express = require('express');
const router= express.Router();
const {register,login}= require('../controlllers/authController');
// TEMP: Add in authRoutes.js (just for testing)
const User = require('../models/User');
router.get('/all', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users' });
  }
});

router.post('/register', register);
router.post('/login', login);

module.exports=router;