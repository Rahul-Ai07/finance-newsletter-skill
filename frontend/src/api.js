import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (email, company_name) =>
    api.post('/auth/signup', { email, company_name }).then(res => {
      // Store token and user ID in localStorage
      if (res.data.token) {
        localStorage.setItem('auth_token', res.data.token);
        localStorage.setItem('user_id', res.data.id);
      }
      return res;
    }),

  getUser: () =>
    api.get('/auth/user'),

  updateUser: (data) =>
    api.put('/auth/user', data),

  verifyToken: () =>
    api.post('/auth/verify-token', {}),

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
  },
};

// Newsletter API
export const newsletterAPI = {
  generate: (requirements) =>
    api.post('/newsletters/generate', requirements),

  getNewsletter: (newsletterId) =>
    api.get(`/newsletters/${newsletterId}`),

  listUserNewsletters: () =>
    api.get('/newsletters/user/newsletters/list'),
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
  axios.get(`${API_BASE_URL.replace('/api', '')}/health`).catch(() => ({
    data: { status: 'unavailable' }
  }));

export default api;
