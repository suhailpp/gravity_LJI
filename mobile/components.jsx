// Shared UI primitives — Emirates Skywards
// Typography: Source Serif 4 Light (titles only) + Fredoka (everything else)
// Spacing: 24 page pad / 32 section gap / 20 card pad / 16 radius

const PAD = 24;
const GAP = 32;
const RADIUS = 16;
const FONT_DISPLAY = '"Source Serif 4", serif';
const FONT_UI = '"Fredoka", system-ui, sans-serif';

// Redemption context — provides redeemedIds set + balance + helpers.
// Provided by App in app.jsx, consumed by OfferCard etc.
const RedemptionContext = React.createContext({
  redeemedIds: new Set(),
  balance: 0,
  isRedeemed: () => false,
  markRedeemed: () => {},
  triggerRedeem: () => {},
});
window.RedemptionContext = RedemptionContext;

// ─────────────────────────────────────────────────────────────
// Mashrabiya pattern (subtle, fixed)
// ─────────────────────────────────────────────────────────────
function MashrabiyaBg() {
  const id = 'mashrab-tile';
  return (
    <svg style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0
    }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <g stroke="rgba(201,148,42,0.18)" strokeWidth="0.6" fill="none">
            <rect x="20" y="20" width="20" height="20" />
            <rect x="20" y="20" width="20" height="20" transform="rotate(45 30 30)" />
            <line x1="0" y1="0" x2="20" y2="20" />
            <line x1="60" y1="0" x2="40" y2="20" />
            <line x1="0" y1="60" x2="20" y2="40" />
            <line x1="60" y1="60" x2="40" y2="40" />
            <path d="M30 0 L34 6 L30 12 L26 6 Z" />
            <path d="M30 48 L34 54 L30 60 L26 54 Z" />
            <path d="M0 30 L6 26 L12 30 L6 34 Z" />
            <path d="M48 30 L54 26 L60 30 L54 34 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity="0.18" />
    </svg>);

}

// ─────────────────────────────────────────────────────────────
// Tier pill
// ─────────────────────────────────────────────────────────────
function TierPill({ tier = 'Gold', size = 'sm' }) {
  const isGold = tier === 'Gold' || tier === 'Platinum';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: size === 'sm' ? '4px 10px' : '6px 12px',
      border: `1px solid ${isGold ? 'rgba(201,148,42,0.45)' : 'rgba(255,255,255,0.18)'}`,
      borderRadius: 6,
      background: isGold ? 'rgba(201,148,42,0.08)' : 'rgba(255,255,255,0.04)',
      color: isGold ? '#C9942A' : 'rgba(240,237,232,0.7)',
      fontFamily: FONT_UI, fontWeight: 500,
      fontSize: size === 'sm' ? 12 : 13,
      letterSpacing: '0.08em', textTransform: 'uppercase'
    }}>
      <svg width="9" height="9" viewBox="0 0 8 8">
        <path d="M4 0 L8 4 L4 8 L0 4 Z" fill={isGold ? '#C9942A' : 'rgba(240,237,232,0.7)'} />
      </svg>
      {tier}
    </span>);

}

// ─────────────────────────────────────────────────────────────
// Generic tag
// ─────────────────────────────────────────────────────────────
function Tag({ children, tone = 'default' }) {
  const tones = {
    default: { c: 'rgba(240,237,232,0.7)', bg: 'rgba(255,255,255,0.06)', bd: 'rgba(255,255,255,0.12)' },
    gold: { c: '#C9942A', bg: 'rgba(201,148,42,0.08)', bd: 'rgba(201,148,42,0.25)' },
    live: { c: '#7ec9a6', bg: 'rgba(126,201,166,0.1)', bd: 'rgba(126,201,166,0.3)' }
  };
  const t = tones[tone] || tones.default;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 9px', borderRadius: 6,
      background: t.bg, border: `1px solid ${t.bd}`, color: t.c,
      fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
      letterSpacing: '0.02em', whiteSpace: 'nowrap'
    }}>{children}</span>);

}

// ─────────────────────────────────────────────────────────────
// Realistic passenger aircraft side profile
// ─────────────────────────────────────────────────────────────
// Lottie plane component
function LottiePlane({ size = 36 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lottie) return;
    const anim = window.lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/aeroplane.json'
    });
    return () => anim.destroy();
  }, []);
  return (
    <div ref={ref} style={{
      width: size, height: size,
      // Source lottie points left; flip so nose leads to the right.
      transform: 'scaleX(-1)'
    }} />);

}

function PlaneIcon({ color = '#C9942A', size = 22 }) {
  // Original silhouette — 40×22 viewBox, simple multi-point jet shape
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 40 22" fill="none"
    style={{ transform: 'scaleX(-1)' }}>
      <path
        d="M2 11 L12 9 L18 4 L21 4 L19 10 L26 9.5 L29 6 L32 6 L31 10 L38 11 L31 12 L32 16 L29 16 L26 12.5 L19 12 L21 18 L18 18 L12 13 Z"
        fill={color} />
      
    </svg>);

}

// ─────────────────────────────────────────────────────────────
// Emirates wordmark + crest (top bar)
// ─────────────────────────────────────────────────────────────
// Raw Emirates crest (gold mark, no wrapper) for top-bar / empty-state
function EmiratesMark({ size = 26 }) {
  return (
    <img src="assets/emirates-mark.svg" alt="Emirates"
    style={{ width: size, height: size, display: 'block' }} />);

}

function ClearbitImg({ domain, size = 24, padding = 4 }) {
  // Local SVGs for primary brands; fall back to favicon services otherwise.
  const LOCAL = {
    'emirates.com': 'assets/emirates-logo.svg'
  };
  const local = LOCAL[domain];
  const sources = local ? [local] : [
  `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`];

  const [idx, setIdx] = React.useState(0);
  const [failed, setFailed] = React.useState(false);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#FFFFFF',
      border: '1px solid rgba(201,148,42,0.45)',
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      {!failed ?
      <img src={sources[idx]} alt=""
      referrerPolicy="no-referrer"
      onError={() => {
        if (idx + 1 < sources.length) setIdx(idx + 1);else
        setFailed(true);
      }}
      style={{
        width: '100%', height: '100%', objectFit: 'contain',
        padding, boxSizing: 'border-box'
      }} /> :

      <span style={{
        fontFamily: FONT_UI, fontWeight: 600, fontSize: size * 0.36,
        color: '#0C0F16'
      }}>{(domain[0] || '?').toUpperCase()}</span>
      }
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Top bar — same on every screen
// ─────────────────────────────────────────────────────────────
function TopBar({ unread = true, showTier = true }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `4px ${PAD}px 10px`,
      position: 'relative', zIndex: 5,
      overflow: 'visible', height: "80px"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, lineHeight: "4.55" }}>
        <img src="assets/emirates-skywards-logo.svg" alt="Emirates Skywards"
          style={{ height: 28, width: 'auto', display: 'block' }} />
        <div style={{
          fontFamily: FONT_UI, fontWeight: 500, fontSize: 14,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--text-1)',
          whiteSpace: 'nowrap'
        }}>Emirates Skywards</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showTier && <TierPill tier={MEMBER.tier} />}
        <button style={{
          all: 'unset', cursor: 'pointer', position: 'relative',
          width: 32, height: 32, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M4 14 L4 9 C4 5.5 6.7 3 10 3 C13.3 3 16 5.5 16 9 L16 14 L17 16 L3 16 Z"
            stroke="rgba(240,237,232,0.6)" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M8.5 18 C8.5 18.8 9.2 19.3 10 19.3 C10.8 19.3 11.5 18.8 11.5 18"
            stroke="rgba(240,237,232,0.6)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {unread &&
          <span style={{
            position: 'absolute', top: 5, right: 7,
            width: 6, height: 6, borderRadius: '50%',
            background: '#C9942A', boxShadow: '0 0 6px rgba(201,148,42,0.6)'
          }} />
          }
        </button>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Notification bell — used in headers across all tabs
// ─────────────────────────────────────────────────────────────
function NotificationBell({ unread = true, onClick }) {
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer', position: 'relative',
      width: 32, height: 32, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M4 14 L4 9 C4 5.5 6.7 3 10 3 C13.3 3 16 5.5 16 9 L16 14 L17 16 L3 16 Z"
          stroke="rgba(240,237,232,0.6)" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M8.5 18 C8.5 18.8 9.2 19.3 10 19.3 C10.8 19.3 11.5 18.8 11.5 18"
          stroke="rgba(240,237,232,0.6)" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      {unread && (
        <span style={{
          position: 'absolute', top: 5, right: 7,
          width: 6, height: 6, borderRadius: '50%',
          background: '#C9942A', boxShadow: '0 0 6px rgba(201,148,42,0.6)',
        }} />
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// PageHeader — title on left, bell on right. Used on every tab
// except Home (which uses the branded TopBar).
// ─────────────────────────────────────────────────────────────
function PageHeader({ title, subtitle, size = 22, unread = true, onBell }) {
  return (
    <div style={{
      padding: `8px ${PAD}px 4px`,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: size,
          color: 'var(--text-1)', letterSpacing: '-0.015em', lineHeight: 1.1,
        }}>{title}</div>
        {subtitle && (
          <div style={{
            marginTop: 8,
            fontFamily: FONT_UI, fontWeight: 400, fontSize: 13,
            color: 'var(--text-2)', lineHeight: 1.5,
          }}>{subtitle}</div>
        )}
      </div>
      <NotificationBell unread={unread} onClick={onBell} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero (160px tall) + member info block — they share the
// same background so the transition is seamless.
// ─────────────────────────────────────────────────────────────
function HeroSky() {
  // exactly 12 subtle dots, 1px, deterministic positions
  const stars = React.useMemo(() => [
  [12, 18], [22, 30], [34, 12], [44, 22], [58, 32], [68, 14],
  [78, 28], [86, 40], [14, 52], [28, 46], [52, 50], [72, 54]].
  map(([x, y], i) => ({ x, y, k: i })), []);

  return (
    <div style={{
      position: 'relative',
      height: 160,
      width: '100%',
      overflow: 'hidden',
      // mask blends bottom into the content below
      WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
      maskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
      background: `
        radial-gradient(ellipse at 70% 50%, rgba(201,148,42,0.20) 0%, rgba(12,15,22,0) 58%),
        linear-gradient(180deg, #07090E 0%, #0A0D14 100%)
      `
    }}>
      {stars.map((s) =>
      <span key={s.k} style={{
        position: 'absolute',
        left: `${s.x}%`, top: `${s.y}%`,
        width: 1, height: 1, borderRadius: '50%',
        background: 'rgba(255,255,255,0.45)'
      }} />
      )}

      {/* greeting overlay (2 lines, serif) — top-left over the sky */}
      <div style={{
        position: 'absolute', top: 18, left: PAD, right: PAD, zIndex: 2,
        fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 20,
        lineHeight: 1.25, color: 'var(--text-1)', letterSpacing: '-0.005em',
      }}>
        Good evening,<br/>{MEMBER.name}
      </div>

      {/* horizon line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '62%',
        height: 1,
        background: 'linear-gradient(to right, transparent, #C9942A 30%, #C9942A 70%, transparent)',
        boxShadow: '0 0 8px rgba(201,148,42,0.3)'
      }} />

      {/* realistic plane — left to right, 16s linear infinite */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '62%',
        marginTop: -7,
        height: 14, pointerEvents: 'none'
      }}>
        <div style={{
          width: '100%', height: '100%',
          animation: 'flyPlane 16s linear infinite',
          display: 'flex', alignItems: 'center'
        }}>
          <PlaneIcon color="#C9942A" size={22} />
        </div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// MilesBlock — sits directly below hero, same dark bg
// 4 rows: greeting / tier pill / two-column / progress / flight chip
// ─────────────────────────────────────────────────────────────
function MilesBlock() {
  const pct = 93;
  const ctx = React.useContext(RedemptionContext);
  const liveMiles = ctx?.balance ?? MEMBER.miles;
  return (
    <div style={{ padding: `0 ${PAD}px`, marginTop: -28, position: 'relative', zIndex: 1 }}>
      {/* greeting moved into HeroSky */}

      {/* Row: two columns separated by divider */}
      <div style={{
        display: 'flex', alignItems: 'center'
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 48,
              lineHeight: 1, color: 'var(--text-1)', letterSpacing: '-0.01em'
            }}>{liveMiles.toLocaleString()}</span>
            <span style={{
              fontFamily: FONT_UI, fontWeight: 400, fontSize: 13,
              color: 'var(--text-2)'
            }}>miles</span>
          </div>
        </div>
        <div style={{
          width: 1, alignSelf: 'stretch', margin: '4px 18px',
          background: 'rgba(255,255,255,0.12)'
        }} />
        <div style={{ width: 110 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 24,
            lineHeight: 1, color: 'var(--text-1)', letterSpacing: '-0.005em'
          }}>{MEMBER.toNextTier.toLocaleString()}</div>
          <div style={{
            marginTop: 4,
            fontFamily: FONT_UI, fontWeight: 400, fontSize: 12,
            color: 'var(--text-2)'
          }}>to {MEMBER.nextTier}</div>
        </div>
      </div>

      {/* Row 4: progress bar */}
      <div style={{
        marginTop: 16, height: 4, borderRadius: 4,
        background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${pct}%`,
          background: '#C9942A',
          borderRadius: 4,
          boxShadow: '0 0 8px rgba(201,148,42,0.4)',
          transformOrigin: 'left',
          animation: 'fillBar 900ms cubic-bezier(.2,.7,.2,1) 200ms both',
          '--p': 1
        }} />
      </div>

      {/* Flight chip */}
      <div style={{ marginTop: 14 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 11px', borderRadius: 999,
          border: '1px solid rgba(201,148,42,0.3)',
          background: 'rgba(201,148,42,0.15)',
          color: 'rgba(240,221,170,0.95)',
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
          letterSpacing: '0.02em'
        }}>
          <svg width="12" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5 L4 4.5 L5.5 3 L7 3 L6 5 L9 4.6 L10 3.2 L11.2 3.2 L10.8 5 L13 5.2 L10.8 5.4 L11.2 7 L10 7 L9 5.6 L6 5.4 L7 7.4 L5.5 7.4 L4 6 Z"
            fill="#C9942A" />
          </svg>
          {MEMBER.nextFlight.code} · {MEMBER.nextFlight.from} → {MEMBER.nextFlight.to} · {MEMBER.nextFlight.when}
        </span>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Section header
// ─────────────────────────────────────────────────────────────
function SectionHeader({ label, right, onRight, mt = GAP }) {
  return (
    <div style={{
      padding: `0 ${PAD}px`,
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      marginTop: mt, marginBottom: 14
    }}>
      <div style={{
        fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 15,
        letterSpacing: '0.02em',
        color: 'rgba(240,237,232,0.7)'
      }}>{label}</div>
      {right &&
      <button onClick={onRight} style={{
        all: 'unset', cursor: 'pointer',
        fontFamily: FONT_UI, fontSize: 12, fontWeight: 400,
        color: 'var(--gold-dim)', letterSpacing: '0.02em'
      }}>{right} →</button>
      }
    </div>);

}

// ─────────────────────────────────────────────────────────────
// PartnerLogo — Clearbit real brand logo on white circle
// ─────────────────────────────────────────────────────────────
function PartnerLogo({ domain, size = 40 }) {
  return <ClearbitImg domain={domain} size={size} padding={6} />;
}

// ─────────────────────────────────────────────────────────────
// More menu (···) — configurable items per surface
// ─────────────────────────────────────────────────────────────
function MoreMenu({ open, onClose, onAction, items = ['Save', 'Share', 'Dismiss'] }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 999
      }} />
      <div style={{
        position: 'absolute', top: 38, right: 0, zIndex: 1000,
        width: 150,
        background: 'rgba(20,18,12,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)'
      }}>
        {items.map((it, i) =>
        <button key={it}
        onClick={(e) => {e.stopPropagation();onAction(it);onClose();}}
        style={{
          all: 'unset', cursor: 'pointer', display: 'block',
          width: '100%', boxSizing: 'border-box',
          padding: '10px 14px',
          fontFamily: FONT_UI, fontSize: 13, fontWeight: 400,
          color: it === 'Report' ? '#d18a8a' : 'var(--text-1)',
          borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
        }}>{it}</button>
        )}
      </div>
    </>);

}

// ─────────────────────────────────────────────────────────────
// More dots button (···) — 12px from edges
// ─────────────────────────────────────────────────────────────
function MoreDots({ onClick, light = false }) {
  const c = light ? 'rgba(240,237,232,0.95)' : 'rgba(240,237,232,0.7)';
  return (
    <button onClick={(e) => {e.stopPropagation();onClick();}} className="press" style={{
      all: 'unset', cursor: 'pointer',
      width: 32, height: 32, borderRadius: '50%',
      background: light ? 'rgba(7,9,14,0.55)' : 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: "1"
    }}>
      <svg width="14" height="3" viewBox="0 0 14 3">
        <circle cx="2" cy="1.5" r="1.3" fill={c} />
        <circle cx="7" cy="1.5" r="1.3" fill={c} />
        <circle cx="12" cy="1.5" r="1.3" fill={c} />
      </svg>
    </button>);

}

// ─────────────────────────────────────────────────────────────
// Gold CTA
// ─────────────────────────────────────────────────────────────
function GoldButton({ children, onClick, height = 48, full = true, style = {},
                     confirmLabel = 'Code Copied', purple = false }) {
  const [phase, setPhase] = React.useState('idle'); // idle | pressed | confirmed
  const timers = React.useRef([]);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const handleClick = (e) => {
    e?.stopPropagation?.();
    if (phase !== 'idle') return;
    setPhase('pressed');
    timers.current.push(setTimeout(() => setPhase('confirmed'), 100));
    timers.current.push(setTimeout(() => setPhase('idle'), 2300));
    onClick?.(e);
  };

  const base = purple
    ? { bg: 'rgba(88,28,255,0.85)', bgDark: 'rgba(58,18,180,0.95)',
        shadow: '0 10px 24px -8px rgba(88,28,255,0.5), inset 0 1px 0 rgba(255,255,255,0.18)' }
    : { bg: '#C9942A', bgDark: '#A67820',
        shadow: '0 8px 22px rgba(201,148,42,0.28), inset 0 1px 0 rgba(255,255,255,0.2)' };

  const isConfirmed = phase === 'confirmed';
  const isPressed = phase === 'pressed';
  const isAnimating = phase !== 'idle';
  const bg = isConfirmed ? base.bgDark : base.bg;
  const textColor = purple || isConfirmed ? '#fff' : '#07090E';

  return (
    <button onClick={handleClick} style={{
      all: 'unset', cursor: phase === 'idle' ? 'pointer' : 'default',
      pointerEvents: isAnimating ? 'none' : 'auto',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: full ? '100%' : undefined,
      height, boxSizing: 'border-box',
      borderRadius: 12,
      background: bg,
      color: textColor,
      fontFamily: FONT_UI, fontWeight: 600, fontSize: 14,
      letterSpacing: '0.04em',
      boxShadow: base.shadow,
      transform: isPressed ? 'scale(0.97)' : 'scale(1)',
      opacity: isPressed ? 0.85 : 1,
      transition: 'transform 100ms cubic-bezier(.2,.7,.2,1), opacity 100ms ease, background-color 240ms ease, color 240ms ease',
      ...style
    }}>
      {isConfirmed && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <path d="M3 8.5 L7 12 L14 4"
            stroke={textColor}
            strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{
              strokeDasharray: 20,
              strokeDashoffset: 20,
              animation: 'checkDraw 200ms cubic-bezier(.2,.7,.2,1) forwards'
            }} />
        </svg>
      )}
      <span>{isConfirmed ? `${confirmLabel} ✓` : children}</span>
    </button>);

}

// ─────────────────────────────────────────────────────────────
// OfferCard — extracted to shared/OfferCard.jsx (loaded as a sibling
// script in mobile/index.html). It reads PartnerLogo / MoreDots /
// MoreMenu / CardCTA / FONT_UI / FONT_DISPLAY / RADIUS off window.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// Smart Nudge
// ─────────────────────────────────────────────────────────────
function SmartNudge({ onClick, onDismiss, onConfirmRedeem }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  // Smart Nudge points at the Marriott offer
  const offer = OFFERS.find(o => o.id === 'off-marriott') || OFFERS[0];
  return (
    <div className="fade-rise press-card" style={{
      margin: `0 ${PAD}px`,
      borderRadius: RADIUS,
      background: 'linear-gradient(135deg, rgba(88,28,255,0.15), rgba(124,58,237,0.08))',
      border: '1px solid rgba(139,92,246,0.25)',
      boxShadow: '0 14px 30px -16px rgba(88,28,255,0.4)',
      position: 'relative',
      overflow: 'visible',
    }}>
      {/* Image — full-bleed top, 200px */}
      <div onClick={onClick} role="button" tabIndex={0} style={{
        cursor: 'pointer', position: 'relative',
        height: 200,
        borderTopLeftRadius: RADIUS, borderTopRightRadius: RADIUS,
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        background: 'linear-gradient(135deg, #1a1232, #2a1a4d)',
      }}>
        <img
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=70"
          alt="" referrerPolicy="no-referrer"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: 0.9,
          }} />
        {/* purple overlay — light at top, heavy at bottom so title stays readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(88,28,255,0.15) 0%, rgba(88,28,255,0.2) 55%, rgba(88,28,255,0.95) 100%)',
        }} />
        {/* gentle top vignette so FOR YOU label + title read */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: 130,
          background: 'linear-gradient(to bottom, rgba(7,9,14,0.5), rgba(7,9,14,0))',
        }} />

        {/* ✦ FOR YOU top-left */}
        <div style={{
          position: 'absolute', top: 14, left: 16,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: FONT_UI, fontSize: 10, fontWeight: 500,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#fff',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
        }}>
          <svg width="10" height="10" viewBox="0 0 14 14">
            <path d="M7 0 L8.2 5.8 L14 7 L8.2 8.2 L7 14 L5.8 8.2 L0 7 L5.8 5.8 Z" fill="#fff"/>
          </svg>
          For You
        </div>

        {/* Title overlay — vertically centered in image area */}
        <div style={{
          position: 'absolute', left: 20, right: 60,
          top: '50%', transform: 'translateY(-50%)',
          fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 22,
          lineHeight: 1.2, color: '#FFFFFF', letterSpacing: '-0.005em',
          textShadow: '0 2px 16px rgba(0,0,0,0.9)',
        }}>
          Marriott 50% Off<br/>Weekend Stays
        </div>
      </div>

      {/* Marriott logo — overlaps image/content boundary */}
      <div style={{ position: 'absolute', top: 200 - 20, left: 20, zIndex: 4 }}>
        <PartnerLogo domain="marriott.com" size={40} />
      </div>

      {/* ··· top-right */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 5 }}>
        <MoreDots light onClick={() => setMenuOpen((o) => !o)} />
        <MoreMenu open={menuOpen}
          items={['Save', 'Share', 'Dismiss']}
          onClose={() => setMenuOpen(false)}
          onAction={(it) => onDismiss?.(it)} />
      </div>

      {/* Content */}
      <div onClick={onClick} style={{ cursor: 'pointer', padding: '30px 20px 0' }}>
        <div style={{
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 12, lineHeight: 1.55,
          color: 'var(--text-2)',
        }}>
          You're in Dubai this weekend.
        </div>
        <div style={{
          marginTop: 4,
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 12, lineHeight: 1.55,
          color: '#c4b5fd',
        }}>
          Book now → +500 miles → only 700 left to Platinum
        </div>
      </div>

      {/* Purple CTA */}
      <div style={{ padding: '16px 20px 20px' }}>
        <CardCTA offer={offer} tone="purple" height={44} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Birthday card — 🎂 inline + Save/Share/Dismiss menu
// ─────────────────────────────────────────────────────────────
function BirthdayCard({ onRedeem, onMore }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  // Synthetic offer so the CardCTA can compute price/state.
  // mechanic 'BIRTHDAY' → free, gold tone, label "Claim Free"
  const offer = React.useMemo(() => ({
    id: 'birthday-2026',
    partner: 'Emirates Skywards',
    title: 'Birthday — 2× miles',
    mechanic: 'BIRTHDAY',
    miles: 1000,
  }), []);
  return (
    <div className="fade-rise" style={{
      margin: `0 ${PAD}px`,
      padding: 20, borderRadius: RADIUS,
      background: 'linear-gradient(135deg, rgba(201,148,42,0.18), rgba(139,95,20,0.06))',
      border: '1px solid rgba(201,148,42,0.32)',
      position: 'relative', overflow: 'visible'
    }}>
      <div style={{
        position: 'absolute', right: -40, top: -40,
        width: 140, height: 140, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,148,42,0.22), transparent 65%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: FONT_UI, fontSize: 10.5, fontWeight: 500,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'var(--gold-dim)'
      }}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>🎂</span>
        Birthday Offer
      </div>
      <div style={{
        marginTop: 12,
        fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 26, lineHeight: 1.2,
        color: 'var(--text-1)', letterSpacing: '-0.01em'
      }}>2× miles on all purchases this week.</div>
      <div style={{
        marginTop: 14, display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: FONT_UI, fontSize: 11,
        color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase'
      }}>
        <span>Expires in 6 days</span>
        <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ color: 'var(--gold-dim)' }}>No limit</span>
      </div>
      <div style={{ marginTop: 18 }}>
        <CardCTA offer={offer} height={44} />
      </div>
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 5 }}>
        <MoreDots onClick={() => setMenuOpen((o) => !o)} />
        <MoreMenu open={menuOpen}
        items={['Save', 'Share', 'Dismiss']}
        onClose={() => setMenuOpen(false)}
        onAction={onMore} />
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Challenge icons
// ─────────────────────────────────────────────────────────────
function ChallengeIcon({ kind = 'flame', size = 22 }) {
  const c = '#C9942A';
  const sw = 1.4;
  if (kind === 'flame') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3 C 14 7 18 9 18 14 C 18 17 15.5 20 12 20 C 8.5 20 6 17 6 14 C 6 12 7 10.5 8 9.5 C 8.5 11 9.5 12 10 11 C 10.5 9 9.5 6 12 3 Z"
      stroke={c} strokeWidth={sw} strokeLinejoin="round" />
    </svg>);

  if (kind === 'plane') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M2 12 L9 11 L13 5 L15 5 L13 11 L18 10.5 L20 8 L22 8 L21 11 L23 12 L21 13 L22 16 L20 16 L18 13.5 L13 13 L15 19 L13 19 L9 13 Z"
      stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>);

  if (kind === 'compass') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth={sw} />
      <path d="M9 15 L13 13 L15 9 L11 11 Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
    </svg>);

  if (kind === 'moon') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 14.5 C 19 18 15.5 21 11.5 21 C 6.8 21 3 17.2 3 12.5 C 3 8.5 6 5 9.5 4 C 8 6.5 8 10 10 12 C 12 14 15.5 14 18 12.5 C 18.5 13.2 19.2 14 20 14.5 Z"
      stroke={c} strokeWidth={sw} strokeLinejoin="round" />
    </svg>);

  return null;
}

// ─────────────────────────────────────────────────────────────
// Challenge card — 4 spaced groups
// ─────────────────────────────────────────────────────────────
function ChallengeCard({ ch, width = '100%', onClick }) {
  const pct = Math.round(ch.cur / ch.tot * 100);
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer',
      flexShrink: 0, width, boxSizing: 'border-box',
      padding: 20, borderRadius: RADIUS,
      background: 'rgba(201,148,42,0.04)',
      border: '1px solid rgba(201,148,42,0.22)',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Group 1: icon (alone, 14px breathing room) */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '1px solid rgba(201,148,42,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14
      }}>
        <ChallengeIcon kind={ch.iconKey} size={22} />
      </div>

      {/* Group 2: title + subtitle, 14px below */}
      <div style={{ marginBottom: 14 }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 15, lineHeight: 1.2,
          color: 'var(--text-1)', letterSpacing: '-0.005em',
          marginBottom: 4
        }}>{ch.title}</div>
        <div style={{
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
          color: 'var(--text-2)'
        }}>{ch.cur}/{ch.tot} · {ch.sub}</div>
      </div>

      {/* Group 3: progress + % inline, 6px below */}
      <div style={{ marginBottom: 6 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            flex: 1,
            height: 4, borderRadius: 4,
            background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute', inset: 0, width: `${pct}%`,
              background: '#C9942A', borderRadius: 4,
              transformOrigin: 'left',
              animation: 'fillBar 800ms cubic-bezier(.2,.7,.2,1) 200ms both',
              '--p': 1
            }} />
          </div>
          <div style={{
            fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
            color: 'var(--text-3)'
          }}>{pct}%</div>
        </div>
      </div>

      {/* Group 4: award */}
      <div style={{
        fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
        color: 'var(--gold-dim)'
      }}>
        Award: <span style={{ color: '#C9942A', fontWeight: 500 }}>+{ch.award.toLocaleString()} mi</span>
      </div>
    </button>);

}

// ─────────────────────────────────────────────────────────────
// Tab bar
// ─────────────────────────────────────────────────────────────
function TabBar({ active, onSelect }) {
  const tabs = [
  { k: 'home', label: 'Home', icon: (c, fill) =>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 9 L10 3 L17 9 L17 17 L12 17 L12 12 L8 12 L8 17 L3 17 Z" stroke={c} strokeWidth="1.4" fill={fill ? c : 'none'} fillOpacity={fill ? 0.15 : 0} /></svg>
  },
  { k: 'offers', label: 'Offers', icon: (c, fill) =>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2 L17 5 L17 11 C17 14.5 14 17.5 10 18 C6 17.5 3 14.5 3 11 L3 5 Z" stroke={c} strokeWidth="1.4" fill={fill ? c : 'none'} fillOpacity={fill ? 0.15 : 0} /></svg>
  },
  { k: 'loyalty', label: 'Loyalty', icon: (c) =>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1 L12.5 7.5 L19 8.2 L14 12.5 L15.5 19 L10 15.7 L4.5 19 L6 12.5 L1 8.2 L7.5 7.5 Z" stroke={c} strokeWidth="1.4" fill="none" /></svg>
  },
  { k: 'wallet', label: 'Wallet', icon: (c) =>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="5" width="15" height="11" rx="2" stroke={c} strokeWidth="1.4" /><path d="M14 11 h2" stroke={c} strokeWidth="1.4" strokeLinecap="round" /></svg>
  },
  { k: 'profile', label: 'Profile', icon: (c) =>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke={c} strokeWidth="1.4" /><path d="M3 17 C3 13.5 6.2 11.5 10 11.5 C13.8 11.5 17 13.5 17 17" stroke={c} strokeWidth="1.4" fill="none" /></svg>
  }];

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 22, paddingTop: 8,
      background: 'rgba(7,9,14,0.92)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex', justifyContent: 'space-around',
      zIndex: 30
    }}>
      {tabs.map((t) => {
        const isActive = active === t.k;
        const c = isActive ? '#C9942A' : 'rgba(240,237,232,0.35)';
        return (
          <button key={t.k} onClick={() => onSelect(t.k)} style={{
            all: 'unset', cursor: 'pointer',
            flex: 1, height: 48,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4,
            position: 'relative'
          }}>
            {isActive &&
            <div style={{
              position: 'absolute', top: 0,
              width: 26, height: 2, background: '#C9942A',
              borderRadius: 2,
              boxShadow: '0 0 6px rgba(201,148,42,0.6)'
            }} />
            }
            {t.icon(c, isActive)}
            <span style={{
              fontFamily: FONT_UI, fontSize: 9.5, fontWeight: isActive ? 500 : 400,
              color: c, letterSpacing: '0.08em'
            }}>{t.label}</span>
          </button>);

      })}
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────
function Toast({ text }) {
  if (!text) return null;
  return (
    <div style={{
      position: 'absolute', bottom: 96, left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(20,18,12,0.95)',
      border: '1px solid rgba(201,148,42,0.3)',
      color: 'var(--text-1)',
      fontFamily: FONT_UI, fontSize: 12.5,
      padding: '10px 16px', borderRadius: 999,
      animation: 'toastIn 200ms ease-out',
      zIndex: 50,
      boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
      whiteSpace: 'nowrap',
      maxWidth: '80%'
    }}>{text}</div>);

}

Object.assign(window, {
  PAD, GAP, RADIUS, FONT_DISPLAY, FONT_UI,
  MashrabiyaBg, TierPill, Tag, PlaneIcon, LottiePlane,
  ClearbitImg, EmiratesMark, TopBar, NotificationBell, PageHeader, HeroSky, MilesBlock, SectionHeader,
  PartnerLogo, MoreMenu, MoreDots, GoldButton,
  SmartNudge, BirthdayCard,
  ChallengeIcon, ChallengeCard,
  TabBar, Toast
});