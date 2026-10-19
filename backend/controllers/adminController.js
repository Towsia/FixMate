const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

// ==================== Get All Users ====================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== Delete User ====================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== Get All Categories ====================
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== Get All Services ====================
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('categoryId', 'name')
      .populate('providerId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: services.length, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== Get All Bookings ====================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('serviceId', 'title price')
      .populate('userId', 'name email')
      .populate('providerId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== Dashboard Statistics ====================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalCategories = await Category.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    res.status(200).json({
      success: true,
      statistics: {
        totalUsers,
        totalProviders,
        totalCategories,
        totalServices,
        totalBookings,
        pendingBookings,
        completedBookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};