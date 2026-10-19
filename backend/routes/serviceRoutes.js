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
const authorizeRoles = require('../middleware/authorizeRoles');
const upload = require('../middleware/upload');

// ===== Public Routes =====
router.get('/', getAllServices);
router.get('/:id', getService);

// ===== Protected Routes =====
router.post('/', authMiddleware, authorizeRoles('provider'), upload.array('images', 5), createService);
router.put('/:id', authMiddleware, authorizeRoles('provider'), updateService);
router.delete('/:id', authMiddleware, authorizeRoles('provider'), deleteService);
router.get('/provider/my-services', authMiddleware, authorizeRoles('provider'), getMyServices);

module.exports = router;