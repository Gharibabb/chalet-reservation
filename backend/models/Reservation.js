const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
