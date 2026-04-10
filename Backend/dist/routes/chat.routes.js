"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const chat_controller_1 = require("../controllers/chat.controller");
const chatRouter = (0, express_1.Router)();
chatRouter.use(authMiddleware_1.authMiddleware);
chatRouter.get("/insights", chat_controller_1.chatController.getInsights);
chatRouter.post("/ask", chat_controller_1.chatController.ask);
exports.default = chatRouter;
//# sourceMappingURL=chat.routes.js.map