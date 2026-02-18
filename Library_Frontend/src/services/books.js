import API from './api';

export const booksAPI = {
  stats: () => API.get('/books/stats'),
  list: (search) => API.get(`/books${search ? `?search=${search}` : ''}`),
  create: (data) => API.post('/books', data),
  update: (id, data) => API.put(`/books/${id}`, data),
  remove: (id) => API.delete(`/books/${id}`)
};