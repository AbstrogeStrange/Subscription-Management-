import { apiClient } from './config';

export const subscriptionApi = {
  // Add subscription
  addSubscription: async (data: {
    name: string;
    category?: string;
    amount: number;
    billingCycle: string;
    nextBillingDate: string;
    paymentMethod?: string;
    notes?: string;
  }) => {
    try {
      const response = await apiClient.post('/subscriptions', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get all subscriptions with filters and sorting
  getSubscriptions: async (filters?: {
    category?: string;
    billingCycle?: string;
    isActive?: boolean;
    search?: string;
  }, sort?: {
    sortBy?: 'amount' | 'nextBillingDate' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.billingCycle) params.append('billingCycle', filters.billingCycle);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters?.search) params.append('search', filters.search);
      if (sort?.sortBy) params.append('sortBy', sort.sortBy);
      if (sort?.sortOrder) params.append('sortOrder', sort.sortOrder);

      const response = await apiClient.get(`/subscriptions?${params.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single subscription
  getSubscription: async (id: string) => {
    try {
      const response = await apiClient.get(`/subscriptions/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update subscription
  updateSubscription: async (id: string, data: {
    name?: string;
    category?: string;
    amount?: number;
    billingCycle?: string;
    nextBillingDate?: string;
    paymentMethod?: string;
    notes?: string;
    isActive?: boolean;
  }) => {
    try {
      const response = await apiClient.patch(`/subscriptions/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete subscription
  deleteSubscription: async (id: string) => {
    try {
      const response = await apiClient.delete(`/subscriptions/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get days until next billing
  getDaysUntilBilling: async (id: string) => {
    try {
      const response = await apiClient.get(`/subscriptions/${id}/days-until-billing`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get upcoming renewals
  getUpcomingRenewals: async (days: number = 7) => {
    try {
      const response = await apiClient.get(`/subscriptions/renewals/upcoming?days=${days}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get overdue renewals
  getOverdueRenewals: async () => {
    try {
      const response = await apiClient.get('/subscriptions/renewals/overdue');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    try {
      const response = await apiClient.get('/subscriptions/analytics/dashboard');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await apiClient.get('/subscriptions/categories/list');
      return response;
    } catch (error) {
      throw error;
    }
  },
};