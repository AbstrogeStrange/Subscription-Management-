import { Request, Response } from 'express';
export declare const dashboardController: {
    getDashboardStats(req: Request, res: Response): Promise<void>;
    getSubscriptions(req: Request, res: Response): Promise<void>;
    getUpcomingRenewals(req: Request, res: Response): Promise<void>;
    getMonthlySpendingTrend(req: Request, res: Response): Promise<void>;
    getSubscriptionByCategory(req: Request, res: Response): Promise<void>;
    createSubscription(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateSubscription(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteSubscription(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getPaymentHistory(req: Request, res: Response): Promise<void>;
    getPaymentsSummary(req: Request, res: Response): Promise<void>;
    createRazorpayOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    verifyRazorpayPayment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=dashboard.controller.d.ts.map