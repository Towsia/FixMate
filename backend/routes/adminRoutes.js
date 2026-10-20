const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getAllServices, getNidList } = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/users', authMiddleware, authorizeRoles('admin'), getAllUsers);
router.delete('/users/:id', authMiddleware, authorizeRoles('admin'), deleteUser);
router.get('/services', authMiddleware, authorizeRoles('admin'), getAllServices);
router.get('/nid-list', authMiddleware, authorizeRoles('admin'), getNidList);

module.exports = router;