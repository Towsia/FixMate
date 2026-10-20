const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('providerId', 'name email');
    res.status(200).json({ success: true, services });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getNidList = async (req, res) => {
  try {
    const users = await User.find({ role: 'provider', nidNumber: { $exists: true, $ne: null } }).select('name email nidNumber nidStatus');
    res.status(200).json({ success: true, users });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};