export interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  currency: string;
}

export interface LoginResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  category?: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextBillingDate: string;
  paymentMethod?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  planType: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  errors?: any[];
}