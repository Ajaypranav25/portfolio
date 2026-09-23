import { cloneElement } from 'react'

// Tiny "app preview" artworks for each node, drawn in SVG so they stay crisp at any size.
const arts = {
  algotrader: (
    <svg viewBox="0 0 64 40" className="h-full w-full">
      <rect width="64" height="40" fill="#0f1411" />
      <path d="M0 30 L10 26 L18 28 L27 18 L35 21 L44 11 L53 14 L64 6" fill="none" stroke="#22c55e" strokeOpacity=".35" strokeWidth="6" />
      {[
        [7, 22, 30, 1], [14, 20, 29, 0], [21, 16, 26, 1], [28, 15, 23, 1], [35, 17, 24, 0],
        [42, 10, 19, 1], [49, 11, 17, 0], [56, 5, 13, 1],
      ].map(([x, top, bottom, up]) => (
        <g key={x}>
          <line x1={x} x2={x} y1={top - 3} y2={bottom + 3} stroke={up ? '#4ade80' : '#f87171'} strokeWidth=".8" />
          <rect x={x - 2} y={top} width="4" height={bottom - top} rx=".6" fill={up ? '#4ade80' : '#f87171'} />
        </g>
      ))}
    </svg>
  ),
  taskmarket: (
    <svg viewBox="0 0 64 40" className="h-full w-full">
      <defs>
        <linearGradient id="tm" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f97316" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      <rect width="64" height="40" fill="url(#tm)" />
      <circle cx="32" cy="20" r="11" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="3" />
      <circle cx="32" cy="20" r="11" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="63 70" strokeLinecap="round" transform="rotate(-90 32 20)" />
      <text x="32" y="23.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">92</text>
    </svg>
  ),
  index: (
    <svg viewBox="0 0 64 40" className="h-full w-full">
      <rect width="64" height="40" fill="#e4e4e7" />
      {[
        [12, 12, '#18181b'], [16, 15, '#18181b'], [10, 17, '#18181b'], [15, 10, '#18181b'],
        [44, 26, '#52525b'], [48, 29, '#52525b'], [51, 24, '#52525b'], [46, 22, '#52525b'],
        [32, 9, '#a1a1aa'], [36, 12, '#a1a1aa'], [29, 13, '#a1a1aa'],
        [20, 30, '#71717a'], [24, 27, '#71717a'], [17, 33, '#71717a'],
      ].map(([x, y, c], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={c} />
      ))}
      <circle cx="13" cy="13.5" r="7" fill="none" stroke="#18181b" strokeDasharray="1.5 1.5" strokeWidth=".7" />
      <circle cx="47.5" cy="25.5" r="7" fill="none" stroke="#52525b" strokeDasharray="1.5 1.5" strokeWidth=".7" />
    </svg>
  ),
  cabshare: (
    <svg viewBox="0 0 64 40" className="h-full w-full">
      <rect width="64" height="40" fill="#1c1917" />
      <path d="M0 12 H64 M0 28 H64 M18 0 V40 M44 0 V40" stroke="#fff" strokeOpacity=".07" strokeWidth="3" />
      <path d="M9 32 C 18 32, 18 20, 30 20 S 44 8, 55 8" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.1 4.5" />
      <circle cx="9" cy="32" r="3" fill="#facc15" />
      <path d="M55 3.5 a4 4 0 0 1 4 4 c0 3 -4 6.5 -4 6.5 s-4 -3.5 -4 -6.5 a4 4 0 0 1 4 -4z" fill="#fff" />
      <circle cx="55" cy="7.5" r="1.4" fill="#1c1917" />
    </svg>
  ),
  smartsearch: (
    <svg viewBox="0 0 64 40" className="h-full w-full">
      <rect width="64" height="40" fill="#fafafa" />
      {[8, 14, 20, 26, 32].map((y, i) => (
        <rect key={y} x="7" y={y} width={[34, 26, 38, 22, 30][i]} height="2.2" rx="1.1" fill={i === 2 ? '#2563eb' : '#d4d4d8'} />
      ))}
      <circle cx="46" cy="19" r="7.5" fill="#fff" fillOpacity=".7" stroke="#18181b" strokeWidth="2.2" />
      <line x1="51.5" y1="24.5" x2="57" y2="30" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  readme: (
    <svg viewBox="0 0 64 40" className="h-full w-full">
      <rect width="64" height="40" fill="#f4f4f5" />
      <rect x="20" y="4" width="24" height="32" rx="2" fill="#fff" stroke="#d4d4d8" />
      <circle cx="32" cy="13" r="4" fill="#27272a" />
      <path d="M25 24 a7 5 0 0 1 14 0" fill="#27272a" />
      <rect x="24" y="28" width="16" height="1.6" rx=".8" fill="#a1a1aa" />
      <rect x="26" y="31" width="12" height="1.6" rx=".8" fill="#d4d4d8" />
    </svg>
  ),
  voting: (
    <svg viewBox="0 0 64 40" className="h-full w-full">
      <rect width="64" height="40" fill="#27272a" />
      <rect x="18" y="18" width="28" height="16" rx="2" fill="#52525b" />
      <rect x="25" y="17" width="14" height="2" fill="#18181b" />
      <rect x="26" y="5" width="12" height="15" rx="1" fill="#fafafa" transform="rotate(-6 32 12)" />
      <path d="M28.5 12 l2.5 2.5 l4.5 -5" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  taskmanager: (
    <svg viewBox="0 0 64 40" className="h-full w-full">
      <rect width="64" height="40" fill="#fde68a" />
      {[9, 18, 27].map((y, i) => (
        <g key={y}>
          <rect x="12" y={y} width="5" height="5" rx="1.2" fill={i < 2 ? '#18181b' : 'none'} stroke="#18181b" strokeWidth="1" />
          <rect x="21" y={y + 1.6} width={[28, 22, 30][i]} height="1.8" rx=".9" fill="#18181b" fillOpacity={i < 2 ? 0.35 : 0.8} />
        </g>
      ))}
    </svg>
  ),
}

// `cover` crops the art to fill non-matching boxes (e.g. square dock tiles) instead of letterboxing
export default function Thumbnail({ kind, className = '', cover = false }) {
  const art = arts[kind] ?? arts.readme
  return (
    <div className={`overflow-hidden ${className}`}>
      {cover ? cloneElement(art, { preserveAspectRatio: 'xMidYMid slice' }) : art}
    </div>
  )
}
