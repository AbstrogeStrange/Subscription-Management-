"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const dashboardRouter = (0, express_1.Router)();
// All dashboard routes are protected
dashboardRouter.use(authMiddleware_1.authMiddleware);
// Stats and Analytics
dashboardRouter.get('/stats', dashboard_controller_1.dashboardController.getDashboardStats);
dashboardRouter.get('/spending-trend', dashboard_controller_1.dashboardController.getMonthlySpendingTrend);
dashboardRouter.get('/categories', dashboard_controller_1.dashboardController.getSubscriptionByCategory);
// Subscriptions
dashboardRouter.get('/subscriptions', dashboard_controller_1.dashboardController.getSubscriptions);
dashboardRouter.post('/subscriptions', dashboard_controller_1.dashboardController.createSubscription);
dashboardRouter.put('/subscriptions/:id', dashboard_controller_1.dashboardController.updateSubscription);
dashboardRouter.delete('/subscriptions/:id', dashboard_controller_1.dashboardController.deleteSubscription);
// Renewals
dashboardRouter.get('/upcoming-renewals', dashboard_controller_1.dashboardController.getUpcomingRenewals);
// Payments
dashboardRouter.get('/payments', dashboard_controller_1.dashboardController.getPaymentHistory);
dashboardRouter.get('/payments/summary', dashboard_controller_1.dashboardController.getPaymentsSummary);
dashboardRouter.post('/payments/razorpay/order', dashboard_controller_1.dashboardController.createRazorpayOrder);
dashboardRouter.post('/payments/razorpay/verify', dashboard_controller_1.dashboardController.verifyRazorpayPayment);
exports.default = dashboardRouter;
//# sourceMappingURL=dashboard.route.js.map