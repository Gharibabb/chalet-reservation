import React, { useEffect, useState } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    const res = await API.get('/reservations');
    setReservations(res.data);
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await API.put(`/reservations/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReservations();
    } catch (err) {
      alert("Erreur mise à jour");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Réservations</h2>
      {reservations.map((res) => (
        <div key={res._id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <p><strong>Nom:</strong> {res.name}</p>
          <p><strong>Téléphone:</strong> {res.phone}</p>
          <p><strong>startTime:</strong> {new Date(res.startTime).toLocaleDateString()}</p>
          <p><strong>endTime:</strong> {new Date(res.endTime).toLocaleDateString()}</p>
          <p><strong>Date:</strong> {res.price} $ </p>
          <p><strong>Statut:</strong> {res.status}</p>
          {res.status === 'pending' && (
            <>
              <button onClick={() => updateStatus(res._id, 'accepted')} style={{ marginRight: 5, backgroundColor: 'green', color: 'white' }}>
                Accepter
              </button>
              <button onClick={() => updateStatus(res._id, 'rejected')} style={{ backgroundColor: 'red', color: 'white' }}>
                Refuser
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
