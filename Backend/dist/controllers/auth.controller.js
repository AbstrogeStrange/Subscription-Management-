"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const validators_1 = require("../utils/validators");
const auth_service_1 = require("../services/auth.service");
const zod_1 = require("zod");
exports.authController = {
    async register(req, res) {
        try {
            const validatedData = validators_1.registerSchema.parse(req.body);
            const result = await auth_service_1.authService.register(validatedData);
            return res.status(201).json({
                message: "User registered successfully",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.issues,
                });
            }
            if (error instanceof Error) {
                return res.status(400).json({
                    message: error.message,
                });
            }
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async login(req, res) {
        try {
            const validatedData = validators_1.loginSchema.parse(req.body);
            const result = await auth_service_1.authService.login(validatedData);
            return res.status(200).json({
                message: "Login successful",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.issues,
                });
            }
            if (error instanceof Error) {
                return res.status(401).json({
                    message: error.message,
                });
            }
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async getProfile(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({
                    message: "Unauthorized",
                });
            }
            const user = await auth_service_1.authService.getUserById(userId);
            return res.status(200).json({
                message: "Profile fetched successfully",
                data: user,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({
                    message: error.message,
                });
            }
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async addBillingAddress(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({
                    message: "Unauthorized",
                });
            }
            const validatedData = validators_1.billingAddressSchema.parse(req.body);
            const billingAddress = await auth_service_1.authService.addBillingAddress(userId, validatedData);
            return res.status(201).json({
                message: "Billing address added/updated successfully",
                data: billingAddress,
            });
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.issues,
                });
            }
            if (error instanceof Error) {
                return res.status(400).json({
                    message: error.message,
                });
            }
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async getBillingAddress(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({
                    message: "Unauthorized",
                });
            }
            const billingAddress = await auth_service_1.authService.getBillingAddress(userId);
            return res.status(200).json({
                message: "Billing address fetched successfully",
                data: billingAddress,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({
                    message: error.message,
                });
            }
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
};
//# sourceMappingURL=auth.controller.js.map