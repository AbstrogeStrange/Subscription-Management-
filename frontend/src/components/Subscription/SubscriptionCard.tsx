import React from 'react';
import { motion } from 'framer-motion';
import {
  Trash,
  PencilSimple,
  CalendarBlank,
  CurrencyDollar,
  Clock,
  CheckCircle,
  XCircle,
} from '@phosphor-icons/react';
import type { Subscription } from '../../types';

interface SubscriptionCardProps {
  subscription: Subscription;
  daysUntilBilling: number;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  daysUntilBilling,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category?: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      Entertainment: { bg: 'var(--color-chart-1)', text: 'var(--color-foreground)' },
      Streaming: { bg: 'var(--color-chart-2)', text: 'var(--color-foreground)' },
      Productivity: { bg: 'var(--color-chart-3)', text: 'var(--color-foreground)' },
      Software: { bg: 'var(--color-chart-4)', text: 'var(--color-foreground)' },
      Storage: { bg: 'var(--color-chart-5)', text: 'var(--color-foreground)' },
      Health: { bg: 'var(--color-primary)', text: 'var(--color-primary-foreground)' },
      Finance: { bg: 'var(--color-accent)', text: 'var(--color-accent-foreground)' },
    };
    return colorMap[category || ''] || { bg: 'var(--color-muted)', text: 'var(--color-muted-foreground)' };
  };

  const getStatusDisplay = () => {
    if (daysUntilBilling < 0) {
      return {
        label: 'Overdue',
        bgColor: 'var(--color-destructive)',
        textColor: 'var(--color-destructive-foreground)',
        icon: <XCircle size={14} weight="fill" />,
        severity: 'high',
      };
    } else if (daysUntilBilling <= 3) {
      return {
        label: `${daysUntilBilling} days left`,
        bgColor: 'var(--color-accent)',
        textColor: 'var(--color-accent-foreground)',
        icon: <Clock size={14} weight="fill" />,
        severity: 'medium',
      };
    }
    return {
      label: `${daysUntilBilling} days left`,
      bgColor: 'var(--color-primary)',
      textColor: 'var(--color-primary-foreground)',
      icon: <CheckCircle size={14} weight="fill" />,
      severity: 'low',
    };
  };

  const statusDisplay = getStatusDisplay();
  const categoryColor = getCategoryColor(subscription.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative group h-full"
    >
      <motion.div
        className="overflow-hidden rounded-xl h-full flex flex-col"
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
        }}
        whileHover={{
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
          transition: { duration: 0.3 },
        }}
      >
        {/* Top Gradient Border */}
        <motion.div
          className="h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        <div className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-base font-bold line-clamp-1"
                style={{ color: 'var(--color-foreground)' }}
              >
                {subscription.name}
              </motion.h3>
              {subscription.paymentMethod && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-xs mt-0.5"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  {subscription.paymentMethod}
                </motion.p>
              )}
            </div>

            {/* Status Badge */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                transition: { duration: 2, repeat: Infinity },
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0"
              style={{
                backgroundColor: subscription.isActive ? 'var(--color-primary)' : 'var(--color-muted)',
                color: subscription.isActive ? 'var(--color-primary-foreground)' : 'var(--color-muted-foreground)',
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-1 rounded-full"
                style={{
                  backgroundColor: subscription.isActive ? 'var(--color-primary-foreground)' : 'currentColor',
                }}
              />
              {subscription.isActive ? 'Active' : 'Inactive'}
            </motion.div>
          </div>

          {/* Category Badge */}
          {subscription.category && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-2.5 py-1 text-xs font-bold rounded-full w-fit"
              style={{
                backgroundColor: categoryColor.bg,
                color: categoryColor.text,
              }}
            >
              {subscription.category}
            </motion.span>
          )}

          {/* Details Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-2 gap-2 mt-1"
          >
            {/* Amount */}
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: 'var(--color-muted)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <CurrencyDollar
                    size={14}
                    weight="bold"
                    style={{ color: 'var(--color-primary)' }}
                  />
                </motion.div>
                <span className="text-xs font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                  Amount
                </span>
              </div>
              <p className="text-sm font-bold truncate" style={{ color: 'var(--color-foreground)' }}>
                ₹{subscription.amount}
              </p>
            </motion.div>

            {/* Next Billing */}
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: 'var(--color-muted)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <CalendarBlank
                    size={14}
                    weight="bold"
                    style={{ color: 'var(--color-accent)' }}
                  />
                </motion.div>
                <span className="text-xs font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                  Next Bill
                </span>
              </div>
              <p className="text-sm font-bold truncate" style={{ color: 'var(--color-foreground)' }}>
                {formatDate(subscription.nextBillingDate)}
              </p>
            </motion.div>
          </motion.div>

          {/* Billing Cycle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="px-3 py-2 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-muted-foreground)',
            }}
          >
            💳 {subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1)}
          </motion.div>

          {/* Days Until Billing Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.02 }}
            className="p-3 rounded-lg border-2"
            style={{
              backgroundColor: 'var(--color-muted)',
              borderColor: statusDisplay.bgColor,
            }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ color: statusDisplay.bgColor, flexShrink: 0 }}
              >
                {statusDisplay.icon}
              </motion.div>
              <div className="min-w-0">
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  Renewal
                </p>
                <p className="text-xs font-bold" style={{ color: statusDisplay.bgColor }}>
                  {statusDisplay.label}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          {subscription.notes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-2.5 rounded-lg border"
              style={{
                backgroundColor: 'var(--color-muted)',
                borderColor: 'var(--color-border)',
              }}
            >
              <p className="text-xs line-clamp-2" style={{ color: 'var(--color-muted-foreground)' }}>
                📝 {subscription.notes}
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex gap-2 pt-3 mt-auto border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(subscription)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium text-xs"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
              }}
            >
              <PencilSimple size={14} weight="bold" />
              <span className="hidden sm:inline">Edit</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-2 rounded-lg font-medium text-xs"
              style={{
                backgroundColor: 'var(--color-destructive)',
                color: 'var(--color-destructive-foreground)',
              }}
            >
              <Trash size={14} weight="bold" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl max-w-sm w-full p-6 space-y-4"
            style={{ backgroundColor: 'var(--color-card)' }}
          >
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-full"
              style={{ backgroundColor: 'var(--color-destructive)', opacity: 0.1 }}
            >
              <Trash size={28} style={{ color: 'var(--color-destructive)' }} weight="bold" />
            </motion.div>

            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-foreground)' }}>
                Delete Subscription?
              </h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                Are you sure you want to delete "{subscription.name}"? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium border"
                style={{
                  backgroundColor: 'var(--color-muted)',
                  color: 'var(--color-muted-foreground)',
                  borderColor: 'var(--color-border)',
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onDelete(subscription.id);
                  setShowDeleteConfirm(false);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium"
                style={{
                  backgroundColor: 'var(--color-destructive)',
                  color: 'var(--color-destructive-foreground)',
                  opacity: isDeleting ? 0.6 : 1,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SubscriptionCard;