import axios from 'axios';

const API = axios.create({
  baseURL: 'https://chalet-reservation.onrender.com/api',
});

export default API;
