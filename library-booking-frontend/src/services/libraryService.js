import api from './api';

export const libraryService = {
  getLibraries: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/libraries?${queryString}`);
  },

  getFeaturedLibraries: async () => {
    return await api.get('/libraries/featured');
  },

  getLibrary: async (id) => {
    return await api.get(`/libraries/${id}`);
  },

  createLibrary: async (formData) => {
    return await api.post('/libraries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updateLibrary: async (id, formData) => {
    return await api.put(`/libraries/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deleteLibrary: async (id) => {
    return await api.delete(`/libraries/${id}`);
  },

  getMyLibraries: async () => {
    return await api.get('/libraries/my-libraries');
  }
};
