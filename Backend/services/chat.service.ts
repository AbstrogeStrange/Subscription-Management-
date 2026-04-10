import axios from "axios";
import prisma from "../utils/prisma";
import { env } from "../config/env";

interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

const extractResponseText = (responseData: any): string => {
  if (typeof responseData?.output_text === "string" && responseData.output_text.trim()) {
    return responseData.output_text.trim();
  }

  const output = responseData?.output;
  if (Array.isArray(output)) {
    const chunks: string[] = [];
    for (const item of output) {
      const content = item?.content;
      if (!Array.isArray(content)) continue;
      for (const part of content) {
        if (typeof part?.text === "string" && part.text.trim()) {
          chunks.push(part.text.trim());
        }
      }
    }
    if (chunks.length > 0) return chunks.join("\n");
  }

  return "I couldn't generate a response right now. Please try again.";
};

const toMonthlyAmount = (amount: number, billingCycle: string) => {
  if (billingCycle === "yearly") return amount / 12;
  if (billingCycle === "weekly") return (amount * 52) / 12;
  return amount;
};

export const chatService = {
  async getInsights(userId: string) {
    const [subscriptions, payments] = await Promise.all([
      prisma.subscription.findMany({
        where: { userId, isActive: true },
      }),
      prisma.payment.findMany({
        where: {
          userId,
          status: "success",
          paymentDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lte: new Date(),
          },
        },
      }),
    ]);

    const monthlySpend = subscriptions.reduce((sum, sub) => {
      return sum + toMonthlyAmount(Number(sub.amount), sub.billingCycle);
    }, 0);

    const paidThisMonth = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

    const estimatedSavings = monthlySpend * 0.2;

    return [
      `You are currently spending about Rs ${monthlySpend.toFixed(0)} per month on active subscriptions.`,
      `You have paid Rs ${paidThisMonth.toFixed(0)} this month so far.`,
      `If you cancel low-usage subscriptions, you could potentially save around Rs ${estimatedSavings.toFixed(0)} per month.`,
    ];
  },

  async ask(userId: string, message: string, history: ChatHistoryItem[] = []) {
    const [user, subscriptions, payments, insights] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.subscription.findMany({
        where: { userId, isActive: true },
        orderBy: { nextBillingDate: "asc" },
      }),
      prisma.payment.findMany({
        where: {
          userId,
          status: "success",
          paymentDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lte: new Date(),
          },
        },
      }),
      this.getInsights(userId),
    ]);

    const monthlySpend = subscriptions.reduce((sum, sub) => {
      return sum + toMonthlyAmount(Number(sub.amount), sub.billingCycle);
    }, 0);

    const paymentsThisMonth = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    const contextSummary = {
      userName: user?.name || "User",
      plan: user?.plan || "free",
      activeSubscriptionsCount: subscriptions.length,
      monthlySpend: Number(monthlySpend.toFixed(2)),
      paymentsThisMonth: Number(paymentsThisMonth.toFixed(2)),
      subscriptions: subscriptions.map((s) => ({
        name: s.name,
        category: s.category || "Uncategorized",
        amount: Number(s.amount),
        billingCycle: s.billingCycle,
        nextBillingDate: s.nextBillingDate.toISOString(),
      })),
      insights,
    };

    if (!env.OPENAI_API_KEY) {
      return `OpenAI key is missing. Add OPENAI_API_KEY in Backend/.env.\n\nQuick insights:\n- ${insights.join(
        "\n- "
      )}`;
    }

    const trimmedHistory = history.slice(-8);
    const input = [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are a subscription finance assistant inside a SaaS app. Give concise, practical suggestions. Use INR and concrete actions. If asked about cancellation, suggest impact and alternatives.",
          },
        ],
      },
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: `User context: ${JSON.stringify(contextSummary)}`,
          },
        ],
      },
      ...trimmedHistory.map((item) => ({
        role: item.role,
        content: [{ type: "input_text", text: item.content }],
      })),
      {
        role: "user",
        content: [{ type: "input_text", text: message }],
      },
    ];

    const response = await axios.post(
      "https://api.openai.com/v1/responses",
      {
        model: env.OPENAI_MODEL,
        input,
        temperature: 0.4,
        max_output_tokens: 400,
      },
      {
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    return extractResponseText(response.data);
  },
};

