import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  signup: (email, company_name) =>
    api.post('/auth/signup', { email, company_name }),

  getUser: (userId) =>
    api.get(`/auth/user/${userId}`),

  updateUser: (userId, data) =>
    api.put(`/auth/user/${userId}`, data),

  verifyToken: (token) =>
    api.post('/auth/verify-token', { token }),
};

// Newsletter API
export const newsletterAPI = {
  generate: (userId, requirements) =>
    api.post(`/newsletters/generate?user_id=${userId}`, requirements),

  getNewsletter: (newsletterId) =>
    api.get(`/newsletters/${newsletterId}`),

  listUserNewsletters: (userId) =>
    api.get(`/newsletters/user/${userId}`),
};

// Template API
export const templateAPI = {
  listTemplates: () =>
    api.get('/templates/'),

  getTemplate: (templateId) =>
    api.get(`/templates/${templateId}`),

  searchTemplates: (query) =>
    api.get(`/templates/search/${query}`),
};

// Health check
export const health = () =>
  api.get('/health');

export default api;
