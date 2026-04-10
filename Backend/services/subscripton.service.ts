import prisma from "../utils/prisma";
import type { SubscriptionInput, UpdateSubscriptionInput } from "../utils/validators";

export const subscriptionService = {
  // Add new subscription
  async addSubscription(userId: string, data: SubscriptionInput) {
    // Check user's plan limit
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Free plan: max 5 subscriptions, Premium: unlimited
    const subscriptionCount = await prisma.subscription.count({
      where: { userId },
    });

    if (user.plan === "free" && subscriptionCount >= 5) {
      throw new Error("Free plan allows maximum 5 subscriptions. Upgrade to Premium for unlimited.");
    }

    if (user.plan === "basic" && subscriptionCount >= 10) {
      throw new Error("Basic plan allows maximum 10 subscriptions. Upgrade to Premium for unlimited.");
    }

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        name: data.name,
        category: data.category,
        amount: data.amount,
        billingCycle: data.billingCycle,
        nextBillingDate: new Date(data.nextBillingDate),
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        isActive: true,
      },
    });

    return subscription;
  },

  // Get all subscriptions for user
  async getUserSubscriptions(
    userId: string,
    filters?: {
      category?: string;
      billingCycle?: string;
      isActive?: boolean;
      search?: string;
    },
    sort?: {
      sortBy?: "amount" | "nextBillingDate" | "createdAt";
      sortOrder?: "asc" | "desc";
    }
  ) {
    let whereClause: any = { userId };

    // Apply filters
    if (filters?.category) {
      whereClause.category = filters.category;
    }

    if (filters?.billingCycle) {
      whereClause.billingCycle = filters.billingCycle;
    }

    if (filters?.isActive !== undefined) {
      whereClause.isActive = filters.isActive;
    }

    if (filters?.search) {
      whereClause.name = {
        contains: filters.search,
        mode: "insensitive",
      };
    }

    // Build sort order
    let orderBy: any = { createdAt: "desc" };
    if (sort?.sortBy) {
      orderBy = { [sort.sortBy]: sort.sortOrder || "asc" };
    }

    const subscriptions = await prisma.subscription.findMany({
      where: whereClause,
      orderBy,
    });

    return subscriptions;
  },

  // Get single subscription
  async getSubscriptionById(subscriptionId: string, userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return subscription;
  },

  // Update subscription
  async updateSubscription(
    subscriptionId: string,
    userId: string,
    data: UpdateSubscriptionInput
  ) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        name: data.name ?? subscription.name,
        category: data.category ?? subscription.category,
        amount: data.amount ?? subscription.amount,
        billingCycle: data.billingCycle ?? subscription.billingCycle,
        nextBillingDate: data.nextBillingDate
          ? new Date(data.nextBillingDate)
          : subscription.nextBillingDate,
        paymentMethod: data.paymentMethod ?? subscription.paymentMethod,
        notes: data.notes ?? subscription.notes,
        isActive: data.isActive ?? subscription.isActive,
      },
    });

    return updatedSubscription;
  },

  // Delete subscription
  async deleteSubscription(subscriptionId: string, userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await prisma.subscription.delete({
      where: { id: subscriptionId },
    });

    return { message: "Subscription deleted successfully" };
  },

  // Calculate days until next billing
  async getDaysUntilBilling(subscriptionId: string, userId: string) {
    const subscription = await this.getSubscriptionById(subscriptionId, userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextBillingDate = new Date(subscription.nextBillingDate);
    nextBillingDate.setHours(0, 0, 0, 0);

    const daysUntil = Math.ceil(
      (nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      subscriptionId,
      daysUntil,
      nextBillingDate: subscription.nextBillingDate,
      isOverdue: daysUntil < 0,
    };
  },

  // Get upcoming renewals (next N days)
  async getUpcomingRenewals(userId: string, daysAhead: number = 7) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const upcomingSubscriptions = await prisma.subscription.findMany({
      where: {
        userId,
        isActive: true,
        nextBillingDate: {
          gte: today,
          lte: futureDate,
        },
      },
      orderBy: {
        nextBillingDate: "asc",
      },
    });

    return upcomingSubscriptions;
  },

  // Get overdue renewals
  async getOverdueRenewals(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueSubscriptions = await prisma.subscription.findMany({
      where: {
        userId,
        isActive: true,
        nextBillingDate: {
          lt: today,
        },
      },
      orderBy: {
        nextBillingDate: "desc",
      },
    });

    return overdueSubscriptions;
  },

  // Get dashboard analytics
  async getDashboardAnalytics(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const allSubscriptions = await prisma.subscription.findMany({
      where: { userId },
    });

    const activeSubscriptions = allSubscriptions.filter((sub) => sub.isActive);

    // Calculate monthly cost
    const monthlyCost = activeSubscriptions.reduce((total, sub) => {
      let monthlyAmount = Number(sub.amount);

      if (sub.billingCycle === "yearly") {
        monthlyAmount = monthlyAmount / 12;
      } else if (sub.billingCycle === "weekly") {
        monthlyAmount = monthlyAmount * 52 / 12;
      }

      return total + monthlyAmount;
    }, 0);

    // Calculate yearly cost
    const yearlyCost = monthlyCost * 12;

    // Category-wise breakdown
    const categoryBreakdown: Record<string, number> = {};
    activeSubscriptions.forEach((sub) => {
      const category = sub.category || "Uncategorized";
      let monthlyAmount = Number(sub.amount);

      if (sub.billingCycle === "yearly") {
        monthlyAmount = monthlyAmount / 12;
      } else if (sub.billingCycle === "weekly") {
        monthlyAmount = monthlyAmount * 52 / 12;
      }

      categoryBreakdown[category] =
        (categoryBreakdown[category] || 0) + monthlyAmount;
    });

    // Get upcoming renewals (next 7 days)
    const upcomingRenewals = await this.getUpcomingRenewals(userId, 7);

    // Get overdue renewals
    const overdueRenewals = await this.getOverdueRenewals(userId);

    return {
      plan: user.plan,
      totalSubscriptions: allSubscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      inactiveSubscriptions: allSubscriptions.length - activeSubscriptions.length,
      monthlyCost: Math.round(monthlyCost * 100) / 100,
      yearlyCost: Math.round(yearlyCost * 100) / 100,
      categoryBreakdown,
      upcomingRenewals: upcomingRenewals.length,
      overdueRenewals: overdueRenewals.length,
      subscriptionsList: activeSubscriptions,
      upcomingRenewalsList: upcomingRenewals,
      overdueRenewalsList: overdueRenewals,
    };
  },

  // Get all categories for user
  async getCategories(userId: string) {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      select: { category: true },
      distinct: ["category"],
    });

    return subscriptions
      .map((sub) => sub.category)
      .filter((cat) => cat !== null) as string[];
  },
};