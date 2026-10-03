const Booking = require('../models/Booking');
const Service = require('../models/Service');

// ==================== Create Booking ====================
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date, time, address, phone, notes } = req.body;

    
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    
    if (service.providerId.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own service'
      });
    }

    const booking = await Booking.create({
      serviceId,
      userId: req.user.id,
      providerId: service.providerId,
      date,
      time,
      address,
      phone,
      notes,
      totalPrice: service.price,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Get My Bookings (User) ====================
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('serviceId', 'title price location')
      .populate('providerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Get Single Booking ====================
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId', 'title price location')
      .populate('userId', 'name email phone')
      .populate('providerId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Update Booking Status (Provider) ====================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    
    if (booking.providerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized'
      });
    }

    // Valid Status Check
    const validStatuses = ['accepted', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Cancel Booking (User) ====================
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};