const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const admin = new Admin({
    username: 'admin',
    password: '123456' // sera automatiquement hashé
  });

  await admin.save();
  console.log('✅ Admin créé avec succès !');
  process.exit();
};

createAdmin();
