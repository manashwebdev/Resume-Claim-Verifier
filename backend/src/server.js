const express = require('express'), cors = require('cors'), multer = require('multer');
const pdf = require('pdf-parse'), mammoth = require('mammoth');
const { extractSkills, verify, trustScore } = require('./verify');

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const gh = (path, accept = 'application/vnd.github+json') =>
  fetch(`https://api.github.com${path}`, { headers: { Accept: accept, 'User-Agent': 'resume-claim-verifier', ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }) } });

async function resumeText(file) {
  const name = file.originalname.toLowerCase();
  if (name.endsWith('.pdf')) return (await pdf(file.buffer)).text;
  if (name.endsWith('.docx')) return (await mammoth.extractRawText({ buffer: file.buffer })).value;
  throw Object.assign(new Error('Upload a PDF or DOCX resume.'), { status: 400 });
}

app.get('/health', (_, res) => res.json({ ok: true }));

app.post('/api/verify', upload.single('resume'), async (req, res) => {
  try {
    const username = (req.body.username || '').trim();
    if (!req.file || !/^[a-z\d-]{1,39}$/i.test(username)) return res.status(400).json({ error: 'Resume file and a valid GitHub username are required.' });
    const skills = extractSkills(await resumeText(req.file));
    if (!skills.length) return res.status(422).json({ error: 'No known skills found in this resume.' });

    const r = await gh(`/users/${username}/repos?per_page=100&sort=pushed`);
    if (r.status === 404) return res.status(404).json({ error: `GitHub user "${username}" not found.` });
    if (!r.ok) return res.status(502).json({ error: 'GitHub API error or rate limit. Try again later.' });
    const list = (await r.json()).filter((x) => !x.fork).slice(0, 25);

    const repos = await Promise.all(list.map(async (x, i) => {
      let readme = '';
      if (i < 12) { try { const rr = await gh(`/repos/${username}/${x.name}/readme`, 'application/vnd.github.raw+json'); if (rr.ok) readme = (await rr.text()).slice(0, 8000); } catch {} }
      return { name: x.name, url: x.html_url, description: x.description, language: x.language, topics: x.topics || [], stars: x.stargazers_count, updated: x.pushed_at, readme };
    }));

    const rows = verify(skills, repos);
    res.json({ username, trustScore: trustScore(rows), skills: rows, repos: repos.map(({ readme, ...p }) => p) });
  } catch (e) { res.status(e.status || 500).json({ error: e.message || 'Something went wrong.' }); }
});

app.listen(process.env.PORT || 4000, () => console.log('API ready'));
