import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardApi } from '../../api/api';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface UpcomingPayment {
  id: string;
  name: string;
  amount: number;
  billingCycle: string;
  nextBillingDate: string;
  daysLeft: number;
}

interface PaymentsSummary {
  totalSpentThisMonth: number;
  upcomingPayments: UpcomingPayment[];
  activeSubscriptionsCount: number;
  savingsIfCanceled: {
    monthly: number;
    yearly: number;
  };
}

interface PaymentRecord {
  id: string;
  amount: number;
  planType: string;
  status: string;
  paymentDate: string;
}

const PLAN_OPTIONS = [
  { id: 'basic', name: 'Basic', amount: 1999, description: 'Good for growing users' },
  { id: 'premium', name: 'Premium', amount: 4999, description: 'Best for heavy subscription users' },
];

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PaymentsPage: React.FC = () => {
  const [summary, setSummary] = useState<PaymentsSummary | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingPlan, setPayingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, historyRes] = await Promise.all([
        dashboardApi.getPaymentsSummary(),
        dashboardApi.getPaymentHistory(0, 20),
      ]);
      setSummary(summaryRes.data.data as PaymentsSummary);
      setPaymentHistory((historyRes.data.data || []) as PaymentRecord[]);
    } catch (apiError: any) {
      const message = apiError?.response?.data?.message || 'Failed to load payments data';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const hasUpcomingPayments = useMemo(
    () => (summary?.upcomingPayments?.length || 0) > 0,
    [summary]
  );

  const startRazorpayPayment = async (planType: string, amount: number) => {
    try {
      setPayingPlan(planType);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Unable to load Razorpay checkout script.');
      }

      const orderRes = await dashboardApi.createRazorpayOrder({ amount, planType });
      const orderData = orderRes.data.data as {
        keyId: string;
        orderId: string;
        amount: number;
        currency: string;
        planType: string;
      };

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency,
        name: 'SubSync',
        description: `${planType.toUpperCase()} plan upgrade`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          await dashboardApi.verifyRazorpayPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            amount: orderData.amount,
            planType: orderData.planType,
          });
          await fetchPaymentsData();
          alert('Payment successful and verified.');
        },
        modal: {
          ondismiss: () => {
            setPayingPlan(null);
          },
        },
        theme: {
          color: '#8b5cf6',
        },
      });

      razorpay.open();
    } catch (paymentError: any) {
      const message = paymentError?.response?.data?.message || paymentError.message || 'Payment failed';
      alert(message);
    } finally {
      setPayingPlan(null);
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-muted-foreground">Loading payments...</div>;
  }

  if (error || !summary) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-600">
        {error || 'Unable to load payments page.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground">
          Monitor spending, upcoming renewals, and upgrade plans with Razorpay.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">💰 Total spent this month</p>
          <p className="mt-1 text-2xl font-bold text-foreground">Rs {summary.totalSpentThisMonth.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">📅 Upcoming payments</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{summary.upcomingPayments.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">🔁 Active subscriptions count</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{summary.activeSubscriptionsCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">💸 Savings (if canceled)</p>
          <p className="mt-1 text-xl font-bold text-foreground">
            Rs {summary.savingsIfCanceled.monthly.toFixed(2)} / month
          </p>
          <p className="text-xs text-muted-foreground">Rs {summary.savingsIfCanceled.yearly.toFixed(2)} / year</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Upcoming payments</h2>
          {!hasUpcomingPayments ? (
            <p className="text-sm text-muted-foreground">No upcoming payments in the next 30 days.</p>
          ) : (
            <div className="space-y-3">
              {summary.upcomingPayments.map((item) => (
                <div key={item.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="font-semibold text-foreground">Rs {item.amount.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Due in {item.daysLeft} day(s) on{' '}
                    {new Date(item.nextBillingDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Upgrade with Razorpay</h2>
          <div className="space-y-3">
            {PLAN_OPTIONS.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{plan.name}</p>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <p className="font-bold text-foreground">Rs {plan.amount}</p>
                </div>
                <button
                  onClick={() => startRazorpayPayment(plan.id, plan.amount)}
                  disabled={payingPlan === plan.id}
                  className="mt-3 w-full rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {payingPlan === plan.id ? 'Processing...' : `Pay with Razorpay (${plan.name})`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Payment history</h2>
        {paymentHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payments yet.</p>
        ) : (
          <div className="space-y-2">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium text-foreground">{payment.planType.toUpperCase()} plan</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(payment.paymentDate).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">Rs {Number(payment.amount).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{payment.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;
