import React from 'react';
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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Active Subscriptions',
      value: 5,
      change: '+2 this month',
      changeType: 'positive' as const,
      icon: <CreditCard size={22} weight="bold" />,
      gradient: 'from-sky-500/20 via-indigo-500/10 to-transparent',
    },
    {
      title: 'Monthly Spending',
      value: 'Rs 2,450',
      change: '-12%',
      changeType: 'positive' as const,
      icon: <Wallet size={22} weight="bold" />,
      gradient: 'from-emerald-500/16 via-teal-400/8 to-transparent',
    },
    {
      title: 'Yearly Total',
      value: 'Rs 29,400',
      change: '+5%',
      changeType: 'negative' as const,
      icon: <TrendUp size={22} weight="bold" />,
      gradient: 'from-violet-500/18 via-fuchsia-500/10 to-transparent',
    },
    {
      title: 'Next Renewal',
      value: '3 days',
      change: 'Netflix',
      changeType: 'neutral' as const,
      icon: <CalendarCheck size={22} weight="bold" />,
      gradient: 'from-violet-500/18 via-fuchsia-500/10 to-transparent',
    },
  ];

  const subscriptions = [
    {
      name: 'Netflix',
      category: 'Entertainment',
      amount: 649,
      billingCycle: 'Monthly',
      nextBillingDate: 'Dec 15, 2024',
      icon: <span className="text-xl font-black tracking-tight text-[#E50914]">N</span>,
      color: '#E50914',
    },
    {
      name: 'Spotify',
      category: 'Music',
      amount: 119,
      billingCycle: 'Monthly',
      nextBillingDate: 'Dec 20, 2024',
      icon: <span className="text-lg font-black tracking-tight text-[#1DB954]">S</span>,
      color: '#1DB954',
    },
    {
      name: 'ChatGPT Plus',
      category: 'Productivity',
      amount: 1650,
      billingCycle: 'Monthly',
      nextBillingDate: 'Dec 25, 2024',
      icon: <span className="text-sm font-black tracking-tight text-[#10A37F]">GPT</span>,
      color: '#10A37F',
    },
    {
      name: 'YouTube Premium',
      category: 'Entertainment',
      amount: 139,
      billingCycle: 'Monthly',
      nextBillingDate: 'Jan 1, 2025',
      icon: <span className="text-sm font-black tracking-tight text-[#FF0000]">YT</span>,
      color: '#FF0000',
    },
    {
      name: 'iCloud+',
      category: 'Storage',
      amount: 75,
      billingCycle: 'Monthly',
      nextBillingDate: 'Jan 5, 2025',
      icon: <span className="text-sm font-black tracking-tight text-[#3B82F6]">iC</span>,
      color: '#3B82F6',
    },
  ];

  const spendingData = [
    { month: 'Jul', amount: 2100 },
    { month: 'Aug', amount: 2350 },
    { month: 'Sep', amount: 2200 },
    { month: 'Oct', amount: 2800 },
    { month: 'Nov', amount: 2450 },
    { month: 'Dec', amount: 2632 },
  ];

  const upcomingRenewals = [
    { id: '1', name: 'Netflix', icon: '🎬', amount: 649, daysLeft: 3, color: '#E50914' },
    { id: '2', name: 'Spotify', icon: '🎵', amount: 119, daysLeft: 8, color: '#1DB954' },
    { id: '3', name: 'ChatGPT Plus', icon: '🤖', amount: 1650, daysLeft: 13, color: '#10A37F' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

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
              Your subscriptions are organized into a cleaner, cinematic control center with floating glass widgets and proactive billing insight.
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
              { label: 'Tracked services', value: '24', tint: 'from-fuchsia-500/25 to-transparent' },
              { label: 'Potential savings', value: 'Rs 450', tint: 'from-sky-500/20 to-transparent' },
              { label: 'Renewals this week', value: '03', tint: 'from-emerald-500/20 to-transparent' },
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
                You could save Rs 450 each month by moving Netflix and Spotify to annual plans.
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
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-6">
          <SpendingChart data={spendingData} />

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
              {subscriptions.map((sub, index) => (
                <SubscriptionCard key={sub.name} {...sub} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <UpcomingRenewals renewals={upcomingRenewals} />

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
                <h3 className="mt-1 text-xl font-semibold text-white capitalize">{user?.plan || 'Free'}</h3>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-white/52">
              {user?.plan === 'premium'
                ? 'You have unlimited subscriptions and access to all premium analytics modules.'
                : user?.plan === 'basic'
                ? 'Your basic workspace is optimized for up to 5 active subscriptions.'
                : 'Upgrade to unlock more tracked subscriptions and richer billing intelligence.'}
            </p>

            {user?.plan !== 'premium' ? (
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
