import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
});

export async function getRestaurants(filters = {}) {
  const { data } = await api.get('/restaurants', { params: filters });
  return data;
}

export async function createRestaurant(payload) {
  const { data } = await api.post('/restaurants', payload);
  return data;
}

export async function updateRestaurant(id, payload) {
  const { data } = await api.put(`/restaurants/${id}`, payload);
  return data;
}

export async function deleteRestaurant(id) {
  await api.delete(`/restaurants/${id}`);
}

export async function getReservations() {
  const { data } = await api.get('/reservations');
  return data;
}

export async function createReservation(payload) {
  const { data } = await api.post('/reservations', payload);
  return data;
}


export async function deleteReservation(id) {
  const { data } = await api.delete(`/reservations/${id}`);
  return data;
}