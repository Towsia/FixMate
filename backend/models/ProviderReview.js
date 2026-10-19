const mongoose = require('mongoose');

const providerReviewSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500 },
}, { timestamps: true });

providerReviewSchema.index({ bookingId: 1, providerId: 1 }, { unique: true });

module.exports = mongoose.model('ProviderReview', providerReviewSchema);
