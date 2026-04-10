"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionController = void 0;
const subscripton_service_1 = require("../services/subscripton.service");
exports.subscriptionController = {
    // Add subscription
    async addSubscription(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const data = req.body;
            const subscription = await subscripton_service_1.subscriptionService.addSubscription(userId, data);
            return res.status(201).json({
                message: "Subscription added successfully",
                data: subscription,
            });
        }
        catch (error) {
            console.error("Add subscription error:", error);
            return res.status(400).json({ message: error.message });
        }
    },
    // Get all subscriptions
    async getSubscriptions(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { category, billingCycle, isActive, search, sortBy, sortOrder } = req.query;
            const filters = {
                category: category,
                billingCycle: billingCycle,
                isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
                search: search,
            };
            const sort = {
                sortBy: sortBy || "createdAt",
                sortOrder: sortOrder || "desc",
            };
            const subscriptions = await subscripton_service_1.subscriptionService.getUserSubscriptions(userId, filters, sort);
            return res.status(200).json({
                message: "Subscriptions retrieved successfully",
                data: subscriptions,
            });
        }
        catch (error) {
            console.error("Get subscriptions error:", error);
            return res.status(400).json({ message: error.message });
        }
    },
    // Get single subscription
    async getSubscription(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { id } = req.params;
            const subscription = await subscripton_service_1.subscriptionService.getSubscriptionById(id, userId);
            return res.status(200).json({
                message: "Subscription retrieved successfully",
                data: subscription,
            });
        }
        catch (error) {
            console.error("Get subscription error:", error);
            return res.status(400).json({ message: error.message });
        }
    },
    // Update subscription
    async updateSubscription(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { id } = req.params;
            const data = req.body;
            const subscription = await subscripton_service_1.subscriptionService.updateSubscription(id, userId, data);
            return res.status(200).json({
                message: "Subscription updated successfully",
                data: subscription,
            });
        }
        catch (error) {
            console.error("Update subscription error:", error);
            return res.status(400).json({ message: error.message });
        }
    },
    // Delete subscription
    async deleteSubscription(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { id } = req.params;
            const result = await subscripton_service_1.subscriptionService.deleteSubscription(id, userId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Delete subscription error:", error);
            return res.status(400).json({ message: error.message });
        }
    },
    // Get days until next billing
    async getDaysUntilBilling(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { id } = req.params;
            const result = await subscripton_service_1.subscriptionService.getDaysUntilBilling(id, userId);
            return res.status(200).json({
                message: "Days until billing calculated successfully",
                data: result,
            });
        }
        catch (error) {
            console.error("Get days until billing error:", error);
            return res.status(400).json({ message: error.message });
        }
    },
    // Get upcoming renewals
    async getUpcomingRenewals(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { days } = req.query;
            const daysAhead = parseInt(days) || 7;
            const renewals = await subscripton_service_1.subscriptionService.getUpcomingRenewals(userId, daysAhead);
            return res.status(200).json({
                message: "Upcoming renewals retrieved successfully",
                data: renewals,
            });
        }
        catch (error) {
            console.error("Get upcoming renewals error:", error);
            return res.status(400).json({ message: error.message });
        }
    },
    // Get overdue renewals
    async getOverdueRenewals(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const renewals = await subscripton_service_1.subscriptionService.getOverdueRenewals(userId);
            return res.status(200).json({
                message: "Overdue renewals retrieved successfully",
                data: renewals,
            });
        }
        catch (error) {
            console.error("Get overdue renewals error:", error);
            return res.status(400).json({ message: error.message });
        }
    },
    // Get dashboard analytics
    async getDashboardAnalytics(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const analytics = await subscripton_service_1.subscriptionService.getDashboardAnalytics(userId);
            return res.status(200).json({
                message: "Dashboard analytics retrieved successfully",
                data: analytics,
            });
        }
        catch (error) {
            console.error("Get dashboard analytics error:", error);
            return res.status(400).json({ message: error.message });
        }
    },
    // Get categories
    async getCategories(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const categories = await subscripton_service_1.subscriptionService.getCategories(userId);
            return res.status(200).json({
                message: "Categories retrieved successfully",
                data: categories,
            });
        }
        catch (error) {
            console.error("Get categories error:", error);
            return res.status(400).json({ message: error.message });
        }
    },
};
//# sourceMappingURL=subscription.controller.js.map