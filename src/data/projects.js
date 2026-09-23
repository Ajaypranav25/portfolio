// `pos` is the node's resting spot on the desktop canvas, in % of the viewport.
export const projects = [
  {
    id: 'algotrader',
    label: 'AlgoTrader',
    tagline: 'AI-Driven Intraday Trading System',
    summary:
      'An automated intraday trading system for Indian equities. Gemini generates signals, a dedicated risk engine gates every order, and a live WebSocket feed streams trades to a React dashboard.',
    tech: ['Python', 'FastAPI', 'React (Vite)', 'WebSockets', 'Google Gemini API', 'Angel One SmartAPI', 'SQLAlchemy'],
    highlights: [
      'Automated intraday trading of Indian equities via Angel One SmartAPI',
      'Gemini-powered signal generation',
      'Live WebSocket trade feed to a React dashboard',
      'Risk engine: kill switch, trailing stop-loss, daily loss limits',
      'Paper trading mode for risk-free strategy validation',
    ],
    architecture: [
      { name: 'Market Data', detail: 'SmartAPI feed' },
      { name: 'Signal Engine', detail: 'Gemini API' },
      { name: 'Risk Engine', detail: 'Kill switch · SL · limits' },
      { name: 'Execution', detail: 'Live / paper' },
      { name: 'Dashboard', detail: 'WebSocket → React' },
    ],
    links: [{ kind: 'github', label: 'GitHub', href: 'https://github.com/Ajaypranav25/algotrader' }],
    thumb: 'algotrader',
    pos: { x: 13, y: 17 },
  },
  {
    id: 'taskmarket',
    label: 'TaskMarket',
    tagline: 'AI-Evaluated Task Marketplace',
    summary:
      'A task marketplace where every submission is graded by Claude. Scores drive payouts and a five-tier progression system that rewards consistent quality.',
    tech: ['Python', 'Django', 'Anthropic Claude API', 'SQLite', 'WhiteNoise'],
    highlights: [
      'Automated submission evaluation with the Claude API: 0–100 grade plus real-time feedback',
      '5-tier role and level progression (Rookie → Master)',
      'Dynamic payouts tied to evaluation scores and level',
      'Relational Django architecture',
    ],
    architecture: [
      { name: 'Task Board', detail: 'Django views' },
      { name: 'Submission', detail: 'User upload' },
      { name: 'Evaluator', detail: 'Claude API · 0–100' },
      { name: 'Progression', detail: 'Rookie → Master' },
      { name: 'Payouts', detail: 'Dynamic rates' },
    ],
    links: [{ kind: 'github', label: 'GitHub', href: 'https://github.com/Ajaypranav25/TaskMarket' }],
    thumb: 'taskmarket',
    pos: { x: 69, y: 17 },
  },
  {
    id: 'index',
    label: 'Index Engine',
    tagline: 'Local-First Semantic File Classifier',
    summary:
      'Index classifies and searches your files semantically, entirely on your machine. A lightweight head trained on frozen CLIP embeddings learns from your corrections in under a second.',
    tech: ['Python', 'FastAPI', 'PyTorch', 'OpenCLIP', 'scikit-learn', 'LanceDB', 'Tesseract OCR'],
    highlights: [
      'Transfer learning on frozen CLIP embeddings, with zero-shot fallback',
      'Active learning loop: retrains in under 1s on user corrections',
      'Real-time file watcher pipeline',
      'Zero cloud dependency: all inference stays local',
    ],
    architecture: [
      { name: 'File Watcher', detail: 'Real-time events' },
      { name: 'Extract', detail: 'Tesseract OCR' },
      { name: 'Embed', detail: 'OpenCLIP (frozen)' },
      { name: 'Classify', detail: 'sklearn head / zero-shot' },
      { name: 'Store', detail: 'LanceDB vectors' },
    ],
    links: [{ kind: 'github', label: 'GitHub', href: 'https://github.com/Ajaypranav25/ai-file-classifier' }],
    thumb: 'index',
    pos: { x: 21, y: 43 },
  },
  {
    id: 'cabshare',
    label: 'VIT CabShare',
    tagline: 'Institutional Ride-Sharing Platform',
    summary:
      'Ride-sharing for the VIT community. Only verified institutional emails can sign in, and a concurrency-safe booking schema keeps seat counts correct under load.',
    tech: ['Python', 'Flask', 'Supabase (PostgreSQL)', 'Google OAuth 2.0', 'Vercel'],
    highlights: [
      'Access restricted to verified institutional domain emails',
      'Concurrency-safe relational booking schema that prevents double booking',
      'Live seat tracking',
      'Automated seat restoration on cancellation',
    ],
    architecture: [
      { name: 'Auth', detail: 'Google OAuth · domain check' },
      { name: 'Flask API', detail: 'Rides & bookings' },
      { name: 'Postgres', detail: 'Supabase · row locks' },
      { name: 'Seats', detail: 'Live tracking' },
      { name: 'Deploy', detail: 'Vercel' },
    ],
    links: [{ kind: 'live', label: 'Live Site', href: 'https://vitcabshare.vercel.app' }],
    thumb: 'cabshare',
    pos: { x: 42, y: 47 },
  },
  {
    id: 'smartsearch',
    label: 'Smart Search',
    tagline: 'Offline OCR & Hybrid Retrieval',
    summary:
      'A local search engine for your screenshots. Text is extracted with OCR, then queries run against both vector embeddings and SQLite full-text search, fused with Reciprocal Rank Fusion.',
    tech: ['FastAPI', 'Tesseract OCR', 'SQLite FTS5', 'sentence-transformers', 'pytest'],
    highlights: [
      'Hybrid search: vector embeddings + full-text search',
      'Results merged with Reciprocal Rank Fusion (RRF)',
      'Fully offline OCR pipeline',
      'End-to-end automated testing with pytest',
    ],
    architecture: [
      { name: 'Ingest', detail: 'Screenshots' },
      { name: 'OCR', detail: 'Tesseract' },
      { name: 'Index', detail: 'FTS5 + embeddings' },
      { name: 'Retrieve', detail: 'BM25 ∥ vector' },
      { name: 'Fuse', detail: 'RRF ranking' },
    ],
    links: [
      { kind: 'github', label: 'GitHub', href: 'https://github.com/Ajaypranav25/Smart-Local-Screenshot-Search-Engine' },
    ],
    thumb: 'smartsearch',
    pos: { x: 68, y: 58 },
  },
]

export const additionalProjects = [
  {
    id: 'voting',
    label: 'Online Voting System',
    tagline: 'RESTful Online Voting System',
    tech: ['REST API'],
    thumb: 'voting',
  },
  {
    id: 'taskmanager',
    label: 'Task Manager',
    tagline: 'Personal Task Manager',
    tech: ['CRUD'],
    thumb: 'taskmanager',
  },
]
