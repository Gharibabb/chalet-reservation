const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  startTime: Date,
  endTime: Date,
  price: Number, // si tu veux aussi stocker le prix
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
});


module.exports = mongoose.model('Reservation', reservationSchema);
