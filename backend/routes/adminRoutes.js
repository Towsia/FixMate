const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllCategories,
  getAllServices,
  getAllBookings,
  getDashboardStats
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

// সব Admin Routes (Admin Only)
router.get('/users', authMiddleware, authorizeRoles('admin'), getAllUsers);
router.delete('/users/:id', authMiddleware, authorizeRoles('admin'), deleteUser);
router.get('/categories', authMiddleware, authorizeRoles('admin'), getAllCategories);
router.get('/services', authMiddleware, authorizeRoles('admin'), getAllServices);
router.get('/bookings', authMiddleware, authorizeRoles('admin'), getAllBookings);
router.get('/stats', authMiddleware, authorizeRoles('admin'), getDashboardStats);

module.exports = router;