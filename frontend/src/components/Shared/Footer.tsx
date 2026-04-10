import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cubicBezier } from 'motion';
import {
  TwitterLogo,
  LinkedinLogo,
  GithubLogo,
  FacebookLogo,
  InstagramLogo,
  ArrowRight,
  PaperPlaneTilt,
  Phone,
  MapPin,
  EnvelopeOpen,
  Heart,
} from '@phosphor-icons/react';
import BrandLogo from './BrandLogo';

const myEase = cubicBezier(0.42, 0, 0.58, 1);

const Footer: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: myEase },
    },
  };

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Security', href: '#security' },
        { name: 'Updates', href: '#updates' },
        { name: 'Roadmap', href: '#roadmap' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#about' },
        { name: 'Blog', href: '#blog' },
        { name: 'Careers', href: '#careers' },
        { name: 'Press', href: '#press' },
        { name: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#docs' },
        { name: 'API Reference', href: '#api' },
        { name: 'Community', href: '#community' },
        { name: 'Support', href: '#support' },
        { name: 'FAQ', href: '#faq' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Terms of Service', href: '#terms' },
        { name: 'Cookie Policy', href: '#cookies' },
        { name: 'Compliance', href: '#compliance' },
        { name: 'Sitemap', href: '#sitemap' },
      ],
    },
  ];

  const socialLinks = [
    { icon: TwitterLogo, label: 'Twitter', href: '#twitter' },
    { icon: LinkedinLogo, label: 'LinkedIn', href: '#linkedin' },
    { icon: FacebookLogo, label: 'Facebook', href: '#facebook' },
    { icon: InstagramLogo, label: 'Instagram', href: '#instagram' },
    { icon: GithubLogo, label: 'GitHub', href: '#github' },
  ];

  const contactInfo = [
    { icon: MapPin, label: 'Address', value: '123 Tech Street, San Francisco, CA 94105' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: EnvelopeOpen, label: 'Email', value: 'hello@subsync.com' },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative w-full bg-transparent border-t border-white/10 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,var(--primary)/5,transparent)]" />
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
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20 grid lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <BrandLogo size={42} />
            </motion.div>

            <p className="text-sm text-muted-foreground font-body mb-8 leading-relaxed">
              Take control of your subscriptions. Save money. Stay organized.
            </p>

            {/* Newsletter signup */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                Subscribe to updates
              </p>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  disabled={isSubscribed}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  <PaperPlaneTilt size={16} weight="fill" />
                </motion.button>
              </div>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={isSubscribed ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs text-green-500 font-medium py-2">
                  ✓ Thanks for subscribing!
                </p>
              </motion.div>
            </form>
          </motion.div>

          {/* Links Sections */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {footerLinks.map((section, index) => (
              <motion.div key={index} variants={itemVariants}>
                <h3 className="text-sm font-display font-bold text-foreground uppercase tracking-wide mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={linkIndex}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground font-body hover:text-primary transition-colors relative group"
                      >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h3 className="text-sm font-display font-bold text-foreground uppercase tracking-wide mb-6">
              Get in touch
            </h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                    <info.icon size={18} className="text-primary" weight="fill" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {info.label}
                    </p>
                    <p className="text-sm text-foreground font-medium break-all">
                      {info.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-border via-border/50 to-border" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-8 flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          {/* Copyright */}
          <div className="text-center lg:text-left">
            <p className="text-sm text-muted-foreground font-body">
              © 2024 SubSync. All rights reserved. Made with{' '}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 1 }}
                className="inline-block"
              >
                <Heart size={14} className="inline text-red-500" weight="fill" />
              </motion.span>
              {' '}for subscription lovers.
            </p>
          </div>

          {/* Social Links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-secondary/80 transition-all"
                >
                  <Icon size={18} weight="bold" />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <motion.a
              href="#status"
              whileHover={{ color: '#var(--primary)' }}
              className="hover:text-primary transition-colors"
            >
              Status
            </motion.a>
            <div className="w-px h-4 bg-border" />
            <motion.a
              href="#changelog"
              whileHover={{ color: '#var(--primary)' }}
              className="hover:text-primary transition-colors"
            >
              Changelog
            </motion.a>
            <div className="w-px h-4 bg-border" />
            <motion.a
              href="#accessibility"
              whileHover={{ color: '#var(--primary)' }}
              className="hover:text-primary transition-colors"
            >
              Accessibility
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
