import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { chatService } from "../services/chat.service";

export const chatController = {
  async getInsights(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const insights = await chatService.getInsights(userId);
      return res.status(200).json({
        message: "Insights generated",
        data: insights,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Failed to generate insights",
      });
    }
  },

  async ask(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { message, history } = req.body as {
        message?: string;
        history?: { role: "user" | "assistant"; content: string }[];
      };

      if (!message || !message.trim()) {
        return res.status(400).json({ message: "message is required" });
      }

      const reply = await chatService.ask(userId, message.trim(), history || []);

      return res.status(200).json({
        message: "Chat response generated",
        data: { reply },
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Failed to generate response",
      });
    }
  },
};

