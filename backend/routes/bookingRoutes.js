const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

// ===== Protected Routes =====
router.post('/', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getMyBookings);
router.get('/provider-bookings', authMiddleware, getProviderBookings);
router.get('/:id', authMiddleware, getBooking);
router.put('/:id/status', authMiddleware, updateBookingStatus);
router.put('/:id/cancel', authMiddleware, cancelBooking);

module.exports = router;