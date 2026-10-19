const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

// ===== Public Routes =====
router.get('/', getAllCategories);
router.get('/:id', getCategory);

// ===== Protected Routes (Admin Only) =====
router.post('/', authMiddleware, authorizeRoles('admin'), createCategory);
router.put('/:id', authMiddleware, authorizeRoles('admin'), updateCategory);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteCategory);

module.exports = router;