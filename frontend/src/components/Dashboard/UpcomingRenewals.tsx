import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

interface Renewal {
  id: string;
  name: string;
  icon: string;
  amount: number;
  daysLeft: number;
  color: string;
}

interface UpcomingRenewalsProps {
  renewals: Renewal[];
}

const UpcomingRenewals: React.FC<UpcomingRenewalsProps> = ({ renewals }) => {
  const navigate = useNavigate();

  const getDaysLeftColor = (days: number) => {
    if (days <= 3) return 'border border-rose-300/10 bg-rose-400/10 text-rose-200';
    if (days <= 7) return 'border border-violet-300/10 bg-violet-400/10 text-violet-200';
    return 'border border-emerald-300/10 bg-emerald-400/10 text-emerald-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-2 text-violet-200">
            <Clock size={18} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/34">
              Calendar pulse
            </p>
            <h3 className="text-lg font-semibold text-white">Upcoming Renewals</h3>
          </div>
        </div>
        <button
          onClick={() => navigate('/calendar')}
          className="flex items-center gap-1 rounded-full bg-white/[0.05] px-3 py-1.5 text-sm font-medium text-violet-200 transition-colors hover:bg-white/[0.1]"
        >
          View all
          <ArrowRight size={14} weight="bold" />
        </button>
      </div>

      <div className="space-y-3">
        {renewals.map((renewal, index) => (
          <motion.div
            key={renewal.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.28 + index * 0.08 }}
            whileHover={{ x: 4, scale: 1.01 }}
            onClick={() => navigate('/calendar')}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-3.5 transition-colors hover:bg-white/[0.08]"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 text-xl"
              style={{ backgroundColor: `${renewal.color}20` }}
            >
              {renewal.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{renewal.name}</p>
              <p className="text-xs text-white/42">Rs {renewal.amount.toLocaleString('en-IN')}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getDaysLeftColor(renewal.daysLeft)}`}>
              {renewal.daysLeft === 0 ? 'Today' : `${renewal.daysLeft}d left`}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UpcomingRenewals;
