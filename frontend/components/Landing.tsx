'use client';
import { motion } from 'framer-motion';
import { GitBranch, FileSearch, Sparkles, FileText, Layers, AlertTriangle } from 'lucide-react';
import { Bar } from './Bars';

const up = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const demo = [['React', 92, 'Strong Evidence', 'bg-ok'], ['Node.js', 80, 'Strong Evidence', 'bg-ok'], ['Docker', 20, 'Weak Evidence', 'bg-warn'], ['AWS', 3, 'No Evidence', 'bg-bad']] as const;
const features = [
  [FileSearch, 'Skill Verification', 'Check every resume claim against real work.'], [GitBranch, 'GitHub Evidence Mining', 'Reads repositories, topics and READMEs.'],
  [Sparkles, 'Evidence Scoring', 'Weighs how deeply a skill shows up in projects.'], [FileText, 'Trust Report', 'Recruiter-ready, printable summary.'],
  [Layers, 'Portfolio Insights', 'Surfaces your strongest skills.'], [AlertTriangle, 'Missing Evidence Detection', 'Flags claims with no proof.'],
] as const;
const steps = ['Upload resume', 'Connect GitHub', 'Extract skills', 'Analyze projects', 'Generate report'];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-32 lg:grid-cols-2">
      <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.12 }}>
        <motion.h1 variants={up} className="text-5xl font-bold tracking-tight sm:text-7xl">Can your resume prove it?</motion.h1>
        <motion.p variants={up} className="mt-6 max-w-md text-lg text-sub">Upload your resume and GitHub profile. See which claimed skills are backed by real projects.</motion.p>
        <motion.div variants={up} className="mt-8 flex flex-wrap gap-3">
          <a href="#analyze" className="rounded-xl bg-violet px-6 py-3 font-medium shadow-glow transition hover:-translate-y-0.5 hover:bg-violet-glow">Analyze resume</a>
          <a href="#demo" className="glass px-6 py-3 font-medium transition hover:-translate-y-0.5">View demo report</a>
        </motion.div>
      </motion.div>
      <div className="glass relative space-y-3 p-6 shadow-glow" aria-hidden>
        {['Resume skills', 'Verification engine', 'GitHub evidence', 'Trust score'].map((t, i) => (
          <motion.div key={t} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.35, type: 'spring' }}>
            <div className="rounded-xl border border-white/10 bg-card px-4 py-3 text-sm">{t}</div>
            {i < 3 && <motion.div className="mx-auto h-5 w-px bg-violet-glow" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.8 + i * 0.35 }} />}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Problem() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold tracking-tight">Recruiters can't check every claim</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[['Docker', 'No Docker project found.', 'text-bad'], ['React', 'Found in 5 repositories.', 'text-ok']].map(([c, r, t]) => (
          <motion.div key={c} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass p-6">
            <p className="text-sm text-muted">Claim</p><p className="text-xl font-semibold">{c}</p>
            <p className="mt-4 text-sm text-muted">Reality</p><p className={t}>{r}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold tracking-tight">Evidence, not adjectives</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(([Icon, t, d]) => (
          <motion.div key={t} whileHover={{ y: -4 }} className="glass p-6 transition hover:border-violet-glow/50">
            <Icon className="h-5 w-5 text-violet-glow" /><h3 className="mt-4 font-semibold">{t}</h3><p className="mt-1 text-sm text-sub">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
      <ol className="mt-8 space-y-6 border-l border-white/10 pl-8">
        {steps.map((s, i) => (
          <motion.li key={s} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="relative">
            <span className="absolute -left-[41px] grid h-5 w-5 place-items-center rounded-full bg-violet text-[11px] shadow-glow">{i + 1}</span>{s}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export function DemoReport() {
  return (
    <section id="demo" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-3xl font-bold tracking-tight">Sample report</h2>
      <div className="glass mt-8 space-y-6 p-6">
        {demo.map(([s, v, l, tone]) => (
          <div key={s}><div className="mb-2 flex justify-between text-sm"><span className="font-medium">{s}</span><span className="text-sub">{l}</span></div><Bar value={v} tone={tone} /></div>
        ))}
      </div>
    </section>
  );
}

export const Footer = () => (
  <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-muted">Resume Claim Verifier — Don't just claim skills. Prove them.</footer>
);
