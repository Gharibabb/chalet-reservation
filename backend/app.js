const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur MongoDB:", err));

// Import des routes
const reservationRoutes = require('./routes/reservations');
const adminRoutes = require('./routes/admin');

// Utilisation des routes
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes); 

// Lancement serveur
app.listen(process.env.PORT, () => {
  console.log(`🚀 Serveur backend lancé sur le port ${process.env.PORT}`);
});
