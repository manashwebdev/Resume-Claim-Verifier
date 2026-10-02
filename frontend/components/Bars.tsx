'use client';
import { motion } from 'framer-motion';
export function Bar({ value, tone = 'bg-violet-glow' }: { value: number; tone?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={value}>
      <motion.div className={`h-full rounded-full ${tone}`} initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 60, damping: 18 }} />
    </div>
  );
}
export function Ring({ value }: { value: number }) {
  const c = 2 * Math.PI * 70;
  return (
    <div className="relative grid h-48 w-48 place-items-center rounded-full shadow-glow">
      <svg viewBox="0 0 160 160" className="absolute inset-0 -rotate-90">
        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8" />
        <motion.circle cx="80" cy="80" r="70" fill="none" stroke="#8B5CF6" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1.6, ease: 'easeOut' }} />
      </svg>
      <div className="text-center"><div className="text-5xl font-bold tracking-tight">{value}%</div><div className="text-xs text-sub">Resume Trust Score</div></div>
    </div>
  );
}
