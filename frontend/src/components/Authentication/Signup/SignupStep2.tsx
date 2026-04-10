import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, ArrowLeft } from '@phosphor-icons/react';

interface SignupStep2Props {
  formData: {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  errors: {
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SignupStep2: React.FC<SignupStep2Props> = ({
  formData,
  errors,
  onInputChange,
  onNext,
  onBack,
}) => {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-5 w-full"
    >
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={24} className="text-primary" weight="bold" />
        <h3 className="text-lg font-display font-bold text-foreground">
          Billing Address
        </h3>
      </div>

      {/* Street Address */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Street Address</label>
        <input
          type="text"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={onInputChange}
          placeholder="123 Main Street"
          className={`w-full px-4 py-3 bg-secondary border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors ${
            errors.streetAddress ? 'border-red-500/50' : 'border-border'
          }`}
        />
        <AnimatePresence>
          {errors.streetAddress && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-red-500 font-medium"
            >
              {errors.streetAddress}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* City and State */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onInputChange}
            placeholder="Mumbai"
            className={`w-full px-4 py-3 bg-secondary border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors ${
              errors.city ? 'border-red-500/50' : 'border-border'
            }`}
          />
          <AnimatePresence>
            {errors.city && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-red-500 font-medium"
              >
                {errors.city}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={onInputChange}
            placeholder="Maharashtra"
            className={`w-full px-4 py-3 bg-secondary border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors ${
              errors.state ? 'border-red-500/50' : 'border-border'
            }`}
          />
          <AnimatePresence>
            {errors.state && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-red-500 font-medium"
              >
                {errors.state}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Postal Code and Country */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={onInputChange}
            placeholder="400001"
            className={`w-full px-4 py-3 bg-secondary border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors ${
              errors.postalCode ? 'border-red-500/50' : 'border-border'
            }`}
          />
          <AnimatePresence>
            {errors.postalCode && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-red-500 font-medium"
              >
                {errors.postalCode}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            disabled
            className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground cursor-not-allowed opacity-50"
          />
        </div>
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
          Continue
          <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </motion.div>
  );
};

export default SignupStep2;