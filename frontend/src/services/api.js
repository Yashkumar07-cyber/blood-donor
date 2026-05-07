import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Donors
export const donorService = {
  registerDonor: (data) => api.post('/donors', data),
  getNearby: (params) => api.get('/donors/nearby', { params }),
  getById: (id) => api.get(`/donors/${id}`),
  updateProfile: (data) => api.put('/donors/me', data),
  toggleAvailability: () => api.patch('/donors/availability'),
};

// Blood Requests
export const requestService = {
  create: (data) => api.post('/requests', data),
  getAll: (params) => api.get('/requests', { params }),
  getById: (id) => api.get(`/requests/${id}`),
  getMyRequests: () => api.get('/requests/my'),
  respond: (id, status) => api.patch(`/requests/${id}/respond`, { status }),
  updateStatus: (id, status) => api.patch(`/requests/${id}/status`, { status }),
};
