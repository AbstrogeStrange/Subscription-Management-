"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const prisma_1 = __importDefault(require("../utils/prisma"));
exports.authService = {
    async register(data) {
        // Check if user already exists
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error("User already exists with this email");
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        // Create user
        const user = await prisma_1.default.user.create({
            data: {
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                passwordHash,
                plan: data.plan,
            },
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                plan: user.plan,
            },
            token,
        };
    },
    async login(data) {
        // Find user by email
        const user = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                plan: user.plan,
            },
            token,
        };
    },
    async getUserById(userId) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                billingAddress: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            plan: user.plan,
            billingAddress: user.billingAddress,
        };
    },
    async addBillingAddress(userId, data) {
        // Check if billing address already exists
        const existingAddress = await prisma_1.default.billingAddress.findUnique({
            where: { userId },
        });
        if (existingAddress) {
            // Update existing address
            return await prisma_1.default.billingAddress.update({
                where: { userId },
                data: {
                    streetAddress: data.streetAddress,
                    city: data.city,
                    state: data.state,
                    postalCode: data.postalCode,
                    country: data.country,
                },
            });
        }
        // Create new billing address
        return await prisma_1.default.billingAddress.create({
            data: {
                userId,
                streetAddress: data.streetAddress,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                country: data.country,
            },
        });
    },
    async getBillingAddress(userId) {
        const billingAddress = await prisma_1.default.billingAddress.findUnique({
            where: { userId },
        });
        if (!billingAddress) {
            throw new Error("Billing address not found");
        }
        return billingAddress;
    },
};
//# sourceMappingURL=auth.service.js.map