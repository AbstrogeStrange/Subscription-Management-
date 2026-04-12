import React from 'react';
import { motion } from 'framer-motion';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
} from 'recharts';

interface SpendingChartPoint {
  month: string;
  amount: number;
  savings?: number;
}

interface AnimatedChartPoint {
  month: string;
  spending: number;
  savings: number;
}

interface SpendingChartProps {
  data: SpendingChartPoint[];
}

const sampleData: SpendingChartPoint[] = [
  { month: 'Jan', amount: 2280, savings: 340 },
  { month: 'Feb', amount: 2410, savings: 430 },
  { month: 'Mar', amount: 2360, savings: 390 },
  { month: 'Apr', amount: 2590, savings: 520 },
  { month: 'May', amount: 2510, savings: 610 },
  { month: 'Jun', amount: 2680, savings: 720 },
];

const formatCurrency = (value: number) => `Rs ${Math.round(value).toLocaleString('en-IN')}`;

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  const spending = payload.find((item) => item.dataKey === 'spending')?.value ?? 0;
  const savings = payload.find((item) => item.dataKey === 'savings')?.value ?? 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#110a20]/92 px-4 py-3 shadow-[0_18px_40px_rgba(18,8,40,0.42)] backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">{label}</p>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7c3aed] shadow-[0_0_12px_rgba(124,58,237,0.8)]" />
            <span className="text-sm text-white/68">Spending</span>
          </div>
          <span className="text-sm font-semibold text-white">{formatCurrency(Number(spending))}</span>
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ec4899] shadow-[0_0_12px_rgba(236,72,153,0.78)]" />
            <span className="text-sm text-white/68">Savings</span>
          </div>
          <span className="text-sm font-semibold text-white">{formatCurrency(Number(savings))}</span>
        </div>
      </div>
    </div>
  );
};

const GlowingDot = ({
  cx,
  cy,
  stroke,
}: {
  cx?: number;
  cy?: number;
  stroke?: string;
}) => {
  if (typeof cx !== 'number' || typeof cy !== 'number') {
    return null;
  }

  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={stroke} opacity={0.14} />
      <circle cx={cx} cy={cy} r={4.5} fill={stroke} stroke="#ffffff" strokeWidth={1.5} />
    </g>
  );
};

const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  const sourceData = React.useMemo(
    () => (data.length > 1 && data.some((item) => item.amount > 0) ? data : sampleData),
    [data]
  );

  const baseData = React.useMemo<AnimatedChartPoint[]>(
    () =>
      sourceData.map((item, index) => ({
        month: item.month,
        spending: Number(item.amount),
        savings:
          item.savings ??
          Math.max(
            0,
            Math.round(item.amount * 0.28 + Math.sin(index * 0.85 + 0.5) * 110 + 180)
          ),
      })),
    [sourceData]
  );

  const [animatedData, setAnimatedData] = React.useState<AnimatedChartPoint[]>(baseData);

  React.useEffect(() => {
    setAnimatedData(baseData);

    let frameId = 0;
    let startTime = 0;

    const animate = (timestamp: number) => {
      if (startTime === 0) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;

      setAnimatedData(
        baseData.map((point, index) => {
          const spendingWave = Math.sin(elapsed / 1800 + index * 0.72) * Math.max(point.spending * 0.022, 18);
          const savingsWave = Math.cos(elapsed / 2200 + index * 0.66) * Math.max(point.savings * 0.03, 14);

          return {
            ...point,
            spending: Math.max(0, point.spending + spendingWave),
            savings: Math.max(0, point.savings + savingsWave),
          };
        })
      );

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [baseData]);

  const totalSpending = baseData.reduce((sum, item) => sum + item.spending, 0);
  const totalSavings = baseData.reduce((sum, item) => sum + item.savings, 0);
  const latestPoint = animatedData[animatedData.length - 1];
  const savingsRate = totalSpending > 0 ? Math.round((totalSavings / totalSpending) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6 lg:p-7"
    >
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
            Performance overview
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Spending vs Savings</h3>
          <p className="mt-1 text-sm text-white/50">
            A premium dual-line view with slow flowing motion across the last six months.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/32">Current spend</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {formatCurrency(latestPoint?.spending ?? 0)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/32">Savings rate</p>
            <p className="mt-1 text-lg font-semibold text-violet-200">{savingsRate}%</p>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ y: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.04)] p-4 shadow-[0_18px_44px_rgba(79,38,143,0.18)] backdrop-blur-xl"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#7c3aed] shadow-[0_0_14px_rgba(124,58,237,0.84)]" />
              <span className="text-sm text-white/70">Spending</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ec4899] shadow-[0_0_14px_rgba(236,72,153,0.78)]" />
              <span className="text-sm text-white/70">Savings</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/32">Six month total</p>
            <p className="mt-1 text-base font-semibold text-white">
              {formatCurrency(totalSpending)} spend
              <span className="mx-2 text-white/22">/</span>
              <span className="text-violet-200">{formatCurrency(totalSavings)} saved</span>
            </p>
          </div>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={animatedData}
              margin={{ top: 10, right: 8, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSpending" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="55%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="colorSavings" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="60%" stopColor="#c026d3" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="fillSpending" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.24} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillSavings" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
                <filter id="glowSpending" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glowSavings" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 8"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.38)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={56}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
                tickFormatter={(value: number) => `₹${Math.round(value / 1000)}k`}
              />
              <Tooltip
                cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeDasharray: '4 6' }}
                content={<CustomTooltip />}
              />

              <Area
                type="monotone"
                dataKey="spending"
                stroke="none"
                fill="url(#fillSpending)"
                isAnimationActive={true}
                animationDuration={2600}
                animationEasing="ease-in-out"
              />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="none"
                fill="url(#fillSavings)"
                isAnimationActive={true}
                animationDuration={2800}
                animationEasing="ease-in-out"
              />

              <Line
                type="monotone"
                dataKey="spending"
                stroke="url(#colorSpending)"
                strokeWidth={8}
                strokeOpacity={0.12}
                dot={false}
                activeDot={false}
                filter="url(#glowSpending)"
                isAnimationActive={true}
                animationDuration={2600}
                animationEasing="ease-in-out"
              />
              <Line
                type="monotone"
                dataKey="spending"
                stroke="url(#colorSpending)"
                strokeWidth={3}
                dot={{ r: 0 }}
                activeDot={<GlowingDot stroke="#7c3aed" />}
                filter="url(#glowSpending)"
                isAnimationActive={true}
                animationDuration={2600}
                animationEasing="ease-in-out"
              />

              <Line
                type="monotone"
                dataKey="savings"
                stroke="url(#colorSavings)"
                strokeWidth={8}
                strokeOpacity={0.12}
                dot={false}
                activeDot={false}
                filter="url(#glowSavings)"
                isAnimationActive={true}
                animationDuration={2800}
                animationEasing="ease-in-out"
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="url(#colorSavings)"
                strokeWidth={3}
                dot={{ r: 0 }}
                activeDot={<GlowingDot stroke="#ec4899" />}
                filter="url(#glowSavings)"
                isAnimationActive={true}
                animationDuration={2800}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SpendingChart;
