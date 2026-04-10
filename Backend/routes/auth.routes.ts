import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const authRouter = Router();

// Public routes
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

// Protected routes
authRouter.get("/profile", authMiddleware, authController.getProfile);
authRouter.post("/billing-address", authMiddleware, authController.addBillingAddress);
authRouter.get("/billing-address", authMiddleware, authController.getBillingAddress);

export default authRouter;