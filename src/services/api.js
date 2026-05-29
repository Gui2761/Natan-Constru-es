import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Adicionar Token JWT às requisições se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/800x800/222d42/ffffff?text=Sem+Foto';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const base = apiURL.replace(/\/api$/, '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${base}${path}`;
};

export default api;
