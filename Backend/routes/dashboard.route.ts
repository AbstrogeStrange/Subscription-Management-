import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const dashboardRouter = Router();

// All dashboard routes are protected
dashboardRouter.use(authMiddleware);

// Stats and Analytics
dashboardRouter.get('/stats', dashboardController.getDashboardStats);
dashboardRouter.get('/spending-trend', dashboardController.getMonthlySpendingTrend);
dashboardRouter.get('/categories', dashboardController.getSubscriptionByCategory);

// Subscriptions
dashboardRouter.get('/subscriptions', dashboardController.getSubscriptions);
dashboardRouter.post('/subscriptions', dashboardController.createSubscription);
dashboardRouter.put('/subscriptions/:id', dashboardController.updateSubscription);
dashboardRouter.delete('/subscriptions/:id', dashboardController.deleteSubscription);

// Renewals
dashboardRouter.get('/upcoming-renewals', dashboardController.getUpcomingRenewals);

// Payments
dashboardRouter.get('/payments', dashboardController.getPaymentHistory);
dashboardRouter.get('/payments/summary', dashboardController.getPaymentsSummary);
dashboardRouter.post('/payments/razorpay/order', dashboardController.createRazorpayOrder);
dashboardRouter.post('/payments/razorpay/verify', dashboardController.verifyRazorpayPayment);

export default dashboardRouter;
