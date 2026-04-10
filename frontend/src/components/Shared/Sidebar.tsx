import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  House,
  CreditCard,
  ChartLineUp,
  Bell,
  ChatsCircle,
  Gear,
  SignOut,
  X,
  CaretDoubleLeft,
  CaretDoubleRight,
  User,
  Receipt,
  Calendar,
} from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import { subscriptionApi } from '../../api/api';
import BrandLogo from './BrandLogo';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [subscriptionCount, setSubscriptionCount] = useState<number>(0);
  const [notificationCount] = useState<number>(3);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await subscriptionApi.getSubscriptions();
        setSubscriptionCount(response.data.data?.length || 0);
      } catch (error) {
        console.error('Error fetching subscription count:', error);
      }
    };

    fetchCounts();
  }, []);

  const mainNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <House size={20} weight="bold" /> },
    { name: 'Subscriptions', href: '/subscriptions', icon: <CreditCard size={20} weight="bold" />, badge: subscriptionCount },
    { name: 'Analytics', href: '/analytics', icon: <ChartLineUp size={20} weight="bold" /> },
    { name: 'Chats', href: '/chats', icon: <ChatsCircle size={20} weight="bold" /> },
    { name: 'Calendar', href: '/calendar', icon: <Calendar size={20} weight="bold" /> },
    { name: 'Payments', href: '/payments', icon: <Receipt size={20} weight="bold" /> },
    { name: 'Notifications', href: '/notifications', icon: <Bell size={20} weight="bold" />, badge: notificationCount },
  ];

  const bottomNavItems: NavItem[] = [
    { name: 'Settings', href: '/settings', icon: <Gear size={20} weight="bold" /> },
    { name: 'Profile', href: '/profile', icon: <User size={20} weight="bold" /> },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -300, opacity: 0 },
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'bg-gradient-to-r from-fuchsia-500 to-violet-500';
      case 'basic':
        return 'bg-gradient-to-r from-violet-500 to-indigo-500';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-400';
    }
  };

  const NavItemComponent: React.FC<{ item: NavItem }> = ({ item }) => {
    const isActive = location.pathname === item.href;

    return (
      <NavLink to={item.href} onClick={() => window.innerWidth < 1024 && onClose()}>
        <motion.div
          whileHover={{ x: 4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={`group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 transition-all ${
            isActive
              ? 'bg-white/[0.12] text-white shadow-[0_10px_24px_rgba(12,10,30,0.12)]'
              : 'text-white/55 hover:bg-white/[0.08] hover:text-white'
          }`}
        >
          <div className={`absolute inset-y-1 left-1 w-1 rounded-full bg-gradient-to-b from-fuchsia-400 to-violet-500 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
          {isActive ? (
            <motion.div
              layoutId="activeIndicator"
              className="absolute inset-0 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))]"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          ) : null}

          <span className={`relative z-10 flex-shrink-0 rounded-xl p-2 ${isActive ? 'bg-white/10 text-violet-200' : 'text-white/58 group-hover:bg-white/[0.05] group-hover:text-white'}`}>
            {item.icon}
          </span>

          <AnimatePresence>
            {!isCollapsed ? (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="relative z-10 overflow-hidden whitespace-nowrap text-sm font-medium"
              >
                {item.name}
              </motion.span>
            ) : null}
          </AnimatePresence>

          {item.badge !== undefined && item.badge > 0 && !isCollapsed ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative z-10 ml-auto rounded-full bg-white/12 px-2 py-0.5 text-xs font-bold text-white"
            >
              {item.badge}
            </motion.span>
          ) : null}

          {isCollapsed ? (
            <div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-lg border border-white/10 bg-[#171225] px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {item.name}
            </div>
          ) : null}
        </motion.div>
      </NavLink>
    );
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className={`border-b border-white/8 p-4 ${isCollapsed ? 'px-2' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <BrandLogo size={44} showWordmark={false} iconClassName="rounded-2xl" />
            <AnimatePresence>
              {!isCollapsed ? (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap text-lg font-display font-bold text-white"
                >
                  SubSync
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.button>

          {!isCollapsed ? (
            <motion.button
              onClick={onToggleCollapse}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white lg:flex"
            >
              <CaretDoubleLeft size={16} weight="bold" />
            </motion.button>
          ) : null}

          <motion.button
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/45 hover:bg-white/[0.06] lg:hidden"
          >
            <X size={18} weight="bold" />
          </motion.button>
        </div>

        {isCollapsed ? (
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Go home"
            className="mt-3 hidden h-8 w-full items-center justify-center rounded-lg text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white lg:flex"
          >
            <CaretDoubleRight size={16} weight="bold" />
          </motion.button>
        ) : null}
      </div>

      <div className={`p-4 ${isCollapsed ? 'px-2' : ''}`}>
        <motion.div whileHover={{ scale: 1.02 }} className={`glass-card rounded-2xl border-white/10 p-3 ${isCollapsed ? 'px-2' : ''}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d56dff_0%,#6d46ff_100%)] text-sm font-bold text-white shadow-[0_10px_26px_rgba(128,78,255,0.3)]">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#140f24] bg-emerald-400" />
            </div>

            <AnimatePresence>
              {!isCollapsed ? (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-semibold text-white">{user?.name || 'User'}</p>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold text-white ${getPlanColor(user?.plan || 'free')}`}>
                      {user?.plan?.toUpperCase() || 'FREE'}
                    </span>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-1">
          {!isCollapsed ? (
            <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/32">
              Main Menu
            </p>
          ) : null}
          {mainNavItems.map((item) => (
            <NavItemComponent key={item.name} item={item} />
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-white/8 px-3 py-4">
        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavItemComponent key={item.name} item={item} />
          ))}

          <motion.button
            onClick={logout}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-rose-300 transition-all hover:bg-rose-500/10 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <SignOut size={20} weight="bold" />
            <AnimatePresence>
              {!isCollapsed ? (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap text-sm font-medium"
                >
                  Logout
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-white/8 bg-white/[0.10] shadow-[8px_0_28px_rgba(7,4,24,0.12)] backdrop-blur-sm lg:flex"
      >
        <SidebarContent />
      </motion.aside>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[#05010d]/80 backdrop-blur-sm lg:hidden"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-white/8 bg-white/[0.10] shadow-2xl backdrop-blur-sm lg:hidden"
          >
            <SidebarContent />
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
