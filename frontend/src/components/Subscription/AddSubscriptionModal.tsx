import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';

interface SubscriptionFormData {
  name: string;
  category: string;
  amount: number;
  billingCycle: 'weekly' | 'monthly' | 'yearly' | 'custom';
  nextBillingDate: string;
  paymentMethod: string;
  notes: string;
}

interface AddSubscriptionModalProps {
  onSubmit: (data: SubscriptionFormData) => Promise<void>;
  categories: string[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  onSubmit,
  categories,
  open,
  onOpenChange,
  hideTrigger = false,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isControlled = typeof open === 'boolean';
  const isOpen = isControlled ? open : internalOpen;

  const setModalOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SubscriptionFormData>({
    defaultValues: {
      name: '',
      category: '',
      amount: 0,
      billingCycle: 'monthly',
      nextBillingDate: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      notes: '',
    },
  });

  const onFormSubmit = async (data: SubscriptionFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset();
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding subscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!hideTrigger && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 font-bold rounded-xl text-sm"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Plus size={18} weight="bold" />
          <span className="hidden sm:inline">Add Subscription</span>
          <span className="sm:hidden">Add</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />

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
                      Add Subscription
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                      Track a new service
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setModalOpen(false)}
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-muted)' }}
                  >
                    <X size={18} style={{ color: 'var(--color-muted-foreground)' }} />
                  </motion.button>
                </div>

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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      {categories.map((cat) => (
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                      Next Billing
                    </label>
                    <input
                      type="date"
                      {...register('nextBillingDate')}
                      disabled={isSubmitting}
                      className="w-full px-3.5 py-2 rounded-lg border-2 font-medium text-sm transition-all"
                      style={{
                        backgroundColor: 'var(--color-muted)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-foreground)',
                      }}
                    />
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                      rows={2}
                      className="w-full px-3.5 py-2 rounded-lg border-2 font-medium text-sm transition-all resize-none"
                      style={{
                        backgroundColor: 'var(--color-muted)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-foreground)',
                      }}
                    />
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
                    onClick={() => setModalOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-lg font-bold border text-sm"
                    style={{
                      backgroundColor: 'var(--color-muted)',
                      color: 'var(--color-muted-foreground)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    onClick={handleSubmit(onFormSubmit)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-primary-foreground)',
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isSubmitting ? 'Adding...' : 'Add'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddSubscriptionModal;
