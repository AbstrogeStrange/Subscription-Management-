import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeOpen, User, Phone, Lock, Eye, EyeSlash, ArrowRight } from '@phosphor-icons/react';

interface SignupStep1Props {
  formData: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  };
  errors: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowPassword: (show: boolean) => void;
  onShowConfirmPassword: (show: boolean) => void;
  onNext: () => void;
}

const SignupStep1: React.FC<SignupStep1Props> = ({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  onInputChange,
  onShowPassword,
  onShowConfirmPassword,
  onNext,
}) => {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-5 w-full"
    >
      {/* Full Name Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Full Name</label>
        <div className="relative">
          <User
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            weight="bold"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="John Doe"
            className={`w-full pl-10 pr-4 py-3 bg-secondary border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors ${
              errors.name ? 'border-red-500/50' : 'border-border'
            }`}
          />
        </div>
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-red-500 font-medium"
            >
              {errors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Email Address</label>
        <div className="relative">
          <EnvelopeOpen
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            weight="bold"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="john@example.com"
            className={`w-full pl-10 pr-4 py-3 bg-secondary border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors ${
              errors.email ? 'border-red-500/50' : 'border-border'
            }`}
          />
        </div>
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-red-500 font-medium"
            >
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Phone Number Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Phone Number</label>
        <div className="relative">
          <Phone
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            weight="bold"
          />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onInputChange}
            placeholder="9876543210"
            className={`w-full pl-10 pr-4 py-3 bg-secondary border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors ${
              errors.phoneNumber ? 'border-red-500/50' : 'border-border'
            }`}
          />
        </div>
        <AnimatePresence>
          {errors.phoneNumber && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-red-500 font-medium"
            >
              {errors.phoneNumber}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Password</label>
        <div className="relative">
          <Lock
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            weight="bold"
          />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={onInputChange}
            placeholder="••••••••"
            className={`w-full pl-10 pr-12 py-3 bg-secondary border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors ${
              errors.password ? 'border-red-500/50' : 'border-border'
            }`}
          />
          <button
            type="button"
            onClick={() => onShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeSlash size={20} weight="bold" />
            ) : (
              <Eye size={20} weight="bold" />
            )}
          </button>
        </div>
        <AnimatePresence>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-red-500 font-medium"
            >
              {errors.password}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Confirm Password</label>
        <div className="relative">
          <Lock
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            weight="bold"
          />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onInputChange}
            placeholder="••••••••"
            className={`w-full pl-10 pr-12 py-3 bg-secondary border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors ${
              errors.confirmPassword ? 'border-red-500/50' : 'border-border'
            }`}
          />
          <button
            type="button"
            onClick={() => onShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {showConfirmPassword ? (
              <EyeSlash size={20} weight="bold" />
            ) : (
              <Eye size={20} weight="bold" />
            )}
          </button>
        </div>
        <AnimatePresence>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-red-500 font-medium"
            >
              {errors.confirmPassword}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        type="button"
        className="w-full mt-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        Continue
        <ArrowRight size={18} weight="bold" />
      </button>
    </motion.div>
  );
};

export default SignupStep1;