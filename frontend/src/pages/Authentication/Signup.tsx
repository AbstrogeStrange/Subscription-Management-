import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { cubicBezier } from 'motion';
import {
  CheckCircle,
  WarningCircle,
} from '@phosphor-icons/react';
import SignupStep1 from '../../components/Authentication/Signup/SignupStep1';
import SignupStep2 from '../../components/Authentication/Signup/SignupStep2';
import SignupStep3 from '../../components/Authentication/Signup/SignupStep3';
import SignupStep4 from '../../components/Authentication/Signup/SignupStep4';
import { authApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/Shared/BrandLogo';

const myEase = cubicBezier(0.42, 0, 0.58, 1);

// Plan details constant
const PLAN_DETAILS = {
  free: { name: 'Free', price: 0, subscriptions: 3 },
  basic: { name: 'Basic', price: 3000, subscriptions: 5 },
  premium: { name: 'Premium', price: 7000, subscriptions: 999 },
};

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [billingData, setBillingData] = useState({
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [billingErrors, setBillingErrors] = useState({
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [selectedPlan, setSelectedPlan] = useState('free');

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: myEase },
    },
  };

  // Validation functions
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({ ...prev, [name]: value }));
    if (billingErrors[name as keyof typeof billingErrors]) {
      setBillingErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    let valid = true;
    const newErrors = { ...formErrors };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      valid = false;
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const validateStep2 = (): boolean => {
    let valid = true;
    const newErrors = { ...billingErrors };

    if (!billingData.streetAddress.trim() || billingData.streetAddress.length < 5) {
      newErrors.streetAddress = 'Please enter a valid street address';
      valid = false;
    }

    if (!billingData.city.trim() || billingData.city.length < 2) {
      newErrors.city = 'Please enter a valid city';
      valid = false;
    }

    if (!billingData.state.trim() || billingData.state.length < 2) {
      newErrors.state = 'Please enter a valid state';
      valid = false;
    }

    if (!/^\d{6}$/.test(billingData.postalCode)) {
      newErrors.postalCode = 'Postal code must be exactly 6 digits';
      valid = false;
    }

    setBillingErrors(newErrors);
    return valid;
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      setError('');
      setCurrentStep(2);
    }
  };

  const handleStep2Next = () => {
    if (validateStep2()) {
      setError('');
      setCurrentStep(3);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSignupSubmit = async () => {
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Call the API to register user
      const response = await authApi.register({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        plan: selectedPlan,
      });

      console.log('Registration response:', response);

      // Access token from response
      const token = response.data?.data?.token || response.data?.token;
      const userData = response.data?.data?.user || response.data?.user;

      if (token && userData) {
        // Update AuthContext
        login(token, {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          plan: userData.plan,
        });

        // Save billing address
        try {
          await authApi.addBillingAddress(billingData);
        } catch (err) {
          console.error('Error saving billing address:', err);
          // Don't fail the signup if billing address fails to save
        }

        setSuccessMessage('Account created successfully! Redirecting to dashboard...');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Signup error:', err);

      let errorMessage = 'An error occurred during signup. Please try again.';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors
            .map((e: any) => e.message || JSON.stringify(e))
            .join(', ');
        } else if (typeof validationErrors === 'object') {
          errorMessage = Object.values(validationErrors)
            .map((e: any) => (typeof e === 'string' ? e : e.message))
            .join(', ');
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanDetails = (plan: string) => {
    return PLAN_DETAILS[plan as keyof typeof PLAN_DETAILS] || PLAN_DETAILS.free;
  };

  const currentPlanDetails = getPlanDetails(selectedPlan);

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-6 relative overflow-x-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/8,transparent)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-chart-1/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.01]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            staggerChildren: 0.1,
            delayChildren: 0.2,
          }}
          className="space-y-6"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-3"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block mb-4"
            >
              <div className="mx-auto">
                <BrandLogo size={52} showWordmark={false} />
              </div>
            </motion.div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground font-body text-sm">
              Step {currentStep} of 4 - Join thousands managing subscriptions smarter
            </p>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 inline-flex items-center justify-center px-4 py-2 border border-border text-foreground rounded-xl hover:bg-accent hover:border-accent transition-all text-sm font-semibold"
              onClick={() => navigate('/#how-it-works')}
            >
              Skip & Watch Demo
            </motion.button>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            variants={itemVariants}
            className="flex gap-2"
          >
            {[1, 2, 3, 4].map((step) => (
              <motion.div
                key={step}
                className={`flex-1 h-1 rounded-full transition-all ${
                  step <= currentStep
                    ? 'bg-primary'
                    : 'bg-border'
                }`}
                animate={{ scaleX: step <= currentStep ? 1 : 0.5 }}
              />
            ))}
          </motion.div>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <WarningCircle size={20} className="text-red-500 flex-shrink-0" weight="fill" />
                <p className="text-sm text-red-500 font-medium">{error}</p>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
              >
                <CheckCircle size={20} className="text-green-500 flex-shrink-0" weight="fill" />
                <p className="text-sm text-green-500 font-medium">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Container */}
          <motion.div 
            variants={itemVariants}
            className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl"
          >
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <SignupStep1
                  key="step-1"
                  formData={{
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                  }}
                  errors={formErrors}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  onInputChange={handleInputChange}
                  onShowPassword={setShowPassword}
                  onShowConfirmPassword={setShowConfirmPassword}
                  onNext={handleStep1Next}
                />
              )}

              {currentStep === 2 && (
                <SignupStep2
                  key="step-2"
                  formData={billingData}
                  errors={billingErrors}
                  onInputChange={handleBillingInputChange}
                  onNext={handleStep2Next}
                  onBack={handleBackStep}
                />
              )}

              {currentStep === 3 && (
                <SignupStep3
                  key="step-3"
                  selectedPlan={selectedPlan}
                  onSelectPlan={setSelectedPlan}
                  onNext={() => setCurrentStep(4)}
                  onBack={handleBackStep}
                />
              )}

              {currentStep === 4 && (
                <SignupStep4
                  key="step-4"
                  planName={currentPlanDetails.name}
                  planPrice={currentPlanDetails.price}
                  planSubscriptions={currentPlanDetails.subscriptions}
                  isLoading={isLoading}
                  onSubmit={handleSignupSubmit}
                  onBack={handleBackStep}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Login Link */}
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-muted-foreground"
          >
            Already have an account?{' '}
            <a
              href="/login"
              className="text-primary hover:underline font-semibold transition-colors"
            >
              Sign in
            </a>
          </motion.p>

          {/* Terms */}
          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-muted-foreground leading-relaxed"
          >
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
