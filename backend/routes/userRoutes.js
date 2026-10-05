const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture
} = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile', authMiddleware, getMyProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);
router.post('/profile-picture', authMiddleware, upload.single('profileImage'), uploadProfilePicture);

module.exports = router;