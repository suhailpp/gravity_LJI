// ============ GRAVTY · Shared UI ============
const { useState, useEffect, useRef, useMemo, useLayoutEffect } = React;

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
  <span style={{ color: color || 'var(--accent-gold)', fontSize: size, fontFamily: 'Sora, sans-serif', display:'inline-block', lineHeight: 1 }}>✦</span>
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

// ─── Brand → logo URL map ────────────────
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
  const totalH = arcH + 44;
  const cx = W / 2, cy = arcH;
  const r = (W / 2) - 14;
  const sw = 10;
  const circ = Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  const stroke = getHealthColor(value);
  return (
    <div className="health-donut">
      <svg width={W} height={totalH} viewBox={`0 0 ${W} ${totalH}`}>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
              fill="none" stroke="#252A35" strokeWidth={sw} strokeLinecap="round"/>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
              fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1-pct)}
              style={{transition:'stroke-dashoffset .5s ease, stroke .3s ease'}}/>
        <text x={cx} y={cy + 24} textAnchor="middle"
              fontFamily="Sora, sans-serif" fontWeight="700" fontSize={26}
              fill={stroke}>{value}</text>
        {delta != null && delta !== 0 && (
          <text x={cx} y={cy + 40} textAnchor="middle"
                fontFamily="DM Sans, sans-serif" fontSize={11} fontWeight="500"
                fill={delta > 0 ? '#2DD4A0' : '#F26B6B'}>
            {delta > 0 ? '↑' : '↓'}{Math.abs(delta)} vs yesterday
          </text>
        )}
      </svg>
    </div>
  );
};

// ─── Health Number (colored value + delta only — for compact table rows) ───
const HealthNumber = ({ value, delta }) => {
  if (value == null) return <span style={{color:'var(--text-muted)', fontSize:13}}>—</span>;
  const color = getHealthColor(value);
  return (
    <span style={{display:'inline-flex', flexDirection:'column', alignItems:'flex-end', gap:2, lineHeight:1}}>
      <span style={{fontFamily:'Sora, sans-serif', fontWeight:700, fontSize:18, color}}>{value}</span>
      {delta != null && delta !== 0 && (
        <span style={{fontSize:10, color: delta > 0 ? '#2DD4A0' : '#F26B6B', fontWeight:500}}>
          {delta > 0 ? '↑' : '↓'}{Math.abs(delta)}
        </span>
      )}
    </span>
  );
};

// Back-compat: <HealthScore/> now renders the half pie at md.
const HealthScore = ({ value, delta, size }) => <HealthDonut value={value} delta={delta} size={size || 'md'}/>;

// ─── Behavioral Signal Badge ────────────
const SignalBadge = ({ signal }) => {
  if (!signal) return <span style={{color:'var(--text-muted)', fontSize:12}}>—</span>;
  const map = {
    trending:    { kind: 'amber',  glyph: '🔥', label: 'Trending' },
    fast:        { kind: 'blue',   glyph: '⚡', label: 'Fast Growing' },
    losing:      { kind: 'red',    glyph: '↘',  label: 'Losing Momentum' },
    elite:       { kind: 'gold',   glyph: '★',  label: 'Elite Favorite' },
    expiring:    { kind: 'orange', glyph: '⏳', label: 'Expiring Soon' },
  };
  const s = map[signal];
  return <Pill kind={s.kind}><span style={{fontSize:11}}>{s.glyph}</span>{s.label}</Pill>;
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
// .tbl-row:hover .row-actions in gravty.css (opacity 0→1,
// visibility hidden→visible, no transition). The actions sit in
// the grid cell with margin-left:auto so they hug the right edge
// without breaking the grid layout that each table relies on.
// Declared as `function` (hoisted, attached to window) to match
// the pattern used by other cross-file shared components.
function TableRowActions({ children, style }) {
  return (
    <div className="row-actions" style={{ justifyContent: 'flex-end', paddingRight: 16, position: 'relative', ...style }}>
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
        <span style={{cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1}}
              onClick={() => go(currentPage - 1)}>‹ Prev</span>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          p === currentPage
            ? <Pill key={p} kind="solid-gold">{p}</Pill>
            : <span key={p} style={{padding:'4px 10px', cursor:'pointer'}} onClick={() => go(p)}>{p}</span>
        ))}
        <span style={{cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1}}
              onClick={() => go(currentPage + 1)}>Next ›</span>
      </div>
    </div>
  );
};

// ─── Expose ───────────────────────────
Object.assign(window, {
  Icon, Sigil, Pill, Btn, Toggle, Logo, HealthScore, HealthDonut, HealthNumber,
  getHealthColor, SignalBadge, Status,
  ToastContext, useToast, BRAND_LOGOS, CODE_TO_BRAND,
  TableRowActions, TablePagination
});
