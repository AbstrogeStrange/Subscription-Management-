"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("../controllers/subscription.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// ✅ SPECIFIC ROUTES MUST COME FIRST (before /:id routes)
// Get categories (public before auth for testing)
router.get("/categories/list", authMiddleware_1.authMiddleware, subscription_controller_1.subscriptionController.getCategories);
// Get dashboard analytics
router.get("/analytics/dashboard", authMiddleware_1.authMiddleware, subscription_controller_1.subscriptionController.getDashboardAnalytics);
// Get upcoming renewals
router.get("/renewals/upcoming", authMiddleware_1.authMiddleware, subscription_controller_1.subscriptionController.getUpcomingRenewals);
// Get overdue renewals
router.get("/renewals/overdue", authMiddleware_1.authMiddleware, subscription_controller_1.subscriptionController.getOverdueRenewals);
// ✅ GENERAL ROUTES
// Get all subscriptions (with filters and sorting)
router.get("/", authMiddleware_1.authMiddleware, subscription_controller_1.subscriptionController.getSubscriptions);
// Add subscription
router.post("/", authMiddleware_1.authMiddleware, subscription_controller_1.subscriptionController.addSubscription);
// ✅ PARAMETERIZED ROUTES (/:id) MUST COME LAST
// Get days until billing (must be before generic /:id)
router.get("/:id/days-until-billing", authMiddleware_1.authMiddleware, subscription_controller_1.subscriptionController.getDaysUntilBilling);
// Get single subscription
router.get("/:id", authMiddleware_1.authMiddleware, subscription_controller_1.subscriptionController.getSubscription);
// Update subscription
router.patch("/:id", authMiddleware_1.authMiddleware, subscription_controller_1.subscriptionController.updateSubscription);
// Delete subscription
router.delete("/:id", authMiddleware_1.authMiddleware, subscription_controller_1.subscriptionController.deleteSubscription);
exports.default = router;
//# sourceMappingURL=subscription.routes.js.map