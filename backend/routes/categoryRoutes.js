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

// ===== Public Routes =====
router.get('/', getAllCategories);
router.get('/:id', getCategory);

// ===== Protected Routes (Admin Only) =====
router.post('/', authMiddleware, createCategory);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;