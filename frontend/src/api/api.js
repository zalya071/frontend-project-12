import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
});

export const getAuthApi = (token) => axios.create({
  baseURL: '/api/v1',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default api;