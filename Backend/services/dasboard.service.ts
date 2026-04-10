import prisma from '../utils/prisma';
import crypto from 'crypto';
import axios from 'axios';
import { env } from '../config/env';

const normalizeMonthlyAmount = (amount: number, billingCycle: string) => {
  if (billingCycle === 'yearly') return amount / 12;
  if (billingCycle === 'weekly') return (amount * 52) / 12;
  return amount;
};

export const dashboardService = {
  async getDashboardStats(userId: string) {
    try {
      // Get user with subscriptions
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscriptions: {
            where: { isActive: true },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate stats
      const activeSubscriptions = user.subscriptions;
      const totalSubscriptions = activeSubscriptions.length;

      // Monthly spending
      const monthlySpending = activeSubscriptions.reduce((total: number, sub: typeof activeSubscriptions[0]) => {
        const amount = Number(sub.amount);
        if (sub.billingCycle === 'yearly') {
          return total + amount / 12;
        } else if (sub.billingCycle === 'weekly') {
          return total + (amount * 52) / 12;
        }
        return total + amount; // monthly
      }, 0);

      // Yearly spending
      const yearlySpending = activeSubscriptions.reduce((total: number, sub: typeof activeSubscriptions[0]) => {
        const amount = Number(sub.amount);
        if (sub.billingCycle === 'yearly') {
          return total + amount;
        } else if (sub.billingCycle === 'weekly') {
          return total + amount * 52;
        }
        return total + amount * 12; // monthly
      }, 0);

      // Next renewal
      const nextRenewal = activeSubscriptions.reduce(
        (closest: typeof activeSubscriptions[0] | null, sub: typeof activeSubscriptions[0]) => {
          if (!closest) return sub;
          return sub.nextBillingDate < closest.nextBillingDate ? sub : closest;
        },
        null as typeof activeSubscriptions[0] | null
      );

      return {
        activeSubscriptions: totalSubscriptions,
        monthlySpending: Math.round(monthlySpending * 100) / 100,
        yearlySpending: Math.round(yearlySpending * 100) / 100,
        nextRenewal: nextRenewal ? {
          name: nextRenewal.name,
          date: nextRenewal.nextBillingDate,
          daysLeft: Math.ceil((nextRenewal.nextBillingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        } : null,
        plan: user.plan,
        subscriptionLimit: user.plan === 'premium' ? 999 : user.plan === 'basic' ? 5 : 3,
      };
    } catch (error) {
      throw error;
    }
  },

  async getSubscriptions(userId: string, options?: { skip?: number; take?: number; isActive?: boolean }) {
    try {
      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId,
          ...(options?.isActive !== undefined && { isActive: options.isActive }),
        },
        skip: options?.skip || 0,
        take: options?.take || 10,
        orderBy: { nextBillingDate: 'asc' },
      });

      return subscriptions;
    } catch (error) {
      throw error;
    }
  },

  async getUpcomingRenewals(userId: string, daysAhead: number = 30) {
    try {
      const today = new Date();
      const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);

      const renewals = await prisma.subscription.findMany({
        where: {
          userId,
          isActive: true,
          nextBillingDate: {
            gte: today,
            lte: futureDate,
          },
        },
        orderBy: { nextBillingDate: 'asc' },
      });

      return renewals.map((renewal: import('@prisma/client').Subscription) => ({
        id: renewal.id,
        name: renewal.name,
        amount: Number(renewal.amount),
        nextBillingDate: renewal.nextBillingDate,
        daysLeft: Math.ceil((renewal.nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      }));
    } catch (error) {
      throw error;
    }
  },

  async getMonthlySpendingTrend(userId: string, months: number = 6) {
    try {
      const subscriptions = await prisma.subscription.findMany({
        where: { userId, isActive: true },
      });

      const data: { month: string; amount: number }[] = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthIndex = date.getMonth();

        let monthlyTotal = 0;
        subscriptions.forEach((sub) => {
          const amount = Number(sub.amount);
          if (sub.billingCycle === 'yearly') {
            monthlyTotal += amount / 12;
          } else if (sub.billingCycle === 'weekly') {
            monthlyTotal += (amount * 52) / 12;
          } else {
            monthlyTotal += amount;
          }
        });

        data.push({
          month: monthNames[monthIndex],
          amount: Math.round(monthlyTotal * 100) / 100,
        });
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async getSubscriptionByCategory(userId: string) {
    try {
      const subscriptions = await prisma.subscription.findMany({
        where: { userId, isActive: true },
      });

      const byCategory: { [key: string]: { count: number; amount: number } } = {};

      subscriptions.forEach((sub) => {
        const category = sub.category || 'Other';
        if (!byCategory[category]) {
          byCategory[category] = { count: 0, amount: 0 };
        }
        byCategory[category].count += 1;
        byCategory[category].amount += Number(sub.amount);
      });

      return byCategory;
    } catch (error) {
      throw error;
    }
  },

  async createSubscription(userId: string, data: {
    name: string;
    category?: string;
    amount: number;
    billingCycle: string;
    nextBillingDate: Date;
    paymentMethod?: string;
    notes?: string;
  }) {
    try {
      // Check subscription limit
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscriptions: { where: { isActive: true } } },
      });

      if (!user) throw new Error('User not found');

      const subscriptionLimit = user.plan === 'premium' ? 999 : user.plan === 'basic' ? 5 : 3;

      if (user.subscriptions.length >= subscriptionLimit) {
        throw new Error(`You have reached your subscription limit of ${subscriptionLimit}`);
      }

      const subscription = await prisma.subscription.create({
        data: {
          userId,
          name: data.name,
          category: data.category || 'Other',
          amount: data.amount,
          billingCycle: data.billingCycle,
          nextBillingDate: data.nextBillingDate,
          paymentMethod: data.paymentMethod,
          notes: data.notes,
        },
      });

      return subscription;
    } catch (error) {
      throw error;
    }
  },

  async updateSubscription(userId: string, subscriptionId: string, data: Partial<{
    name: string;
    category: string;
    amount: number;
    billingCycle: string;
    nextBillingDate: Date;
    paymentMethod: string;
    notes: string;
    isActive: boolean;
  }>) {
    try {
      // Verify ownership
      const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
      });

      if (!subscription || subscription.userId !== userId) {
        throw new Error('Subscription not found or access denied');
      }

      const updated = await prisma.subscription.update({
        where: { id: subscriptionId },
        data,
      });

      return updated;
    } catch (error) {
      throw error;
    }
  },

  async deleteSubscription(userId: string, subscriptionId: string) {
    try {
      // Verify ownership
      const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
      });

      if (!subscription || subscription.userId !== userId) {
        throw new Error('Subscription not found or access denied');
      }

      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { isActive: false },
      });

      return { message: 'Subscription deleted successfully' };
    } catch (error) {
      throw error;
    }
  },

  async getPaymentHistory(userId: string, options?: { skip?: number; take?: number }) {
    try {
      const payments = await prisma.payment.findMany({
        where: { userId },
        skip: options?.skip || 0,
        take: options?.take || 10,
        orderBy: { paymentDate: 'desc' },
      });

      return payments;
    } catch (error) {
      throw error;
    }
  },

  async getPaymentsSummary(userId: string) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextThirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [payments, activeSubscriptions] = await Promise.all([
      prisma.payment.findMany({
        where: {
          userId,
          status: 'success',
          paymentDate: {
            gte: monthStart,
            lte: now,
          },
        },
      }),
      prisma.subscription.findMany({
        where: {
          userId,
          isActive: true,
        },
        orderBy: { nextBillingDate: 'asc' },
      }),
    ]);

    const totalSpentThisMonth = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

    const upcomingPayments = activeSubscriptions
      .filter((subscription) => subscription.nextBillingDate >= now && subscription.nextBillingDate <= nextThirtyDays)
      .map((subscription) => ({
        id: subscription.id,
        name: subscription.name,
        amount: Number(subscription.amount),
        billingCycle: subscription.billingCycle,
        nextBillingDate: subscription.nextBillingDate,
        daysLeft: Math.max(
          0,
          Math.ceil((subscription.nextBillingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        ),
      }));

    const monthlySavingsIfCanceled = activeSubscriptions.reduce((sum, subscription) => {
      return sum + normalizeMonthlyAmount(Number(subscription.amount), subscription.billingCycle);
    }, 0);

    return {
      totalSpentThisMonth: Math.round(totalSpentThisMonth * 100) / 100,
      upcomingPayments,
      activeSubscriptionsCount: activeSubscriptions.length,
      savingsIfCanceled: {
        monthly: Math.round(monthlySavingsIfCanceled * 100) / 100,
        yearly: Math.round(monthlySavingsIfCanceled * 12 * 100) / 100,
      },
    };
  },

  async createRazorpayOrder(userId: string, payload: { amount: number; planType: string }) {
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys are missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Backend/.env');
    }

    const amountInPaise = Math.round(payload.amount * 100);
    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      throw new Error('Invalid amount');
    }

    const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64');
    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `user-${userId}-${Date.now()}`,
        notes: {
          userId,
          planType: payload.planType,
        },
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    return {
      orderId: response.data.id,
      amount: payload.amount,
      currency: 'INR',
      keyId: env.RAZORPAY_KEY_ID,
      planType: payload.planType,
    };
  },

  async verifyRazorpayPayment(
    userId: string,
    payload: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      amount: number;
      planType: string;
    }
  ) {
    if (!env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay secret is missing');
    }

    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== payload.razorpaySignature) {
      throw new Error('Invalid payment signature');
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: payload.amount,
        planType: payload.planType,
        razorpayOrderId: payload.razorpayOrderId,
        razorpayPaymentId: payload.razorpayPaymentId,
        status: 'success',
      },
    });

    if (['basic', 'premium', 'lifetime'].includes(payload.planType)) {
      await prisma.user.update({
        where: { id: userId },
        data: { plan: payload.planType },
      });
    }

    return payment;
  },
};
