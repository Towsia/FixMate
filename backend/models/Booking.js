const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  providerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  totalPrice: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);