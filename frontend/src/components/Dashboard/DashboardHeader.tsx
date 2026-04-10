import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CaretDown,
  List,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

const notifications = [
  { id: 1, title: 'Netflix renewal', message: 'Your subscription renews in 3 days', time: '2h ago', unread: true },
  { id: 2, title: 'Payment successful', message: 'Spotify payment processed', time: '5h ago', unread: true },
  { id: 3, title: 'New feature', message: 'Glass dashboard enabled', time: '1d ago', unread: false },
];

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMenuClick,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 border-b border-white/8 bg-transparent backdrop-blur-sm"
    >
      <div className="px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onMenuClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card flex h-11 w-11 items-center justify-center rounded-2xl text-white/75 transition-colors hover:bg-white/[0.12] lg:hidden"
            >
              <List size={22} weight="bold" className="text-white" />
            </motion.button>

            <div className="glass-card hidden w-64 items-center gap-3 rounded-2xl px-4 py-3 text-white/60 transition-colors focus-within:border-violet-300/25 focus-within:bg-white/[0.16] sm:flex lg:w-80">
              <MagnifyingGlass size={18} className="text-white/45" weight="bold" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
              />
              <kbd className="hidden rounded-lg border border-white/8 bg-white/[0.06] px-2 py-0.5 text-xs font-mono text-white/34 md:inline-flex">
                Ctrl K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <motion.button
                onClick={() => setShowNotifications((value) => !value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card relative flex h-11 w-11 items-center justify-center rounded-2xl transition-colors hover:bg-white/[0.12]"
              >
                <Bell size={20} weight="bold" className="text-white" />
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#171225] bg-rose-400" />
              </motion.button>

              <AnimatePresence>
                {showNotifications ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="glass-panel absolute right-0 mt-3 w-80 overflow-hidden rounded-3xl border-white/10"
                  >
                    <div className="border-b border-white/8 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-xs font-bold text-violet-200">
                          2 new
                        </span>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                          className={`cursor-pointer border-b border-white/6 p-4 ${
                            notification.unread ? 'bg-white/[0.04]' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${
                                notification.unread ? 'bg-violet-300' : 'bg-white/20'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white">{notification.title}</p>
                              <p className="mt-0.5 text-xs text-white/52">{notification.message}</p>
                              <p className="mt-1 text-xs text-white/32">{notification.time}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="border-t border-white/8 p-3">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/notifications');
                        }}
                        className="w-full rounded-xl bg-white/[0.05] py-2 text-sm font-medium text-violet-200 transition-colors hover:bg-white/[0.1]"
                      >
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="relative">
              <motion.button
                onClick={() => setShowProfile((value) => !value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card flex items-center gap-2 rounded-2xl pl-2 pr-3 py-1.5 transition-colors hover:bg-white/[0.12]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d56dff_0%,#6d46ff_100%)] text-xs font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden max-w-24 truncate text-sm font-medium text-white sm:block">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
                <CaretDown size={14} weight="bold" className="text-white/45" />
              </motion.button>

              <AnimatePresence>
                {showProfile ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="glass-panel absolute right-0 mt-3 w-56 overflow-hidden rounded-3xl border-white/10"
                  >
                    <div className="border-b border-white/8 p-4">
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                      <p className="truncate text-xs text-white/42">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          navigate('/profile');
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          navigate('/settings');
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
                      >
                        Settings
                      </button>
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          navigate('/payments');
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
                      >
                        Billing
                      </button>
                    </div>
                    <div className="border-t border-white/8 p-2">
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          logout();
                          navigate('/login');
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-300 transition-colors hover:bg-rose-500/10"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
