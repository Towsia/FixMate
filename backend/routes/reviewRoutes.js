const express = require('express');
const router = express.Router();
const {
  createReview,
  getServiceReviews,
  getMyReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

// ===== Public Routes =====
router.get('/service/:serviceId', getServiceReviews);

// ===== Protected Routes =====
router.post('/', authMiddleware, createReview);
router.get('/my-reviews', authMiddleware, getMyReviews);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;