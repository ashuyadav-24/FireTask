import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hostelcart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiration handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      if (!originalRequest.url.includes('/auth/login')) {
        localStorage.removeItem('hostelcart_token');
        localStorage.removeItem('hostelcart_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Order endpoints
export const orderAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrder: (id, data) => api.put(`/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  joinOrder: (id, data) => api.post(`/orders/${id}/join`, data),
  leaveOrder: (id) => api.post(`/orders/${id}/leave`),
  updateContribution: (id, data) => api.put(`/orders/${id}/contribution`, data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  removeParticipant: (orderId, participantUserId) =>
    api.delete(`/orders/${orderId}/participants/${participantUserId}`)
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getMyOrders: () => api.get('/users/my-orders')
};

export default api;
