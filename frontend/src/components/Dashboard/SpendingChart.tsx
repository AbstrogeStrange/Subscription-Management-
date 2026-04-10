import React from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface SpendingChartProps {
  data: { month: string; amount: number }[];
}

const allocations = [
  { label: 'Entertainment', value: 42, color: '#a855f7' },
  { label: 'Productivity', value: 33, color: '#818cf8' },
  { label: 'Cloud & utility', value: 25, color: '#ec4899' },
];

const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const latest = data[data.length - 1]?.amount ?? 0;
  const donutStops = allocations.map((item, index) => {
    const start = allocations.slice(0, index).reduce((sum, current) => sum + current.value, 0);
    const end = start + item.value;
    return `${item.color} ${start}% ${end}%`;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6 lg:p-7"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
            Performance overview
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Monthly Spending</h3>
          <p className="mt-1 text-sm text-white/46">
            Your premium dashboard view across the last six months.
          </p>
        </div>
        <select className="glass-card rounded-2xl border-white/10 px-4 py-2.5 text-sm text-white/76 focus:outline-none focus:border-violet-300/35">
          <option>Last 6 months</option>
          <option>Last year</option>
          <option>All time</option>
        </select>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.03)_100%)] p-4 lg:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/42">Current monthly spend</p>
              <p className="mt-1 text-3xl font-display font-bold tracking-[-0.05em] text-white">
                Rs {latest.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="rounded-full border border-emerald-300/10 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Stable
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="spendingFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity={0.44} />
                    <stop offset="55%" stopColor="#8b5cf6" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.38)', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(18, 14, 34, 0.92)',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`Rs ${value.toLocaleString('en-IN')}`, 'Spend']}
                  labelStyle={{ color: 'rgba(255,255,255,0.55)' }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#c084fc"
                  strokeWidth={3}
                  fill="url(#spendingFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.03)_100%)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/34">
              Spend allocation
            </p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="relative flex h-36 w-36 items-center justify-center">
                <div
                  className="h-32 w-32 rounded-full"
                  style={{ background: `conic-gradient(${donutStops.join(', ')})` }}
                />
                <div className="absolute flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-[#120d20]/90 text-center">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/32">Total</p>
                    <p className="text-sm font-semibold text-white">{allocations.length} tiers</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {allocations.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-white/38">{item.value}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.03)_100%)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/34">
              Six month volume
            </p>
            <p className="mt-3 text-3xl font-display font-bold tracking-[-0.05em] text-white">
              Rs {total.toLocaleString('en-IN')}
            </p>
            <p className="mt-2 text-sm text-white/42">
              Your billing pattern is concentrated in streaming and productivity tools, with an October peak.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpendingChart;
