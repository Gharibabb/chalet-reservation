const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const sendWhatsApp = require('../utils/sendWhatsApp');

// Créer une réservation
router.post('/', async (req, res) => {
  const { name, phone, date } = req.body;

  try {
    const newRes = new Reservation({ name, phone, date });
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

    // Préparer le message
    const msg =
      status === 'accepted'
        ? `Bonjour ${updated.name}, votre réservation pour le ${new Date(updated.date).toLocaleDateString()} a été ACCEPTÉE. Merci !`
        : `Bonjour ${updated.name}, désolé, votre réservation pour le ${new Date(updated.date).toLocaleDateString()} a été REFUSÉE.`;

    // Envoyer WhatsApp
    await sendWhatsApp(updated.phone, msg);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur mise à jour ou envoi WhatsApp" });
  }
});

module.exports = router;
