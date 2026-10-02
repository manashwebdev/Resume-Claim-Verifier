const SKILLS = {
  React: ['react', 'reactjs', 'react.js'], 'Next.js': ['next.js', 'nextjs', 'next'],
  'Node.js': ['node.js', 'nodejs', 'node', 'express'], MongoDB: ['mongodb', 'mongoose', 'mongo'],
  AWS: ['aws', 'amazon web services', 'lambda', 's3', 'ec2'], Docker: ['docker', 'dockerfile', 'docker-compose'],
  TypeScript: ['typescript', 'ts'], JavaScript: ['javascript', 'js'], Python: ['python', 'django', 'flask'],
  'Tailwind CSS': ['tailwind', 'tailwindcss'], PostgreSQL: ['postgresql', 'postgres'], GraphQL: ['graphql'],
  Kubernetes: ['kubernetes', 'k8s'], Redis: ['redis'], Git: ['git'],
};
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const has = (text, alias) => new RegExp(`(^|[^a-z0-9])${esc(alias)}([^a-z0-9]|$)`, 'i').test(text);

function extractSkills(resumeText) {
  return Object.keys(SKILLS).filter((s) => SKILLS[s].some((a) => a.length > 2 && has(resumeText, a) || a.length <= 2 && has(resumeText, a) && s === 'Git'));
}

function verify(skills, repos) {
  return skills.map((skill) => {
    const aliases = SKILLS[skill];
    const projects = [];
    for (const r of repos) {
      const reasons = [];
      if (r.language && aliases.includes(r.language.toLowerCase())) reasons.push(`Primary language: ${r.language}`);
      for (const t of r.topics) if (aliases.includes(t.toLowerCase())) reasons.push(`Topic: ${t}`);
      if (aliases.some((a) => a.length > 2 && has(`${r.name} ${r.description || ''}`, a))) reasons.push('Mentioned in name/description');
      if (aliases.some((a) => a.length > 2 && has(r.readme || '', a))) reasons.push('Mentioned in README');
      if (reasons.length) projects.push({ name: r.name, url: r.url, description: r.description, topics: r.topics, stars: r.stars, reasons, weight: reasons.length });
    }
    projects.sort((a, b) => b.weight - a.weight);
    const strong = projects.filter((p) => p.weight >= 2).length;
    const confidence = Math.min(97, projects.length ? 25 + strong * 20 + (projects.length - strong) * 8 : 5);
    const level = strong >= 2 ? 'Strong' : projects.length >= 2 || strong === 1 ? 'Moderate' : projects.length ? 'Weak' : 'None';
    const status = { Strong: 'Verified', Moderate: 'Supported', Weak: 'Questionable', None: 'No Evidence' }[level];
    return { skill, level, status, confidence, projects };
  });
}

const trustScore = (rows) => (rows.length ? Math.round(rows.reduce((a, r) => a + r.confidence, 0) / rows.length) : 0);
module.exports = { extractSkills, verify, trustScore };
