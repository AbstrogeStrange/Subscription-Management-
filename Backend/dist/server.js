"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const app = (0, express_1.default)();
// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Debug middleware - log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.query);
    next();
});
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/dashboard", dashboard_route_1.default);
app.use("/api/subscriptions", subscription_routes_1.default);
app.use("/api/chat", chat_routes_1.default);
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});
// 404 handler - add this to see what routes are not found
app.use((req, res, next) => {
    console.log('404 Not Found:', req.method, req.originalUrl);
    res.status(404).json({
        message: "Route not found",
        path: req.originalUrl,
        method: req.method
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
const PORT = env_1.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map