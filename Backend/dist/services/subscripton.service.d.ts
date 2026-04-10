import type { SubscriptionInput, UpdateSubscriptionInput } from "../utils/validators";
export declare const subscriptionService: {
    addSubscription(userId: string, data: SubscriptionInput): Promise<{
        name: string;
        category: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        billingCycle: string;
        nextBillingDate: Date;
        paymentMethod: string | null;
        notes: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    getUserSubscriptions(userId: string, filters?: {
        category?: string;
        billingCycle?: string;
        isActive?: boolean;
        search?: string;
    }, sort?: {
        sortBy?: "amount" | "nextBillingDate" | "createdAt";
        sortOrder?: "asc" | "desc";
    }): Promise<{
        name: string;
        category: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        billingCycle: string;
        nextBillingDate: Date;
        paymentMethod: string | null;
        notes: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    getSubscriptionById(subscriptionId: string, userId: string): Promise<{
        name: string;
        category: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        billingCycle: string;
        nextBillingDate: Date;
        paymentMethod: string | null;
        notes: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    updateSubscription(subscriptionId: string, userId: string, data: UpdateSubscriptionInput): Promise<{
        name: string;
        category: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        billingCycle: string;
        nextBillingDate: Date;
        paymentMethod: string | null;
        notes: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    deleteSubscription(subscriptionId: string, userId: string): Promise<{
        message: string;
    }>;
    getDaysUntilBilling(subscriptionId: string, userId: string): Promise<{
        subscriptionId: string;
        daysUntil: number;
        nextBillingDate: Date;
        isOverdue: boolean;
    }>;
    getUpcomingRenewals(userId: string, daysAhead?: number): Promise<{
        name: string;
        category: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        billingCycle: string;
        nextBillingDate: Date;
        paymentMethod: string | null;
        notes: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    getOverdueRenewals(userId: string): Promise<{
        name: string;
        category: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        billingCycle: string;
        nextBillingDate: Date;
        paymentMethod: string | null;
        notes: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    getDashboardAnalytics(userId: string): Promise<{
        plan: string;
        totalSubscriptions: number;
        activeSubscriptions: number;
        inactiveSubscriptions: number;
        monthlyCost: number;
        yearlyCost: number;
        categoryBreakdown: Record<string, number>;
        upcomingRenewals: number;
        overdueRenewals: number;
        subscriptionsList: {
            name: string;
            category: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            billingCycle: string;
            nextBillingDate: Date;
            paymentMethod: string | null;
            notes: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        }[];
        upcomingRenewalsList: {
            name: string;
            category: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            billingCycle: string;
            nextBillingDate: Date;
            paymentMethod: string | null;
            notes: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        }[];
        overdueRenewalsList: {
            name: string;
            category: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            billingCycle: string;
            nextBillingDate: Date;
            paymentMethod: string | null;
            notes: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        }[];
    }>;
    getCategories(userId: string): Promise<string[]>;
};
//# sourceMappingURL=subscripton.service.d.ts.map