const ProviderReview = require('../models/ProviderReview');
const Booking = require('../models/Booking');

exports.createProviderReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const providerId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.providerId.toString() !== providerId) {
      return res.status(403).json({ message: 'You are not the provider for this booking' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate after booking is completed' });
    }

    const existingReview = await ProviderReview.findOne({ bookingId, providerId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this customer for this booking' });
    }

    const review = await ProviderReview.create({
      bookingId,
      providerId,
      userId: booking.userId,
      rating,
      comment
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await ProviderReview.find({ userId: req.params.userId })
      .populate('providerId', 'name profileImage');
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyReceivedReviews = async (req, res) => {
  try {
    const reviews = await ProviderReview.find({ userId: req.user.id })
      .populate('providerId', 'name profileImage');
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
