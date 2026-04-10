import { Request, Response } from "express";
import { subscriptionService } from "../services/subscripton.service";
import { SubscriptionInput, UpdateSubscriptionInput } from "../utils/validators";
import { AuthRequest } from "../middleware/authMiddleware";

export const subscriptionController = {
  // Add subscription
  async addSubscription(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data: SubscriptionInput = req.body;

      const subscription = await subscriptionService.addSubscription(
        userId,
        data
      );

      return res.status(201).json({
        message: "Subscription added successfully",
        data: subscription,
      });
    } catch (error: any) {
      console.error("Add subscription error:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  // Get all subscriptions
  async getSubscriptions(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { category, billingCycle, isActive, search, sortBy, sortOrder } =
        req.query;

      const filters = {
        category: category as string,
        billingCycle: billingCycle as string,
        isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
        search: search as string,
      };

      const sort = {
        sortBy: (sortBy as "amount" | "nextBillingDate" | "createdAt") || "createdAt",
        sortOrder: (sortOrder as "asc" | "desc") || "desc",
      };

      const subscriptions = await subscriptionService.getUserSubscriptions(
        userId,
        filters,
        sort
      );

      return res.status(200).json({
        message: "Subscriptions retrieved successfully",
        data: subscriptions,
      });
    } catch (error: any) {
      console.error("Get subscriptions error:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  // Get single subscription
  async getSubscription(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;

      const subscription = await subscriptionService.getSubscriptionById(
        id,
        userId
      );

      return res.status(200).json({
        message: "Subscription retrieved successfully",
        data: subscription,
      });
    } catch (error: any) {
      console.error("Get subscription error:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  // Update subscription
  async updateSubscription(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const data: UpdateSubscriptionInput = req.body;

      const subscription = await subscriptionService.updateSubscription(
        id,
        userId,
        data
      );

      return res.status(200).json({
        message: "Subscription updated successfully",
        data: subscription,
      });
    } catch (error: any) {
      console.error("Update subscription error:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  // Delete subscription
  async deleteSubscription(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;

      const result = await subscriptionService.deleteSubscription(id, userId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Delete subscription error:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  // Get days until next billing
  async getDaysUntilBilling(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;

      const result = await subscriptionService.getDaysUntilBilling(id, userId);

      return res.status(200).json({
        message: "Days until billing calculated successfully",
        data: result,
      });
    } catch (error: any) {
      console.error("Get days until billing error:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  // Get upcoming renewals
  async getUpcomingRenewals(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { days } = req.query;
      const daysAhead = parseInt(days as string) || 7;

      const renewals = await subscriptionService.getUpcomingRenewals(
        userId,
        daysAhead
      );

      return res.status(200).json({
        message: "Upcoming renewals retrieved successfully",
        data: renewals,
      });
    } catch (error: any) {
      console.error("Get upcoming renewals error:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  // Get overdue renewals
  async getOverdueRenewals(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const renewals = await subscriptionService.getOverdueRenewals(userId);

      return res.status(200).json({
        message: "Overdue renewals retrieved successfully",
        data: renewals,
      });
    } catch (error: any) {
      console.error("Get overdue renewals error:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  // Get dashboard analytics
  async getDashboardAnalytics(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const analytics = await subscriptionService.getDashboardAnalytics(userId);

      return res.status(200).json({
        message: "Dashboard analytics retrieved successfully",
        data: analytics,
      });
    } catch (error: any) {
      console.error("Get dashboard analytics error:", error);
      return res.status(400).json({ message: error.message });
    }
  },

  // Get categories
  async getCategories(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const categories = await subscriptionService.getCategories(userId);

      return res.status(200).json({
        message: "Categories retrieved successfully",
        data: categories,
      });
    } catch (error: any) {
      console.error("Get categories error:", error);
      return res.status(400).json({ message: error.message });
    }
  },
};