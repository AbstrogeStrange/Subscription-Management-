import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cubicBezier } from 'motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  List, 
  X,
  SignOut,
  User,
  Gear,
  House,
  ChartLine,
  CreditCard,
  Bell,
  CaretDown,
} from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from './BrandLogo';

const myEase = cubicBezier(0.42, 0, 0.58, 1);

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Public navigation items (for landing page)
  const publicNavItems = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  // Authenticated navigation items
  const authNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: House },
    { label: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
    { label: 'Analytics', href: '/analytics', icon: ChartLine },
  ];

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
    setMobileMenuOpen(false);
  };

  const isActivePath = (href: string) => {
    if (href.startsWith('#')) return false;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  // Check if we're on the dashboard
  const isDashboardPage = location.pathname.startsWith('/dashboard');

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: myEase }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isDashboardPage
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
          >
            <BrandLogo
              size={42}
              textClassName="hidden text-xl font-display font-bold text-foreground sm:block"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {isAuthenticated ? (
              // Authenticated Navigation
              authNavItems.map((item) => (
                <motion.button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActivePath(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon size={18} weight={isActivePath(item.href) ? 'fill' : 'regular'} />
                  {item.label}
                </motion.button>
              ))
            ) : (
              // Public Navigation
              publicNavItems.map((item) => (
                <motion.button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                >
                  {item.label}
                </motion.button>
              ))
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                >
                  <Bell size={20} weight="bold" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                </motion.button>

                {/* Profile Menu */}
                <div ref={profileMenuRef} className="relative">
                  <motion.button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-foreground hidden sm:block max-w-[100px] truncate">
                      {user?.name || 'User'}
                    </span>
                    <CaretDown
                      size={14}
                      weight="bold"
                      className={`text-muted-foreground transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
                    />
                  </motion.button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                      >
                        {/* User Info */}
                        <div className="p-4 border-b border-border bg-secondary/30">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user?.email || 'user@example.com'}
                          </p>
                          <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize">
                            {user?.plan || 'Free'} Plan
                          </span>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <button
                            onClick={() => {
                              navigate('/dashboard/profile');
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
                          >
                            <User size={18} weight="bold" />
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              navigate('/dashboard/settings');
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
                          >
                            <Gear size={18} weight="bold" />
                            Settings
                          </button>
                        </div>

                        {/* Logout */}
                        <div className="p-2 border-t border-border">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <SignOut size={18} weight="bold" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              // Public Actions
              <div className="hidden sm:flex items-center gap-2">
                <motion.button
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={() => navigate('/signup')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Get Started
                </motion.button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground transition-all"
            >
              {mobileMenuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-border/50"
            >
              <div className="py-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    {authNavItems.map((item) => (
                      <motion.button
                        key={item.href}
                        onClick={() => handleNavClick(item.href)}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActivePath(item.href)
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                      >
                        <item.icon size={20} weight={isActivePath(item.href) ? 'fill' : 'regular'} />
                        {item.label}
                      </motion.button>
                    ))}
                    <div className="pt-2 border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <SignOut size={20} weight="bold" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {publicNavItems.map((item) => (
                      <motion.button
                        key={item.href}
                        onClick={() => handleNavClick(item.href)}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                      >
                        {item.label}
                      </motion.button>
                    ))}
                    <div className="pt-2 space-y-2 border-t border-border">
                      <button
                        onClick={() => {
                          navigate('/login');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full py-3 text-sm font-semibold text-foreground hover:bg-accent rounded-xl transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          navigate('/signup');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl"
                      >
                        Get Started
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navbar;
