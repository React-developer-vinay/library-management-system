import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // Direct API URL
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data)
};

export const booksAPI = {
  stats: () => API.get('/books/stats'),
  list: (search) => API.get(`/books${search ? `?search=${search}` : ''}`),
  create: (data) => API.post('/books', data),
  update: (id, data) => API.put(`/books/${id}`, data),
  remove: (id) => API.delete(`/books/${id}`)
};

export const studentsAPI = {
  list: (search) => API.get(`/students${search ? `?search=${search}` : ''}`),
  create: (data) => API.post('/students', data),
  update: (id, data) => API.put(`/students/${id}`, data),
  remove: (id) => API.delete(`/students/${id}`)
};

export const issuesAPI = {
  list: () => API.get('/issues'),
  history: () => API.get('/issues/history'),
  issue: (data) => API.post('/issues', data),
  return: (id, data) => API.post(`/issues/${id}/return`, data)
};

export default API;
