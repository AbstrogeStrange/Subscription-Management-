import React, { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { motion } from 'framer-motion';
import { BellRinging, CalendarCheck, Plus, Trash } from '@phosphor-icons/react';
import { subscriptionApi } from '../../api/api';

interface SubscriptionItem {
  id: string;
  name: string;
  amount: number;
  nextBillingDate: string;
  isActive: boolean;
}

interface ManualReminder {
  id: string;
  title: string;
  date: string;
  note?: string;
}

interface DisplayReminder {
  id: string;
  title: string;
  date: string;
  source: 'subscription' | 'manual';
  note?: string;
}

const STORAGE_KEY = 'calendar_manual_reminders';
const NOTIFICATION_LOG_KEY = 'calendar_notification_log_v1';

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, count: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
};

const formatReadableDate = (dateKey: string) => {
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [manualReminders, setManualReminders] = useState<ManualReminder[]>([]);
  const [subscriptionReminders, setSubscriptionReminders] = useState<DisplayReminder[]>([]);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [notificationStatus, setNotificationStatus] = useState<
    'unsupported' | 'default' | 'denied' | 'granted'
  >('default');

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationStatus('unsupported');
      return;
    }
    setNotificationStatus(Notification.permission);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setManualReminders(JSON.parse(stored) as ManualReminder[]);
      } catch {
        setManualReminders([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(manualReminders));
  }, [manualReminders]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await subscriptionApi.getSubscriptions();
        const subs = (response.data.data || []) as SubscriptionItem[];
        const reminders: DisplayReminder[] = subs
          .filter((sub) => sub.isActive)
          .map((sub) => ({
            id: `sub-${sub.id}`,
            title: `Renew ${sub.name} (Rs ${Number(sub.amount).toFixed(0)})`,
            date: toDateKey(new Date(sub.nextBillingDate)),
            source: 'subscription',
          }));
        setSubscriptionReminders(reminders);
      } catch (error) {
        console.error('Failed to load subscriptions for calendar reminders:', error);
        setSubscriptionReminders([]);
      }
    };

    fetchSubscriptions();
  }, []);

  const selectedDateKey = toDateKey(selectedDate);

  const allReminders: DisplayReminder[] = useMemo(() => {
    const manual: DisplayReminder[] = manualReminders.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      note: item.note,
      source: 'manual',
    }));
    return [...subscriptionReminders, ...manual];
  }, [manualReminders, subscriptionReminders]);

  const remindersForSelectedDate = useMemo(
    () => allReminders.filter((item) => item.date === selectedDateKey),
    [allReminders, selectedDateKey]
  );

  const reminderDates = useMemo(() => {
    const unique = new Set(allReminders.map((item) => item.date));
    return Array.from(unique).map((dateKey) => new Date(`${dateKey}T00:00:00`));
  }, [allReminders]);

  const tomorrowDateKey = useMemo(() => toDateKey(addDays(new Date(), 1)), []);
  const remindersDueTomorrow = useMemo(
    () => allReminders.filter((item) => item.date === tomorrowDateKey),
    [allReminders, tomorrowDateKey]
  );

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      setNotificationStatus('unsupported');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (notificationStatus !== 'granted') return;
    if (remindersDueTomorrow.length === 0) return;

    const todayKey = toDateKey(new Date());
    const rawLog = localStorage.getItem(NOTIFICATION_LOG_KEY);
    const log: Record<string, string> = rawLog ? JSON.parse(rawLog) : {};

    remindersDueTomorrow.forEach((reminder) => {
      const uniqueLogKey = `${todayKey}:${reminder.id}`;
      if (log[uniqueLogKey]) return;

      const body =
        reminder.source === 'subscription'
          ? `Your subscription renews tomorrow: ${reminder.title}`
          : `Reminder for tomorrow: ${reminder.title}`;

      new Notification('Reminder from SubSync', { body });
      log[uniqueLogKey] = new Date().toISOString();
    });

    localStorage.setItem(NOTIFICATION_LOG_KEY, JSON.stringify(log));
  }, [notificationStatus, remindersDueTomorrow]);

  const addManualReminder = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    const newReminder: ManualReminder = {
      id: `manual-${Date.now()}`,
      title: title.trim(),
      note: note.trim() || undefined,
      date: selectedDateKey,
    };

    setManualReminders((prev) => [newReminder, ...prev]);
    setTitle('');
    setNote('');
  };

  const deleteManualReminder = (id: string) => {
    setManualReminders((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Calendar Reminders</h1>
        <p className="text-muted-foreground">
          Set reminders for buying subscriptions and track upcoming renewals.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-3 rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-foreground">Browser Renewal Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get a popup one day before subscription renewal.
              </p>
              {remindersDueTomorrow.length > 0 ? (
                <p className="mt-1 text-sm text-chart-2">
                  {remindersDueTomorrow.length} reminder(s) due tomorrow.
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">No reminders due tomorrow.</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  notificationStatus === 'granted'
                    ? 'bg-green-500/20 text-green-600'
                    : notificationStatus === 'denied'
                    ? 'bg-red-500/20 text-red-600'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {notificationStatus === 'granted'
                  ? 'Enabled'
                  : notificationStatus === 'denied'
                  ? 'Blocked'
                  : notificationStatus === 'unsupported'
                  ? 'Not Supported'
                  : 'Not Enabled'}
              </span>
              {notificationStatus !== 'granted' && notificationStatus !== 'unsupported' ? (
                <button
                  onClick={enableNotifications}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  <BellRinging size={16} weight="bold" />
                  Enable
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-1 rounded-2xl border border-border bg-card p-4"
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            modifiers={{ hasReminder: reminderDates }}
            modifiersClassNames={{ hasReminder: 'bg-primary/20 text-primary font-semibold rounded-md' }}
            showOutsideDays
            className="w-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-2 space-y-4"
        >
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <CalendarCheck size={20} className="text-primary" weight="bold" />
              <h2 className="text-lg font-semibold text-foreground">
                {formatReadableDate(selectedDateKey)}
              </h2>
            </div>

            {remindersForSelectedDate.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reminders for this date.</p>
            ) : (
              <div className="space-y-3">
                {remindersForSelectedDate.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      {item.note ? (
                        <p className="text-sm text-muted-foreground">{item.note}</p>
                      ) : null}
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          item.source === 'subscription'
                            ? 'bg-chart-2/20 text-chart-2'
                            : 'bg-primary/20 text-primary'
                        }`}
                      >
                        {item.source === 'subscription' ? 'Subscription Renewal' : 'Custom Reminder'}
                      </span>
                    </div>
                    {item.source === 'manual' ? (
                      <button
                        onClick={() => deleteManualReminder(item.id)}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10"
                        aria-label="Delete reminder"
                      >
                        <Trash size={18} weight="bold" />
                      </button>
                    ) : (
                      <BellRinging size={18} className="mt-2 text-chart-2" weight="bold" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 text-lg font-semibold text-foreground">Add Reminder</h3>
            <form onSubmit={addManualReminder} className="space-y-3">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Reminder title (e.g., Buy Netflix plan)"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Optional note"
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <Plus size={16} weight="bold" />
                Add Reminder
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CalendarPage;
