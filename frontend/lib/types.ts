export type Project = { name: string; url: string; description: string | null; topics: string[]; stars: number; reasons: string[] };
export type SkillRow = { skill: string; level: 'Strong' | 'Moderate' | 'Weak' | 'None'; status: string; confidence: number; projects: Project[] };
export type Result = { username: string; trustScore: number; skills: SkillRow[]; repos: (Project & { language: string | null; updated: string })[] };
export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const levelColor = { Strong: 'text-ok', Moderate: 'text-violet-glow', Weak: 'text-warn', None: 'text-bad' } as const;
