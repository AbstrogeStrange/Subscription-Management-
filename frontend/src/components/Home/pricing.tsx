import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { cubicBezier } from 'motion';
import {
  Check,
  X,
  ArrowRight,
  Lightning,
  Crown,
  Rocket,
  CurrencyDollar,
} from '@phosphor-icons/react';

const myEase = cubicBezier(0.42, 0, 0.58, 1);

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

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

  const plans = [
    {
      name: 'Starter',
      icon: Rocket,
      description: 'Perfect for personal use',
      monthlyPrice: 0,
      annualPrice: 0,
      badge: 'Free Forever',
      badgeColor: 'from-chart-1 to-chart-2',
      highlighted: false,
      features: [
        { text: 'Track up to 10 subscriptions', included: true },
        { text: 'Basic spending analytics', included: true },
        { text: 'Monthly reminders', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Priority support', included: false },
        { text: 'Family sharing', included: false },
        { text: 'Advanced analytics', included: false },
      ],
      cta: 'Get Started',
      ctaVariant: 'secondary',
    },
    {
      name: 'Pro',
      icon: Lightning,
      description: 'For power users',
      monthlyPrice: 4.99,
      annualPrice: 49.99,
      badge: 'Most Popular',
      badgeColor: 'from-primary to-chart-3',
      highlighted: true,
      features: [
        { text: 'Unlimited subscriptions', included: true },
        { text: 'Advanced AI analytics', included: true },
        { text: 'Smart renewal alerts', included: true },
        { text: 'Mobile & web app', included: true },
        { text: 'Priority support', included: true },
        { text: 'Family sharing (up to 5)', included: true },
        { text: 'Custom budget limits', included: false },
      ],
      cta: 'Start Free Trial',
      ctaVariant: 'primary',
    },
    {
      name: 'Premium',
      icon: Crown,
      description: 'For teams & families',
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      badge: 'Best Value',
      badgeColor: 'from-chart-4 to-chart-5',
      highlighted: false,
      features: [
        { text: 'Unlimited everything', included: true },
        { text: 'AI-powered recommendations', included: true },
        { text: 'Real-time notifications', included: true },
        { text: 'All platforms included', included: true },
        { text: '24/7 Priority support', included: true },
        { text: 'Unlimited family members', included: true },
        { text: 'Custom budgets & insights', included: true },
      ],
      cta: 'Start Free Trial',
      ctaVariant: 'primary',
    },
  ];

  const comparisonFeatures = [
    'Subscription tracking',
    'Analytics & insights',
    'Smart reminders',
    'Mobile app',
    'Family sharing',
    'Priority support',
    'Advanced features',
    'API access',
  ];

  const savings = [
    { name: 'Average annual savings', value: '$500+' },
    { name: 'Subscriptions tracked', value: '50K+' },
    { name: 'Money recovered', value: '$12M+' },
  ];

  return (
    <section className="relative w-full bg-transparent py-24 lg:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,var(--primary)/8,transparent)]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-chart-1/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.01]"
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
          className="text-center mb-4 lg:mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
          >
            <CurrencyDollar size={16} className="text-primary" weight="fill" />
            <span className="text-sm font-semibold text-primary">Simple Pricing</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
            Plans for Every{' '}
            <span className="bg-gradient-to-r from-primary via-chart-3 to-chart-1 bg-clip-text text-transparent">
              Budget
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
            Flexible pricing that scales with your needs. Start free, upgrade anytime.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <span className={`text-sm font-semibold transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <motion.button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-8 rounded-full bg-secondary border border-border transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ x: isAnnual ? 28 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 rounded-full bg-primary shadow-lg"
            />
          </motion.button>
          <span className={`text-sm font-semibold transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Annual
          </span>
          {isAnnual && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-2 px-3 py-1 bg-green-500/20 text-green-500 text-xs font-bold rounded-full border border-green-500/30"
            >
              Save 17%
            </motion.span>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20"
        >
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const displayPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isFreePlan = displayPrice === 0;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={plan.highlighted ? { y: -12, scale: 1.02 } : { y: -8 }}
                className={`relative group rounded-3xl overflow-hidden transition-all duration-500 ${
                  plan.highlighted
                    ? 'md:scale-105 ring-2 ring-primary/50'
                    : ''
                }`}
              >
                {/* Card background */}
                <div className={`absolute inset-0 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20'
                    : 'bg-card border border-border'
                } transition-all duration-500`} />

                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className={`absolute -top-4 right-6 px-4 py-2 bg-gradient-to-r ${plan.badgeColor} text-white text-xs font-bold rounded-full shadow-lg`}
                >
                  {plan.badge}
                </motion.div>

                {/* Content */}
                <div className="relative z-10 p-8 lg:p-10 h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-8">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                        plan.badgeColor
                      } flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <Icon size={28} className="text-white" weight="fill" />
                    </motion.div>

                    <h3 className="text-2xl font-display font-bold text-foreground mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    {isFreePlan ? (
                      <div>
                        <div className="text-4xl font-display font-bold text-foreground">Free</div>
                        <p className="text-sm text-muted-foreground mt-2">Forever</p>
                      </div>
                    ) : (
                      <div>
                        <motion.div
                          key={isAnnual ? 'annual' : 'monthly'}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-baseline"
                        >
                          <span className="text-5xl font-display font-bold text-foreground">
                            ${displayPrice.toFixed(2)}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            /{isAnnual ? 'year' : 'month'}
                          </span>
                        </motion.div>
                        {isAnnual && (
                          <p className="text-xs text-muted-foreground mt-2">
                            ${(displayPrice / 12).toFixed(2)}/month when billed annually
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3.5 font-semibold rounded-xl transition-all duration-300 mb-8 flex items-center justify-center gap-2 ${
                      plan.ctaVariant === 'primary'
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30'
                        : 'bg-secondary text-foreground border border-border hover:border-primary hover:bg-secondary/80'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight size={18} weight="bold" />
                  </motion.button>

                  {/* Features List */}
                  <div className="space-y-3 flex-1">
                    {plan.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        {feature.included ? (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mt-0.5">
                            <Check size={16} className="text-green-500" weight="bold" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-border flex items-center justify-center mt-0.5">
                            <X size={16} className="text-muted-foreground" weight="bold" />
                          </div>
                        )}
                        <span className={`text-sm font-body ${
                          feature.included ? 'text-foreground' : 'text-muted-foreground/60'
                        }`}>
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Savings Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: myEase, delay: 0.2 }}
          className="relative mb-20"
        >
          <div className="relative bg-gradient-to-br from-card to-card/50 border border-border rounded-3xl p-8 lg:p-12 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-chart-3/10 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-2 text-center">
                See How Much You Can Save
              </h3>
              <p className="text-muted-foreground text-center mb-8 font-body">
                Users save an average of $500+ annually with SubSync
              </p>

              <div className="grid grid-cols-3 gap-6 lg:gap-8">
                {savings.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-6 bg-background/50 rounded-2xl border border-border/50 hover:border-primary/30 transition-all"
                  >
                    <motion.p
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                      className="text-4xl lg:text-5xl font-display font-bold text-primary mb-2"
                    >
                      {item.value}
                    </motion.p>
                    <p className="text-sm text-muted-foreground font-body">{item.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: myEase, delay: 0.3 }}
        >
          <div className="mb-8 text-center">
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-2">
              Feature Comparison
            </h3>
            <p className="text-muted-foreground font-body">
              See what's included in each plan
            </p>
          </div>

          <div className="relative rounded-2xl border border-border overflow-hidden">
            {/* Table wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left font-display font-bold text-foreground">Feature</th>
                    {plans.map((plan) => (
                      <th key={plan.name} className="px-6 py-4 text-center font-display font-bold text-foreground">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={feature} className={index % 2 === 0 ? 'bg-transparent' : 'bg-card/30'}>
                      <td className="px-6 py-4 text-sm font-body text-foreground border-r border-border">
                        {feature}
                      </td>
                      {plans.map((plan) => (
                        <td key={`${plan.name}-${feature}`} className="px-6 py-4 text-center border-r border-border last:border-r-0">
                          <Check size={20} className="mx-auto text-green-500" weight="bold" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* FAQ CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: myEase, delay: 0.4 }}
          className="text-center mt-20"
        >
          <p className="text-muted-foreground mb-6 font-body">
            Have questions? Check out our{' '}
            <motion.a
              href="#faq"
              whileHover={{ color: '#var(--primary)' }}
              className="text-primary hover:underline font-semibold"
            >
              FAQ
            </motion.a>
            {' '}or{' '}
            <motion.a
              href="#contact"
              whileHover={{ color: '#var(--primary)' }}
              className="text-primary hover:underline font-semibold"
            >
              contact us
            </motion.a>
          </p>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                window.location.hash = 'how-it-works';
              }
            }}
          >
            Get Started Free Today
            <ArrowRight size={20} weight="bold" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
