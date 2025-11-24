import api from './api';

export const paymentService = {
  createOrder: async (bookingId, amount) => {
    return await api.post('/payment/create-order', { bookingId, amount });
  },

  verifyPayment: async (paymentData) => {
    return await api.post('/payment/verify', paymentData);
  }
};
