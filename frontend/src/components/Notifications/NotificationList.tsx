import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BellSlash } from '@phosphor-icons/react';
import NotificationItem from './NotificationItem';
import type { NotificationRecord } from './NotificationItem';

interface NotificationListProps {
  groupedNotifications: Array<{
    label: string;
    items: NotificationRecord[];
  }>;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  groupedNotifications,
  onOpen,
  onDelete,
}) => {
  const hasItems = groupedNotifications.some((group) => group.items.length > 0);

  if (!hasItems) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card flex min-h-[280px] flex-col items-center justify-center rounded-3xl border-white/10 px-6 py-12 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] text-violet-200">
          <BellSlash size={28} weight="bold" />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-white">No notifications available</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-white/50">
          Everything is quiet for now. New billing reminders and subscription updates will show up here.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedNotifications.map((group) =>
        group.items.length > 0 ? (
          <section key={group.label} className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.26em] text-white/34">
                {group.label}
              </h2>
              <div className="h-px flex-1 bg-white/8" />
            </div>

            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {group.items.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onOpen={onOpen}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </AnimatePresence>
          </section>
        ) : null
      )}
    </div>
  );
};

export default NotificationList;
