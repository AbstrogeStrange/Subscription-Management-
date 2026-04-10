import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, FunnelSimple, X } from '@phosphor-icons/react';

interface SubscriptionFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onBillingCycleChange: (cycle: string) => void;
  onStatusChange: (status: boolean | undefined) => void;
  categories: string[];
  activeFilters: {
    search?: string;
    category?: string;
    billingCycle?: string;
    status?: boolean | undefined;
  };
  onClearFilters: () => void;
}

const SubscriptionFilters: React.FC<SubscriptionFiltersProps> = ({
  onSearch,
  onCategoryChange,
  onBillingCycleChange,
  onStatusChange,
  categories,
  activeFilters,
  onClearFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState(activeFilters.search || '');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const activeFilterCount = Object.values(activeFilters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  const filterVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative group"
      >
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100"
          style={{
            backgroundColor: 'var(--color-primary)',
            filter: 'blur(20px)',
          }}
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="relative flex items-center">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute left-3 pointer-events-none"
            style={{ color: 'var(--color-primary)' }}
          >
            <MagnifyingGlass size={18} weight="bold" />
          </motion.div>
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 font-medium"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = 'var(--color-primary)';
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = 'var(--color-border)';
            }}
          />
        </div>
      </motion.div>

      {/* Desktop Filters */}
      <motion.div
        className="hidden md:grid grid-cols-3 gap-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {/* Category Filter */}
        <motion.select
          custom={0}
          variants={filterVariants}
          value={activeFilters.category || ''}
          onChange={(e) =>
            onCategoryChange(e.target.value === 'all' ? '' : e.target.value)
          }
          className="px-4 py-3 rounded-xl border-2 font-medium"
          style={{
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-foreground)',
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </motion.select>

        {/* Billing Cycle Filter */}
        <motion.select
          custom={1}
          variants={filterVariants}
          value={activeFilters.billingCycle || ''}
          onChange={(e) =>
            onBillingCycleChange(e.target.value === 'all' ? '' : e.target.value)
          }
          className="px-4 py-3 rounded-xl border-2 font-medium"
          style={{
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-foreground)',
          }}
        >
          <option value="">All Cycles</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="custom">Custom</option>
        </motion.select>

        {/* Status Filter */}
        <motion.select
          custom={2}
          variants={filterVariants}
          value={
            activeFilters.status === undefined
              ? ''
              : activeFilters.status
                ? 'active'
                : 'inactive'
          }
          onChange={(e) => {
            if (e.target.value === '') onStatusChange(undefined);
            else if (e.target.value === 'active') onStatusChange(true);
            else onStatusChange(false);
          }}
          className="px-4 py-3 rounded-xl border-2 font-medium"
          style={{
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-foreground)',
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </motion.select>
      </motion.div>

      {/* Mobile Filter Button */}
      <motion.button
        onClick={() => setMobileFiltersOpen(true)}
        className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium relative overflow-hidden group"
        style={{
          backgroundColor: 'var(--color-card)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-foreground)',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-10"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />
        <FunnelSimple size={18} weight="bold" />
        Filters
        {activeFilterCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            {activeFilterCount}
          </motion.span>
        )}
      </motion.button>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-40 md:hidden"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden max-h-[90vh] overflow-y-auto rounded-t-3xl"
              style={{ backgroundColor: 'var(--color-card)' }}
            >
              <div className="flex items-center justify-between p-6 border-b sticky top-0"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>
                    Filter Subscriptions
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                    Refine your subscription list
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-muted)' }}
                >
                  <X size={20} style={{ color: 'var(--color-muted-foreground)' }} />
                </motion.button>
              </div>

              <div className="p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
                    Category
                  </label>
                  <select
                    value={activeFilters.category || ''}
                    onChange={(e) =>
                      onCategoryChange(e.target.value === 'all' ? '' : e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg border-2 font-medium"
                    style={{
                      backgroundColor: 'var(--color-muted)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
                    Billing Cycle
                  </label>
                  <select
                    value={activeFilters.billingCycle || ''}
                    onChange={(e) =>
                      onBillingCycleChange(e.target.value === 'all' ? '' : e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg border-2 font-medium"
                    style={{
                      backgroundColor: 'var(--color-muted)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    <option value="">All Cycles</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="custom">Custom</option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
                    Status
                  </label>
                  <select
                    value={
                      activeFilters.status === undefined
                        ? ''
                        : activeFilters.status
                          ? 'active'
                          : 'inactive'
                    }
                    onChange={(e) => {
                      if (e.target.value === '') onStatusChange(undefined);
                      else if (e.target.value === 'active') onStatusChange(true);
                      else onStatusChange(false);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border-2 font-medium"
                    style={{
                      backgroundColor: 'var(--color-muted)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-foreground)',
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClearFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg font-medium"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-primary-foreground)',
                  }}
                >
                  Clear Filters
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 items-center"
        >
          {activeFilters.search && (
            <motion.span
              layoutId="filter-search"
              className="px-3 py-1.5 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
              }}
            >
              Search: {activeFilters.search}
            </motion.span>
          )}
          {activeFilters.category && (
            <motion.span
              layoutId="filter-category"
              className="px-3 py-1.5 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-accent-foreground)',
              }}
            >
              Category: {activeFilters.category}
            </motion.span>
          )}
          {activeFilters.billingCycle && (
            <motion.span
              layoutId="filter-cycle"
              className="px-3 py-1.5 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: 'var(--color-chart-2)',
                color: 'var(--color-foreground)',
              }}
            >
              Cycle: {activeFilters.billingCycle}
            </motion.span>
          )}
          {activeFilters.status !== undefined && (
            <motion.span
              layoutId="filter-status"
              className="px-3 py-1.5 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: 'var(--color-chart-3)',
                color: 'var(--color-foreground)',
              }}
            >
              Status: {activeFilters.status ? 'Active' : 'Inactive'}
            </motion.span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearFilters}
            className="text-xs font-medium ml-2 underline"
            style={{ color: 'var(--color-destructive)' }}
          >
            Clear all
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SubscriptionFilters;