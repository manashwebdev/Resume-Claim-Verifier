'use client';
import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Search, UploadCloud, X, Download } from 'lucide-react';
import { API, levelColor, type Result, type SkillRow } from '@/lib/types';
import { Ring, Bar } from './Bars';

const STEPS = ['Parsing resume', 'Extracting skills', 'Fetching GitHub repositories', 'Reading README files', 'Analyzing topics', 'Matching skills', 'Generating evidence report'];

export default function Analyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState('');
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle');
  const [step, setStep] = useState(0);
  const [err, setErr] = useState('');
  const [data, setData] = useState<Result | null>(null);
  const [open, setOpen] = useState<SkillRow | null>(null);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'confidence' | 'skill'>('confidence');
  const input = useRef<HTMLInputElement>(null);

  async function run() {
    if (!file || !user.trim()) return setErr('Add a resume and a GitHub username.');
    setErr(''); setPhase('loading'); setStep(0);
    const tick = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1100);
    try {
      const fd = new FormData(); fd.append('resume', file); fd.append('username', user.trim());
      const res = await fetch(`${API}/api/verify`, { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setStep(STEPS.length); setTimeout(() => { setData(json); setPhase('done'); }, 600);
    } catch (e) { setErr(e instanceof Error ? e.message : 'Request failed. Is the API running?'); setPhase('idle'); }
    finally { clearInterval(tick); }
  }

  const rows = useMemo(() => (data?.skills ?? []).filter((r) => r.skill.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === 'skill' ? a.skill.localeCompare(b.skill) : b.confidence - a.confidence)), [data, q, sort]);

  return (
    <section id="analyze" className="mx-auto max-w-4xl px-6 py-20">
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div key="i" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass p-8">
            <h2 className="text-3xl font-bold tracking-tight">Verify your claims</h2>
            <button onClick={() => input.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0] ?? null); }}
              className="mt-6 flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-white/20 py-12 transition hover:border-violet-glow hover:bg-violet/5">
              <UploadCloud className="h-7 w-7 text-violet-glow" />
              <span>{file ? file.name : 'Drop a PDF or DOCX, or click to browse'}</span>
            </button>
            <input ref={input} type="file" accept=".pdf,.docx" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <label className="mt-4 block text-sm text-sub" htmlFor="gh">GitHub username</label>
            <input id="gh" value={user} onChange={(e) => setUser(e.target.value)} placeholder="octocat" className="mt-1 w-full rounded-xl border border-white/10 bg-card px-4 py-3 outline-none focus:border-violet-glow" />
            {err && <p role="alert" className="mt-3 text-sm text-bad">{err}</p>}
            <button onClick={run} className="mt-6 w-full rounded-xl bg-violet py-3.5 font-medium shadow-glow transition hover:-translate-y-0.5 hover:bg-violet-glow">Verify claims</button>
          </motion.div>
        )}
        {phase === 'loading' && (
          <motion.ul key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass space-y-3 p-8" aria-live="polite">
            {STEPS.map((s, i) => (
              <motion.li key={s} animate={{ opacity: i <= step ? 1 : 0.3 }} className="flex items-center gap-3">
                {i < step ? <Check className="h-4 w-4 text-ok" /> : i === step ? <Loader2 className="h-4 w-4 animate-spin text-violet-glow" /> : <span className="h-4 w-4 rounded-full border border-white/20" />}
                <span className={i === step ? 'text-white' : 'text-sub'}>{s}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}
        {phase === 'done' && data && (
          <motion.div key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="glass flex flex-col items-center gap-6 p-8 sm:flex-row sm:justify-between">
              <Ring value={data.trustScore} />
              <div className="text-center sm:text-left">
                <p className="text-sub">Verified against github.com/{data.username}</p>
                <p className="mt-1 text-2xl font-semibold">{data.skills.filter((s) => s.level === 'Strong').length} strong · {data.skills.filter((s) => s.level === 'None').length} unsupported</p>
                <div className="no-print mt-4 flex gap-2">
                  <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2 text-sm"><Download className="h-4 w-4" />Download report</button>
                  <button onClick={() => { setPhase('idle'); setData(null); }} className="glass px-4 py-2 text-sm">New analysis</button>
                </div>
              </div>
            </div>
            <div className="glass overflow-x-auto p-4">
              <div className="no-print mb-3 flex gap-3">
                <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted" /><input aria-label="Search skills" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search skills" className="w-full rounded-lg border border-white/10 bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-glow" /></div>
                <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as 'confidence' | 'skill')} className="rounded-lg border border-white/10 bg-card px-3 text-sm"><option value="confidence">Confidence</option><option value="skill">Name</option></select>
              </div>
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-muted"><tr><th className="p-2">Skill</th><th>Evidence</th><th>Projects</th><th className="w-40">Confidence</th><th>Status</th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <motion.tr layout key={r.skill} onClick={() => setOpen(r)} className="cursor-pointer border-t border-white/5 hover:bg-white/5">
                      <td className="p-2 font-medium">{r.skill}</td><td className={levelColor[r.level]}>{r.level}</td><td>{r.projects.length}</td>
                      <td><div className="flex items-center gap-2"><Bar value={r.confidence} /><span className="text-xs text-sub">{r.confidence}%</span></div></td><td>{r.status}</td>
                    </motion.tr>
                  ))}
                  {!rows.length && <tr><td colSpan={5} className="p-6 text-center text-sub">No skills match "{q}".</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.repos.slice(0, 6).map((r) => (
                <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="glass p-5 transition hover:-translate-y-1 hover:border-violet-glow/60 hover:shadow-glow">
                  <p className="font-semibold">{r.name}</p><p className="mt-1 line-clamp-2 text-sm text-sub">{r.description || 'No description'}</p>
                  <p className="mt-3 text-xs text-muted">{r.language ?? '—'} · ★ {r.stars} · {new Date(r.updated).toLocaleDateString()}</p>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} />
            <motion.aside role="dialog" aria-label={`${open.skill} evidence`} className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-surface p-6" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
              <button onClick={() => setOpen(null)} aria-label="Close" className="float-right"><X /></button>
              <h3 className="text-2xl font-bold">{open.skill}</h3><p className="text-sub">Confidence {open.confidence}% · {open.status}</p>
              <div className="mt-6 space-y-4">
                {open.projects.map((p) => (
                  <div key={p.name} className="glass p-4"><a href={p.url} target="_blank" rel="noreferrer" className="font-medium text-violet-glow">{p.name}</a>
                    <p className="text-sm text-sub">{p.description}</p>
                    <ul className="mt-2 list-disc pl-5 text-sm">{p.reasons.map((x) => <li key={x}>{x}</li>)}</ul></div>
                ))}
                {!open.projects.length && <p className="text-sub">No repository mentions this skill. Add a project that uses it, or remove the claim.</p>}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
