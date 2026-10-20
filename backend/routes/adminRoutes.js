const express = require('express');
const router = express.Router();
const { 
    getAdminDetails, 
    approveProvider, 
    deleteUser 
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Get all details for Admin (Users, Providers, Services, Bookings)
router.get('/details', authMiddleware, authorizeRoles('admin'), getAdminDetails);

// Approve a pending provider
router.put('/providers/approve/:userId', authMiddleware, authorizeRoles('admin'), approveProvider);

// Delete a user
router.delete('/users/:id', authMiddleware, authorizeRoles('admin'), deleteUser);

module.exports = router;