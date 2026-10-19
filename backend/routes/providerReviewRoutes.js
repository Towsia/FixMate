const express = require('express');
const router = express.Router();
const { createProviderReview, getUserReviews, getMyReceivedReviews } = require('../controllers/providerReviewController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

router.post('/', authMiddleware, authorizeRoles('provider'), createProviderReview);
router.get('/user/:userId', getUserReviews);
router.get('/my-received', authMiddleware, getMyReceivedReviews);

module.exports = router;
