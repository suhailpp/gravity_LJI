// ─────────────────────────────────────────────────────────────
// shared/OfferCard.jsx
// Self-contained Offer Card used by both mobile/ and web/.
// In mobile/: reuses window.PartnerLogo / MoreDots / MoreMenu / CardCTA
//   defined by mobile/components.jsx + mobile/redeem-inline.jsx.
// In web/: those globals don't exist, so visually-equivalent fallbacks
//   defined here are used instead.
// Component contract: { offer, distance, onOpen, onAction, width = 280 }
//
// IIFE wrapper: babel-standalone evals each text/babel script at global
// scope, so top-level `function Foo()` declarations get hoisted to
// window.Foo. The web project already defines its own `window.OfferCard`
// (web/gravty/ui.jsx — a dashboard campaign card). Without the IIFE the
// shared `function OfferCard()` would clobber it at hoist time, before any
// guard could run. Wrapping in an IIFE confines the declaration to a local
// scope; the wrapper then explicitly chooses whether to publish.
// ─────────────────────────────────────────────────────────────
(function () {
const _OC_RADIUS       = (typeof window !== 'undefined' && window.RADIUS)       || 16;
const _OC_FONT_UI      = (typeof window !== 'undefined' && window.FONT_UI)      || '"Fredoka", system-ui, sans-serif';
const _OC_FONT_DISPLAY = (typeof window !== 'undefined' && window.FONT_DISPLAY) || '"Source Serif 4", serif';

// ── Fallback PartnerLogo ────────────────────────────────────
function _OC_PartnerLogoFallback({ domain, size = 40 }) {
  const [failed, setFailed] = React.useState(false);
  const src = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#FFFFFF',
      border: '1px solid rgba(201,148,42,0.45)',
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {!failed ? (
        <img src={src} alt="" referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6, boxSizing: 'border-box' }} />
      ) : (
        <span style={{
          fontFamily: _OC_FONT_UI, fontWeight: 600, fontSize: size * 0.36, color: '#0C0F16',
        }}>{(domain[0] || '?').toUpperCase()}</span>
      )}
    </div>
  );
}

// ── Fallback MoreDots / MoreMenu ────────────────────────────
function _OC_MoreDotsFallback({ onClick, light = false }) {
  const c = light ? 'rgba(240,237,232,0.95)' : 'rgba(240,237,232,0.7)';
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick && onClick(); }} style={{
      all: 'unset', cursor: 'pointer',
      width: 32, height: 32, borderRadius: '50%',
      background: light ? 'rgba(7,9,14,0.55)' : 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1,
    }}>
      <svg width="14" height="3" viewBox="0 0 14 3">
        <circle cx="2" cy="1.5" r="1.3" fill={c} />
        <circle cx="7" cy="1.5" r="1.3" fill={c} />
        <circle cx="12" cy="1.5" r="1.3" fill={c} />
      </svg>
    </button>
  );
}

function _OC_MoreMenuFallback({ open, onClose, onAction, items = ['Save', 'Share', 'Dismiss'] }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
      <div style={{
        position: 'absolute', top: 38, right: 0, zIndex: 1000,
        width: 150,
        background: 'rgba(20,18,12,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
      }}>
        {items.map((it, i) => (
          <button key={it}
            onClick={(e) => { e.stopPropagation(); onAction(it); onClose(); }}
            style={{
              all: 'unset', cursor: 'pointer', display: 'block',
              width: '100%', boxSizing: 'border-box',
              padding: '10px 14px',
              fontFamily: _OC_FONT_UI, fontSize: 13, fontWeight: 400,
              color: it === 'Report' ? '#d18a8a' : '#F0EDE8',
              borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>{it}</button>
        ))}
      </div>
    </>
  );
}

// ── Fallback CardCTA ────────────────────────────────────────
// Visual-only "Redeem Now" gold button with the same press/confirm cycle
// (idle → pressed → confirmed "Code Copied ✓" → idle), styled to match
// the mobile design. No real redemption state machine.
function _OC_CardCTAFallback({ offer, tone = 'gold', height = 44 }) {
  const [phase, setPhase] = React.useState('idle');
  const timers = React.useRef([]);
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const purple = tone === 'purple';
  const base = purple
    ? { bg: 'rgba(88,28,255,0.85)', bgDark: 'rgba(58,18,180,0.95)',
        shadow: '0 10px 24px -8px rgba(88,28,255,0.5), inset 0 1px 0 rgba(255,255,255,0.18)' }
    : { bg: '#C9942A', bgDark: '#A67820',
        shadow: '0 8px 22px rgba(201,148,42,0.28), inset 0 1px 0 rgba(255,255,255,0.2)' };
  const onClick = (e) => {
    e?.stopPropagation?.();
    if (phase !== 'idle') return;
    setPhase('pressed');
    timers.current.push(setTimeout(() => setPhase('confirmed'), 100));
    timers.current.push(setTimeout(() => setPhase('idle'), 2300));
  };
  const isConfirmed = phase === 'confirmed';
  const isPressed = phase === 'pressed';
  const bg = isConfirmed ? base.bgDark : base.bg;
  const textColor = purple || isConfirmed ? '#fff' : '#07090E';
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: phase === 'idle' ? 'pointer' : 'default',
      pointerEvents: phase !== 'idle' ? 'none' : 'auto',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: '100%', height, boxSizing: 'border-box',
      borderRadius: 12, background: bg, color: textColor,
      fontFamily: _OC_FONT_UI, fontWeight: 600, fontSize: 14, letterSpacing: '0.04em',
      boxShadow: base.shadow,
      transform: isPressed ? 'scale(0.97)' : 'scale(1)',
      opacity: isPressed ? 0.85 : 1,
      transition: 'transform 100ms cubic-bezier(.2,.7,.2,1), opacity 100ms ease, background-color 240ms ease, color 240ms ease',
    }}>
      <span>{isConfirmed ? 'Code Copied ✓' : 'Redeem Now'}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// OfferCard — extracted from mobile/components.jsx as-is.
// Resolves dependencies from window.* (mobile) and falls back
// to local helpers above when those globals are absent (web).
// ─────────────────────────────────────────────────────────────
function OfferCard({ offer, distance, onOpen, onAction, width = 280 }) {
  const PartnerLogo = (typeof window !== 'undefined' && window.PartnerLogo) || _OC_PartnerLogoFallback;
  const MoreDots    = (typeof window !== 'undefined' && window.MoreDots)    || _OC_MoreDotsFallback;
  const MoreMenu    = (typeof window !== 'undefined' && window.MoreMenu)    || _OC_MoreMenuFallback;
  const CardCTA     = (typeof window !== 'undefined' && window.CardCTA)     || _OC_CardCTAFallback;

  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <div className="press-card" style={{
      width, flexShrink: 0,
      borderRadius: _OC_RADIUS,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      position: 'relative',
      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
      overflow: 'visible',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* ··· top-right kebab menu — Save / Share / Dismiss */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 5 }}
        onClick={(e) => e.stopPropagation()}>
        <MoreDots light onClick={() => setMenuOpen((o) => !o)} />
        <MoreMenu open={menuOpen}
          items={['Save', 'Share', 'Dismiss']}
          onClose={() => setMenuOpen(false)}
          onAction={(it) => onAction && onAction(it)} />
      </div>
      {/* image area */}
      <div onClick={onOpen} role="button" tabIndex={0} style={{
        cursor: 'pointer', position: 'relative',
        height: 160,
        borderTopLeftRadius: _OC_RADIUS,
        borderTopRightRadius: _OC_RADIUS,
        background: `linear-gradient(135deg, ${offer.swatch[0]}, ${offer.swatch[1]})`,
        overflow: 'hidden',
      }}>
        {offer.image &&
          <img src={offer.image} alt="" referrerPolicy="no-referrer"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.82 }} />
        }
        {/* fade into card bg at bottom */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: 60,
          background: 'linear-gradient(to bottom, rgba(7,9,14,0) 0%, rgba(12,15,22,0.55) 60%, rgba(12,15,22,0.92) 100%)',
        }} />
        {/* distance chip top-left */}
        {distance &&
          <span style={{
            position: 'absolute', top: 12, left: 12,
            padding: '4px 9px', borderRadius: 999,
            background: 'rgba(7,9,14,0.55)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontFamily: _OC_FONT_UI, fontSize: 11,
            color: 'var(--text-1)', fontWeight: 400,
          }}>{distance}</span>
        }
      </div>

      {/* partner logo overlap */}
      <div style={{ position: 'absolute', top: 160 - 20, left: 20, zIndex: 4 }}>
        <PartnerLogo domain={offer.domain} size={40} />
      </div>

      {/* content */}
      <div onClick={onOpen} style={{ cursor: 'pointer', padding: '28px 20px 0' }}>
        <div style={{
          fontFamily: _OC_FONT_UI, fontWeight: 400, fontSize: 13,
          color: 'var(--gold-dim)', letterSpacing: '0.02em', lineHeight: 1.2,
        }}>{offer.partner}</div>
        <div style={{
          marginTop: 6,
          fontFamily: _OC_FONT_DISPLAY, fontWeight: 300, fontSize: 18, lineHeight: 1.2,
          color: 'var(--text-1)', letterSpacing: '-0.005em',
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{offer.title}</div>
        <div style={{
          marginTop: 6,
          fontFamily: _OC_FONT_UI, fontWeight: 400, fontSize: 12, lineHeight: 1.5,
          color: 'var(--text-2)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', height: 36,
        }}>{offer.desc}</div>
        <div style={{
          marginTop: 10,
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: _OC_FONT_UI, fontSize: 11.5,
        }}>
          <span style={{ color: '#C9942A', fontWeight: 500 }}>+{offer.miles} mi</span>
          <span style={{ color: 'var(--text-3)' }}>·</span>
          <span style={{ color: '#E0A946' }}>Expires {offer.expires}</span>
        </div>
      </div>

      {/* Redeem CTA */}
      <div style={{ padding: '16px 20px 20px' }}>
        <CardCTA offer={offer} height={44} />
      </div>
    </div>
  );
}

// Mobile relies on the bare name `OfferCard` resolving to a window prop, but the
// web project (web/gravty/ui.jsx) already defines its own `window.OfferCard` for
// dashboard campaign cards. Don't clobber it — only set if unclaimed. Always
// expose under MobileOfferCard so consumers can pick the right one explicitly.
if (!window.OfferCard) window.OfferCard = OfferCard;
window.MobileOfferCard = OfferCard;
})();
