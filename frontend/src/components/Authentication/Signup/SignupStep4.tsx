import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  LockKey,
} from '@phosphor-icons/react';

interface SignupStep4Props {
  planName: string;
  planPrice: number;
  planSubscriptions: number;
  isLoading: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

const SignupStep4: React.FC<SignupStep4Props> = ({
  planName,
  planPrice,
  planSubscriptions,
  isLoading,
  onSubmit,
  onBack,
}) => {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-4 w-full"
    >
      <div className="text-center mb-4">
        <h3 className="text-xl font-display font-bold text-foreground mb-1">
          Confirm Payment
        </h3>
        <p className="text-muted-foreground text-sm">
          Demo payment gateway (test mode)
        </p>
      </div>

      {/* Order Summary */}
      <div className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-foreground font-medium text-sm">Plan</span>
          <span className="text-foreground font-bold text-sm">{planName}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between">
          <span className="text-foreground font-medium text-sm">Subscriptions</span>
          <span className="text-foreground font-bold text-sm">
            {planSubscriptions === 999 ? 'Unlimited' : planSubscriptions}
          </span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between pt-2">
          <span className="text-foreground font-bold text-base">Total Cost</span>
          {planPrice > 0 ? (
            <span className="text-primary font-display font-bold text-2xl">
              ₹{planPrice.toLocaleString('en-IN')}
            </span>
          ) : (
            <span className="text-green-500 font-display font-bold text-2xl">
              Free
            </span>
          )}
        </div>
      </div>

      {/* Demo Payment Method */}
      {planPrice > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Demo Card Details</h4>
          
          {/* Card Display */}
          <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm">Card Number</span>
              <CreditCard size={20} weight="fill" />
            </div>
            <div className="text-lg tracking-widest font-mono mb-3">
              4242 4242 4242 4242
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Any Name</span>
              <span>12/25</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Demo Mode: This is a test payment. No real charge will be made.
          </p>
        </div>
      ) : (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <p className="text-sm font-semibold text-green-600 text-center">
            ✓ No payment required for Free plan
          </p>
        </div>
      )}

      {/* Security Info */}
      <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <LockKey size={16} className="text-green-500 flex-shrink-0" weight="bold" />
        <p className="text-xs text-green-600 font-medium">
          {planPrice > 0 ? 'Secure test environment' : 'Your account is secure'}
        </p>
      </div>

      {/* Money Back Guarantee */}
      {planPrice > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <CheckCircle size={16} className="text-blue-600 flex-shrink-0" weight="bold" />
          <p className="text-xs text-blue-600 font-medium">
            30-day money-back guarantee
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
        >
          <ArrowLeft size={16} weight="bold" />
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
              />
              Processing...
            </>
          ) : (
            <>
              {planPrice > 0 ? 'Complete Payment' : 'Complete Sign Up'}
              <CheckCircle size={16} weight="bold" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default SignupStep4;