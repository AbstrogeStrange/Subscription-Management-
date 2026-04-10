import React, { useState } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { cubicBezier } from 'motion';
import {
  UserPlus,
  Link,
  ChartLineUp,
  Bell,
  CheckCircle,
  ArrowRight,
  Play,
  CreditCard,
  Bank,
  GoogleLogo,
  AppleLogo,
  Wallet,
  ShieldCheck,
  Lightning,
  ArrowDown,
} from '@phosphor-icons/react';

const myEase = cubicBezier(0.42, 0, 0.58, 1);

const How: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: myEase },
    },
  };

  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up in seconds with your email or social accounts. No credit card required to start.',
      color: 'from-chart-1 to-chart-2',
      shadowColor: 'shadow-chart-1/30',
      features: ['Free forever plan', 'No credit card needed', '2-minute setup'],
    },
    {
      number: '02',
      icon: Link,
      title: 'Connect Your Accounts',
      description: 'Securely link your bank accounts and cards. We automatically detect all your subscriptions.',
      color: 'from-primary to-chart-3',
      shadowColor: 'shadow-primary/30',
      features: ['Bank-level encryption', 'Auto-detection', '10,000+ services'],
    },
    {
      number: '03',
      icon: ChartLineUp,
      title: 'Track & Analyze',
      description: 'Get a clear overview of all subscriptions with spending insights and smart recommendations.',
      color: 'from-chart-3 to-chart-4',
      shadowColor: 'shadow-chart-3/30',
      features: ['Real-time tracking', 'AI insights', 'Spending trends'],
    },
    {
      number: '04',
      icon: Bell,
      title: 'Stay Notified & Save',
      description: 'Receive smart alerts before renewals and discover unused subscriptions to cancel.',
      color: 'from-chart-4 to-chart-5',
      shadowColor: 'shadow-chart-4/30',
      features: ['Smart reminders', 'Cancel suggestions', 'Price alerts'],
    },
  ];

  const integrations = [
    { icon: CreditCard, name: 'Visa' },
    { icon: CreditCard, name: 'Mastercard' },
    { icon: Bank, name: 'Banks' },
    { icon: GoogleLogo, name: 'Google' },
    { icon: AppleLogo, name: 'Apple' },
    { icon: Wallet, name: 'PayPal' },
  ];

  return (
    <section id="how-it-works" className="relative w-full bg-transparent py-24 lg:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/5,transparent)]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-primary/5 to-transparent rounded-full blur-[100px]" />
      
      {/* Animated dots pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: myEase }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
          >
            <Play size={16} className="text-primary" weight="fill" />
            <span className="text-sm font-semibold text-primary">How It Works</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
            Get Started in{' '}
            <span className="bg-gradient-to-r from-primary via-chart-3 to-chart-1 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
            From signup to savings in minutes. Here's how SubSync transforms your subscription management.
          </p>
        </motion.div>

        {/* Steps Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Steps List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-4"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onMouseEnter={() => setActiveStep(index)}
                className={`relative group cursor-pointer p-6 rounded-2xl border transition-all duration-500 ${
                  activeStep === index
                    ? 'bg-card border-primary/30 shadow-lg shadow-primary/5'
                    : 'bg-transparent border-border/50 hover:border-border hover:bg-card/50'
                }`}
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-10 top-full w-0.5 h-4 bg-gradient-to-b from-border to-transparent" />
                )}
                
                <div className="flex gap-5">
                  {/* Step number & icon */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      animate={activeStep === index ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5 }}
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg ${step.shadowColor} transition-all duration-300`}
                    >
                      <step.icon size={26} className="text-white" weight="fill" />
                    </motion.div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`text-xl font-display font-bold mb-2 transition-colors duration-300 ${
                      activeStep === index ? 'text-foreground' : 'text-foreground/80'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground font-body leading-relaxed mb-3">
                      {step.description}
                    </p>
                    
                    {/* Features list */}
                    <AnimatePresence>
                      {activeStep === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-wrap gap-2"
                        >
                          {step.features.map((feature, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                            >
                              <CheckCircle size={12} weight="fill" />
                              {feature}
                            </motion.span>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: myEase }}
            className="relative"
          >
            {/* Demo card */}
            <div className="relative bg-card border border-border rounded-3xl p-8 overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
              
              {/* Demo content based on active step */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10"
                >
                  {/* Step 1: Account Creation */}
                  {activeStep === 0 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center shadow-lg shadow-chart-1/30">
                          <UserPlus size={32} className="text-white" weight="fill" />
                        </div>
                        <h4 className="text-lg font-display font-bold text-foreground">Create Account</h4>
                      </div>
                      
                      {/* Form mockup */}
                      <div className="space-y-4">
                        <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Email</p>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '80%' }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-2 bg-gradient-to-r from-primary to-chart-3 rounded-full"
                          />
                        </div>
                        <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Password</p>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '60%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-2 bg-gradient-to-r from-primary to-chart-3 rounded-full"
                          />
                        </div>
                        <motion.button
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl"
                        >
                          Sign Up Free
                        </motion.button>
                      </div>
                      
                      {/* Social login */}
                      <div className="flex items-center gap-3 justify-center">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground">or continue with</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <div className="flex gap-3 justify-center">
                        {[GoogleLogo, AppleLogo].map((Icon, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center border border-border hover:border-primary/30 cursor-pointer transition-colors"
                          >
                            <Icon size={24} className="text-foreground" weight="fill" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Connect Accounts */}
                  {activeStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center shadow-lg shadow-primary/30">
                          <Link size={32} className="text-white" weight="fill" />
                        </div>
                        <h4 className="text-lg font-display font-bold text-foreground">Connect Accounts</h4>
                      </div>
                      
                      {/* Integration cards */}
                      <div className="grid grid-cols-3 gap-3">
                        {integrations.map((integration, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="p-4 bg-secondary/50 rounded-xl border border-border hover:border-primary/30 cursor-pointer transition-all text-center"
                          >
                            <integration.icon size={28} className="mx-auto mb-2 text-foreground" weight="fill" />
                            <p className="text-xs text-muted-foreground">{integration.name}</p>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Security badge */}
                      <motion.div
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                      >
                        <ShieldCheck size={24} className="text-green-500" weight="fill" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Bank-level Security</p>
                          <p className="text-xs text-muted-foreground">256-bit encryption • Read-only access</p>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Step 3: Track & Analyze */}
                  {activeStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-chart-3 to-chart-4 flex items-center justify-center shadow-lg shadow-chart-3/30">
                          <ChartLineUp size={32} className="text-white" weight="fill" />
                        </div>
                        <h4 className="text-lg font-display font-bold text-foreground">Your Dashboard</h4>
                      </div>
                      
                      {/* Mini chart mockup */}
                      <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-semibold text-foreground">Monthly Spending</p>
                          <span className="text-xs text-green-500 font-medium">↓ 12%</span>
                        </div>
                        <div className="flex items-end gap-2 h-24">
                          {[40, 65, 45, 80, 55, 70, 35].map((height, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: i * 0.1, duration: 0.5 }}
                              className={`flex-1 rounded-t-md ${
                                i === 6 ? 'bg-gradient-to-t from-primary to-chart-3' : 'bg-primary/30'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-muted-foreground">Mon</span>
                          <span className="text-xs text-muted-foreground">Sun</span>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                          <p className="text-2xl font-display font-bold text-foreground">$284</p>
                          <p className="text-xs text-muted-foreground">This Month</p>
                        </div>
                        <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                          <p className="text-2xl font-display font-bold text-foreground">12</p>
                          <p className="text-xs text-muted-foreground">Active Subs</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Notifications */}
                  {activeStep === 3 && (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-chart-4 to-chart-5 flex items-center justify-center shadow-lg shadow-chart-4/30">
                          <Bell size={32} className="text-white" weight="fill" />
                        </div>
                        <h4 className="text-lg font-display font-bold text-foreground">Smart Alerts</h4>
                      </div>
                      
                      {/* Notification cards */}
                      {[
                        { title: 'Upcoming Renewal', desc: 'Netflix renews in 3 days • $15.99', type: 'warning', delay: 0 },
                        { title: 'Unused Subscription', desc: 'You haven\'t used Hulu in 45 days', type: 'alert', delay: 0.2 },
                        { title: 'Price Increase', desc: 'Spotify increasing to $11.99/mo', type: 'info', delay: 0.4 },
                      ].map((notification, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: notification.delay, duration: 0.4 }}
                          className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl border border-border"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            notification.type === 'warning' ? 'bg-violet-500/20' :
                            notification.type === 'alert' ? 'bg-red-500/20' : 'bg-blue-500/20'
                          }`}>
                            <Bell size={20} className={
                              notification.type === 'warning' ? 'text-violet-300' :
                              notification.type === 'alert' ? 'text-red-500' : 'text-blue-500'
                            } weight="fill" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.desc}</p>
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-primary"
                          />
                        </motion.div>
                      ))}
                      
                      {/* Savings highlight */}
                      <motion.div
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="p-4 bg-gradient-to-br from-primary/20 to-chart-3/20 rounded-xl border border-primary/30"
                      >
                        <div className="flex items-center gap-3">
                          <Lightning size={24} className="text-primary" weight="fill" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">Potential Savings</p>
                            <p className="text-lg font-display font-bold text-primary">$47.98/month</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-chart-1 to-chart-2 rounded-xl flex items-center justify-center shadow-lg shadow-chart-1/30"
            >
              <CheckCircle size={24} className="text-white" weight="fill" />
            </motion.div>
            <motion.div
              animate={{ y: [5, -5, 5], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-primary to-chart-3 rounded-lg flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <Lightning size={20} className="text-white" weight="fill" />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: myEase }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-card border border-border rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-3 border-2 border-background flex items-center justify-center text-xs font-bold text-white"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Join 50,000+ users</p>
                <p className="text-xs text-muted-foreground">Start saving today</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  window.location.hash = 'how-it-works';
                }
              }}
            >
              Get Started Free
              <ArrowRight size={18} weight="bold" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default How;
