import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { subscriptionApi } from '../../api/api';
import SubscriptionFilters from '../../components/Subscription/SubscriptionFilters';
import SubscriptionCard from '../../components/Subscription/SubscriptionCard';
import AddSubscriptionModal from '../../components/Subscription/AddSubscriptionModal';
import EditSubscriptionModal from '../../components/Subscription/EditSubscriptionModal';
import { toast } from 'sonner';
import { Sparkle, TrendUp, Calendar } from '@phosphor-icons/react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Subscription } from '../../types';
import axios from 'axios';

interface DaysUntilBilling {
  [key: string]: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: ['easeOut'],
    },
  },
};

const DEFAULT_CATEGORIES = [
  'Entertainment',
  'Productivity',
  'Cloud & Storage',
  'Education',
  'Health & Fitness',
  'Shopping & Lifestyle',
  'Finance & Utilities',
  'Internet & Telecom',
  'Other',
];

const normalizeAmount = (amount: number | string) => Number(amount) || 0;

const SubscriptionsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [daysUntilBilling, setDaysUntilBilling] = useState<DaysUntilBilling>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    billingCycle: '',
    status: undefined as boolean | undefined,
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    if (location.state?.openAddSubscription) {
      setAddModalOpen(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsRes, categoriesRes] = await Promise.all([
        subscriptionApi.getSubscriptions(
          {
            search: filters.search,
            category: filters.category,
            billingCycle: filters.billingCycle,
            isActive: filters.status,
          },
          {
            sortBy: 'nextBillingDate',
            sortOrder: 'asc',
          }
        ),
        subscriptionApi.getCategories(),
      ]);

      setSubscriptions(subsRes.data.data || []);
      setCategories(
        Array.from(new Set([...(categoriesRes.data.data || []), ...DEFAULT_CATEGORIES]))
      );

      const daysMap: DaysUntilBilling = {};
      for (const sub of subsRes.data.data || []) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextBilling = new Date(sub.nextBillingDate);
        nextBilling.setHours(0, 0, 0, 0);
        const days = Math.ceil(
          (nextBilling.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        daysMap[sub.id] = days;
      }
      setDaysUntilBilling(daysMap);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = async (data: any) => {
    try {
      const response = await subscriptionApi.addSubscription(data);
      const createdSubscription = response.data?.data as Subscription | undefined;

      if (createdSubscription) {
        setSubscriptions((prev) => {
          const next = [createdSubscription, ...prev.filter((sub) => sub.id !== createdSubscription.id)];

          return next.sort(
            (a, b) =>
              new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime()
          );
        });

        setCategories((prev) =>
          createdSubscription.category && !prev.includes(createdSubscription.category)
            ? [...prev, createdSubscription.category]
            : prev
        );

        setDaysUntilBilling((prev) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const nextBilling = new Date(createdSubscription.nextBillingDate);
          nextBilling.setHours(0, 0, 0, 0);

          return {
            ...prev,
            [createdSubscription.id]: Math.ceil(
              (nextBilling.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            ),
          };
        });
      }

      toast.success('Subscription added successfully');
      fetchData();
    } catch (error) {
      console.error('Error adding subscription:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to add subscription'
        : 'Failed to add subscription';
      toast.error(message);
      throw error;
    }
  };

  const handleUpdateSubscription = async (id: string, data: any) => {
    try {
      await subscriptionApi.updateSubscription(id, data);
      toast.success('Subscription updated successfully');
      fetchData();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription');
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      setDeleting(id);
      await subscriptionApi.deleteSubscription(id);
      toast.success('Subscription deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast.error('Failed to delete subscription');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setEditModalOpen(true);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      billingCycle: '',
      status: undefined,
    });
  };

  const totalMonthlySpending = subscriptions.reduce((sum, sub) => {
    const amount = normalizeAmount(sub.amount);
    if (sub.billingCycle === 'monthly') return sum + amount;
    if (sub.billingCycle === 'yearly') return sum + amount / 12;
    if (sub.billingCycle === 'weekly') return sum + amount * 4.33;
    return sum;
  }, 0);

  const activeSubscriptions = subscriptions.filter((s) => s.isActive).length;
  const nextRenewal = subscriptions.length > 0
    ? Math.min(...subscriptions.map((s) => daysUntilBilling[s.id] || Infinity))
    : 0;
  const categorySummaryMap = subscriptions.reduce((acc, sub) => {
    const categoryName = sub.category?.trim() || 'Other';

    if (!acc[categoryName]) {
      acc[categoryName] = {
        name: categoryName,
        count: 0,
        monthlyTotal: 0,
      };
    }

    acc[categoryName].count += 1;

    const amount = normalizeAmount(sub.amount);

    if (sub.billingCycle === 'monthly') acc[categoryName].monthlyTotal += amount;
    else if (sub.billingCycle === 'yearly') acc[categoryName].monthlyTotal += amount / 12;
    else if (sub.billingCycle === 'weekly') acc[categoryName].monthlyTotal += amount * 4.33;

    return acc;
  }, {} as Record<string, { name: string; count: number; monthlyTotal: number }>);

  const categorySummary = categories.map((categoryName) => ({
    name: categoryName,
    count: categorySummaryMap[categoryName]?.count || 0,
    monthlyTotal: categorySummaryMap[categoryName]?.monthlyTotal || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl lg:text-4xl font-bold" style={{ color: 'var(--color-foreground)' }}>
              My Subscriptions
            </h1>
            <motion.div
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              className="text-2xl"
            >
              💳
            </motion.div>
          </div>
          <p style={{ color: 'var(--color-muted-foreground)' }}>
            Track and manage all your subscriptions in one place
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AddSubscriptionModal
            onSubmit={handleAddSubscription}
            categories={categories}
            open={addModalOpen}
            onOpenChange={setAddModalOpen}
          />
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      {!loading && subscriptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {/* Active Subscriptions */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-2xl border"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💚
                </motion.div>
              </div>
              <span className="px-3 py-1 text-xs font-bold rounded-full" style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
              }}>
                Active
              </span>
            </div>
            <p className="text-sm mt-3" style={{ color: 'var(--color-muted-foreground)' }}>
              Active Subscriptions
            </p>
            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-foreground)' }}>
              {activeSubscriptions}
            </p>
          </motion.div>

          {/* Monthly Spending */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-2xl border"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--color-accent)', opacity: 0.1 }}>
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  💰
                </motion.div>
              </div>
              <span className="px-3 py-1 text-xs font-bold rounded-full" style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-accent-foreground)',
              }}>
                Monthly
              </span>
            </div>
            <p className="text-sm mt-3" style={{ color: 'var(--color-muted-foreground)' }}>
              Monthly Spending
            </p>
            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-foreground)' }}>
              ₹{totalMonthlySpending.toFixed(0)}
            </p>
          </motion.div>

          {/* Next Renewal */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-2xl border"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--color-chart-2)', opacity: 0.1 }}>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📅
                </motion.div>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                nextRenewal <= 3 ? 'bg-violet-500/20 text-violet-300' : ''
              }`} style={nextRenewal > 3 ? {
                backgroundColor: 'var(--color-chart-2)',
                color: 'var(--color-foreground)',
              } : {}}>
                {nextRenewal <= 3 ? 'Soon' : 'Upcoming'}
              </span>
            </div>
            <p className="text-sm mt-3" style={{ color: 'var(--color-muted-foreground)' }}>
              Next Renewal
            </p>
            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-foreground)' }}>
              {nextRenewal} days
            </p>
          </motion.div>
        </motion.div>
      )}

      {!loading && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative overflow-hidden rounded-[24px] border"
          style={{
            borderColor: 'rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(12, 7, 24, 0.72)',
          }}
        >
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_18%,rgba(153,92,255,0.22),transparent_28%),radial-gradient(circle_at_86%_10%,rgba(199,144,255,0.18),transparent_26%),linear-gradient(180deg,#120429_0%,#090112_48%,#04010a_100%)]" />
          <div className="absolute inset-0 z-0 bg-black/20" />

          <div className="relative z-10 p-5 lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                  Categories
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Browse by category
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-white/58">
                  Jump into a category to narrow your subscriptions and compare where your monthly spend is concentrated.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/78">
                {categories.length} categories
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleFilterChange('category', '')}
                className="rounded-2xl border p-4 text-left transition-all"
                style={{
                  borderColor: !filters.category ? 'rgba(216, 180, 254, 0.42)' : 'rgba(255,255,255,0.08)',
                  background: !filters.category
                    ? 'linear-gradient(135deg, rgba(213,109,255,0.22), rgba(77,86,255,0.16))'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">All Categories</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/36">
                      Show every subscription
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-violet-100">
                    {subscriptions.length} total
                  </span>
                </div>
              </motion.button>

              {categorySummary.map((category, index) => {
                const isActiveCategory = filters.category === category.name;

                return (
                  <motion.button
                    key={category.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: (index + 1) * 0.05 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleFilterChange('category', isActiveCategory ? '' : category.name)}
                    className="rounded-2xl border p-4 text-left transition-all"
                    style={{
                      borderColor: isActiveCategory ? 'rgba(216, 180, 254, 0.42)' : 'rgba(255,255,255,0.08)',
                      background: isActiveCategory
                        ? 'linear-gradient(135deg, rgba(213,109,255,0.22), rgba(77,86,255,0.16))'
                        : 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{category.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/36">
                          {category.count} service{category.count === 1 ? '' : 's'}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-violet-100">
                        Rs {category.monthlyTotal.toFixed(0)}/mo
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Insight Banner */}
      {subscriptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-primary)',
            background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl flex-shrink-0" style={{
              backgroundColor: 'var(--color-primary)',
              opacity: 0.2,
            }}>
              <Sparkle size={20} weight="fill" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                <span style={{ fontWeight: 'bold' }}>Smart Tip:</span> You could save money by consolidating similar services or switching to annual plans.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
              }}
            >
              Learn more
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-4"
      >
        <SubscriptionFilters
          onSearch={(query) => handleFilterChange('search', query)}
          onCategoryChange={(category) => handleFilterChange('category', category)}
          onBillingCycleChange={(cycle) => handleFilterChange('billingCycle', cycle)}
          onStatusChange={(status) => handleFilterChange('status', status)}
          categories={categories}
          activeFilters={filters}
          onClearFilters={handleClearFilters}
        />
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-32"
        >
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 mx-auto rounded-full border-4 border-transparent"
              style={{
                borderTopColor: 'var(--color-primary)',
                borderRightColor: 'var(--color-accent)',
              }}
            />
            <p style={{ color: 'var(--color-muted-foreground)' }} className="font-medium">
              Loading your subscriptions...
            </p>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && subscriptions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 px-4"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}
          >
            <span className="text-5xl">📦</span>
          </motion.div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-foreground)' }}>
            No subscriptions yet
          </h2>
          <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--color-muted-foreground)' }}>
            Start tracking your subscriptions to see insights about your spending and manage renewals.
          </p>
          <AddSubscriptionModal
            onSubmit={handleAddSubscription}
            categories={categories}
          />
        </motion.div>
      )}

      {/* Subscriptions Grid */}
      {!loading && subscriptions.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {subscriptions.map((subscription) => (
            <motion.div
              key={subscription.id}
              variants={itemVariants}
            >
              <SubscriptionCard
                subscription={subscription}
                daysUntilBilling={daysUntilBilling[subscription.id] || 0}
                onEdit={handleEdit}
                onDelete={handleDeleteSubscription}
                isDeleting={deleting === subscription.id}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Edit Modal */}
      <EditSubscriptionModal
        subscription={editingSubscription}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSubmit={handleUpdateSubscription}
        categories={categories}
      />
    </div>
  );
};

export default SubscriptionsPage;
