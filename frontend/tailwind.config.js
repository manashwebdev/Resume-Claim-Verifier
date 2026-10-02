module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bg: '#050505', surface: '#0B0B0B', card: '#111111', violet: { DEFAULT: '#7C3AED', glow: '#8B5CF6' }, muted: '#71717A', sub: '#A1A1AA', ok: '#22C55E', warn: '#F59E0B', bad: '#EF4444' },
    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    boxShadow: { glow: '0 0 60px -10px rgba(139,92,246,.45)' },
  } },
};
