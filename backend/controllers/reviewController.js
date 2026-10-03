const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// ==================== Create Review ====================
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed bookings'
      });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to review this booking'
      });
    }

    const existingReview = await Review.findOne({ 
      bookingId, 
      userId: req.user.id 
    });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    const review = await Review.create({
      bookingId,
      userId: req.user.id,
      serviceId: booking.serviceId,
      providerId: booking.providerId,
      rating,
      comment
    });

    await updateServiceRating(booking.serviceId);

    res.status(201).json({
      success: true,
      message: 'Review added successfully!',
      review
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Get Service Reviews ====================
exports.getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.serviceId })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 });

    let averageRating = 0;
    if (reviews.length > 0) {
      const total = reviews.reduce((sum, r) => sum + r.rating, 0);
      averageRating = (total / reviews.length).toFixed(1);
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: Number(averageRating),
      reviews
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Get My Reviews ====================
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id })
      .populate('serviceId', 'title price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Update Review ====================
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized'
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    await updateServiceRating(review.serviceId);

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Delete Review ====================
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized'
      });
    }

    const serviceId = review.serviceId;
    await Review.findByIdAndDelete(req.params.id);

    await updateServiceRating(serviceId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== Helper: Update Service Rating ====================
async function updateServiceRating(serviceId) {
  const reviews = await Review.find({ serviceId });
  
  let averageRating = 0;
  if (reviews.length > 0) {
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    averageRating = total / reviews.length;
  }

  await Service.findByIdAndUpdate(serviceId, {
    averageRating: Math.round(averageRating * 10) / 10
  });
}