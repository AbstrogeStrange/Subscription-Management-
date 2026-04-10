import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
export declare const chatController: {
    getInsights(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    ask(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=chat.controller.d.ts.map