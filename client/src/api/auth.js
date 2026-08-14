import api, { refreshSession } from './client';

export function register(payload) {
  return api.post('/auth/register', payload);
}

export function login(payload) {
  return api.post('/auth/login', payload);
}

export function logout() {
  return api.post('/auth/logout');
}

export function refresh() {
  return refreshSession();
}

export function getMe() {
  return api.get('/auth/me');
}

export function changePassword(payload) {
  return api.put('/auth/change-password', payload);
}
