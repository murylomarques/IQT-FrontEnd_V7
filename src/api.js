import axios from 'axios';

const api = axios.create({
  baseURL: 'https://iqt.desktop.com.br/api',
  withCredentials: true, // necessário para CSRF
});

export default api;
