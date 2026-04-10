import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phoneNumber: z.ZodUnion<[z.ZodString, z.ZodString]>;
    password: z.ZodString;
    plan: z.ZodDefault<z.ZodEnum<{
        free: "free";
        premium: "premium";
        lifetime: "lifetime";
    }>>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const billingAddressSchema: z.ZodObject<{
    streetAddress: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BillingAddressInput = z.infer<typeof billingAddressSchema>;
export declare const SubscriptionInputSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    amount: z.ZodNumber;
    billingCycle: z.ZodEnum<{
        custom: "custom";
        weekly: "weekly";
        monthly: "monthly";
        yearly: "yearly";
    }>;
    nextBillingDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    paymentMethod: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateSubscriptionInputSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    billingCycle: z.ZodOptional<z.ZodEnum<{
        custom: "custom";
        weekly: "weekly";
        monthly: "monthly";
        yearly: "yearly";
    }>>;
    nextBillingDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    paymentMethod: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type SubscriptionInput = z.infer<typeof SubscriptionInputSchema>;
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionInputSchema>;
//# sourceMappingURL=validators.d.ts.map