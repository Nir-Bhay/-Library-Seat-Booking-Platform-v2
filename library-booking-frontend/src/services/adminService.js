import api from './api';

export const adminService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard-stats');
    return response.data;
  },

  // Library Management
  getPendingLibraries: async (page = 1, limit = 10) => {
    const response = await api.get(`/admin/pending-libraries?page=${page}&limit=${limit}`);
    return response;
  },

  approveLibrary: async (id) => {
    const response = await api.put(`/admin/approve-library/${id}`);
    return response;
  },

  rejectLibrary: async (id, reason) => {
    const response = await api.put(`/admin/reject-library/${id}`, { reason });
    return response;
  },

  getAllLibraries: async (page = 1, limit = 10) => {
    const response = await api.get(`/admin/all-libraries?page=${page}&limit=${limit}`);
    return response;
  },

  // User Management
  getAllUsers: async (page = 1, limit = 10, role = '') => {
    const response = await api.get(`/admin/all-users?page=${page}&limit=${limit}${role ? `&role=${role}` : ''}`);
    return response;
  },

  updateUserStatus: async (id, isActive) => {
    const response = await api.put(`/admin/user/${id}/status`, { isActive });
    return response;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/user/${id}`);
    return response;
  },

  // Booking Management
  getAllBookings: async (page = 1, limit = 10, status = '') => {
    const response = await api.get(`/admin/all-bookings?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`);
    return response;
  },

  // Commission Reports
  getCommissionReport: async (startDate = '', endDate = '') => {
    const response = await api.get(`/admin/commission-report?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/admin/settings', settings);
    return response;
  },
};
