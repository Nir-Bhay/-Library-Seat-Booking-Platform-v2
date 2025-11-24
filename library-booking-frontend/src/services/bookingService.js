import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    return await api.post('/bookings', bookingData);
  },

  getMyBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/bookings/my-bookings?${queryString}`);
  },

  getBooking: async (id) => {
    return await api.get(`/bookings/${id}`);
  },

  cancelBooking: async (id, reason) => {
    return await api.put(`/bookings/${id}/cancel`, { cancellationReason: reason });
  },

  getLibrarianBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/bookings/librarian/bookings?${queryString}`);
  },

  checkAvailability: async (libraryId, date, timeSlotId) => {
    return await api.get('/bookings/check-availability', {
      params: { libraryId, date, timeSlotId }
    });
  }
};
