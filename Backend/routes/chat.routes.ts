import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { chatController } from "../controllers/chat.controller";

const chatRouter = Router();

chatRouter.use(authMiddleware);
chatRouter.get("/insights", chatController.getInsights);
chatRouter.post("/ask", chatController.ask);

export default chatRouter;

