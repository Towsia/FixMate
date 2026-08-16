const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/BlacklistToken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied! No token provided.'
      });
    }

    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token invalid! Please login again.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired! Please login again.'
      });
    }
    res.status(401).json({
      success: false,
      message: 'Invalid token!'
    });
  }
};

module.exports = authMiddleware;