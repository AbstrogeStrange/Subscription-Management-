import { apiClient } from './config';

export const dashboardApi = {
  // Stats and Analytics
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMonthlySpendingTrend: async (months: number = 6) => {
    try {
      const response = await apiClient.get(`/dashboard/spending-trend?months=${months}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getSubscriptionsByCategory: async () => {
    try {
      const response = await apiClient.get('/dashboard/categories');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Subscriptions CRUD (legacy - use subscriptionApi instead)
  getSubscriptions: async (skip: number = 0, take: number = 10, isActive: boolean = true) => {
    try {
      const response = await apiClient.get(
        `/dashboard/subscriptions?skip=${skip}&take=${take}&isActive=${isActive}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  createSubscription: async (data: {
    name: string;
    category?: string;
    amount: number;
    billingCycle: string;
    nextBillingDate: string;
    paymentMethod?: string;
    notes?: string;
  }) => {
    try {
      const response = await apiClient.post('/dashboard/subscriptions', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateSubscription: async (id: string, data: Record<string, any>) => {
    try {
      const response = await apiClient.put(`/dashboard/subscriptions/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteSubscription: async (id: string) => {
    try {
      const response = await apiClient.delete(`/dashboard/subscriptions/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Renewals
  getUpcomingRenewals: async (days: number = 30) => {
    try {
      const response = await apiClient.get(`/dashboard/upcoming-renewals?days=${days}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Payments
  getPaymentHistory: async (skip: number = 0, take: number = 10) => {
    try {
      const response = await apiClient.get(
        `/dashboard/payments?skip=${skip}&take=${take}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPaymentsSummary: async () => {
    try {
      const response = await apiClient.get('/dashboard/payments/summary');
      return response;
    } catch (error) {
      throw error;
    }
  },

  createRazorpayOrder: async (data: { amount: number; planType: string }) => {
    try {
      const response = await apiClient.post('/dashboard/payments/razorpay/order', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  verifyRazorpayPayment: async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    amount: number;
    planType: string;
  }) => {
    try {
      const response = await apiClient.post('/dashboard/payments/razorpay/verify', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
