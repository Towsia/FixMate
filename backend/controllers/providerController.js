const Service = require('../models/Service');
const Booking = require('../models/Booking');

// ==================== Get My Services (Provider) ====================
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user.id })
      .populate('categoryId', 'name icon')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== Get Provider Bookings ====================
exports.getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.user.id })
      .populate('serviceId', 'title price')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== Update Booking Status (Accept/Reject) ====================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.providerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const validStatuses = ['accepted', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== Get Statistics ====================
exports.getStatistics = async (req, res) => {
  try {
    const totalServices = await Service.countDocuments({ providerId: req.user.id });
    const totalBookings = await Booking.countDocuments({ providerId: req.user.id });
    const pendingBookings = await Booking.countDocuments({ 
      providerId: req.user.id, 
      status: 'pending' 
    });
    const acceptedBookings = await Booking.countDocuments({ 
      providerId: req.user.id, 
      status: 'accepted' 
    });
    const completedBookings = await Booking.countDocuments({ 
      providerId: req.user.id, 
      status: 'completed' 
    });

    res.status(200).json({
      success: true,
      statistics: {
        totalServices,
        totalBookings,
        pendingBookings,
        acceptedBookings,
        completedBookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== Update Service Status ====================
exports.updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.providerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    service.status = status;
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service status updated',
      service
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};