import api from './api';

export const librarianService = {
  // Library Management
  getMyLibraries: async () => {
    const response = await api.get('/libraries/my-libraries');
    return response.data;
  },

  createLibrary: async (formData) => {
    const response = await api.post('/libraries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  updateLibrary: async (id, formData) => {
    const response = await api.put(`/libraries/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  deleteLibrary: async (id) => {
    const response = await api.delete(`/libraries/${id}`);
    return response;
  },

  // Time Slots Management
  getTimeSlots: async (libraryId) => {
    const response = await api.get(`/timeslots/library/${libraryId}`);
    return response.data;
  },

  createTimeSlot: async (libraryId, data) => {
    const response = await api.post('/timeslots', {
      library_id: libraryId,
      ...data,
    });
    return response;
  },

  updateTimeSlot: async (id, data) => {
    const response = await api.put(`/timeslots/${id}`, data);
    return response;
  },

  deleteTimeSlot: async (id) => {
    const response = await api.delete(`/timeslots/${id}`);
    return response;
  },

  // Bookings
  getLibraryBookings: async (libraryId, page = 1, limit = 10) => {
    const response = await api.get(`/bookings/library/${libraryId}?page=${page}&limit=${limit}`);
    return response;
  },

  // Dashboard Stats
  getLibrarianStats: async (libraryId) => {
    // This will aggregate from bookings
    const response = await api.get(`/bookings/library/${libraryId}/stats`);
    return response.data;
  },
};
