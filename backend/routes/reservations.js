const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const sendWhatsApp = require('../utils/sendWhatsApp');

// Créer une réservation
router.post('/', async (req, res) => {
  const { name, phone, startDate, endDate } = req.body;

  try {
    const newRes = new Reservation({ name, phone, startDate, endDate });
    await newRes.save();
    res.status(201).json(newRes);
  } catch (err) {
    res.status(400).json({ message: 'Erreur création réservation' });
  }
});

// Récupérer toutes les réservations (admin)
router.get('/', async (req, res) => {
  const reservations = await Reservation.find();
  res.json(reservations);
});

// Accepter ou refuser une réservation
router.put('/:id', async (req, res) => {
  const { status } = req.body;

  try {
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // Format des dates
    const startStr = new Date(updated.startDate).toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    const endStr = new Date(updated.endDate).toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    // Préparer le message
    const msg =
      status === 'accepted'
        ? `Hello ${updated.name}, your reservation from ${startStr} to ${endStr} has been ACCEPTED. Thank you!`
        : `Hello ${updated.name}, unfortunately your reservation from ${startStr} to ${endStr} has been REJECTED.`;

    // Envoyer WhatsApp
    await sendWhatsApp(updated.phone, msg);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur mise à jour ou envoi WhatsApp" });
  }
});

module.exports = router;
