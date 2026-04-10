import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  CreditCard,
  Sparkle,
  TrendUp,
  Wallet,
} from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/Dashboard/StatsCard';
import SubscriptionCard from '../../components/Dashboard/SubscriptionCard';
import QuickActions from '../../components/Dashboard/QuickActions';
import SpendingChart from '../../components/Dashboard/SpendingChart';
import UpcomingRenewals from '../../components/Dashboard/UpcomingRenewals';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../api/api';
import { toast } from 'sonner';

interface DashboardStats {
  activeSubscriptions: number;
  monthlySpending: number;
  yearlySpending: number;
  nextRenewal: {
    name: string;
    date: string;
    daysLeft: number;
  } | null;
  plan: string;
}

interface DashboardSubscription {
  id: string;
  name: string;
  category?: string | null;
  amount: number | string;
  billingCycle: string;
  nextBillingDate: string;
}

interface SpendingPoint {
  month: string;
  amount: number;
}

interface Renewal {
  id: string;
  name: string;
  amount: number;
  daysLeft: number;
  nextBillingDate: string;
}

const accentByCategory: Record<string, string> = {
  Entertainment: '#E50914',
  Productivity: '#10A37F',
  'Cloud & Storage': '#3B82F6',
  Education: '#F59E0B',
  'Health & Fitness': '#22C55E',
  'Shopping & Lifestyle': '#EC4899',
  'Finance & Utilities': '#14B8A6',
  'Internet & Telecom': '#6366F1',
  Other: '#A855F7',
};

const getColorForCategory = (category?: string | null) =>
  accentByCategory[category || 'Other'] || '#A855F7';

const getIconLabel = (name: string) => {
  const compact = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return compact || name.slice(0, 2).toUpperCase();
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subscriptions, setSubscriptions] = useState<DashboardSubscription[]>([]);
  const [spendingData, setSpendingData] = useState<SpendingPoint[]>([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState<Renewal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [statsRes, subscriptionsRes, trendRes, renewalsRes] = await Promise.all([
          dashboardApi.getDashboardStats(),
          dashboardApi.getSubscriptions(0, 5, true),
          dashboardApi.getMonthlySpendingTrend(6),
          dashboardApi.getUpcomingRenewals(30),
        ]);

        setStats(statsRes.data?.data || null);
        setSubscriptions(subscriptionsRes.data?.data || []);
        setSpendingData(trendRes.data?.data || []);
        setUpcomingRenewals(renewalsRes.data?.data || []);
      } catch (error) {
        console.error('Dashboard load error:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    {
      title: 'Active Subscriptions',
      value: stats?.activeSubscriptions ?? 0,
      change: subscriptions.length > 0 ? `${subscriptions.length} shown` : undefined,
      changeType: 'positive' as const,
      icon: <CreditCard size={22} weight="bold" />,
      gradient: 'from-sky-500/20 via-indigo-500/10 to-transparent',
    },
    {
      title: 'Monthly Spending',
      value: `Rs ${(stats?.monthlySpending ?? 0).toLocaleString('en-IN')}`,
      change: 'Live data',
      changeType: 'positive' as const,
      icon: <Wallet size={22} weight="bold" />,
      gradient: 'from-emerald-500/16 via-teal-400/8 to-transparent',
    },
    {
      title: 'Yearly Total',
      value: `Rs ${(stats?.yearlySpending ?? 0).toLocaleString('en-IN')}`,
      change: 'Projected',
      changeType: 'neutral' as const,
      icon: <TrendUp size={22} weight="bold" />,
      gradient: 'from-violet-500/18 via-fuchsia-500/10 to-transparent',
    },
    {
      title: 'Next Renewal',
      value: stats?.nextRenewal ? `${Math.max(stats.nextRenewal.daysLeft, 0)} days` : 'No dues',
      change: stats?.nextRenewal?.name || 'All clear',
      changeType: stats?.nextRenewal && stats.nextRenewal.daysLeft <= 3 ? 'negative' : 'neutral' as const,
      icon: <CalendarCheck size={22} weight="bold" />,
      gradient: 'from-violet-500/18 via-fuchsia-500/10 to-transparent',
    },
  ];

  return (
    <div className="space-y-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="glass-card rounded-2xl p-6 lg:p-7"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-200">
              <Sparkle size={14} weight="fill" />
              Premium dashboard
            </div>
            <h1 className="mt-5 text-3xl font-display font-bold tracking-[-0.05em] text-white lg:text-5xl">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}.
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-white/52">
              {loading
                ? 'Syncing your latest subscriptions and billing activity.'
                : 'Your subscriptions are now powered by live SQLite-backed data across the dashboard and subscription workspace.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/analytics')}
                className="rounded-2xl bg-[linear-gradient(135deg,#d56dff_0%,#7a38ff_55%,#4d56ff_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(117,74,255,0.34)] transition-all hover:shadow-[0_22px_54px_rgba(117,74,255,0.42)]"
              >
                Explore analytics
              </button>
              <button
                onClick={() => navigate('/subscriptions')}
                className="glass-card rounded-2xl border-white/10 px-5 py-3 text-sm font-medium text-white/78 transition-all hover:bg-white/[0.12]"
              >
                Open subscriptions
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[360px] xl:grid-cols-1">
            {[
              { label: 'Tracked services', value: String(stats?.activeSubscriptions ?? 0), tint: 'from-fuchsia-500/25 to-transparent' },
              { label: 'Monthly spend', value: `Rs ${(stats?.monthlySpending ?? 0).toLocaleString('en-IN')}`, tint: 'from-sky-500/20 to-transparent' },
              {
                label: 'Renewals this month',
                value: String(upcomingRenewals.length).padStart(2, '0'),
                tint: 'from-emerald-500/20 to-transparent',
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl border border-white/8 bg-gradient-to-r ${item.tint} bg-white/[0.05] px-4 py-4 backdrop-blur-xl`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/34">{item.label}</p>
                <p className="mt-2 text-2xl font-display font-bold tracking-[-0.04em] text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-white/8 pt-6">
          <QuickActions
            onAddSubscription={() => navigate('/subscriptions', { state: { openAddSubscription: true } })}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="glass-card rounded-2xl border-white/10 p-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-2.5 text-violet-200">
              <Sparkle size={18} weight="fill" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/34">AI insight</p>
              <p className="mt-1 text-sm text-white/68">
                {stats?.monthlySpending
                  ? `Your current live monthly spend is Rs ${stats.monthlySpending.toLocaleString('en-IN')}. Add more subscriptions to keep this view up to date.`
                  : 'No active subscriptions yet. Add one from the subscriptions page and it will appear here automatically.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/analytics')}
            className="rounded-2xl bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-violet-200 transition-colors hover:bg-white/[0.1]"
          >
            Learn more
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-6">
          <SpendingChart data={spendingData.length > 0 ? spendingData : [{ month: 'Now', amount: 0 }]} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/34">Subscriptions list</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Your active services</h2>
              </div>
              <button
                onClick={() => navigate('/subscriptions')}
                className="rounded-full bg-white/[0.05] px-3 py-1.5 text-sm font-medium text-violet-200 transition-colors hover:bg-white/[0.1]"
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {subscriptions.length > 0 ? (
                subscriptions.map((sub, index) => (
                  <SubscriptionCard
                    key={sub.id}
                    name={sub.name}
                    category={sub.category || 'Other'}
                    amount={Number(sub.amount)}
                    billingCycle={sub.billingCycle}
                    nextBillingDate={new Date(sub.nextBillingDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    icon={<span className="text-sm font-black tracking-tight">{getIconLabel(sub.name)}</span>}
                    color={getColorForCategory(sub.category)}
                    index={index}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5 text-sm text-white/58">
                  No subscriptions yet. Add your first one and it will appear here.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <UpcomingRenewals
            renewals={upcomingRenewals.map((renewal) => ({
              id: renewal.id,
              name: renewal.name,
              icon: getIconLabel(renewal.name),
              amount: Number(renewal.amount),
              daysLeft: renewal.daysLeft,
              color: getColorForCategory('Other'),
            }))}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(213,109,255,0.24),rgba(109,70,255,0.18))] p-3 text-white">
                <CreditCard size={20} weight="bold" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/34">Current plan</p>
                <h3 className="mt-1 text-xl font-semibold text-white capitalize">{stats?.plan || user?.plan || 'free'}</h3>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-white/52">
              {stats?.plan === 'premium'
                ? 'You have unlimited subscriptions and access to all premium analytics modules.'
                : stats?.plan === 'basic'
                ? 'Your basic workspace is optimized for up to 5 active subscriptions.'
                : 'Upgrade to unlock more tracked subscriptions and richer billing intelligence.'}
            </p>

            {(stats?.plan || user?.plan) !== 'premium' ? (
              <button
                onClick={() => navigate('/payments')}
                className="mt-6 w-full rounded-2xl bg-[linear-gradient(135deg,#d56dff_0%,#7a38ff_55%,#4d56ff_100%)] py-3.5 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(117,74,255,0.34)] transition-all hover:shadow-[0_22px_54px_rgba(117,74,255,0.42)]"
              >
                Upgrade plan
              </button>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
