import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  CreditCard,
  CheckCircle,
  Sparkle,
  Trash,
  WarningCircle,
} from '@phosphor-icons/react';

export interface NotificationRecord {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  timestamp: string;
  isRead: boolean;
  category: 'billing' | 'renewal' | 'alert' | 'feature' | 'system';
}

interface NotificationItemProps {
  notification: NotificationRecord;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryIconMap = {
  billing: CreditCard,
  renewal: Bell,
  alert: WarningCircle,
  feature: Sparkle,
  system: CheckCircle,
} as const;

const categoryTintMap = {
  billing: 'from-sky-500/30 to-indigo-500/20 text-sky-200',
  renewal: 'from-violet-500/30 to-fuchsia-500/20 text-violet-200',
  alert: 'from-rose-500/30 to-pink-500/20 text-rose-200',
  feature: 'from-cyan-500/30 to-blue-500/20 text-cyan-200',
  system: 'from-emerald-500/30 to-teal-500/20 text-emerald-200',
} as const;

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onOpen,
  onDelete,
}) => {
  const Icon = categoryIconMap[notification.category];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      whileHover={{ y: -2 }}
      onClick={() => onOpen(notification.id)}
      className={`group relative flex cursor-pointer flex-col gap-4 rounded-2xl border px-4 py-4 transition-all duration-300 sm:flex-row sm:items-start sm:justify-between ${
        notification.isRead
          ? 'border-white/8 bg-white/[0.04] hover:bg-white/[0.06]'
          : 'border-violet-300/20 bg-white/[0.08] shadow-[0_12px_30px_rgba(16,12,40,0.14)] hover:border-violet-300/28 hover:bg-white/[0.10]'
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className={`mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${categoryTintMap[notification.category]}`}>
          <Icon size={18} weight="bold" />
        </div>

        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="text-sm font-semibold text-white sm:text-[15px]">
              {notification.title}
            </h3>
            {!notification.isRead ? (
              <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(196,181,253,0.65)]" />
            ) : null}
          </div>
          <p className="mt-1 text-sm leading-6 text-white/60">
            {notification.description}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-white/36">
            <span>{notification.timeLabel}</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="capitalize">{notification.category}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
        <p className="text-xs text-white/32">{notification.timestamp}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen(notification.id);
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-violet-200 transition-all duration-200 hover:bg-white/[0.10] hover:text-white"
          >
            View
            <ArrowRight size={14} weight="bold" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(notification.id);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04] text-white/48 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-200"
          >
            <Trash size={16} weight="bold" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default NotificationItem;
