const User = require('../models/User');
const BlacklistToken = require('../models/BlacklistToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==================== Registration ====================
exports.register = async (req, res) => {
  try {
    const { name, password, role } = req.body;
    let { email } = req.body;

    // ===== Email Lowercase + Trim =====
    email = email.toLowerCase().trim();

    let assignedRole = 'user';
    if (role === 'provider') assignedRole = 'provider';
    if (role === 'admin') assignedRole = 'admin';

    // ===== Email Already Exists? =====
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }

    // ===== Password Hash =====
    const hashedPassword = await bcrypt.hash(password, 10);

    // ===== User Create (Auto Verified) =====
    const user = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
      role: assignedRole,
      isVerified: true    // ← Auto Verified
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! You can now login.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ==================== Login (Admin Auto Login) ====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ===== Admin Auto Login =====
    if (email === 'admin@fixmate.com' && password === 'admin123') {
      let adminUser = await User.findOne({ email: 'admin@fixmate.com' });
      
      if (!adminUser) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        adminUser = await User.create({
          name: 'Admin',
          email: 'admin@fixmate.com',
          password: hashedPassword,
          role: 'admin',
          isVerified: true
        });
      }

      const token = jwt.sign(
        { id: adminUser._id, email: adminUser.email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Admin login successful',
        token,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: 'admin',
          isVerified: true
        }
      });
    }

    // ===== Normal User Login =====
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Logout ====================
exports.logout = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided'
      });
    }

    await BlacklistToken.create({ token });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully!'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};