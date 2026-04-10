import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cubicBezier } from 'motion';
import {
  ShieldCheck,
  Lightning,
  ChartLineUp,
  Bell,
  CurrencyDollar,
  Users,
  Lock,
  CloudCheck,
  ArrowRight,
  CheckCircle,
} from '@phosphor-icons/react';

const myEase = cubicBezier(0.42, 0, 0.58, 1);

const Why: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const features = [
    {
      icon: Lightning,
      title: 'Lightning Fast',
      description: 'Real-time sync across all devices. Your subscription data updates instantly.',
      color: 'from-chart-1 to-chart-2',
      shadowColor: 'shadow-chart-1/30',
    },
    {
      icon: ShieldCheck,
      title: 'Bank-Level Security',
      description: 'Enterprise-grade encryption keeps your financial data completely secure.',
      color: 'from-primary to-chart-3',
      shadowColor: 'shadow-primary/30',
    },
    {
      icon: ChartLineUp,
      title: 'Smart Analytics',
      description: 'AI-powered insights help you understand and optimize your spending patterns.',
      color: 'from-chart-3 to-chart-4',
      shadowColor: 'shadow-chart-3/30',
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Never miss a renewal. Get notified before charges hit your account.',
      color: 'from-chart-4 to-chart-5',
      shadowColor: 'shadow-chart-4/30',
    },
    {
      icon: CurrencyDollar,
      title: 'Save Money',
      description: 'Identify unused subscriptions and save an average of $500 per year.',
      color: 'from-chart-2 to-chart-3',
      shadowColor: 'shadow-chart-2/30',
    },
    {
      icon: Users,
      title: 'Family Sharing',
      description: 'Manage household subscriptions together with shared dashboards.',
      color: 'from-chart-5 to-primary',
      shadowColor: 'shadow-chart-5/30',
    },
  ];

  const stats = [
    { value: '$12M+', label: 'Saved by users', icon: CurrencyDollar },
    { value: '99.9%', label: 'Uptime guarantee', icon: CloudCheck },
    { value: '256-bit', label: 'Encryption', icon: Lock },
    { value: '50K+', label: 'Happy users', icon: Users },
  ];

  return (
    <section className="relative w-full bg-transparent py-24 lg:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,var(--primary)/5,transparent)]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-chart-1/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

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
            <CheckCircle size={16} className="text-primary" weight="fill" />
            <span className="text-sm font-semibold text-primary">Why Choose SubSync</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-primary via-chart-3 to-chart-1 bg-clip-text text-transparent">
              Master Subscriptions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
            Powerful features designed to give you complete control over your recurring expenses
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-6 lg:p-8 bg-card/50 border border-border rounded-2xl backdrop-blur-sm hover:border-primary/30 hover:bg-card/80 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg ${feature.shadowColor} group-hover:shadow-xl transition-shadow duration-300`}
              >
                <feature.icon size={28} className="text-white" weight="fill" />
              </motion.div>
              
              {/* Content */}
              <h3 className="relative text-xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="relative text-muted-foreground font-body leading-relaxed">
                {feature.description}
              </p>
              
              {/* Arrow indicator */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <ArrowRight size={20} className="text-primary" weight="bold" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: myEase }}
          className="relative"
        >
          {/* Stats card */}
          <div className="relative bg-gradient-to-br from-card to-card/50 border border-border rounded-3xl p-8 lg:p-12 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-chart-3/10 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              {/* Stats header */}
              <div className="text-center mb-10">
                <h3 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-3">
                  Trusted by Thousands
                </h3>
                <p className="text-muted-foreground font-body">
                  Join the community saving money every month
                </p>
              </div>
              
              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 lg:p-6 bg-background/50 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300"
                  >
                    <motion.div
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                      className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-chart-3/20 border border-primary/20 flex items-center justify-center"
                    >
                      <stat.icon size={24} className="text-primary" weight="fill" />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-1"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-sm text-muted-foreground font-body">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: myEase }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6 font-body">
            Ready to take control of your subscriptions?
          </p>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
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
            <ArrowRight size={20} weight="bold" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Why;
