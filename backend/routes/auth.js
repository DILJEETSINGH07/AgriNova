const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect, adminOnly } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role, location } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name, email, password, role, location
    });

    // Send Welcome Email asynchronously
    sendEmail({
      email: user.email,
      subject: 'Welcome to AgriNova!',
      html: `
        <h2>Welcome to AgriNova, ${user.name}!</h2>
        <p>You have successfully signed up for an account as a <strong>${user.role}</strong>.</p>
        <p>We are thrilled to have you join our direct farm-to-table marketplace.</p>
      `
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      
      // Send Login Alert asynchronously
      sendEmail({
        email: user.email,
        subject: 'AgriNova Security Alert: Successful Sign-In',
        html: `
          <h2>New Login Detected</h2>
          <p>Hi ${user.name},</p>
          <p>You have successfully signed in to your AgriNova account.</p>
          <p>If this was not you, please contact support immediately.</p>
        `
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/auth/users
// @desc Get all users (Admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/auth/google
router.post('/google', async (req, res) => {
  const { token, role } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with a random secure password
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      user = await User.create({
        name,
        email,
        password: randomPassword,
        role: role || 'customer',
      });

      // Send Welcome Email asynchronously
      sendEmail({
        email: user.email,
        subject: 'Welcome to AgriNova!',
        html: `
          <h2>Welcome to AgriNova, ${user.name}!</h2>
          <p>You have successfully signed up for an account as a <strong>${user.role}</strong> using Google.</p>
          <p>We are thrilled to have you join our direct farm-to-table marketplace.</p>
        `
      });
    } else {
      // Send Login Alert asynchronously for existing users
      sendEmail({
        email: user.email,
        subject: 'AgriNova Security Alert: Successful Google Sign-In',
        html: `
          <h2>New Login Detected</h2>
          <p>Hi ${user.name},</p>
          <p>You have successfully signed in to your AgriNova account using Google.</p>
          <p>If this was not you, please contact support immediately.</p>
        `
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

module.exports = router;
