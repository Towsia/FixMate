const express = require('express');
const router = express.Router();
const { register, verifyEmail } = require('../controllers/authController');

router.post('/register', register);
router.get('/verify-email', verifyEmail);

module.exports = router;