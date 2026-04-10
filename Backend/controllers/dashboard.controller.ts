import { Request, Response } from 'express';
import { dashboardService } from '../services/dasboard.service';

export const dashboardController = {
  async getDashboardStats(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const stats = await dashboardService.getDashboardStats(userId);

      res.status(200).json({
        message: 'Dashboard stats retrieved successfully',
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || 'Failed to get dashboard stats',
        error,
      });
    }
  },

  async getSubscriptions(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { skip, take, isActive } = req.query;

      const subscriptions = await dashboardService.getSubscriptions(userId, {
        skip: skip ? parseInt(skip as string) : 0,
        take: take ? parseInt(take as string) : 10,
        isActive: isActive ? isActive === 'true' : undefined,
      });

      res.status(200).json({
        message: 'Subscriptions retrieved successfully',
        data: subscriptions,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || 'Failed to get subscriptions',
        error,
      });
    }
  },

  async getUpcomingRenewals(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { days } = req.query;

      const renewals = await dashboardService.getUpcomingRenewals(
        userId,
        days ? parseInt(days as string) : 30
      );

      res.status(200).json({
        message: 'Upcoming renewals retrieved successfully',
        data: renewals,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || 'Failed to get upcoming renewals',
        error,
      });
    }
  },

  async getMonthlySpendingTrend(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { months } = req.query;

      const trend = await dashboardService.getMonthlySpendingTrend(
        userId,
        months ? parseInt(months as string) : 6
      );

      res.status(200).json({
        message: 'Monthly spending trend retrieved successfully',
        data: trend,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || 'Failed to get spending trend',
        error,
      });
    }
  },

  async getSubscriptionByCategory(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const categories = await dashboardService.getSubscriptionByCategory(userId);

      res.status(200).json({
        message: 'Subscriptions by category retrieved successfully',
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || 'Failed to get subscriptions by category',
        error,
      });
    }
  },

  async createSubscription(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { name, category, amount, billingCycle, nextBillingDate, paymentMethod, notes } = req.body;

      if (!name || !amount || !billingCycle || !nextBillingDate) {
        return res.status(400).json({
          message: 'Missing required fields',
        });
      }

      const subscription = await dashboardService.createSubscription(userId, {
        name,
        category,
        amount: parseFloat(amount),
        billingCycle,
        nextBillingDate: new Date(nextBillingDate),
        paymentMethod,
        notes,
      });

      res.status(201).json({
        message: 'Subscription created successfully',
        data: subscription,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Failed to create subscription',
        error,
      });
    }
  },

  async updateSubscription(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const data = req.body;

      if (!id) {
        return res.status(400).json({
          message: 'Subscription ID is required',
        });
      }

      const subscription = await dashboardService.updateSubscription(userId, id, data);

      res.status(200).json({
        message: 'Subscription updated successfully',
        data: subscription,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Failed to update subscription',
        error,
      });
    }
  },

  async deleteSubscription(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: 'Subscription ID is required',
        });
      }

      const result = await dashboardService.deleteSubscription(userId, id);

      res.status(200).json({
        message: result.message,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Failed to delete subscription',
        error,
      });
    }
  },

  async getPaymentHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { skip, take } = req.query;

      const payments = await dashboardService.getPaymentHistory(userId, {
        skip: skip ? parseInt(skip as string) : 0,
        take: take ? parseInt(take as string) : 10,
      });

      res.status(200).json({
        message: 'Payment history retrieved successfully',
        data: payments,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || 'Failed to get payment history',
        error,
      });
    }
  },

  async getPaymentsSummary(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const summary = await dashboardService.getPaymentsSummary(userId);
      res.status(200).json({
        message: 'Payments summary retrieved successfully',
        data: summary,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || 'Failed to get payments summary',
        error,
      });
    }
  },

  async createRazorpayOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { amount, planType } = req.body;

      if (!amount || !planType) {
        return res.status(400).json({
          message: 'amount and planType are required',
        });
      }

      const order = await dashboardService.createRazorpayOrder(userId, {
        amount: Number(amount),
        planType: String(planType),
      });

      res.status(200).json({
        message: 'Razorpay order created',
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Failed to create Razorpay order',
        error,
      });
    }
  },

  async verifyRazorpayPayment(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature, amount, planType } = req.body;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !amount || !planType) {
        return res.status(400).json({
          message: 'Missing required payment verification fields',
        });
      }

      const payment = await dashboardService.verifyRazorpayPayment(userId, {
        razorpayOrderId: String(razorpayOrderId),
        razorpayPaymentId: String(razorpayPaymentId),
        razorpaySignature: String(razorpaySignature),
        amount: Number(amount),
        planType: String(planType),
      });

      res.status(200).json({
        message: 'Payment verified successfully',
        data: payment,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Payment verification failed',
        error,
      });
    }
  },
};
