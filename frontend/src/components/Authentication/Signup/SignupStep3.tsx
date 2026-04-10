import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Gift, Lightning, Crown } from '@phosphor-icons/react';

interface Plan {
  id: string;
  name: string;
  price: number;
  subscriptions: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
  badge?: string;
}

interface SignupStep3Props {
  selectedPlan: string;
  onSelectPlan: (planId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    subscriptions: 3,
    description: 'Get started for free',
    badge: 'Get Started',
    icon: <Gift size={28} weight="bold" />,
    features: [
      'Track up to 3 subscriptions',
      'Basic dashboard',
      'Email reminders',
      'Community support',
      '7-day free trial',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 3000,
    subscriptions: 5,
    description: 'Perfect for regular users',
    badge: 'Popular',
    isPopular: true,
    icon: <Lightning size={28} weight="bold" />,
    features: [
      'Track up to 5 subscriptions',
      'Advanced dashboard',
      'Smart reminders',
      'Priority support',
      'Export data (CSV)',
      'Custom alerts',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 7000,
    subscriptions: 999,
    description: 'For power users',
    badge: 'Best Value',
    icon: <Crown size={28} weight="bold" />,
    features: [
      'Unlimited subscriptions',
      'Premium analytics',
      'AI recommendations',
      '24/7 Priority support',
      'Export reports (PDF/CSV)',
      'API access',
      'Ad-free experience',
    ],
  },
];

const SignupStep3: React.FC<SignupStep3Props> = ({
  selectedPlan,
  onSelectPlan,
  onNext,
  onBack,
}) => {
  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6 w-full"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-display font-bold text-foreground">
          Choose Your Plan
        </h3>
        <p className="text-muted-foreground text-sm">
          Select a plan that fits your needs
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-4 w-full">
        {plans.map((plan, index) => (
          <motion.button
            key={plan.id}
            type="button"
            onClick={() => onSelectPlan(plan.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-5 rounded-2xl border-2 transition-all text-left overflow-visible group ${
              selectedPlan === plan.id
                ? 'border-primary bg-gradient-to-br from-primary/15 to-primary/5 shadow-lg shadow-primary/25'
                : 'border-border hover:border-primary/50 bg-card/30 hover:bg-card/50'
            }`}
          >
            {/* Animated background */}
            <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 rounded-2xl ${
              selectedPlan === plan.id ? 'opacity-100' : ''
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-2xl" />
            </div>

            {/* Badge - Fixed positioning */}
            {plan.badge && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`absolute -top-2 right-3 px-3 py-1 text-xs font-bold rounded-full shadow-lg whitespace-nowrap ${
                  plan.isPopular
                    ? 'bg-gradient-to-r from-primary via-chart-3 to-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {plan.badge}
              </motion.div>
            )}

            <div className="relative z-10 space-y-3">
              {/* Plan Header */}
              <div className="flex items-start justify-between gap-3 pt-2">
                <div className="flex items-start gap-3 flex-1">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl flex-shrink-0 transition-colors ${
                    selectedPlan === plan.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    {plan.icon}
                  </div>

                  {/* Title and Description */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-display font-bold text-foreground">
                      {plan.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                </div>

                {/* Radio Button */}
                <motion.div
                  animate={{
                    scale: selectedPlan === plan.id ? 1 : 0.8,
                    backgroundColor: selectedPlan === plan.id ? 'var(--primary)' : 'transparent',
                  }}
                  className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  {selectedPlan === plan.id && (
                    <Check size={14} className="text-primary-foreground" weight="bold" />
                  )}
                </motion.div>
              </div>

              {/* Price and Subscription Limit */}
              <div className="pt-2 border-t border-border/30 space-y-2">
                {/* Price */}
                <div>
                  {plan.price > 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-display font-bold text-primary">
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        one-time payment
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-2xl font-display font-bold text-green-500">
                        Free
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        forever free
                      </span>
                    </div>
                  )}
                </div>

                {/* Subscription Limit */}
                <div>
                  <p className="text-sm font-bold text-primary">
                    {plan.subscriptions === 999 ? '∞' : plan.subscriptions} subscriptions
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Track {plan.subscriptions === 999 ? 'unlimited' : `up to ${plan.subscriptions}`} subscription accounts
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1.5 pt-2">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + featureIndex * 0.04 }}
                    className="flex items-start gap-2"
                  >
                    <Check
                      size={14}
                      className={`mt-0.5 flex-shrink-0 ${
                        selectedPlan === plan.id ? 'text-primary' : 'text-muted-foreground'
                      }`}
                      weight="bold"
                    />
                    <span className="text-xs text-foreground leading-snug">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Text */}
              {selectedPlan === plan.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 bg-primary/10 border border-primary/20 rounded-lg mt-2"
                >
                  <p className="text-xs font-semibold text-primary">
                    ✓ Selected
                  </p>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <ArrowLeft size={18} weight="bold" />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
        >
          {selectedPlanData?.price === 0 ? 'Continue Free' : 'Proceed to Payment'}
          <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </motion.div>
  );
};

export default SignupStep3;