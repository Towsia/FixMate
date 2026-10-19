const express = require('express');
const router = express.Router();
const {
  getMyServices,
  getProviderBookings,
  updateBookingStatus,
  getStatistics,
  updateServiceStatus
} = require('../controllers/providerController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/my-services', authMiddleware, authorizeRoles('provider'), getMyServices);
router.get('/bookings', authMiddleware, authorizeRoles('provider'), getProviderBookings);
router.put('/bookings/:id/status', authMiddleware, authorizeRoles('provider'), updateBookingStatus);
router.get('/statistics', authMiddleware, authorizeRoles('provider'), getStatistics);
router.put('/services/:id/status', authMiddleware, authorizeRoles('provider'), updateServiceStatus);

module.exports = router;