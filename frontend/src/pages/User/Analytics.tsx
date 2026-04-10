import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ChartLineUp,
  CreditCard,
  MagnifyingGlass,
  Sparkle,
  TrendUp,
  Wallet,
} from '@phosphor-icons/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { subscriptionApi } from '../../api/api';

interface AnalyticsSubscription {
  id: string;
  name: string;
  category?: string;
  amount: number;
  billingCycle: string;
  isActive: boolean;
}

interface DashboardAnalyticsResponse {
  monthlyCost: number;
  yearlyCost: number;
  activeSubscriptions: number;
  categoryBreakdown: Record<string, number>;
  subscriptionsList: AnalyticsSubscription[];
}

interface ProjectionPoint {
  month: string;
  amount: number;
}

const monthName = (date: Date) =>
  date.toLocaleString('en-IN', { month: 'short' });

const addMonths = (date: Date, count: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + count);
  return next;
};

const normalizeMonthlyAmount = (amount: number, billingCycle: string) => {
  if (billingCycle === 'yearly') return amount / 12;
  if (billingCycle === 'weekly') return amount * (52 / 12);
  return amount;
};

const buildProjectionData = (subscriptions: AnalyticsSubscription[]): ProjectionPoint[] => {
  const baseMonthlySpend = subscriptions
    .filter((subscription) => subscription.isActive)
    .reduce(
      (sum, subscription) =>
        sum + normalizeMonthlyAmount(Number(subscription.amount), subscription.billingCycle),
      0
    );

  const now = new Date();
  return Array.from({ length: 6 }).map((_, index) => {
    const date = addMonths(now, index);
    return {
      month: monthName(date),
      amount: Number(baseMonthlySpend.toFixed(2)),
    };
  });
};

const activityColumns = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalyticsResponse | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await subscriptionApi.getDashboardAnalytics();
        setAnalytics(response.data.data as DashboardAnalyticsResponse);
      } catch (apiError) {
        console.error('Failed to load analytics:', apiError);
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const projectionData = useMemo(
    () => buildProjectionData(analytics?.subscriptionsList || []),
    [analytics]
  );

  const categoryData = useMemo(() => {
    if (!analytics?.categoryBreakdown) return [];
    return Object.entries(analytics.categoryBreakdown)
      .map(([category, amount]) => ({
        category,
        amount: Number(amount.toFixed(2)),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [analytics]);

  const topSubscriptions = useMemo(() => {
    return [...(analytics?.subscriptionsList || [])]
      .sort(
        (a, b) =>
          normalizeMonthlyAmount(b.amount, b.billingCycle) -
          normalizeMonthlyAmount(a.amount, a.billingCycle)
      )
      .slice(0, 5);
  }, [analytics]);

  const totalSubscriptions = analytics?.subscriptionsList.length || 0;
  const activeSubscriptions = analytics?.activeSubscriptions || 0;
  const inactiveSubscriptions = Math.max(totalSubscriptions - activeSubscriptions, 0);
  const monthlyCost = analytics?.monthlyCost || 0;
  const yearlyCost = analytics?.yearlyCost || 0;
  const growthRate = monthlyCost > 0 ? ((yearlyCost / 12 - monthlyCost) / monthlyCost) * 100 : 0;
  const avgSubscriptionCost = totalSubscriptions > 0 ? monthlyCost / totalSubscriptions : 0;

  const statCards = [
    {
      title: 'Total Subscriptions',
      value: totalSubscriptions,
      change: `${activeSubscriptions} active`,
      tone: 'bg-blue-50 text-blue-600',
      icon: <CreditCard size={18} weight="bold" />,
    },
    {
      title: 'Monthly Spending',
      value: `Rs ${monthlyCost.toFixed(0)}`,
      change: growthRate >= 0 ? `+${growthRate.toFixed(1)}%` : `${growthRate.toFixed(1)}%`,
      tone: 'bg-violet-50 text-violet-600',
      icon: <Wallet size={18} weight="bold" />,
    },
    {
      title: 'Active Users',
      value: activeSubscriptions,
      change: `${inactiveSubscriptions} paused`,
      tone: 'bg-emerald-50 text-emerald-600',
      icon: <TrendUp size={18} weight="bold" />,
    },
    {
      title: 'Growth %',
      value: `${Math.abs(growthRate).toFixed(1)}%`,
      change: growthRate >= 0 ? 'Positive trend' : 'Needs review',
      tone: 'bg-amber-50 text-amber-600',
      icon: <ArrowUpRight size={18} weight="bold" />,
    },
    {
      title: 'Avg. Cost',
      value: `Rs ${avgSubscriptionCost.toFixed(0)}`,
      change: 'Per subscription',
      tone: 'bg-slate-100 text-slate-700',
      icon: <Sparkle size={18} weight="fill" />,
    },
  ];

  const activityGrid = Array.from({ length: 35 }).map((_, index) => {
    const intensity = (index * 17) % 5;
    const shades = [
      'bg-slate-100',
      'bg-indigo-100',
      'bg-violet-200',
      'bg-violet-300',
      'bg-violet-500',
    ];
    return shades[intensity];
  });

  if (loading) {
    return (
      <div className="rounded-[28px] bg-white/95 p-10 shadow-sm ring-1 ring-slate-200">
        <p className="text-center text-slate-500">Loading analytics...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-white/95 p-6 text-rose-600 shadow-sm">
        {error || 'Unable to load analytics right now.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] bg-[#f8f8fb]/95 p-5 shadow-sm ring-1 ring-slate-200 backdrop-blur-sm lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <p className="text-sm font-medium text-slate-400">Dashboard / Analytics</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
              Analytics
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor subscription trends, category spend, and account activity in one clean workspace.
            </p>
          </div>

          <div className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <MagnifyingGlass size={18} className="text-slate-400" weight="bold" />
            <input
              type="text"
              placeholder="Search analytics..."
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </motion.div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all"
            >
              <div className={`inline-flex rounded-xl p-2.5 ${card.tone}`}>
                {card.icon}
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">{card.title}</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-slate-400">{card.change}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Revenue trend</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">Monthly spending</h2>
              </div>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600">
                Last 6 months
              </span>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="analyticsSpendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: '1px solid #e5e7eb',
                      background: '#ffffff',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                    }}
                    formatter={(value: number) => [`Rs ${value.toFixed(2)}`, 'Spend']}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#analyticsSpendFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.14 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Category breakdown</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">Subscriptions per category</h2>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: '1px solid #e5e7eb',
                      background: '#ffffff',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                    }}
                    formatter={(value: number) => [`Rs ${value.toFixed(2)}`, 'Amount']}
                  />
                  <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.18 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Insights</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">Top categories</h3>
              </div>
              <ChartLineUp size={18} className="text-violet-500" weight="bold" />
            </div>

            <div className="space-y-3">
              {categoryData.slice(0, 5).map((item, index) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-sm font-semibold text-violet-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.category}</p>
                      <p className="text-xs text-slate-400">Category share</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Rs {item.amount.toFixed(0)}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.22 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Top subscriptions</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">Highest monthly impact</h3>
              </div>
              <Wallet size={18} className="text-blue-500" weight="bold" />
            </div>

            <div className="space-y-3">
              {topSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{subscription.name}</p>
                    <p className="text-xs text-slate-400">{subscription.category || 'Uncategorized'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      Rs {normalizeMonthlyAmount(subscription.amount, subscription.billingCycle).toFixed(0)}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">{subscription.billingCycle}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.26 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-400">Usage heatmap</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">Weekly activity</h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-medium text-slate-400">
                {activityColumns.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {activityGrid.map((shade, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-md ${shade} border border-white`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Recent activity</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">Subscription activity table</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Cost</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.subscriptionsList.slice(0, 6).map((subscription) => (
                  <tr key={subscription.id} className="rounded-2xl bg-slate-50 text-sm text-slate-700">
                    <td className="rounded-l-2xl px-4 py-3 font-medium text-slate-900">{subscription.name}</td>
                    <td className="px-4 py-3 text-slate-500">{subscription.category || 'Uncategorized'}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      Rs {subscription.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          subscription.isActive
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {subscription.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="rounded-r-2xl px-4 py-3 text-slate-500">
                      {new Date().toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
