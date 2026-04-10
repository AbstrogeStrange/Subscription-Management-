import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ToggleRight, ToggleLeft } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import type { Subscription } from '../../types';

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

interface EditSubscriptionFormData {
  name: string;
  category: string;
  amount: number;
  billingCycle: 'weekly' | 'monthly' | 'yearly' | 'custom';
  nextBillingDate: string;
  paymentMethod: string;
  notes: string;
  isActive: boolean;
}

interface EditSubscriptionModalProps {
  subscription: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: EditSubscriptionFormData) => Promise<void>;
  isLoading?: boolean;
  categories: string[];
}

const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({
  subscription,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  categories,
}) => {
  const categoryOptions = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<EditSubscriptionFormData>({
    defaultValues: {
      name: '',
      category: '',
      amount: 0,
      billingCycle: 'monthly',
      nextBillingDate: '',
      paymentMethod: '',
      notes: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (subscription) {
      reset({
        name: subscription.name,
        category: subscription.category || '',
        amount: subscription.amount,
        billingCycle: subscription.billingCycle as EditSubscriptionFormData['billingCycle'],
        nextBillingDate: subscription.nextBillingDate?.split('T')[0] || '',
        paymentMethod: subscription.paymentMethod || '',
        isActive: subscription.isActive,
        notes: subscription.notes || '',
      });
    }
  }, [subscription, reset]);

  const onFormSubmit = async (data: EditSubscriptionFormData) => {
    if (!subscription) return;
    try {
      const submitData = {
        ...data,
        amount: Number(data.amount),
      };
      await onSubmit(subscription.id, submitData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="rounded-2xl w-full max-w-sm max-h-[95vh] flex flex-col" style={{ backgroundColor: 'var(--color-card)' }}>
              {/* Header - Fixed */}
              <div className="flex items-center justify-between p-5 border-b flex-shrink-0"
                style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex-1">
                  <h2 className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>
                    Edit Subscription
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                    Update subscription details
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onOpenChange(false)}
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-muted)' }}
                >
                  <X size={18} style={{ color: 'var(--color-muted-foreground)' }} />
                </motion.button>
              </div>

              {subscription && (
                <>
                  {/* Form - Scrollable */}
                  <form onSubmit={handleSubmit(onFormSubmit)} className="flex-1 overflow-y-auto p-5 space-y-3.5">
                    {/* Name */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="space-y-1.5">
                      <label className="block text-xs font-bold" style={{ color: 'var(--color-foreground)' }}>
                        Service Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Netflix"
                        {...register('name', { required: 'Service name is required' })}
                        disabled={isLoading || isSubmitting}
                        className="w-full px-3.5 py-2 rounded-lg border-2 font-medium text-sm transition-all"
                        style={{
                          backgroundColor: 'var(--color-muted)',
                          borderColor: errors.name ? 'var(--color-destructive)' : 'var(--color-border)',
                          color: 'var(--color-foreground)',
                        }}
                      />
                      {errors.name && (
                        <p className="text-xs font-medium" style={{ color: 'var(--color-destructive)' }}>
                          {errors.name.message}
                        </p>
                      )}
                    </motion.div>

                    {/* Category */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-1.5">
                      <label className="block text-xs font-bold" style={{ color: 'var(--color-foreground)' }}>
                        Category
                      </label>
                      <select
                        disabled={isLoading || isSubmitting}
                        onChange={(e) => setValue('category', e.target.value)}
                        value={watch('category') || ''}
                        className="w-full px-3.5 py-2 rounded-lg border-2 font-medium text-sm transition-all"
                        style={{
                          backgroundColor: 'var(--color-muted)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-foreground)',
                        }}
                      >
                        <option value="">Select category</option>
                        {categoryOptions.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    {/* Amount & Billing Cycle Row */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Amount */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="space-y-1.5">
                        <label className="block text-xs font-bold" style={{ color: 'var(--color-foreground)' }}>
                          Amount ₹ *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register('amount', {
                            required: 'Amount is required',
                            valueAsNumber: true,
                            validate: (value) => value > 0 || 'Must be positive',
                          })}
                          disabled={isLoading || isSubmitting}
                          className="w-full px-3.5 py-2 rounded-lg border-2 font-medium text-sm transition-all"
                          style={{
                            backgroundColor: 'var(--color-muted)',
                            borderColor: errors.amount ? 'var(--color-destructive)' : 'var(--color-border)',
                            color: 'var(--color-foreground)',
                          }}
                        />
                        {errors.amount && (
                          <p className="text-xs font-medium" style={{ color: 'var(--color-destructive)' }}>
                            {errors.amount.message}
                          </p>
                        )}
                      </motion.div>

                      {/* Billing Cycle */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-1.5">
                        <label className="block text-xs font-bold" style={{ color: 'var(--color-foreground)' }}>
                          Cycle *
                        </label>
                        <select
                          {...register('billingCycle')}
                          disabled={isLoading || isSubmitting}
                          onChange={(e) => setValue('billingCycle', e.target.value as EditSubscriptionFormData['billingCycle'])}
                          value={watch('billingCycle')}
                          className="w-full px-3.5 py-2 rounded-lg border-2 font-medium text-sm transition-all"
                          style={{
                            backgroundColor: 'var(--color-muted)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-foreground)',
                          }}
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                          <option value="custom">Custom</option>
                        </select>
                      </motion.div>
                    </div>

                    {/* Next Billing Date */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="space-y-1.5">
                      <label className="block text-xs font-bold" style={{ color: 'var(--color-foreground)' }}>
                        Next Billing *
                      </label>
                      <input
                        type="date"
                        {...register('nextBillingDate', {
                          required: 'Next billing date is required',
                        })}
                        disabled={isLoading || isSubmitting}
                        className="w-full px-3.5 py-2 rounded-lg border-2 font-medium text-sm transition-all"
                        style={{
                          backgroundColor: 'var(--color-muted)',
                          borderColor: errors.nextBillingDate ? 'var(--color-destructive)' : 'var(--color-border)',
                          color: 'var(--color-foreground)',
                        }}
                      />
                      {errors.nextBillingDate && (
                        <p className="text-xs font-medium" style={{ color: 'var(--color-destructive)' }}>
                          {errors.nextBillingDate.message}
                        </p>
                      )}
                    </motion.div>

                    {/* Payment Method */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-1.5">
                      <label className="block text-xs font-bold" style={{ color: 'var(--color-foreground)' }}>
                        Payment Method
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Credit Card"
                        {...register('paymentMethod')}
                        disabled={isLoading || isSubmitting}
                        className="w-full px-3.5 py-2 rounded-lg border-2 font-medium text-sm transition-all"
                        style={{
                          backgroundColor: 'var(--color-muted)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-foreground)',
                        }}
                      />
                    </motion.div>

                    {/* Notes */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="space-y-1.5">
                      <label className="block text-xs font-bold" style={{ color: 'var(--color-foreground)' }}>
                        Notes
                      </label>
                      <textarea
                        placeholder="Add notes..."
                        {...register('notes')}
                        disabled={isLoading || isSubmitting}
                        rows={2}
                        className="w-full px-3.5 py-2 rounded-lg border-2 font-medium text-sm transition-all resize-none"
                        style={{
                          backgroundColor: 'var(--color-muted)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-foreground)',
                        }}
                      />
                    </motion.div>

                    {/* Active Status Toggle */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-3.5 rounded-xl border-2"
                      style={{
                        backgroundColor: 'var(--color-muted)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-bold" style={{ color: 'var(--color-foreground)' }}>
                            Active Status
                          </label>
                          <p className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                            Is this subscription active?
                          </p>
                        </div>
                        <motion.button
                          type="button"
                          onClick={() => setValue('isActive', !watch('isActive'))}
                          disabled={isLoading || isSubmitting}
                          className="relative w-12 h-6 rounded-full transition-all flex-shrink-0"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            backgroundColor: watch('isActive') ? 'var(--color-primary)' : 'var(--color-border)',
                            opacity: isLoading || isSubmitting ? 0.5 : 1,
                            cursor: isLoading || isSubmitting ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <motion.div
                            animate={{ x: watch('isActive') ? 24 : 4 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="absolute top-1 w-4 h-4 rounded-full"
                            style={{ backgroundColor: 'var(--color-card)' }}
                          />
                        </motion.button>
                      </div>
                    </motion.div>
                  </form>

                  {/* Buttons - Fixed at bottom */}
                  <div
                    className="flex gap-3 p-5 border-t flex-shrink-0"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => onOpenChange(false)}
                      disabled={isLoading || isSubmitting}
                      className="flex-1 px-4 py-2.5 rounded-lg font-bold border text-sm"
                      style={{
                        backgroundColor: 'var(--color-muted)',
                        color: 'var(--color-muted-foreground)',
                        borderColor: 'var(--color-border)',
                        opacity: isLoading || isSubmitting ? 0.6 : 1,
                        cursor: isLoading || isSubmitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      onClick={handleSubmit(onFormSubmit)}
                      disabled={isLoading || isSubmitting}
                      className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-primary-foreground)',
                        opacity: isLoading || isSubmitting ? 0.7 : 1,
                        cursor: isLoading || isSubmitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isLoading || isSubmitting ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditSubscriptionModal;
