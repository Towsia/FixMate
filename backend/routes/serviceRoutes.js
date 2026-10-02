const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
  getMyServices
} = require('../controllers/serviceController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// ===== Public Routes =====
router.get('/', getAllServices);
router.get('/:id', getService);

// ===== Protected Routes =====
router.post('/', authMiddleware, upload.array('images', 5), createService);
router.put('/:id', authMiddleware, updateService);
router.delete('/:id', authMiddleware, deleteService);
router.get('/provider/my-services', authMiddleware, getMyServices);

module.exports = router;