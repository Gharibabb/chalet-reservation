import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import API from '../services/api';
import 'react-calendar/dist/Calendar.css';

const ReservationForm = () => {
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reservedDates, setReservedDates] = useState([]);

  // Récupérer les dates réservées pour désactiver
  useEffect(() => {
    const fetchReservations = async () => {
      const res = await API.get('/reservations');
      const accepted = res.data.filter(r => r.status === 'accepted');
      const dates = accepted.map(r => new Date(r.date).toDateString());
      setReservedDates(dates);
    };
    fetchReservations();
  }, []); 

  // Empêcher de sélectionner une date déjà réservée
  const isTileDisabled = ({ date }) => {
    return reservedDates.includes(date.toDateString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reservations', {
        name,
        phone,
        date,
      });
      alert("Réservation soumise ! Vous recevrez une réponse via WhatsApp.");
      setName('');
      setPhone('');
    } catch {
      alert("Erreur lors de la réservation.");
    }
  };

  return (
    <div className="reservation-form" style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Réserver le chalet</h2>
      <Calendar
        onChange={setDate}
        value={date}
        tileDisabled={isTileDisabled}
      />

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <input
          type="tel"
          placeholder="Votre numéro WhatsApp (+213...)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, backgroundColor: '#28a745', color: 'white', border: 'none' }}>
          Réserver
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
