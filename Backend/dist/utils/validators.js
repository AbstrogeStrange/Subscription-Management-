"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionInputSchema = exports.SubscriptionInputSchema = exports.billingAddressSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    phoneNumber: zod_1.z.string()
        .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
        .or(zod_1.z.string().regex(/^\+91[0-9]{10}$/, 'Invalid Indian phone number format')),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    plan: zod_1.z.enum(['free', 'premium', 'lifetime']).default('free'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.billingAddressSchema = zod_1.z.object({
    streetAddress: zod_1.z.string().min(5, 'Street address must be at least 5 characters').max(200),
    city: zod_1.z.string().min(2, 'City must be at least 2 characters').max(100),
    state: zod_1.z.string().min(2, 'State must be at least 2 characters').max(100),
    postalCode: zod_1.z.string()
        .regex(/^[0-9]{6}$/, 'Postal code must be exactly 6 digits'),
    country: zod_1.z.string().default('India'),
});
// ...existing code...
exports.SubscriptionInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Subscription name is required"),
    category: zod_1.z.string().optional(),
    amount: zod_1.z.number().positive("Amount must be positive"),
    billingCycle: zod_1.z.enum(["weekly", "monthly", "yearly", "custom"]),
    nextBillingDate: zod_1.z.string().or(zod_1.z.date()),
    paymentMethod: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.UpdateSubscriptionInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    category: zod_1.z.string().optional(),
    amount: zod_1.z.number().positive().optional(),
    billingCycle: zod_1.z.enum(["weekly", "monthly", "yearly", "custom"]).optional(),
    nextBillingDate: zod_1.z.string().or(zod_1.z.date()).optional(),
    paymentMethod: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
});
// ...existing code...
//# sourceMappingURL=validators.js.map