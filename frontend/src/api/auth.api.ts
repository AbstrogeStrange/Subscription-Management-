import { apiClient } from './config';

export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    plan: string;
  }) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  login: async (data: { email: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/login', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },

  addBillingAddress: async (data: {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    try {
      const response = await apiClient.post('/auth/billing-address', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getBillingAddress: async () => {
    try {
      const response = await apiClient.get('/auth/billing-address');
      return response;
    } catch (error) {
      throw error;
    }
  },
};