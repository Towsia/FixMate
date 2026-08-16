const express = require('express');
const router = express.Router();
const { 
  register, 
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  logout
} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// ===== Public Routes =====
router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ===== Protected Routes =====
router.post('/logout', authMiddleware, logout);

module.exports = router;