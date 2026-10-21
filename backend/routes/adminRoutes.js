const express = require('express');
const router = express.Router();
const {
  getAdminDetails,
  approveProvider,
  deleteUser
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/details', authMiddleware, authorizeRoles('admin'), getAdminDetails);
router.put('/providers/approve/:userId', authMiddleware, authorizeRoles('admin'), approveProvider);
router.delete('/users/:id', authMiddleware, authorizeRoles('admin'), deleteUser);

module.exports = router;