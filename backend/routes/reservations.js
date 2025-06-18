const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const sendWhatsApp = require('../utils/sendWhatsApp');

// Créer une réservation
router.post('/', async (req, res) => {
  const { name, phone, startTime, endTime, price } = req.body;
  if (!startTime || !endTime) {
    return res.status(400).json({ message: "Start and end time are required" });
  }
  try {const newRes = new Reservation({
      name,
      phone,
      startTime,
      endTime,
      price,
    });
    await newRes.save();
    res.status(201).json(newRes);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Erreur création réservation' });
  }
});

// Récupérer toutes les réservations (admin)
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération réservations' });
  }
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

    if (!updated) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Format des dates
    const startStr = new Date(updated.startTime).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const endStr = new Date(updated.endTime).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const msg =
      status === 'accepted'
        ? `Hello ${updated.name}, your reservation from ${startStr} to ${endStr} has been ACCEPTED. Thank you!`
        : `Hello ${updated.name}, unfortunately your reservation from ${startStr} to ${endStr} has been REJECTED.`;

    await sendWhatsApp(updated.phone, msg);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur mise à jour ou envoi WhatsApp" });
  }
});

module.exports = router;
