import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

export const predictPerformance = async (payload) => (await API.post('/predictions', payload)).data;
export const getPredictionHistory = async () => (await API.get('/predictions/history')).data;
export const createQuiz = async (payload) => (await API.post('/quiz', payload)).data;
export const registerUser = async (payload) => (await API.post('/auth/register', payload)).data;
export const loginUser = async (payload) => (await API.post('/auth/login', payload)).data;
export const getStudents = async () => (await API.get('/students')).data;
