export declare const dashboardService: {
    getDashboardStats(userId: string): Promise<{
        activeSubscriptions: number;
        monthlySpending: number;
        yearlySpending: number;
        nextRenewal: {
            name: string;
            date: Date;
            daysLeft: number;
        } | null;
        plan: string;
        subscriptionLimit: number;
    }>;
    getSubscriptions(userId: string, options?: {
        skip?: number;
        take?: number;
        isActive?: boolean;
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
    getUpcomingRenewals(userId: string, daysAhead?: number): Promise<{
        id: string;
        name: string;
        amount: number;
        nextBillingDate: Date;
        daysLeft: number;
    }[]>;
    getMonthlySpendingTrend(userId: string, months?: number): Promise<{
        month: string;
        amount: number;
    }[]>;
    getSubscriptionByCategory(userId: string): Promise<{
        [key: string]: {
            count: number;
            amount: number;
        };
    }>;
    createSubscription(userId: string, data: {
        name: string;
        category?: string;
        amount: number;
        billingCycle: string;
        nextBillingDate: Date;
        paymentMethod?: string;
        notes?: string;
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
    }>;
    updateSubscription(userId: string, subscriptionId: string, data: Partial<{
        name: string;
        category: string;
        amount: number;
        billingCycle: string;
        nextBillingDate: Date;
        paymentMethod: string;
        notes: string;
        isActive: boolean;
    }>): Promise<{
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
    deleteSubscription(userId: string, subscriptionId: string): Promise<{
        message: string;
    }>;
    getPaymentHistory(userId: string, options?: {
        skip?: number;
        take?: number;
    }): Promise<{
        amount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planType: string;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        status: string;
        paymentDate: Date;
    }[]>;
    getPaymentsSummary(userId: string): Promise<{
        totalSpentThisMonth: number;
        upcomingPayments: {
            id: string;
            name: string;
            amount: number;
            billingCycle: string;
            nextBillingDate: Date;
            daysLeft: number;
        }[];
        activeSubscriptionsCount: number;
        savingsIfCanceled: {
            monthly: number;
            yearly: number;
        };
    }>;
    createRazorpayOrder(userId: string, payload: {
        amount: number;
        planType: string;
    }): Promise<{
        orderId: any;
        amount: number;
        currency: string;
        keyId: string;
        planType: string;
    }>;
    verifyRazorpayPayment(userId: string, payload: {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
        amount: number;
        planType: string;
    }): Promise<{
        amount: import("@prisma/client/runtime/library").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planType: string;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        status: string;
        paymentDate: Date;
    }>;
};
//# sourceMappingURL=dasboard.service.d.ts.map