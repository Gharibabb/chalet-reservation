import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API from '../services/api';
import './ReservationPage.css';

// Import du sélecteur de numéro de téléphone
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ReservationForm = () => {
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reservedDates, setReservedDates] = useState([]);

  // Charger les dates déjà réservées
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await API.get('/reservations');
        const accepted = res.data.filter(r => r.status === 'accepted');
        const dates = accepted.map(r => new Date(r.date).toDateString());
        setReservedDates(dates);
      } catch (error) {
        console.error("Erreur lors du chargement des réservations :", error);
      }
    };
    fetchReservations();
  }, []);

  // Vérifier si une date est déjà réservée
  const isDateReserved = (selectedDate) =>
    reservedDates.includes(selectedDate.toDateString());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    try {
      await API.post('/reservations', {
        name,
        phone: formattedPhone,
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
    <div className="background-container">
      <div className="content-box">
        <h2>Cozy Chalet</h2>

        <DatePicker
          selected={date}
          onChange={setDate}
          filterDate={(d) => !isDateReserved(d)}
          className="custom-datepicker"
        />

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
          />

          <PhoneInput
            country={'lb'} // Liban par défaut
            value={phone}
            onChange={setPhone}
            inputStyle={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
            }}
            enableSearch={true}
            specialLabel=""
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: 10,
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
            }}
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
