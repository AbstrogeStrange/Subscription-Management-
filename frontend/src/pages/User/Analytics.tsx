import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CaretDown,
  ChartLineUp,
  Coins,
  PiggyBank,
  Sparkle,
  TrendDown,
  TrendUp,
  Wallet,
} from '@phosphor-icons/react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { dashboardApi, subscriptionApi } from '../../api/api';

interface AnalyticsSubscription {
  id: string;
  name: string;
  category?: string | null;
  amount: number | string;
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

interface SpendingPoint {
  month: string;
  amount: number;
}

type AnalyticsTab = 'Summary' | 'Spending' | 'Income' | 'Savings' | 'Net Worth';
type TimeRange = 'Weekly' | 'Monthly' | 'Yearly';

const tabs: AnalyticsTab[] = ['Summary', 'Spending', 'Income', 'Savings', 'Net Worth'];
const ranges: TimeRange[] = ['Weekly', 'Monthly', 'Yearly'];
const accounts = ['All accounts', 'Primary account', 'Subscriptions wallet'];
const donutPalette = ['#7C3AED', '#3B82F6', '#14B8A6', '#EC4899', '#F59E0B', '#8B5CF6'];

const normalizeAmount = (amount: number | string) => Number(amount) || 0;

const normalizeMonthlyAmount = (amount: number | string, billingCycle: string) => {
  const value = normalizeAmount(amount);
  if (billingCycle === 'yearly') return value / 12;
  if (billingCycle === 'weekly') return value * (52 / 12);
  return value;
};

const formatCurrency = (amount: number) => `Rs ${Math.round(amount).toLocaleString('en-IN')}`;

const buildWeeklySeries = (monthlyExpense: number) => {
  const base = monthlyExpense / 4.2;
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, index) => {
    const expenses = Number((base * (0.72 + index * 0.09)).toFixed(2));
    const income = Number((expenses * 2.55).toFixed(2));
    return { label, income, expenses, net: income - expenses };
  });
};

const buildMonthlySeries = (trend: SpendingPoint[]) =>
  trend.map((point, index) => {
    const expenses = normalizeAmount(point.amount);
    const income = Number((expenses * (2.15 + (index % 2) * 0.08)).toFixed(2));
    return {
      label: point.month,
      income,
      expenses,
      net: Number((income - expenses).toFixed(2)),
    };
  });

const buildYearlySeries = (monthlyExpense: number) => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return labels.map((label, index) => {
    const expenses = Number((monthlyExpense * (0.78 + (index % 6) * 0.08)).toFixed(2));
    const income = Number((expenses * 2.35).toFixed(2));
    return { label, income, expenses, net: Number((income - expenses).toFixed(2)) };
  });
};

const GlassPanel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div
    className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] shadow-[0_18px_60px_rgba(4,8,20,0.34)] backdrop-blur-xl ${className}`}
  >
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))]" />
    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px]" />
    <div className="relative z-10">{children}</div>
  </div>
);

interface KpiCardProps {
  title: string;
  value: string;
  trend: string;
  positive?: boolean;
  icon: React.ReactNode;
  accent: string;
  delay: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, trend, positive = true, icon, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -6, scale: 1.01 }}
  >
    <GlassPanel className="h-full p-5">
      <div className={`absolute -right-10 top-0 h-24 w-24 rounded-full blur-3xl ${accent}`} />
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-3 text-white">
          {icon}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            positive
              ? 'border border-emerald-400/15 bg-emerald-400/10 text-emerald-200'
              : 'border border-rose-400/15 bg-rose-400/10 text-rose-200'
          }`}
        >
          {trend}
        </span>
      </div>
      <p className="mt-5 text-sm font-medium text-white/48">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">{value}</p>
    </GlassPanel>
  </motion.div>
);

const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalyticsResponse | null>(null);
  const [spendingTrend, setSpendingTrend] = useState<SpendingPoint[]>([]);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('Summary');
  const [range, setRange] = useState<TimeRange>('Monthly');
  const [account, setAccount] = useState(accounts[0]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const [analyticsRes, trendRes] = await Promise.all([
          subscriptionApi.getDashboardAnalytics(),
          dashboardApi.getMonthlySpendingTrend(6),
        ]);

        setAnalytics(analyticsRes.data.data as DashboardAnalyticsResponse);
        setSpendingTrend((trendRes.data.data || []) as SpendingPoint[]);
      } catch (apiError) {
        console.error('Failed to load analytics:', apiError);
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const subscriptions = useMemo(
    () =>
      (analytics?.subscriptionsList || []).map((subscription) => ({
        ...subscription,
        amount: normalizeAmount(subscription.amount),
      })),
    [analytics]
  );

  const monthlyExpense = analytics?.monthlyCost || 0;
  const yearlyExpense = analytics?.yearlyCost || 0;
  const modeledIncome = monthlyExpense > 0 ? monthlyExpense * 2.35 : 0;
  const netIncome = modeledIncome - monthlyExpense;
  const previousExpense = spendingTrend.length > 1 ? normalizeAmount(spendingTrend[spendingTrend.length - 2].amount) : monthlyExpense;
  const growthRate = previousExpense > 0 ? ((monthlyExpense - previousExpense) / previousExpense) * 100 : 0;
  const savingsRate = modeledIncome > 0 ? (netIncome / modeledIncome) * 100 : 0;

  const performanceSeries = useMemo(() => {
    if (range === 'Weekly') return buildWeeklySeries(monthlyExpense);
    if (range === 'Yearly') return buildYearlySeries(monthlyExpense);
    return buildMonthlySeries(spendingTrend.length > 0 ? spendingTrend : [{ month: 'Now', amount: monthlyExpense }]);
  }, [monthlyExpense, range, spendingTrend]);

  const donutData = useMemo(() => {
    const entries = Object.entries(analytics?.categoryBreakdown || {})
      .map(([name, value]) => ({
        name,
        value: normalizeAmount(value),
      }))
      .filter((entry) => entry.value > 0)
      .sort((a, b) => b.value - a.value);

    return entries.length > 0
      ? entries
      : [
          { name: 'Entertainment', value: 0 },
          { name: 'Productivity', value: 0 },
          { name: 'Cloud & Storage', value: 0 },
          { name: 'Other', value: 0 },
        ];
  }, [analytics]);

  const topSubscriptions = useMemo(
    () =>
      [...subscriptions]
        .sort(
          (a, b) =>
            normalizeMonthlyAmount(b.amount, b.billingCycle) -
            normalizeMonthlyAmount(a.amount, a.billingCycle)
        )
        .slice(0, 4),
    [subscriptions]
  );

  const forecastSeries = useMemo(() => {
    const source = performanceSeries.slice(-4);
    return source.map((point, index) => ({
      label: point.label,
      actual: point.expenses,
      forecast: Number((point.expenses * (1 + (index + 1) * 0.06)).toFixed(2)),
    }));
  }, [performanceSeries]);

  const forecastInsight = useMemo(() => {
    const lastPoint = forecastSeries[forecastSeries.length - 1];
    if (!lastPoint) return 'No forecast available yet.';
    return lastPoint.forecast > modeledIncome
      ? `Expected deficit risk around ${lastPoint.label} if subscription expenses continue climbing.`
      : `Projected runway stays healthy through ${lastPoint.label} with current subscription levels.`;
  }, [forecastSeries, modeledIncome]);

  const kpis = [
    {
      title: 'Total Income',
      value: formatCurrency(modeledIncome),
      trend: '+8.4%',
      positive: true,
      icon: <Coins size={20} weight="bold" />,
      accent: 'bg-emerald-400/20',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(monthlyExpense),
      trend: `${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%`,
      positive: growthRate <= 0,
      icon: <Wallet size={20} weight="bold" />,
      accent: 'bg-rose-400/20',
    },
    {
      title: 'Net Income',
      value: formatCurrency(netIncome),
      trend: `${savingsRate.toFixed(1)}% margin`,
      positive: netIncome >= 0,
      icon: <PiggyBank size={20} weight="bold" />,
      accent: 'bg-sky-400/20',
    },
    {
      title: 'Growth %',
      value: `${Math.abs(growthRate).toFixed(1)}%`,
      trend: growthRate >= 0 ? 'Expense expansion' : 'Spend cooling',
      positive: growthRate < 0,
      icon: growthRate >= 0 ? <TrendUp size={20} weight="bold" /> : <TrendDown size={20} weight="bold" />,
      accent: 'bg-violet-400/20',
    },
  ];

  if (loading) {
    return (
      <GlassPanel className="p-10">
        <p className="text-center text-white/58">Loading analytics...</p>
      </GlassPanel>
    );
  }

  if (error || !analytics) {
    return (
      <GlassPanel className="border-rose-400/20 p-6">
        <p className="text-rose-200">{error || 'Unable to load analytics right now.'}</p>
      </GlassPanel>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[30px] bg-[#0b0f19] p-4 text-white lg:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.18),transparent_24%),linear-gradient(180deg,#0b0f19_0%,#0a0e17_44%,#090b12_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative z-10 space-y-6">
        <GlassPanel className="p-5 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-200">
                  <Sparkle size={14} weight="fill" />
                  Premium analytics workspace
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white lg:text-5xl">
                  Financial Analytics
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/56">
                  A premium dark command center for subscription cash flow, modeled financial health, and forward-looking spend signals.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">Time Range</p>
                  <div className="mt-2 flex items-center justify-between text-sm font-medium text-white">
                    <span>{range}</span>
                    <CaretDown size={14} weight="bold" className="text-white/40" />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">Account</p>
                  <div className="mt-2 flex items-center justify-between text-sm font-medium text-white">
                    <span>{account}</span>
                    <CaretDown size={14} weight="bold" className="text-white/40" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-[linear-gradient(135deg,#8b5cf6,#3b82f6)] text-white shadow-[0_10px_30px_rgba(76,81,191,0.35)]'
                      : 'border border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {ranges.map((item) => (
                <button
                  key={item}
                  onClick={() => setRange(item)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
                    range === item
                      ? 'border border-violet-300/20 bg-violet-400/15 text-violet-100'
                      : 'border border-white/10 bg-white/[0.04] text-white/42 hover:text-white/70'
                  }`}
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => setAccount(accounts[(accounts.indexOf(account) + 1) % accounts.length])}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/42 transition-all hover:text-white/70"
              >
                Switch account
              </button>
            </div>
          </motion.div>
        </GlassPanel>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((card, index) => (
            <KpiCard key={card.title} {...card} delay={index * 0.06} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}>
            <GlassPanel className="p-5 lg:p-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/34">Performance overview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Income vs Expenses</h2>
                  <p className="mt-2 text-sm text-white/48">
                    Premium cashflow framing for your subscription stack, with gradient bars and smooth overlays.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white/72">
                  {activeTab} mode
                </div>
              </div>

              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={performanceSeries}>
                    <defs>
                      <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.32} />
                        <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.38} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.08} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.40)', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.32)', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 20,
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(15,18,28,0.92)',
                        color: '#fff',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                      }}
                      formatter={(value: number, name: string) => [formatCurrency(value), name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Net']}
                    />
                    <Bar dataKey="expenses" fill="url(#expenseFill)" radius={[12, 12, 0, 0]} barSize={28} />
                    <Line type="monotone" dataKey="income" stroke="#34D399" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="net" stroke="#60A5FA" strokeWidth={2.5} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}>
            <GlassPanel className="h-full p-5 lg:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/34">Signal board</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Snapshot</h3>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-2 text-violet-200">
                  <ChartLineUp size={18} weight="bold" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Active subscriptions', value: `${analytics.activeSubscriptions}` },
                  { label: 'Annualized expense', value: formatCurrency(yearlyExpense) },
                  { label: 'Savings rate', value: `${savingsRate.toFixed(1)}%` },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/34">{item.label}</p>
                    <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}

                <div className="rounded-2xl border border-white/8 bg-[linear-gradient(135deg,rgba(124,58,237,0.24),rgba(59,130,246,0.12))] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-violet-100/70">Insight</p>
                  <p className="mt-2 text-sm leading-7 text-white/78">
                    {monthlyExpense > 0
                      ? `Subscription spend is currently consuming ${(monthlyExpense / Math.max(modeledIncome, 1) * 100).toFixed(1)}% of your modeled income frame.`
                      : 'Add subscriptions to unlock richer cashflow insight and forecasting.'}
                  </p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}>
            <GlassPanel className="h-full p-5 lg:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/34">Income overview</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{formatCurrency(modeledIncome)}</h3>
                </div>
                <div className="rounded-2xl border border-white/10 bg-emerald-400/10 p-2 text-emerald-200">
                  <Coins size={18} weight="bold" />
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#14b8a6,#60a5fa,#8b5cf6)]"
                  style={{ width: `${Math.min(92, Math.max(18, savingsRate + 30))}%` }}
                />
              </div>

              <div className="mt-5 space-y-3">
                {topSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{subscription.name}</p>
                      <p className="text-xs text-white/38">{subscription.category || 'Other'}</p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(normalizeMonthlyAmount(subscription.amount, subscription.billingCycle))}
                    </p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.26 }}>
            <GlassPanel className="h-full p-5 lg:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/34">Expense analysis</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Donut breakdown</h3>
                </div>
              </div>

              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 18,
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(15,18,28,0.92)',
                        color: '#fff',
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={92}
                      paddingAngle={4}
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={entry.name} fill={donutPalette[index % donutPalette.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {donutData.slice(0, 4).map((item, index) => {
                  const total = donutData.reduce((sum, entry) => sum + entry.value, 0);
                  const share = total > 0 ? (item.value / total) * 100 : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: donutPalette[index % donutPalette.length] }} />
                        <p className="text-sm text-white/72">{item.name}</p>
                      </div>
                      <p className="text-sm font-medium text-white">{share.toFixed(0)}%</p>
                    </div>
                  );
                })}
              </div>
            </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
            <GlassPanel className="h-full p-5 lg:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/34">Financial forecast</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Forward view</h3>
                </div>
              </div>

              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastSeries}>
                    <defs>
                      <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.32)', fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 18,
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(15,18,28,0.92)',
                        color: '#fff',
                      }}
                    />
                    <Area type="monotone" dataKey="forecast" stroke="#60A5FA" strokeWidth={3} fill="url(#forecastFill)" />
                    <Line type="monotone" dataKey="actual" stroke="#A78BFA" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/34">Insight</p>
                <p className="mt-2 text-sm leading-7 text-white/72">{forecastInsight}</p>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
