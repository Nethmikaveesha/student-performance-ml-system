import axios from 'axios';

const STORAGE_KEY = 'splms_auth';

function normalizeApiBase(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return 'http://localhost:5000/api';
  }
  const u = url.trim().replace(/\/+$/, '');
  if (u.endsWith('/api')) return u;
  return `${u}/api`;
}

const API = axios.create({
  baseURL: normalizeApiBase(import.meta.env.VITE_API_BASE_URL),
});

/** Accepts { token, data:{...} } or { data:{ token, ...user } } from /auth/login and /auth/register */
export function extractAuthFromBody(body) {
  if (!body || typeof body !== 'object') return null;
  const token =
    typeof body.token === 'string'
      ? body.token
      : typeof body.data?.token === 'string'
        ? body.data.token
        : null;
  const raw =
    body.data && typeof body.data === 'object' && !Array.isArray(body.data)
      ? { ...body.data }
      : { ...body };
  delete raw.token;
  if (!token) return null;
  return { token, user: raw };
}

export function apiErrorMessage(error) {
  if (!error?.response) {
    if (error?.code === 'ERR_NETWORK') {
      return 'Cannot reach the server. Check your connection and that the API is running.';
    }
    return error?.message || 'Request failed.';
  }
  const d = error.response.data;
  if (typeof d?.message === 'string') return d.message;
  if (Array.isArray(d?.errors)) return d.errors.join('; ');
  return `Something went wrong (${error.response.status}).`;
}

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
}

export function persistAuth(user, token) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
  setAuthToken(token);
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
  setAuthToken(null);
}

const stored = typeof localStorage !== 'undefined' ? getStoredAuth() : null;
if (stored?.token) {
  setAuthToken(stored.token);
}

export const predictPerformance = async (payload) => (await API.post('/predictions', payload)).data;
export const getPredictionHistory = async () => (await API.get('/predictions/history')).data;
export const createQuiz = async (payload) => (await API.post('/quiz', payload)).data;
export const getQuizzes = async () => (await API.get('/quiz')).data;
export const registerUser = async (payload) => (await API.post('/auth/register', payload)).data;
export const loginUser = async (payload) => (await API.post('/auth/login', payload)).data;
export const getStudents = async () => (await API.get('/students')).data;
