"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const backendRootCandidates = [
    path_1.default.resolve(process.cwd()),
    path_1.default.resolve(__dirname, ".."),
    path_1.default.resolve(__dirname, "..", ".."),
];
const backendRoot = backendRootCandidates.find((candidate) => fs_1.default.existsSync(path_1.default.resolve(candidate, "package.json")) &&
    fs_1.default.existsSync(path_1.default.resolve(candidate, "prisma", "schema.prisma"))) || path_1.default.resolve(__dirname, "..");
// Force project-level .env values so machine-wide env vars don't break local schema/provider setup.
dotenv_1.default.config({ path: path_1.default.resolve(backendRoot, ".env"), override: true });
const rawDatabaseUrl = process.env.DATABASE_URL?.trim();
if (!rawDatabaseUrl) {
    const defaultDbPath = path_1.default.resolve(backendRoot, "prisma", "dev.db").replace(/\\/g, "/");
    process.env.DATABASE_URL = `file:${defaultDbPath}`;
}
else if (rawDatabaseUrl.startsWith("file:./") || rawDatabaseUrl.startsWith("file:../")) {
    const relativeDbPath = rawDatabaseUrl.slice("file:".length);
    const resolvedDbPath = path_1.default.resolve(backendRoot, relativeDbPath).replace(/\\/g, "/");
    process.env.DATABASE_URL = `file:${resolvedDbPath}`;
}
exports.env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key",
    JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4.1-mini",
};
//# sourceMappingURL=env.js.map