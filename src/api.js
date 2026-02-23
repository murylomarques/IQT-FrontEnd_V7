import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';


const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // necessário para CSRF
});

export default api;
