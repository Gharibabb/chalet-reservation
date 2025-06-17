const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Envoie un message WhatsApp à un utilisateur
 * @param {string} to - Numéro de téléphone (ex: +2136XXXXXXX)
 * @param {string} body - Message à envoyer
 */
const sendWhatsApp = async (to, body) => {
  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
      body
    });
    console.log("📨 WhatsApp envoyé à", to);
    return message;
  } catch (error) {
    console.error("❌ Erreur WhatsApp:", error.message);
  }
};

module.exports = sendWhatsApp;
