import React, { useState, useEffect } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { cubicBezier } from 'motion';
import {
  Star,
  ArrowLeft,
  ArrowRight,
  Quotes,
  CaretRight,
  CaretLeft,
} from '@phosphor-icons/react';

const myEase = cubicBezier(0.42, 0, 0.58, 1);

const Testimonial: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Freelancer',
      company: 'Creative Agency',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      content:
        'SubSync helped me discover I was paying for 5 subscriptions I completely forgot about. Now I save $120 every month!',
      rating: 5,
      savings: '$120/month',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Software Engineer',
      company: 'Tech Startup',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      content:
        'The analytics dashboard is incredible. I can see exactly where my money goes and plan my budget accordingly. Highly recommended!',
      rating: 5,
      savings: '$180/month',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Marketing Manager',
      company: 'E-commerce Co',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      content:
        'Managing my family subscriptions across 6 people was a nightmare. SubSync makes it so simple and transparent.',
      rating: 5,
      savings: '$320/month',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 4,
      name: 'David Park',
      role: 'Business Owner',
      company: 'Consulting Firm',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      content:
        'The smart reminders before renewal dates have saved me from unexpected charges. Best $5/month I spend.',
      rating: 5,
      savings: '$95/month',
      color: 'from-violet-500 to-fuchsia-500',
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      role: 'Student',
      company: 'University',
      image: 'https://images.unsplash.com/photo-1517070213202-1ebbab92a666?w=100&h=100&fit=crop',
      content:
        'Free plan is perfect for students like me. I can track my Netflix and Spotify subscriptions without spending extra.',
      rating: 5,
      savings: '$0/month',
      color: 'from-violet-400 to-purple-500',
    },
    {
      id: 6,
      name: 'Robert Williams',
      role: 'Product Manager',
      company: 'Fortune 500',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      content:
        'The AI recommendations actually work. It suggested canceling services I didn\'t realize I had. This app is a game-changer.',
      rating: 5,
      savings: '$250/month',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  const stats = [
    { label: 'Happy Customers', value: '50,000+' },
    { label: 'Avg. Monthly Savings', value: '$180' },
    { label: 'Subscriptions Tracked', value: '500K+' },
    { label: 'App Rating', value: '4.9 ⭐' },
  ];

  const nextSlide = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setAutoplay(false);
  };

  const prevSlide = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoplay(false);
  };

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section className="relative w-full bg-transparent py-24 lg:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,var(--primary)/8,transparent)]" />
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
            <Star size={16} className="text-primary" weight="fill" />
            <span className="text-sm font-semibold text-primary">Loved by Users</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
            Real Stories from{' '}
            <span className="bg-gradient-to-r from-primary via-chart-3 to-chart-1 bg-clip-text text-transparent">
              Real Users
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
            See how thousands of people are taking control of their subscriptions and saving money.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-card/50 border border-border rounded-2xl text-center hover:border-primary/30 transition-all"
            >
              <motion.p
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                className="text-3xl lg:text-4xl font-display font-bold text-primary mb-2"
              >
                {stat.value}
              </motion.p>
              <p className="text-sm text-muted-foreground font-body">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Main carousel container */}
          <div
            className="relative h-auto overflow-hidden rounded-3xl"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                }}
                className="w-full"
              >
                {/* Testimonial Card */}
                <div className="relative bg-gradient-to-br from-card to-card/50 border border-border rounded-3xl p-8 lg:p-12 overflow-hidden">
                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${testimonials[activeIndex].color} opacity-10 rounded-full blur-[100px]`} />

                  {/* Grid pattern */}
                  <div 
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                      backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                      backgroundSize: '60px 60px',
                    }}
                  />

                  <div className="relative z-10">
                    {/* Quote icon */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center mb-6 shadow-lg shadow-primary/30"
                    >
                      <Quotes size={24} className="text-white" weight="fill" />
                    </motion.div>

                    {/* Stars */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex gap-1 mb-6"
                    >
                      {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                        >
                          <Star size={20} className="text-violet-300" weight="fill" />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Testimonial text */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl lg:text-2xl font-display font-bold text-foreground mb-8 leading-relaxed"
                    >
                      "{testimonials[activeIndex].content}"
                    </motion.p>

                    {/* Author info & savings */}
                    <div className="flex items-center justify-between">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-4"
                      >
                        {/* Avatar */}
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonials[activeIndex].color} flex items-center justify-center shadow-lg overflow-hidden`}>
                          <img
                            src={testimonials[activeIndex].image}
                            alt={testimonials[activeIndex].name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonials[activeIndex].name}`;
                            }}
                          />
                        </div>

                        {/* Name and role */}
                        <div>
                          <p className="font-display font-bold text-foreground">
                            {testimonials[activeIndex].name}
                          </p>
                          <p className="text-sm text-muted-foreground font-body">
                            {testimonials[activeIndex].role} • {testimonials[activeIndex].company}
                          </p>
                        </div>
                      </motion.div>

                      {/* Savings badge */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl"
                      >
                        <span className="text-sm font-bold text-green-500">
                          Saves {testimonials[activeIndex].savings}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1);
                    setActiveIndex(index);
                    setAutoplay(false);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'bg-primary w-8'
                      : 'bg-border w-2 hover:bg-primary/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Arrow buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={prevSlide}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground hover:border-primary hover:bg-secondary/80 transition-all"
              >
                <CaretLeft size={20} weight="bold" />
              </motion.button>
              <motion.button
                onClick={nextSlide}
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <CaretRight size={20} weight="bold" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Featured in section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground text-sm uppercase tracking-wider mb-8 font-body">
            Featured in
          </p>
          <div className="flex justify-center items-center gap-8 lg:gap-12 flex-wrap">
            {['TechCrunch', 'ProductHunt', 'Forbes', 'Wired'].map((publication, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-muted-foreground font-display font-bold text-lg hover:text-primary transition-colors cursor-default"
              >
                {publication}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-4">
            Join thousands saving money every month
          </h3>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            Start Your Free Account
            <ArrowRight size={20} weight="bold" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
