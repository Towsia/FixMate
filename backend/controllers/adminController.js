const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const sendEmail = require('../utils/email');

// Get all details for Admin Dashboard
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

// Approve a pending Provider
exports.approveProvider = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Provider not found' });
        }

        user.isProviderVerified = true;
        user.nidStatus = 'verified';
        await user.save();

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your FixMate Provider Application is Approved!',
                html: `
                    <h1>Congratulations ${user.name}!</h1>
                    <p>Your application to become a FixMate provider has been approved.</p>
                    <p>You can now login and start providing your services.</p>
                `
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
        }

        res.status(200).json({ success: true, message: 'Provider Approved & Email Sent!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a User
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};