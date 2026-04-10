import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cubicBezier } from 'motion';
import {
  ArrowRight,
  Bell,
  ChartLineUp,
  CreditCard,
  Lightning,
  Play,
  Sparkle,
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const myEase = cubicBezier(0.22, 1, 0.36, 1);

const heroStats = [
  { value: '52K+', label: 'active members' },
  { value: '$2.8M', label: 'tracked monthly' },
  { value: '31%', label: 'average savings' },
];

const floatingCards = [
  {
    title: 'Smart reminder',
    body: 'Netflix renews in 3 days',
    icon: Bell,
    position: 'left-2 top-8 lg:-left-10 lg:top-12',
  },
  {
    title: 'Spending spike',
    body: 'Entertainment rose 14%',
    icon: ChartLineUp,
    position: 'right-2 top-6 lg:-right-12 lg:top-16',
  },
  {
    title: 'New insight',
    body: 'Bundle annual plans to save more',
    icon: Sparkle,
    position: 'left-4 bottom-8 lg:-left-12 lg:bottom-20',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: myEase },
  },
};

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-screen overflow-hidden bg-transparent text-white">

      <motion.div
        animate={{ opacity: [0.45, 0.72, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-24 top-24 h-[360px] w-[360px] rounded-full bg-[#9b5cff]/20 blur-[120px]"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[-120px] top-[-40px] h-[440px] w-[440px] rounded-full bg-[#d9a8ff]/18 blur-[140px]"
      />
      <motion.div
        animate={{ opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-x-0 bottom-[-140px] mx-auto h-[320px] w-[86%] rounded-full bg-[#7a38ff]/18 blur-[130px]"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-[18%] h-[34%]">
        <div className="absolute inset-x-[4%] bottom-0 h-full rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(177,105,255,0.22)_0%,rgba(132,65,255,0.12)_30%,rgba(45,14,97,0.04)_54%,transparent_72%)] blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 pb-16 pt-28 lg:px-12 lg:pt-32">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-xl"
            >
              <span className="h-2 w-2 rounded-full bg-[#d7a8ff] shadow-[0_0_14px_rgba(215,168,255,0.95)]" />
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
                Subscription intelligence
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-7 text-5xl font-display font-bold leading-[0.96] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl"
            >
              Own the chaos
              <span className="block bg-[linear-gradient(180deg,#ffffff_0%,#efdcff_45%,#c88dff_100%)] bg-clip-text text-transparent">
                behind every renewal
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-base leading-8 text-white/68 sm:text-lg"
            >
              A cinematic dashboard for tracking subscriptions, surfacing hidden costs,
              and receiving smart reminders before charges hit. Built with motion,
              glassmorphism, and a dark violet atmosphere.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <motion.button
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#b46bff_0%,#7a38ff_100%)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(122,56,255,0.35)] transition-shadow hover:shadow-[0_22px_65px_rgba(122,56,255,0.45)]"
              >
                Start free
                <ArrowRight size={18} weight="bold" />
              </motion.button>
              <motion.button
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.location.hash = 'how-it-works';
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/[0.06] px-6 py-4 text-sm font-semibold text-white/86 backdrop-blur-xl transition-colors hover:bg-white/[0.1]"
              >
                <Play size={18} weight="fill" />
                Explore flow
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-2xl"
                >
                  <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/46">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: myEase }}
            className="relative mx-auto w-full max-w-[560px]"
          >
            {floatingCards.map((card, index) => (
              <motion.div
                key={card.title}
                animate={{ y: [-6, 8, -6] }}
                transition={{
                  duration: 6 + index,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.5,
                }}
                className={`absolute z-20 hidden w-52 rounded-2xl border border-white/12 bg-white/[0.08] p-4 backdrop-blur-2xl lg:block ${card.position}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#e4c2ff]">
                    <card.icon size={18} weight="fill" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{card.title}</p>
                    <p className="mt-1 text-xs leading-5 text-white/58">{card.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [-0.7, 0.7, -0.7] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="relative rounded-[34px] border border-white/12 bg-white/[0.07] p-4 shadow-[0_30px_100px_rgba(7,2,20,0.55)] backdrop-blur-3xl"
            >
              <div className="absolute inset-0 rounded-[34px] bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.02)_40%,rgba(180,107,255,0.05)_100%)]" />
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,7,30,0.95)_0%,rgba(8,4,20,0.92)_100%)] p-6">
                <div className="absolute inset-x-10 top-0 h-24 rounded-full bg-[#d7a8ff]/10 blur-3xl" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/42">SubSync</p>
                    <h3 className="mt-2 text-2xl font-display font-bold text-white">
                      Visual spending pulse
                    </h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] text-[#dbb3ff]">
                    <Lightning size={20} weight="fill" />
                  </div>
                </div>

                <div className="mt-8 rounded-[26px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/50">Active monthly total</p>
                      <p className="mt-2 text-4xl font-display font-bold tracking-[-0.04em] text-white">
                        $284.50
                      </p>
                    </div>
                    <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                      down 12%
                    </div>
                  </div>

                  <div className="mt-8 flex h-32 items-end gap-2">
                    {[34, 48, 42, 68, 58, 76, 88, 72, 96, 82, 64, 74].map((height, index) => (
                      <motion.div
                        key={height + index}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: `${height}%`, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.6, ease: myEase }}
                        className={`flex-1 rounded-t-full ${
                          index > 7
                            ? 'bg-[linear-gradient(180deg,#f1d8ff_0%,#b46bff_48%,#5d2bcd_100%)] shadow-[0_0_24px_rgba(180,107,255,0.28)]'
                            : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(176,108,255,0.28)_55%,rgba(96,44,204,0.18)_100%)]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-2xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#cb8bff_0%,#7b3cff_100%)] text-white">
                        <CreditCard size={18} weight="fill" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Top category</p>
                        <p className="text-xs text-white/52">Entertainment stack</p>
                      </div>
                    </div>
                    <p className="mt-4 text-2xl font-display font-bold text-white">$74.00</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-2xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#dcaeff]">
                        <Sparkle size={18} weight="fill" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Recommendation</p>
                        <p className="text-xs text-white/52">Bundle annual billing</p>
                      </div>
                    </div>
                    <p className="mt-4 text-2xl font-display font-bold text-white">Save $119</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
