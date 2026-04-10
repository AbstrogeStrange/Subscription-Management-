Subscription Management SaaS – Software Requirements Specification (SRS)

Introduction
This document outlines the Software Requirements Specification for a Personal Subscription Tracker
SaaS. It defines features, modules, workflows, database design, and non-functional requirements.
Project Overview
A web-based subscription tracking SaaS where users manage personal subscriptions, receive
reminders, and access analytics.
Target Users: Consumers, students, working professionals.
Tech Stack:
Frontend: React, Tailwind CSS, shadcn/ui, React Router
Backend: Node.js, Express.js
Database: NeonDB (PostgreSQL-compatible)
Authentication: JWT
Payment: Razorpay
Other Tools: bcryptjs, date-fns, node-cron, Nodemailer, zod

Functional Requirements
3.1 Authentication

Register user with hashed password.
Login with JWT.
Protected routes (middleware).
View/edit profile (name, currency).
Logout (client-side token removal).
3.2 Subscription Management

Add subscription: name, amount, billing cycle, category, next billing date, payment method, notes.
Edit subscription details.
Delete subscription.
List all subscriptions for the logged-in user.
Search by name.
Filter by category, billing cycle, active status.
Sort by amount, next billing date.
3.3 Dashboard & Analytics

Show total monthly cost (calculated from subscriptions).
Show total yearly cost.
Show count of active subscriptions.
Category-wise spending summary.
List of upcoming renewals (next 7 / 30 days).
List of overdue renewals (next billing date < today).
3.4 SaaS Plan System (Free vs Pro)
Free Plan:

Maximum 5 subscriptions.
Basic dashboard & upcoming renewals.
Pro Plan:

Unlimited subscriptions.
Email reminders.
Export subscriptions to CSV.
Full analytics (category charts, longer lookback).
3.5 Payment Integration

Allow user to choose Pro Monthly/Yearly on pricing page.
Create Razorpay order from backend.
Handle Razorpay webhook to verify payment.
Auto-upgrade user plan to Pro on successful payment.
Store billing history (amount, date, plan type, status).
3.6 Notifications & Reminders

Daily cron job to detect subscriptions whose next billing date is in 1, 3, or 7 days.
Send email reminders to Pro users only.
Email content: subscription name, amount, renewal date, and link to dashboard.
3.7 Export Feature (Pro)

Export all subscriptions for the logged-in user to CSV.
Include core fields: name, category, amount, billing cycle, next billing date, payment method, status.
Non-Functional Requirements
Performance: Typical API requests should complete within 500 ms under normal load.
Security:
Hash all passwords using bcrypt.
Use JWT for authentication and verify on every protected request.
Use HTTPS in production.
Do not store raw payment card details (handled by Razorpay).
Reliability: System should tolerate transient failures and log errors for debugging.
Availability: Target 99.5% uptime.
Usability: Responsive, mobile-friendly UI with clear navigation.
Scalability: Database and backend designed to handle thousands of users and their subscriptions.
Database Design (PostgreSQL / NeonDB)
Relational schema with proper foreign keys and constraints.

Table: users

id (UUID, primary key)
name (text, not null)
email (text, unique, not null)
password_hash (text, not null)
plan (text, default 'free') -- enum-like: 'free' or 'pro'
plan_expires_at (timestamp, nullable)
currency (text, default 'INR')
created_at (timestamp, default now())
updated_at (timestamp, default now())
Table: subscriptions

id (UUID, primary key)
user_id (UUID, not null, references users(id) on delete cascade)
name (text, not null)
category (text, nullable)
amount (numeric(10,2), not null)
currency (text, not null)
billing_cycle (text, not null) -- e.g. 'monthly','yearly','weekly','custom'
next_billing_date (date, not null)
payment_method (text, nullable) -- e.g. 'UPI','Card'
is_active (boolean, default true)
notes (text, nullable)
created_at (timestamp, default now())
updated_at (timestamp, default now())
Table: payments

id (UUID, primary key)
user_id (UUID, not null, references users(id) on delete cascade)
amount (numeric(10,2), not null)
currency (text, not null)
plan_type (text, not null) -- e.g. 'pro_monthly','pro_yearly'
razorpay_order_id (text, not null)
razorpay_payment_id (text, nullable)
status (text, not null) -- 'created','success','failed'
payment_date (timestamp, default now())
Development Phases
Phase 1: Project setup and static UI

Set up React frontend and Express backend.
Configure NeonDB/PostgreSQL connection.
Build static pages: landing, login, register, dashboard shell.
Phase 2: Authentication

Implement register, login, JWT auth.
Protect routes.
Basic profile view.
Phase 3: Subscription CRUD

Implement backend CRUD for subscriptions linked by user_id.
Build frontend forms, lists, filters, and sorting.
Phase 4: Dashboard & Insights

Implement aggregated queries for monthly/yearly totals and category breakdown.
Show upcoming/overdue renewals.
Phase 5: Free vs Pro Plan Logic

Enforce max subscription limit for Free users.
Show upgrade prompts when limit reached.
Display current plan and expiry in UI.
Phase 6: Payment Integration

Integrate Razorpay for Pro plan upgrades.
Implement webhook to mark payments successful and set plan/pro expiry.
Show billing history.
Phase 7: Reminder System

Add cron job for daily renewal checks.
Send reminder emails for Pro users.
Phase 8: Enhancements

CSV export (Pro only).
UI polish, dark mode, advanced analytics, etc.
Future Enhancements
Multiple profiles per user (Personal, Work, Family).
Card expiry reminders.
AI-based recommendations for cancelling rarely used subscriptions.
Mobile app using React Native.
