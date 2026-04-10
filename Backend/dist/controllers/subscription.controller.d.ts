import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
export declare const subscriptionController: {
    addSubscription(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getSubscriptions(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getSubscription(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateSubscription(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteSubscription(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getDaysUntilBilling(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getUpcomingRenewals(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getOverdueRenewals(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getDashboardAnalytics(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getCategories(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=subscription.controller.d.ts.map