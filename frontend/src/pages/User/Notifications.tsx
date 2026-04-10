import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  FunnelSimple,
  MagnifyingGlass,
  Plus,
  Sparkle,
} from '@phosphor-icons/react';
import NotificationList from '../../components/Notifications/NotificationList';
import type { NotificationRecord } from '../../components/Notifications/NotificationItem';

type FilterValue = 'all' | 'unread' | 'read';

const createInitialNotifications = (): NotificationRecord[] => {
  const now = new Date();
  const todayEarlier = new Date(now.getTime() - 60 * 60 * 1000);
  const todayMorning = new Date(now.getTime() - 4 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const olderOne = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const olderTwo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'notif-1',
      title: 'Netflix renewal due soon',
      description: 'Your Netflix plan renews in 2 days. Review the plan before the payment is processed.',
      timeLabel: '1h ago',
      timestamp: todayEarlier.toISOString(),
      isRead: false,
      category: 'renewal',
    },
    {
      id: 'notif-2',
      title: 'Payment recorded successfully',
      description: 'Your Spotify monthly payment was captured and your subscription remains active.',
      timeLabel: '4h ago',
      timestamp: todayMorning.toISOString(),
      isRead: false,
      category: 'billing',
    },
    {
      id: 'notif-3',
      title: 'Budget spike detected',
      description: 'Entertainment spending is 18% higher than last month. Open analytics to review the increase.',
      timeLabel: 'Yesterday',
      timestamp: yesterday.toISOString(),
      isRead: false,
      category: 'alert',
    },
    {
      id: 'notif-4',
      title: 'Weekly insight ready',
      description: 'Your dashboard summary has new suggestions to reduce overlapping subscriptions.',
      timeLabel: '3 days ago',
      timestamp: olderOne.toISOString(),
      isRead: true,
      category: 'feature',
    },
    {
      id: 'notif-5',
      title: 'Workspace synced',
      description: 'Subscription history was refreshed successfully and all records are up to date.',
      timeLabel: '6 days ago',
      timestamp: olderTwo.toISOString(),
      isRead: true,
      category: 'system',
    },
  ];
};

const isSameLocalDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = React.useState<NotificationRecord[]>(createInitialNotifications);
  const [filter, setFilter] = React.useState<FilterValue>('all');
  const [query, setQuery] = React.useState('');
  const [toastVisible, setToastVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      const createdAt = new Date();
      setNotifications((current) => [
        {
          id: `notif-${createdAt.getTime()}`,
          title: 'New renewal reminder',
          description: 'Notion annual billing is coming up next week. You can review or cancel it before renewal.',
          timeLabel: 'Just now',
          timestamp: createdAt.toISOString(),
          isRead: false,
          category: 'renewal',
        },
        ...current,
      ]);
      setToastVisible(true);

      window.setTimeout(() => {
        setToastVisible(false);
      }, 3500);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'read' && notification.isRead);

    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      normalizedQuery.length === 0 ||
      notification.title.toLowerCase().includes(normalizedQuery) ||
      notification.description.toLowerCase().includes(normalizedQuery) ||
      notification.category.toLowerCase().includes(normalizedQuery);

    return matchesFilter && matchesQuery;
  });

  const groupedNotifications = React.useMemo(() => {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    return [
      {
        label: 'Today',
        items: filteredNotifications.filter((item) => isSameLocalDay(new Date(item.timestamp), now)),
      },
      {
        label: 'Yesterday',
        items: filteredNotifications.filter((item) => isSameLocalDay(new Date(item.timestamp), yesterday)),
      },
      {
        label: 'Older',
        items: filteredNotifications.filter((item) => {
          const itemDate = new Date(item.timestamp);
          return !isSameLocalDay(itemDate, now) && !isSameLocalDay(itemDate, yesterday);
        }),
      },
    ];
  }, [filteredNotifications]);

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  const addNotification = () => {
    const createdAt = new Date();
    setNotifications((current) => [
      {
        id: `manual-${createdAt.getTime()}`,
        title: 'Custom notification created',
        description: 'A new sample notification was added so you can test the interaction flow and filters.',
        timeLabel: 'Just now',
        timestamp: createdAt.toISOString(),
        isRead: false,
        category: 'feature',
      },
      ...current,
    ]);
  };

  const filterOptions: Array<{ label: string; value: FilterValue }> = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread' },
    { label: 'Read', value: 'read' },
  ];

  return (
    <div className="relative space-y-6 text-white">
      <AnimatePresence>
        {toastVisible ? (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="fixed right-5 top-24 z-40 w-[min(92vw,360px)] rounded-2xl border border-violet-300/20 bg-[#140f24]/82 p-4 shadow-[0_20px_44px_rgba(8,5,28,0.28)] backdrop-blur-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(192,132,252,0.24),rgba(96,165,250,0.16))] text-violet-200">
                <Bell size={18} weight="fill" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">New notification received</p>
                <p className="mt-1 text-sm text-white/58">
                  Your notifications list updated in real time.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-card rounded-[28px] border-white/10 p-5 sm:p-6"
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/34">
              <span>Dashboard</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Notifications</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-display font-bold tracking-[-0.04em] text-white">
                Notifications
              </h1>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-violet-200">
                {unreadCount} unread
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/54">
              You have {notifications.length} notifications across billing updates, renewals, and product activity.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={addNotification}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/[0.10]"
            >
              <Plus size={16} weight="bold" />
              Add notification
            </button>
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#b77cff_0%,#7b7fff_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(78,59,181,0.28)] transition-all duration-200 hover:scale-[1.01] hover:brightness-105"
            >
              <Check size={16} weight="bold" />
              Mark all as read
            </button>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="glass-card rounded-[28px] border-white/10 p-4 sm:p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <MagnifyingGlass
                  size={18}
                  weight="bold"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="text"
                  placeholder="Search notifications"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-violet-300/30 focus:bg-white/[0.08]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  <FunnelSimple size={14} weight="bold" />
                  Filter
                </div>
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                    className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      filter === option.value
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'border border-white/10 bg-white/[0.05] text-white/68 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <NotificationList
            groupedNotifications={groupedNotifications}
            onOpen={markAsRead}
            onDelete={deleteNotification}
          />
        </div>

        <div className="space-y-5">
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="glass-card rounded-[28px] border-white/10 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(192,132,252,0.24),rgba(96,165,250,0.18))] text-violet-200">
                <Sparkle size={18} weight="fill" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/34">
                  Quick insight
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">Inbox summary</h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { label: 'Unread', value: unreadCount },
                { label: 'Read', value: notifications.length - unreadCount },
                { label: 'Billing alerts', value: notifications.filter((item) => item.category === 'billing').length },
                { label: 'Renewals', value: notifications.filter((item) => item.category === 'renewal').length },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3"
                >
                  <span className="text-sm text-white/58">{item.label}</span>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.aside>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.12 }}
            className="glass-card rounded-[28px] border-white/10 p-5"
          >
            <h2 className="text-lg font-semibold text-white">Helpful actions</h2>
            <div className="mt-4 space-y-3">
              {[
                'Open subscription renewals to review upcoming charges.',
                'Use Analytics when spend alerts start trending upward.',
                'Mark older resolved items as read to keep the feed focused.',
              ].map((tip) => (
                <div
                  key={tip}
                  className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white/56"
                >
                  {tip}
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>
    </div>
  );
};

export default NotificationsPage;
