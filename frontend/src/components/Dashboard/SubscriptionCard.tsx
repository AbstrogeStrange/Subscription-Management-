import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, DotsThree } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionCardProps {
  name: string;
  category: string;
  amount: number;
  billingCycle: string;
  nextBillingDate: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  name,
  category,
  amount,
  billingCycle,
  nextBillingDate,
  icon,
  color,
  index,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.01 }}
      onClick={() => navigate('/subscriptions')}
      className="glass-card glass-card-hover group cursor-pointer rounded-2xl p-5"
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 text-2xl shadow-[0_16px_34px_rgba(11,8,28,0.24)]"
          style={{ backgroundColor: `${color}22` }}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h4 className="truncate text-base font-semibold text-white">{name}</h4>
            <button
              onClick={(event) => {
                event.stopPropagation();
                navigate('/subscriptions');
              }}
              className="rounded-xl p-2 opacity-0 transition-all hover:bg-white/[0.08] group-hover:opacity-100"
            >
              <DotsThree size={18} weight="bold" className="text-white/42" />
            </button>
          </div>
          <p className="text-sm text-white/42">{category}</p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-white">Rs {amount.toLocaleString('en-IN')}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/34">{billingCycle}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-white/42">
          <Calendar size={14} weight="bold" />
          <span>Next: {nextBillingDate}</span>
        </div>
        <motion.div
          className="flex items-center gap-1 text-xs font-medium text-violet-200 opacity-0 transition-opacity group-hover:opacity-100"
          whileHover={{ x: 2 }}
        >
          View details
          <ArrowRight size={12} weight="bold" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SubscriptionCard;
