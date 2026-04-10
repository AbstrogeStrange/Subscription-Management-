"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dasboard_service_1 = require("../services/dasboard.service");
exports.dashboardController = {
    async getDashboardStats(req, res) {
        try {
            const userId = req.userId;
            const stats = await dasboard_service_1.dashboardService.getDashboardStats(userId);
            res.status(200).json({
                message: 'Dashboard stats retrieved successfully',
                data: stats,
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Failed to get dashboard stats',
                error,
            });
        }
    },
    async getSubscriptions(req, res) {
        try {
            const userId = req.userId;
            const { skip, take, isActive } = req.query;
            const subscriptions = await dasboard_service_1.dashboardService.getSubscriptions(userId, {
                skip: skip ? parseInt(skip) : 0,
                take: take ? parseInt(take) : 10,
                isActive: isActive ? isActive === 'true' : undefined,
            });
            res.status(200).json({
                message: 'Subscriptions retrieved successfully',
                data: subscriptions,
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Failed to get subscriptions',
                error,
            });
        }
    },
    async getUpcomingRenewals(req, res) {
        try {
            const userId = req.userId;
            const { days } = req.query;
            const renewals = await dasboard_service_1.dashboardService.getUpcomingRenewals(userId, days ? parseInt(days) : 30);
            res.status(200).json({
                message: 'Upcoming renewals retrieved successfully',
                data: renewals,
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Failed to get upcoming renewals',
                error,
            });
        }
    },
    async getMonthlySpendingTrend(req, res) {
        try {
            const userId = req.userId;
            const { months } = req.query;
            const trend = await dasboard_service_1.dashboardService.getMonthlySpendingTrend(userId, months ? parseInt(months) : 6);
            res.status(200).json({
                message: 'Monthly spending trend retrieved successfully',
                data: trend,
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Failed to get spending trend',
                error,
            });
        }
    },
    async getSubscriptionByCategory(req, res) {
        try {
            const userId = req.userId;
            const categories = await dasboard_service_1.dashboardService.getSubscriptionByCategory(userId);
            res.status(200).json({
                message: 'Subscriptions by category retrieved successfully',
                data: categories,
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Failed to get subscriptions by category',
                error,
            });
        }
    },
    async createSubscription(req, res) {
        try {
            const userId = req.userId;
            const { name, category, amount, billingCycle, nextBillingDate, paymentMethod, notes } = req.body;
            if (!name || !amount || !billingCycle || !nextBillingDate) {
                return res.status(400).json({
                    message: 'Missing required fields',
                });
            }
            const subscription = await dasboard_service_1.dashboardService.createSubscription(userId, {
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
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Failed to create subscription',
                error,
            });
        }
    },
    async updateSubscription(req, res) {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const data = req.body;
            if (!id) {
                return res.status(400).json({
                    message: 'Subscription ID is required',
                });
            }
            const subscription = await dasboard_service_1.dashboardService.updateSubscription(userId, id, data);
            res.status(200).json({
                message: 'Subscription updated successfully',
                data: subscription,
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Failed to update subscription',
                error,
            });
        }
    },
    async deleteSubscription(req, res) {
        try {
            const userId = req.userId;
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    message: 'Subscription ID is required',
                });
            }
            const result = await dasboard_service_1.dashboardService.deleteSubscription(userId, id);
            res.status(200).json({
                message: result.message,
                data: result,
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Failed to delete subscription',
                error,
            });
        }
    },
    async getPaymentHistory(req, res) {
        try {
            const userId = req.userId;
            const { skip, take } = req.query;
            const payments = await dasboard_service_1.dashboardService.getPaymentHistory(userId, {
                skip: skip ? parseInt(skip) : 0,
                take: take ? parseInt(take) : 10,
            });
            res.status(200).json({
                message: 'Payment history retrieved successfully',
                data: payments,
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Failed to get payment history',
                error,
            });
        }
    },
    async getPaymentsSummary(req, res) {
        try {
            const userId = req.userId;
            const summary = await dasboard_service_1.dashboardService.getPaymentsSummary(userId);
            res.status(200).json({
                message: 'Payments summary retrieved successfully',
                data: summary,
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Failed to get payments summary',
                error,
            });
        }
    },
    async createRazorpayOrder(req, res) {
        try {
            const userId = req.userId;
            const { amount, planType } = req.body;
            if (!amount || !planType) {
                return res.status(400).json({
                    message: 'amount and planType are required',
                });
            }
            const order = await dasboard_service_1.dashboardService.createRazorpayOrder(userId, {
                amount: Number(amount),
                planType: String(planType),
            });
            res.status(200).json({
                message: 'Razorpay order created',
                data: order,
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Failed to create Razorpay order',
                error,
            });
        }
    },
    async verifyRazorpayPayment(req, res) {
        try {
            const userId = req.userId;
            const { razorpayOrderId, razorpayPaymentId, razorpaySignature, amount, planType } = req.body;
            if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !amount || !planType) {
                return res.status(400).json({
                    message: 'Missing required payment verification fields',
                });
            }
            const payment = await dasboard_service_1.dashboardService.verifyRazorpayPayment(userId, {
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
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Payment verification failed',
                error,
            });
        }
    },
};
//# sourceMappingURL=dashboard.controller.js.map