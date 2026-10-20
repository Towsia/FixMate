const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const sendEmail = require('../utils/email');


exports.getAdminDetails = async (req, res) => {
  try {
    
    const users = await User.find({ role: 'user' }).select('-password');
    
    
    const verifiedProviders = await User.find({ role: 'provider', isProviderVerified: true }).select('-password');
    const pendingProviders = await User.find({ role: 'provider', isProviderVerified: false }).select('-password');
    
    
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
      verifiedProviders,
      pendingProviders,
      services,
      bookings,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Pending Provider Approve 
exports.approveProvider = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ success: false, message: 'Provider not found' });

        user.isProviderVerified = true; 
        user.nidStatus = 'verified';    
        await user.save();

        
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your FixMate Provider Application is Approved!',
                html: `<h1>Congratulations ${user.name}!</h1><p>Your application to become a FixMate provider has been approved.</p>`
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
        }

        res.status(200).json({ success: true, message: 'Provider Approved & Email Sent!' });
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