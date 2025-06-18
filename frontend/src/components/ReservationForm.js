import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API from '../services/api';
import './ReservationPage.css';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ReservationForm = () => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 3600000));
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState(0);
  const [reservedRanges, setReservedRanges] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await API.get('/reservations');
        const accepted = res.data.filter(r => r.status === 'accepted');
        const ranges = accepted.map(r => ({
          start: new Date(r.startTime),
          end: new Date(r.endTime)
        }));
        setReservedRanges(ranges);
      } catch (error) {
        console.error("Erreur lors du chargement des réservations :", error);
      }
    };
    fetchReservations();
  }, []);

  useEffect(() => {
    if (endTime > startTime) {
      calculatePrice();
    } else {
      setPrice(0);
    }
  }, [startTime, endTime]);

  const calculatePrice = () => {
    const durationMs = endTime - startTime;
    const durationHours = durationMs / (1000 * 60 * 60);

    let total = 0;
    if (durationHours <= 12) {
      total = 100;
    } else if (durationHours <= 24) {
      total = 180;
    } else {
      const fullDays = Math.floor(durationHours / 24);
      const remainingHours = durationHours % 24;

      if (remainingHours > 0 && remainingHours <= 12) {
        total = fullDays * 180 + 100;
      } else if (remainingHours > 12) {
        total = fullDays * 180 + 180;
      } else {
        total = fullDays * 180;
      }
    }
    setPrice(total);
  };

  const isOverlapping = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
  };

  const isDateRangeReserved = () =>
    reservedRanges.some(r => isOverlapping(startTime, endTime, r.start, r.end));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (endTime <= startTime) {
      alert("La date de fin doit être après la date de début.");
      return;
    }

    if (isDateRangeReserved()) {
      alert("Cette plage horaire est déjà réservée.");
      return;
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    console.log({
  name,
  phone,
  startTime,
  endTime,
  price
});

    try {
      await API.post('/reservations', {
        name,
        phone: formattedPhone,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        price: Number(price),
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
        <h1>Cozy Chalet</h1>
        <h3>12h: $100 — 24h: $180</h3>

         <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 'bold' }} >FROM  : </label>
          <DatePicker
            selected={startTime}
            onChange={(date) => setStartTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="yyyy/MM/dd HH:mm"
            className="custom-datepicker"
            wrapperClassName="date-picker-wrapper"
          />
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 'bold' }}>TO : </label>
          <DatePicker
            selected={endTime}
            onChange={(date) => setEndTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="yyyy/MM/dd HH:mm"
            className="custom-datepicker"
            wrapperClassName="date-picker-wrapper"
          />
        </div>

        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
          Total Price: ${price}
        </div>

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
            country={'lb'}
            value={phone}
            onChange={setPhone}
            inputStyle={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
            }}
            enableSearch
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
