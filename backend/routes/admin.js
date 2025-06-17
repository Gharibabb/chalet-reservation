const express = require('express');
const router = express.Router(); // ✅ définition du router

const Admin = require('../models/Admin');
const bcrypt = require('bcrypt'); // ou bcryptjs
const jwt = require('jsonwebtoken');

// 📌 Route de connexion de l'admin
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ message: 'Utilisateur introuvable' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

module.exports = router;
