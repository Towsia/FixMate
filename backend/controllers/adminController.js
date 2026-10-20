const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');


exports.getAdminDetails = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    const providers = await User.find({ role: 'provider' }).select('-password');
    const services = await Service.find().populate('providerId', 'name');
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('serviceId', 'title price')
      .populate('providerId', 'name');
    const reviews = await Review.find()
      .populate('userId', 'name')
      .populate('serviceId', 'title');

    res.status(200).json({
      success: true,
      users,
      providers,
      services,
      bookings,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find().populate('providerId', 'name');
        res.status(200).json({ success: true, services });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getNidList = async (req, res) => {
    try {
        const users = await User.find({ role: 'provider', nidNumber: { $exists: true, $ne: null } }).select('name email nidNumber nidStatus');
        res.status(200).json({ success: true, users });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};