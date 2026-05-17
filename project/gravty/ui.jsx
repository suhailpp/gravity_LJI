// ============ GRAVTY · Shared UI ============
const { useState, useEffect, useRef, useMemo, useLayoutEffect } = React;

// ============================================================
// DESIGN TOKENS — Raycast dark + custom GRAVTY light
// Mirrors CSS variables in gravty.css. JS access for inline styles.
// CSS variables are the source of truth for the visual layer.
// ============================================================

const THEME = {
  dark: {
    canvas:          '#07080a',
    surface:         '#0d0d0d',
    surfaceElevated: '#101111',
    surfaceCard:     '#121212',
    hairline:        '#242728',
    hairlineSoft:    'rgba(255,255,255,0.08)',
    hairlineStrong:  'rgba(255,255,255,0.16)',
    ink:             '#f4f4f6',
    body:            '#cdcdcd',
    charcoal:        '#d3d3d4',
    mute:            '#9c9c9d',
    ash:             '#6a6b6c',
    stone:           '#434345',
    onDark:          '#ffffff',
    onDarkMute:      'rgba(255,255,255,0.72)',
    primary:         '#ffffff',
    primaryPressed:  '#e8e8e8',
    onPrimary:       '#000000',
    accentGold:      '#E8B563',
    accentGoldSoft:  'rgba(232,181,99,0.15)',
    accentBlue:      '#57c1ff',
    accentBlueSoft:  'rgba(87,193,255,0.15)',
    accentRed:       '#ff6161',
    accentRedSoft:   'rgba(255,97,97,0.15)',
    accentGreen:     '#59d499',
    accentGreenSoft: 'rgba(89,212,153,0.15)',
    accentYellow:    '#ffc533',
    accentYellowSoft:'rgba(255,197,51,0.15)',
    accentOrange:    '#ff9500',
  },
  light: {
    canvas:          '#F4F5F7',
    surface:         '#FFFFFF',
    surfaceElevated: '#ECEEF1',
    surfaceCard:     '#E4E6EA',
    hairline:        '#E2E4E9',
    hairlineSoft:    'rgba(0,0,0,0.06)',
    hairlineStrong:  'rgba(0,0,0,0.12)',
    ink:             '#0A0C10',
    body:            '#2D3340',
    charcoal:        '#3D4454',
    mute:            '#6B7280',
    ash:             '#9CA3AF',
    stone:           '#D1D5DB',
    onDark:          '#0A0C10',
    onDarkMute:      'rgba(10,12,16,0.72)',
    primary:         '#0A0C10',
    primaryPressed:  '#1C2028',
    onPrimary:       '#ffffff',
    accentGold:      '#B88735',
    accentGoldSoft:  'rgba(184,135,53,0.12)',
    accentBlue:      '#0EA5E9',
    accentBlueSoft:  'rgba(14,165,233,0.12)',
    accentRed:       '#EF4444',
    accentRedSoft:   'rgba(239,68,68,0.12)',
    accentGreen:     '#10B981',
    accentGreenSoft: 'rgba(16,185,129,0.12)',
    accentYellow:    '#F59E0B',
    accentYellowSoft:'rgba(245,158,11,0.12)',
    accentOrange:    '#EA580C',
  },
};

// Read active theme from document attribute (app.jsx sets data-theme).
const getTheme = () => {
  const mode = (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) || 'dark';
  return mode === 'light' ? THEME.light : THEME.dark;
};

const TYPOGRAPHY = {
  sans:  "'Inter', 'Inter Fallback', system-ui, sans-serif",
  mono:  "'JetBrains Mono', 'Geist Mono', monospace",
  features: '"calt", "kern", "liga", "ss03"',
  displayXl:    { size: '64px', weight: 600, lineHeight: 1.1,  letterSpacing: '0' },
  displayLg:    { size: '56px', weight: 500, lineHeight: 1.17, letterSpacing: '0.2px' },
  headingXl:    { size: '24px', weight: 500, lineHeight: 1.6,  letterSpacing: '0.2px' },
  headingLg:    { size: '22px', weight: 500, lineHeight: 1.15, letterSpacing: '0' },
  headingMd:    { size: '20px', weight: 500, lineHeight: 1.4,  letterSpacing: '0.2px' },
  headingSm:    { size: '18px', weight: 500, lineHeight: 1.4,  letterSpacing: '0.2px' },
  bodyLg:       { size: '18px', weight: 400, lineHeight: 1.6,  letterSpacing: '0' },
  bodyMd:       { size: '16px', weight: 400, lineHeight: 1.6,  letterSpacing: '0' },
  bodyStrong:   { size: '16px', weight: 500, lineHeight: 1.4,  letterSpacing: '0.2px' },
  bodySm:       { size: '14px', weight: 400, lineHeight: 1.6,  letterSpacing: '0' },
  bodySmStrong: { size: '14px', weight: 500, lineHeight: 1.6,  letterSpacing: '0.2px' },
  captionMd:    { size: '13px', weight: 400, lineHeight: 1.4,  letterSpacing: '0.1px' },
  captionSm:    { size: '12px', weight: 400, lineHeight: 1.5,  letterSpacing: '0.4px' },
  buttonMd:     { size: '14px', weight: 500, lineHeight: 1.6,  letterSpacing: '0.2px' },
};

const SPACING = {
  xxs: '2px', xs: '4px', sm: '8px', md: '12px',
  lg: '16px', xl: '24px', xxl: '32px', section: '96px',
};

const RADIUS = {
  none: '0px', xs: '4px', sm: '6px', md: '8px', lg: '10px', xl: '16px', full: '9999px',
};

const MOTION = {
  curve: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    enter:   'cubic-bezier(0, 0, 0.2, 1)',
    exit:    'cubic-bezier(0.4, 0, 1, 1)',
    spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  duration: { instant:'0ms', fast:'100ms', default:'180ms', medium:'250ms', slow:'400ms' },
  transition: {
    default:  'all 180ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast:     'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
    medium:   'all 250ms cubic-bezier(0, 0, 0.2, 1)',
    slow:     'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors:   'background-color 180ms cubic-bezier(0.4, 0, 0.2, 1), border-color 180ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform:'transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// Legacy COLORS map — preserved for any direct consumers (read-only mirror of dark theme).
const COLORS = {
  bgBase:        THEME.dark.canvas,
  bgSurface:     THEME.dark.surface,
  bgElevated:    THEME.dark.surfaceElevated,
  border:        THEME.dark.hairline,
  textPrimary:   THEME.dark.ink,
  textSecondary: THEME.dark.mute,
  textMuted:     THEME.dark.ash,
  gold:          THEME.dark.accentGold,
  green:         THEME.dark.accentGreen,
  amber:         THEME.dark.accentYellow,
  orange:        THEME.dark.accentOrange,
  red:           THEME.dark.accentRed,
  blue:          THEME.dark.accentBlue,
};

// Health score — semantic mapping (consistent across modes)
const HEALTH_COLOR = (score) => {
  if (score == null) return 'var(--text-muted)';
  if (score >= 80) return THEME.dark.accentGreen;
  if (score >= 60) return THEME.dark.accentYellow;
  if (score >= 40) return THEME.dark.accentOrange;
  return THEME.dark.accentRed;
};

// ─── Icons (inline SVG, lucide-style) ───────────────────
const Icon = ({ name, size = 16, stroke = 1.6, color }) => {
  const paths = {
    LayoutDashboard: <>
      <rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/>
      <rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    Tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.2"/></>,
    Users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    FileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8M8 9h2"/></>,
    Gift: <><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></>,
    BarChart2: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    Settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.14.66.39.85.7l.06.06a2 2 0 0 1 0 2.82l-.06.06a1.65 1.65 0 0 0-.85.7z"/></>,
    TrendingDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></>,
    TrendingUp: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    FileEdit: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M10.5 13.5l3 3 6-6"/></>,
    DollarSign: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    Bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    Sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    Moon: <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
    X: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    ChevronDown: <><polyline points="6 9 12 15 18 9"/></>,
    ChevronUp: <><polyline points="18 15 12 9 6 15"/></>,
    ChevronRight: <><polyline points="9 6 15 12 9 18"/></>,
    Search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    Plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    Filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    Check: <><polyline points="20 6 9 17 4 12"/></>,
    AlertTriangle: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    MoreHorizontal: <><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></>,
    Edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    Copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    Pause: <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    Clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    Map: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    Table: <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></>,
    Upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    Trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/></>,
    ArrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    Sparkles: <><path d="M12 3l1.4 4.2L17.6 9 13.4 10.6 12 15 10.6 10.6 6.4 9 10.6 7.2z"/><path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9z"/></>,
    Sliders: <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
    Smartphone: <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    Monitor: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
    Image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    Share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    Bookmark: <><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></>,
    Globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    ArrowDown: <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
    Refresh: <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
    Send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    ArrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    Trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    Zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    Star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    Timer: <><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3l-1 2"/><path d="M19 3l1 2"/><path d="M9 3h6"/></>,
    Flame: <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></>,
    ChevronLeft: <><polyline points="15 18 9 12 15 6"/></>,
    Minus: <><line x1="5" y1="12" x2="19" y2="12"/></>,
    ArrowUp: <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color || 'currentColor'} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
};

// ─── Sigil ───────────────────────────────
const Sigil = ({ size = 14, color }) => (
  <span style={{ color: color || 'var(--accent-gold)', fontSize: size, fontFamily: 'Inter, system-ui, sans-serif', display:'inline-block', lineHeight: 1 }}>✦</span>
);

// ─── Pill ─────────────────────────────────
const Pill = ({ children, kind = '', icon, style }) =>
  <span className={"pill " + kind} style={style}>
    {icon && <span style={{display:'inline-flex'}}>{icon}</span>}
    {children}
  </span>;

// ─── Btn ─────────────────────────────────
const Btn = ({ children, kind = '', sm = false, lg = false, onClick, style, icon }) =>
  <button
    className={"btn " + kind + (sm ? " sm" : "") + (lg ? " lg" : "")}
    onClick={onClick}
    style={style}>
    {icon && <span style={{display:'inline-flex'}}>{icon}</span>}
    {children}
  </button>;

// ─── Toggle ───────────────────────────────
const Toggle = ({ on, onToggle, label }) =>
  <span className={"toggle " + (on ? "on" : "")} onClick={onToggle}>
    <span className="knob"/>
    {label && <span style={{fontSize:12, color:'var(--text-secondary)'}}>{label}</span>}
  </span>;

// ─── Brand to logo URL map ────────────────
const BRAND_LOGOS = {
  'Marriott Bonvoy':  'https://www.google.com/s2/favicons?sz=128&domain=marriott.com',
  'Marriott':         'https://www.google.com/s2/favicons?sz=128&domain=marriott.com',
  'Careem':           'https://www.google.com/s2/favicons?sz=128&domain=careem.com',
  'Noon':             'https://www.google.com/s2/favicons?sz=128&domain=noon.com',
  'Cult.fit':         'https://www.google.com/s2/favicons?sz=128&domain=cult.fit',
  'BookMyShow':       'https://www.google.com/s2/favicons?sz=128&domain=bookmyshow.com',
  'Emirates':         'https://www.google.com/s2/favicons?sz=128&domain=emirates.com',
  'Chalhoub':         'https://www.google.com/s2/favicons?sz=128&domain=chalhoubgroup.com',
};
const CODE_TO_BRAND = {
  MA:'Marriott Bonvoy', CA:'Careem', NO:'Noon', CF:'Cult.fit',
  BM:'BookMyShow', EM:'Emirates', CH:'Chalhoub'
};
const CODE_TO_SIGNAL = {
  MA:'trending', CA:'fast', NO:'losing', CF:'elite',
  BM:'expiring', EM:'stable', CH:'stable'
};

// ─── Logo bubble (image with initials fallback) ──
const Logo = ({ code, brand, lg = false, sm = false, color, circle = true }) => {
  const [err, setErr] = useState(false);
  const resolvedBrand = brand || CODE_TO_BRAND[code];
  const src = resolvedBrand ? BRAND_LOGOS[resolvedBrand] : null;
  const showImg = src && !err;
  const cls = "logo-bubble " + (lg?'lg':'') + (sm?'sm':'') + (circle?' circ':'') + (showImg?' with-img':'');
  return (
    <div className={cls}
         style={color ? { color, background: 'transparent', borderColor: color + '55' } : {}}>
      {showImg
        ? <img src={src} alt={resolvedBrand} onError={()=>setErr(true)}/>
        : <span>{code}</span>}
    </div>
  );
};

// ─── Health score color (single source of truth) ───
const getHealthColor = (value) => {
  if (value == null) return 'var(--text-muted)';
  if (value >= 80) return '#2DD4A0'; // green
  if (value >= 60) return '#F59E0B'; // amber
  if (value >= 40) return '#F97316'; // orange
  return '#F26B6B';                  // red
};

// ─── Health Donut (half-pie) ─────────────
const HealthDonut = ({ value, delta, size = 'md' }) => {
  if (value == null) return <span style={{color:'var(--text-muted)', fontSize:13}}>—</span>;
  // viewBox per spec: 0 0 120 60 arc; total height adds room for score + delta.
  const isLg = size === 'lg';
  const W = isLg ? 140 : 120;
  const arcH = W / 2;
  const cx = W / 2, cy = arcH;
  const r = (W / 2) - 14;
  const sw = 10;
  const circ = Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  const stroke = getHealthColor(value);
  return (
    <div className="health-donut" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <svg width={W} height={arcH + 4} viewBox={`0 0 ${W} ${arcH + 4}`}>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
              fill="none" stroke="var(--border-default)" strokeWidth={sw} strokeLinecap="round"/>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
              fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1-pct)}
              style={{transition:'stroke-dashoffset .5s ease, stroke .3s ease'}}/>
      </svg>
      <div style={{fontFamily:'Inter, system-ui, sans-serif', fontWeight:700, fontSize:26, color:stroke, lineHeight:1, marginTop:-6}}>{value}</div>
      {delta != null && delta !== 0 && (
        <div style={{display:'inline-flex', alignItems:'center', gap:3, marginTop:4,
                     fontFamily:'Inter, system-ui, sans-serif', fontSize:11, fontWeight:500,
                     color: delta > 0 ? 'var(--accent-green)' : 'var(--accent-red)'}}>
          <Icon name={delta > 0 ? 'ArrowUp' : 'ArrowDown'} size={10}/>{Math.abs(delta)} vs yesterday
        </div>
      )}
    </div>
  );
};

// ─── Health Number (colored value + delta only — for compact table rows) ───
const HealthNumber = ({ value, delta }) => {
  if (value == null) return <span style={{color:'var(--text-muted)', fontSize:13}}>—</span>;
  const color = getHealthColor(value);
  return (
    <span style={{display:'inline-flex', flexDirection:'column', alignItems:'flex-end', gap:2, lineHeight:1}}>
      <span style={{fontFamily:'Inter, system-ui, sans-serif', fontWeight:700, fontSize:18, color}}>{value}</span>
      {delta != null && delta !== 0 && (
        <span style={{display:'inline-flex', alignItems:'center', gap:2, fontSize:10, color: delta > 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight:500}}>
          <Icon name={delta > 0 ? 'ArrowUp' : 'ArrowDown'} size={10}/>{Math.abs(delta)}
        </span>
      )}
    </span>
  );
};

// Back-compat: <HealthScore/> now renders the half pie at md.
const HealthScore = ({ value, delta, size }) => <HealthDonut value={value} delta={delta} size={size || 'md'}/>;

// ─── MiniHealth ──────────────────────────
// Compact half-pie + score + delta. Sized for table-row cells
// (80×40 arc). Use when the full HealthDonut is too tall.
const MiniHealth = ({ value, delta }) => {
  if (value == null) return <span style={{color:'var(--text-muted)', fontSize:12}}>—</span>;
  const hc = getHealthColor(value);
  const r = 30, sw = 7;
  const circ = Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
      <svg width="80" height="40" viewBox="0 0 80 40" style={{overflow:'visible', display:'block'}}>
        <path d="M 10 40 A 30 30 0 0 1 70 40" fill="none" stroke="var(--border-default)" strokeWidth={sw} strokeLinecap="round"/>
        <path d="M 10 40 A 30 30 0 0 1 70 40" fill="none" stroke={hc} strokeWidth={sw} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
              style={{transition:'stroke-dashoffset .5s ease'}}/>
      </svg>
      <span style={{fontFamily:'Inter, system-ui, sans-serif', fontWeight:700, fontSize:16, color:hc, lineHeight:1}}>{value}</span>
      {delta != null && delta !== 0 && (
        <span style={{display:'inline-flex', alignItems:'center', gap:2, fontSize:11, fontWeight:500, color: delta > 0 ? 'var(--accent-green)' : 'var(--accent-red)', lineHeight:1}}>
          <Icon name={delta > 0 ? 'ArrowUp' : 'ArrowDown'} size={10}/>{Math.abs(delta)}
        </span>
      )}
    </div>
  );
};

// ─── Behavioral Signal Badge ────────────
const SignalBadge = ({ signal }) => {
  if (!signal) return <span style={{color:'var(--text-muted)', fontSize:12}}>—</span>;
  const map = {
    trending:    { kind: 'amber',  icon: 'TrendingUp',   label: 'Trending' },
    fast:        { kind: 'blue',   icon: 'Zap',          label: 'Fast Growing' },
    losing:      { kind: 'red',    icon: 'TrendingDown', label: 'Losing Momentum' },
    elite:       { kind: 'gold',   icon: 'Star',         label: 'Elite Favorite' },
    expiring:    { kind: 'orange', icon: 'Clock',        label: 'Expiring Soon' },
    regional:    { kind: 'green',  icon: 'Globe',        label: 'Regional Spike' },
  };
  const s = map[signal];
  if (!s) return <span style={{color:'var(--text-disabled)', fontSize:12}}>—</span>;
  return <Pill kind={s.kind}><Icon name={s.icon} size={13}/>{s.label}</Pill>;
};

// ─── Status with dot ────────────────────
const Status = ({ kind, label }) => {
  const k = kind === 'live' ? 'live' : kind === 'scheduled' ? 'blue' : kind === 'in-review' ? 'amber' : kind === 'ended' ? 'gray' : kind === 'paused' ? 'amber' : 'gray';
  return <span className="row gap-6" style={{fontSize:12, color:'var(--text-primary)'}}><span className={"dot " + k}/>{label}</span>;
};

// ─── Toast helper ───────────────────────
const ToastContext = React.createContext({ show: () => {} });
function useToast() { return React.useContext(ToastContext); }

// ============================================================
// SHARED TABLE BEHAVIOR — single source of truth for all tables
// (offers, segments, rules). Edit here once, applies everywhere.
// ============================================================

// ─── TableRowActions ────────────────────
// Wraps a row's quick-action icons. Hover behavior comes from
// .tbl-row:hover .row-actions in gravty.css (opacity 0to1,
// visibility hiddentovisible, no transition). The actions sit in
// the grid cell with margin-left:auto so they hug the right edge
// without breaking the grid layout that each table relies on.
// Declared as `function` (hoisted, attached to window) to match
// the pattern used by other cross-file shared components.
function TableRowActions({ children, style }) {
  return (
    <div className="row-actions" style={{
      justifyContent: 'flex-end',
      marginLeft: 'auto',
      paddingRight: 16,
      minWidth: 90,
      overflow: 'visible',
      position: 'relative',
      ...style
    }}>
      {children}
    </div>
  );
}

// ─── TablePagination ────────────────────
// Fixed bottom bar (.tbl-pagination CSS handles position:fixed,
// bottom:0, left:56px, right:0, height:48px). Use this for every
// table — it auto-shows page controls only when total > pageSize.
//   <TablePagination total={n} noun="segments" />
//   <TablePagination total={n} noun="offers" pageSize={25}
//                    currentPage={p} onPageChange={setPage} />
function TablePagination({ total, noun = 'items', pageSize = 25, currentPage = 1, onPageChange }) {
  const showPagination = total > pageSize;
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (!showPagination) {
    return (
      <div className="tbl-pagination">
        <span>Showing {total} of {total} {noun}</span>
        <span/>
      </div>
    );
  }

  const go = (p) => onPageChange && onPageChange(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="tbl-pagination">
      <div className="row gap-12">
        <span style={{cursor:'pointer'}}>{pageSize} per page ▾</span>
        <span>Showing {start}–{end} of {total} {noun}</span>
      </div>
      <div className="row gap-6">
        <span style={{display:'inline-flex', alignItems:'center', gap:4, cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1}}
              onClick={() => go(currentPage - 1)}><Icon name="ChevronLeft" size={14}/>Prev</span>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          p === currentPage
            ? <Pill key={p} kind="solid-gold">{p}</Pill>
            : <span key={p} style={{padding:'4px 10px', cursor:'pointer'}} onClick={() => go(p)}>{p}</span>
        ))}
        <span style={{display:'inline-flex', alignItems:'center', gap:4, cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1}}
              onClick={() => go(currentPage + 1)}>Next<Icon name="ChevronRight" size={14}/></span>
      </div>
    </div>
  );
};

// ─── OfferCard ───────────────────────────
// Shared offer-summary card. `c` is the offer record (brand, code,
// name, mech, tiers, region, health, delta, sig, pct, q, cat).
// Layout: header row (logo + brand/cat on left; signal badge +
// hover-only Edit/More icons on right) to title to pills to region to
// centered health donut with breathing room to redemption bar.
// Hover reveals quick-action icons (no transition, instant).
function OfferCard({ c, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="card hoverable" onClick={onClick}
         onMouseEnter={() => setHovered(true)}
         onMouseLeave={() => setHovered(false)}
         style={{display:'flex', flexDirection:'column', gap:10, padding:16}}>

      {/* HEADER — logo+brand/cat (left)  |  signal + quick actions (right) */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8}}>
        <div style={{display:'flex', gap:10, alignItems:'center', minWidth:0}}>
          <Logo code={c.code} brand={c.brand}/>
          <div style={{minWidth:0}}>
            <div style={{fontWeight:500, fontSize:13}}>{c.brand}</div>
            <div className="mute" style={{fontSize:11}}>{c.cat}</div>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:6, flexShrink:0}}>
          <SignalBadge signal={c.sig}/>
          <div style={{opacity: hovered ? 1 : 0, display:'flex', gap:4}}>
            <button className="btn icon-only sm ghost" onClick={(e)=>e.stopPropagation()} title="Edit"><Icon name="Edit" size={13}/></button>
            <button className="btn icon-only sm ghost" onClick={(e)=>e.stopPropagation()} title="More"><Icon name="MoreHorizontal" size={13}/></button>
          </div>
        </div>
      </div>

      {/* BODY — title */}
      <div className="sora" style={{fontSize:16, fontWeight:600, lineHeight:1.3}}>{c.name}</div>

      {/* BODY — mechanic + tier pills */}
      <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
        <Pill kind="solid-dark">{c.mech}</Pill>
        <Pill>{c.tiers}</Pill>
      </div>

      {/* BODY — region */}
      <div className="mute" style={{fontSize:13}}>{c.region}</div>

      {/* FOOTER — centered health donut with breathing room */}
      <div style={{display:'flex', justifyContent:'center', padding:'16px 0'}}>
        <HealthDonut value={c.health} delta={c.delta} size="md"/>
      </div>

      {/* FOOTER — redemption bar (full width) */}
      <div>
        <div className="progress" style={{marginBottom:5}}><div style={{width:c.pct+'%'}}/></div>
        <div style={{display:'flex', justifyContent:'space-between', fontSize:11}}>
          <span style={{color:'var(--text-primary)', fontWeight:500}}>{c.pct}%</span>
          <span className="mute mono">{c.q}</span>
        </div>
      </div>
    </div>
  );
}

// ─── EmptyArt ────────────────────────────
// Line-geometric SVGs for empty states. Kinds: stage | funnel | drafts.
// Stays generic; pair with screen-specific copy in the call site.
function EmptyArt({ kind }) {
  const stroke = "var(--text-muted)";
  if (kind === 'stage') return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
      <rect x="20" y="22" width="22" height="36" rx="3" stroke={stroke} strokeWidth="1.5"/>
      <rect x="50" y="14" width="22" height="44" rx="3" stroke={stroke} strokeWidth="1.5"/>
      <rect x="80" y="30" width="22" height="28" rx="3" stroke={stroke} strokeWidth="1.5"/>
      <line x1="10" y1="62" x2="112" y2="62" stroke="var(--accent-gold)" strokeWidth="1" strokeDasharray="3 4"/>
      <circle cx="61" cy="20" r="2" fill="var(--accent-gold)"/>
    </svg>
  );
  if (kind === 'funnel') return (
    <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
      <path d="M15 14h70l-25 30v22l-20-8v-14z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="50" cy="68" r="2" fill="var(--accent-gold)"/>
    </svg>
  );
  if (kind === 'drafts') return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
      <rect x="30" y="14" width="60" height="58" rx="4" stroke={stroke} strokeWidth="1.5"/>
      <line x1="40" y1="28" x2="80" y2="28" stroke={stroke} strokeWidth="1.5"/>
      <line x1="40" y1="40" x2="80" y2="40" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 3"/>
      <line x1="40" y1="52" x2="65" y2="52" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 3"/>
      <circle cx="86" cy="60" r="6" stroke="var(--accent-gold)" strokeWidth="1.5"/>
      <line x1="83" y1="60" x2="89" y2="60" stroke="var(--accent-gold)"/>
      <line x1="86" y1="57" x2="86" y2="63" stroke="var(--accent-gold)"/>
    </svg>
  );
  return null;
}

// ─── FilterCheck ─────────────────────────
// Checklist row inside a filter panel. Caller owns active state.
//   <FilterCheck label="Marriott Bonvoy" active={isOn} onClick={toggle}/>
function FilterCheck({ label, active, onClick }) {
  return (
    <div className={"filter-check " + (active ? 'on' : '')} onClick={onClick}>
      <span className="box"><Icon name="Check" size={11} stroke={2.5}/></span>
      {label}
    </div>
  );
}

// ─── FilterChip ──────────────────────────
// Toggleable pill inside a filter panel. Caller owns active state.
//   <FilterChip label="Gold" active={isOn} onClick={toggle}/>
function FilterChip({ label, active, onClick }) {
  return (
    <button className={"filter-pill " + (active ? 'active' : '')} onClick={onClick}>{label}</button>
  );
}

// ─── RadioRow ────────────────────────────
// Single row of a radio-list (segments, rules, choices). Caller owns
// the active state. Supports three shapes:
//   <RadioRow label="…" active onClick={…}/>                           — radio + label
//   <RadioRow label="…" sublabel="…" active onClick={…}/>              — radio + label + sublabel
//   <RadioRow icon="Plus" label="Build new…" muted onClick={…}/>       — icon + muted label (add-new variant)
// Sublabel accepts any ReactNode so callers can interpolate <b/>.
function RadioRow({ label, sublabel, active, onClick, icon, muted }) {
  const rowStyle = muted ? { color: 'var(--text-secondary)' } : undefined;
  const labelStyle = muted ? { color: 'var(--text-secondary)' } : undefined;
  return (
    <div className={"radio-row " + (active ? 'active' : '')}
         onClick={onClick}
         style={rowStyle}>
      {icon ? <Icon name={icon} size={11}/> : <div className="radio"/>}
      {sublabel ? (
        <div style={{flex:1}}>
          <div className="rl" style={labelStyle}>{label}</div>
          <div className="rs">{sublabel}</div>
        </div>
      ) : (
        <span className="rl" style={labelStyle}>{label}</span>
      )}
    </div>
  );
}

// ─── OfferChipRow ────────────────────────
// Horizontal row of small offer chips (logo + truncated title) with a
// "+N more" tail when offers overflow. Used by segments and rules to
// preview the offers attached to a segment/rule in accordion details.
//   <OfferChipRow offers={[{c, n}]} more={2} onClick={(o)=>…}/>
function OfferChipRow({ offers, more = 0, onClick }) {
  const shown = offers.slice(0, 4);
  const remaining = more + Math.max(0, offers.length - 4);
  const trunc = (s, n = 12) => s == null ? '' : (s.length <= n ? s : s.slice(0, n - 1) + '…');
  return (
    <div className="offer-chip-row" style={{marginBottom:18}}>
      {shown.map((o, i) => (
        <div key={i} className="offer-chip" onClick={(e)=>{e.stopPropagation(); onClick && onClick(o);}}>
          <Logo code={o.c} brand={CODE_TO_BRAND[o.c]} sm/>
          <span>{trunc(o.n, 14)}</span>
        </div>
      ))}
      {remaining > 0 && <span className="offer-chip-more">+{remaining} more</span>}
    </div>
  );
}

// ─── InsightCard ─────────────────────────
// Colored attention card used on the Dashboard intelligence strip.
// `tone` = red | green | amber | blue (drives the existing
// `.insight-card.<tone>` CSS variant — no new styles).
//   <InsightCard tone="red" icon={<Icon name="TrendingDown"/>}
//                headline="…" body="…" ctaLabel="View"
//                onClick={…}/>
function InsightCard({ tone = 'blue', icon, headline, body, ctaLabel, onClick }) {
  return (
    <div className={"insight-card " + tone + " hoverable"} onClick={onClick}>
      <div className="ic-icon">{icon}</div>
      <h4>{headline}</h4>
      <p>{body}</p>
      <div className="ic-cta row gap-4">{ctaLabel} <Icon name="ArrowRight" size={12}/></div>
    </div>
  );
}

// ─── MetricTile ──────────────────────────
// KPI tile with label / value / change indicator. `changeKind` drives
// the existing `.mc.up | .down | .flat | .warn` CSS variant.
//   <MetricTile label="Active Members" value="1.24M" change="^ 3.1%" changeKind="up"/>
//   <MetricTile … onClick={…}/>  // tile gets `.clickable` class
function MetricTile({ label, value, unit, change, changeKind = 'flat', onClick }) {
  return (
    <div className={"metric-tile" + (onClick ? ' clickable' : '')} onClick={onClick}>
      <div className="ml">{label}</div>
      <div className="mv">{value}{unit && <span className="unit"> {unit}</span>}</div>
      <div className={"mc " + changeKind}>{change}</div>
    </div>
  );
}

// ─── ViewToggle ──────────────────────────
// Segmented button group (e.g. Table | Map). Uses the existing
// `.btn.sm.ghost` styling. Options: [{ id, label, icon? }].
//   <ViewToggle value={view} onChange={setView}
//               options={[{id:'table',label:'Table',icon:'Table'},
//                         {id:'map',  label:'Map',  icon:'Map'}]}/>
function ViewToggle({ value, onChange, options }) {
  return (
    <div className="row gap-4"
         style={{padding:'3px', background:'var(--bg-elevated)', borderRadius:8, border:'1px solid var(--border-default)'}}>
      {options.map(o => (
        <button key={o.id}
                className="btn sm ghost"
                style={{
                  background: value === o.id ? 'var(--accent-gold)' : 'transparent',
                  color:      value === o.id ? '#0A0C10'           : 'var(--text-secondary)',
                }}
                onClick={()=>onChange(o.id)}>
          {o.icon && <Icon name={o.icon} size={13}/>} {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── PathCard ────────────────────────────
// Large branching-choice card (e.g. "Start from a Template" vs
// "Build from Scratch"). `art` is any ReactNode (typically an inline
// SVG) shown above the title. `highlighted` swaps to the gold-border
// variant + primary CTA.
//   <PathCard highlighted title="…" subtitle="…" ctaLabel="…"
//             onCTA={…} art={<TemplateArt/>}/>
function PathCard({ highlighted, title, subtitle, ctaLabel, onCTA, art }) {
  return (
    <div className="card hoverable" style={{
      borderWidth: highlighted ? 2 : 1,
      borderColor: highlighted ? 'var(--accent-gold)' : 'var(--border-default)',
      background:  highlighted ? 'var(--bg-elevated)' : 'var(--bg-surface)',
      padding: '24px',
      display:'flex', flexDirection:'column', gap:14, minHeight: 250
    }}>
      <div style={{height:80, display:'flex', alignItems:'center'}}>{art}</div>
      <div className="sora" style={{fontSize:18, fontWeight:600}}>{title}</div>
      <div className="mute" style={{fontSize:13, lineHeight:1.5}}>{subtitle}</div>
      <div style={{flex:1}}/>
      <div>
        <Btn kind={highlighted ? 'primary' : ''} onClick={onCTA}>{ctaLabel}</Btn>
      </div>
    </div>
  );
}

// ─── TemplateCard ────────────────────────
// Single offer-template card used in the Templates grid. `template`
// shape: { i, cat, rec?, name, desc, meta: string[] }. The first
// item in `meta` is rendered with a green up-arrow; the rest are
// muted. `onSelect(template)` fires when the CTA is clicked.
function TemplateCard({ template, onSelect }) {
  const t = template;
  return (
    <div className="card hoverable" style={{position:'relative', display:'flex', flexDirection:'column', gap:10}}>
      {t.rec && (
        <div style={{position:'absolute', top:-9, right:14, background:'var(--accent-gold)', color:'#0A0C10', fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:999, display:'flex', alignItems:'center', gap:4}}>
          <span>✦</span> Recommended
        </div>
      )}
      <Pill style={{alignSelf:'flex-start'}}>{t.cat}</Pill>
      <div className="sora" style={{fontSize:16, fontWeight:600, lineHeight:1.2}}>{t.name}</div>
      <div className="mute" style={{fontSize:13, lineHeight:1.5}}>{t.desc}</div>
      <div className="col gap-4" style={{marginTop:6}}>
        {t.meta.map((m, mi) => (
          <div key={mi} style={{display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--text-secondary)'}}>
            <span style={{display:'inline-flex', color: mi === 0 ? 'var(--accent-green)' : 'var(--text-muted)'}}>
              <Icon name={mi === 0 ? 'TrendingUp' : 'Minus'} size={mi === 0 ? 11 : 10}/>
            </span>
            {m}
          </div>
        ))}
      </div>
      <div style={{flex:1}}/>
      <div style={{marginTop:10}}>
        <Btn kind={t.rec ? 'primary' : ''} sm onClick={() => onSelect && onSelect(t)}>Use This Template <Icon name="ArrowRight" size={12}/></Btn>
      </div>
    </div>
  );
}

// ─── StatusTimeline ──────────────────────
// Vertical milestone timeline (created / approved / live / now /
// projected). Uses existing CSS: .timeline / .tnode.{past|now|peak|future}
// / .tdate / .ttitle / .tsub. Each node:
//   { kind, date, title, sub?, subStyle? }
//   <StatusTimeline nodes={…} style={{marginTop:14}}/>
function StatusTimeline({ nodes, style }) {
  return (
    <div className="timeline" style={style}>
      {nodes.map((n, i) => (
        <div key={i} className={"tnode " + (n.kind || 'past')}>
          <div className="tdate">{n.date}</div>
          <div className="ttitle">{n.title}</div>
          {n.sub && <div className="tsub" style={n.subStyle}>{n.sub}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── PageLayout ──────────────────────────
// Single source of truth for screen padding + width. `.shell` in
// gravty.css already provides the 84px top + 56px left offset for
// the dev-bar/top-bar/nav-rail; PageLayout only owns inner padding.
//   <PageLayout><PageHeader …/> … </PageLayout>
function PageLayout({ children }) {
  return (
    <div style={{
      padding: '32px 40px',
      minHeight: 'calc(100vh - 84px)',
      boxSizing: 'border-box',
      width: '100%',
    }}>
      {children}
    </div>
  );
}

// ─── PageHeader ──────────────────────────
// Consistent screen header: optional back link to title to subtitle on
// the left; optional action group on the right.
//   <PageHeader title="…" subtitle="…"
//               backLabel="Back to Offers" onBack={…}
//               actions={<Btn>+ Create</Btn>}/>
function PageHeader({ title, subtitle, actions, backLabel, onBack }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '24px',
    }}>
      <div>
        {backLabel && (
          <button onClick={onBack} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Icon name="ArrowLeft" size={13}/> {backLabel}
          </button>
        )}
        <h1 className="sora" style={{
          fontSize: '24px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: 'var(--text-primary)',
          margin: 0,
        }}>{title}</h1>
        {subtitle && (
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: '4px 0 0',
          }}>{subtitle}</p>
        )}
      </div>
      {actions && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          {actions}
        </div>
      )}
    </div>
  );
}

// ─── Expose ───────────────────────────
Object.assign(window, {
  // Design tokens (Raycast dark + custom light)
  THEME, getTheme, TYPOGRAPHY, SPACING, RADIUS, MOTION,
  COLORS, HEALTH_COLOR,
  // Components
  Icon, Sigil, Pill, Btn, Toggle, Logo, HealthScore, HealthDonut, HealthNumber, MiniHealth,
  getHealthColor, SignalBadge, Status,
  ToastContext, useToast, BRAND_LOGOS, CODE_TO_BRAND, CODE_TO_SIGNAL,
  TableRowActions, TablePagination, OfferCard,
  EmptyArt, FilterCheck, FilterChip, OfferChipRow, RadioRow,
  InsightCard, MetricTile, ViewToggle, PathCard, TemplateCard,
  StatusTimeline, PageLayout, PageHeader
});
