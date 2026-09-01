import { api } from './api';

/**
 * One place that knows the shape of the API. Screens call these rather than
 * building paths themselves, so a route change is a single edit.
 */
export const auth = {
  register: body => api.post('/v1/auth/register', body, { auth: false }),
  login: (email, password) =>
    api.post('/v1/auth/login', { email, password }, { auth: false }),
  logout: () => api.post('/v1/auth/logout'),
  changePassword: (currentPassword, newPassword) =>
    api.post('/v1/auth/change-password', { currentPassword, newPassword }),
};

export const users = {
  me: () => api.get('/v1/users/me'),
  update: body => api.patch('/v1/users/me', body),
  profile: userId => api.get(`/v1/users/${userId}`),
  deactivate: () => api.post('/v1/users/me/deactivate'),
  remove: () => api.delete('/v1/users/me'),
};

export const moments = {
  checkIn: position => api.post('/v1/moments/check-in', position),
  nearby: (window = 'hour') => api.get(`/v1/moments/nearby?window=${window}`),
};

export const likes = {
  act: (targetUserId, action, momentId) =>
    api.post('/v1/likes', { targetUserId, action, momentId }),
  admirers: () => api.get('/v1/likes/admirers'),
  matches: () => api.get('/v1/likes/matches'),
};

export const chat = {
  messages: matchId => api.get(`/v1/chat/${matchId}/messages`),
  send: (matchId, body) => api.post(`/v1/chat/${matchId}/messages`, { body }),
  markRead: matchId => api.post(`/v1/chat/${matchId}/read`),
};

export const notifications = {
  list: () => api.get('/v1/notifications'),
  markRead: () => api.post('/v1/notifications/read'),
};

export const safety = {
  blocks: () => api.get('/v1/safety/blocks'),
  block: userId => api.post('/v1/safety/blocks', { userId }),
  unblock: userId => api.delete(`/v1/safety/blocks/${userId}`),
  report: (userId, reason, detail) =>
    api.post('/v1/safety/reports', { userId, reason, detail }),
  feedback: (reason, message) =>
    api.post('/v1/safety/feedback', { reason, message }),
};
