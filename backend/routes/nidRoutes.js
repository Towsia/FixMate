const express = require('express');
const router = express.Router();
const { submitNid, verifyNid, getNidStatus } = require('../controllers/nidController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const upload = require('../middleware/upload');

// ===== Submit NID (Provider) =====
router.post('/submit', authMiddleware, upload.fields([
  { name: 'nidFront', maxCount: 1 },
  { name: 'nidBack', maxCount: 1 },
  { name: 'nidSelfie', maxCount: 1 },
  { name: 'birthCertImage', maxCount: 1 }
]), submitNid);

// ===== Verify NID (Admin) =====
router.put('/verify/:userId', authMiddleware, authorizeRoles('admin'), verifyNid);

// ===== Get NID Status =====
router.get('/status', authMiddleware, getNidStatus);

module.exports = router;