"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authRouter = (0, express_1.Router)();
// Public routes
authRouter.post("/register", auth_controller_1.authController.register);
authRouter.post("/login", auth_controller_1.authController.login);
// Protected routes
authRouter.get("/profile", authMiddleware_1.authMiddleware, auth_controller_1.authController.getProfile);
authRouter.post("/billing-address", authMiddleware_1.authMiddleware, auth_controller_1.authController.addBillingAddress);
authRouter.get("/billing-address", authMiddleware_1.authMiddleware, auth_controller_1.authController.getBillingAddress);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map