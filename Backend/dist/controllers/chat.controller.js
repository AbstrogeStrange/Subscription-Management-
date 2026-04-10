"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const chat_service_1 = require("../services/chat.service");
exports.chatController = {
    async getInsights(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const insights = await chat_service_1.chatService.getInsights(userId);
            return res.status(200).json({
                message: "Insights generated",
                data: insights,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: error.message || "Failed to generate insights",
            });
        }
    },
    async ask(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { message, history } = req.body;
            if (!message || !message.trim()) {
                return res.status(400).json({ message: "message is required" });
            }
            const reply = await chat_service_1.chatService.ask(userId, message.trim(), history || []);
            return res.status(200).json({
                message: "Chat response generated",
                data: { reply },
            });
        }
        catch (error) {
            return res.status(500).json({
                message: error.message || "Failed to generate response",
            });
        }
    },
};
//# sourceMappingURL=chat.controller.js.map