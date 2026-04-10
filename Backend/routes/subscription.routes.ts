import express from "express";
import { subscriptionController } from "../controllers/subscription.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ SPECIFIC ROUTES MUST COME FIRST (before /:id routes)

// Get categories (public before auth for testing)
router.get("/categories/list", authMiddleware, subscriptionController.getCategories);

// Get dashboard analytics
router.get("/analytics/dashboard", authMiddleware, subscriptionController.getDashboardAnalytics);

// Get upcoming renewals
router.get("/renewals/upcoming", authMiddleware, subscriptionController.getUpcomingRenewals);

// Get overdue renewals
router.get("/renewals/overdue", authMiddleware, subscriptionController.getOverdueRenewals);

// ✅ GENERAL ROUTES

// Get all subscriptions (with filters and sorting)
router.get("/", authMiddleware, subscriptionController.getSubscriptions);

// Add subscription
router.post("/", authMiddleware, subscriptionController.addSubscription);

// ✅ PARAMETERIZED ROUTES (/:id) MUST COME LAST

// Get days until billing (must be before generic /:id)
router.get("/:id/days-until-billing", authMiddleware, subscriptionController.getDaysUntilBilling);

// Get single subscription
router.get("/:id", authMiddleware, subscriptionController.getSubscription);

// Update subscription
router.patch("/:id", authMiddleware, subscriptionController.updateSubscription);

// Delete subscription
router.delete("/:id", authMiddleware, subscriptionController.deleteSubscription);

export default router;