const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Initialiser dotenv
dotenv.config();

// Créer l'application Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connecté à MongoDB'))
  .catch((err) => console.error('❌ Erreur MongoDB:', err));

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reservations', require('./routes/reservation'));

// Exporter l'app
module.exports = app;
