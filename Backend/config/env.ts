import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const backendRootCandidates = [
  path.resolve(process.cwd()),
  path.resolve(__dirname, ".."),
  path.resolve(__dirname, "..", ".."),
];

const backendRoot =
  backendRootCandidates.find((candidate) =>
    fs.existsSync(path.resolve(candidate, "package.json")) &&
    fs.existsSync(path.resolve(candidate, "prisma", "schema.prisma"))
  ) || path.resolve(__dirname, "..");

// Force project-level .env values so machine-wide env vars don't break local schema/provider setup.
dotenv.config({ path: path.resolve(backendRoot, ".env"), override: true });
const rawDatabaseUrl = process.env.DATABASE_URL?.trim();

if (!rawDatabaseUrl) {
  const defaultDbPath = path.resolve(backendRoot, "prisma", "dev.db").replace(/\\/g, "/");
  process.env.DATABASE_URL = `file:${defaultDbPath}`;
} else if (rawDatabaseUrl.startsWith("file:./") || rawDatabaseUrl.startsWith("file:../")) {
  const relativeDbPath = rawDatabaseUrl.slice("file:".length);
  const resolvedDbPath = path.resolve(backendRoot, relativeDbPath).replace(/\\/g, "/");
  process.env.DATABASE_URL = `file:${resolvedDbPath}`;
}

export const env = {
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
