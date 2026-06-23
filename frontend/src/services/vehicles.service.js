import api from './api.js';

export const vehiclesService = {
  findAll:  ()         => api.get('/vehicles'),
  create:   (data)     => api.post('/vehicles', data),
  update:   (id, data) => api.patch(`/vehicles/${id}`, data),
  remove:   (id)       => api.delete(`/vehicles/${id}`),
};
