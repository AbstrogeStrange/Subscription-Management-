import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  index: number;
  gradient?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  index,
  gradient = 'from-violet-500/20 via-fuchsia-500/10 to-transparent',
}) => {
  const changeStyles = {
    positive: 'border border-emerald-300/10 bg-emerald-400/10 text-emerald-200',
    negative: 'border border-rose-300/10 bg-rose-400/10 text-rose-200',
    neutral: 'border border-white/8 bg-white/[0.06] text-white/58',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.015 }}
      className="glass-card glass-card-hover group relative overflow-hidden rounded-2xl p-6"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-70`} />
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/6 blur-3xl transition-all duration-300 group-hover:bg-violet-300/8" />
      <div className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />

      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="rounded-2xl border border-white/12 bg-white/[0.08] p-3 text-white shadow-[0_16px_40px_rgba(89,55,255,0.18)]">
            {icon}
          </div>
          {change ? (
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${changeStyles[changeType]}`}
            >
              {change}
            </span>
          ) : null}
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/36">
          {title}
        </p>
        <p className="mt-3 text-3xl font-display font-bold tracking-[-0.05em] text-white">
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
