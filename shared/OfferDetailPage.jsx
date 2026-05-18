// ─────────────────────────────────────────────────────────────
// shared/OfferDetailPage.jsx
// Visual port of mobile/detail-screen.jsx → OfferDetail, made
// self-contained so it can render in either mobile/ or web/.
//
// Mobile (the live app) still uses mobile/detail-screen.jsx for the real
// state-machine'd detail flow. This shared port is what the web editor's
// Live Preview / Full Preview renders inside the iOS frame.
//
// Wrapped in an IIFE so top-level function declarations don't get hoisted
// to window and clobber names defined by other scripts. See the same
// pattern in shared/OfferCard.jsx.
//
// Skipped vs. detail-screen.jsx: the "You might also like" similar-offers
// carousel (requires the OFFERS data array, which web doesn't have) and
// the full MechanicCTASection redemption state machine (uses RedemptionContext).
// In their place: a sticky gold Redeem Now bar with the same idle→confirmed
// visual cycle as the mobile gold CTA.
// ─────────────────────────────────────────────────────────────
(function () {
const _OD_PAD          = (typeof window !== 'undefined' && window.PAD)          || 24;
const _OD_GAP          = (typeof window !== 'undefined' && window.GAP)          || 32;
const _OD_RADIUS       = (typeof window !== 'undefined' && window.RADIUS)       || 16;
const _OD_FONT_UI      = (typeof window !== 'undefined' && window.FONT_UI)      || '"Fredoka", system-ui, sans-serif';
const _OD_FONT_DISPLAY = (typeof window !== 'undefined' && window.FONT_DISPLAY) || '"Source Serif 4", serif';
const _OD_MEMBER       = (typeof window !== 'undefined' && window.MEMBER) || {
  tier: 'Gold', nextTier: 'Platinum', miles: 47300, toNextTier: 2700,
};

// ── Fallbacks ───────────────────────────────────────────────
function ODPartnerLogo({ domain, size = 52 }) {
  const W = window.PartnerLogo;
  if (W) return React.createElement(W, { domain, size });
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
      {!failed
        ? <img src={src} alt="" referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8, boxSizing: 'border-box' }} />
        : <span style={{ fontFamily: _OD_FONT_UI, fontWeight: 600, fontSize: size * 0.36, color: '#0C0F16' }}>
            {(domain[0] || '?').toUpperCase()}
          </span>
      }
    </div>
  );
}

function ODMoreDots({ onClick, light = true }) {
  const W = window.MoreDots;
  if (W) return React.createElement(W, { onClick, light });
  const c = 'rgba(240,237,232,0.95)';
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick && onClick(); }} style={{
      all: 'unset', cursor: 'pointer',
      width: 32, height: 32, borderRadius: '50%',
      background: 'rgba(7,9,14,0.55)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="14" height="3" viewBox="0 0 14 3">
        <circle cx="2" cy="1.5" r="1.3" fill={c} />
        <circle cx="7" cy="1.5" r="1.3" fill={c} />
        <circle cx="12" cy="1.5" r="1.3" fill={c} />
      </svg>
    </button>
  );
}

function ODMoreMenu({ open, onClose, onAction, items = ['Save', 'Share', 'Report'] }) {
  const W = window.MoreMenu;
  if (W) return React.createElement(W, { open, onClose, onAction, items });
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
      <div style={{
        position: 'absolute', top: 38, right: 0, zIndex: 1000,
        width: 150, background: 'rgba(20,18,12,0.97)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
        boxShadow: '0 12px 32px rgba(0,0,0,0.5)', overflow: 'hidden',
        backdropFilter: 'blur(12px)',
      }}>
        {items.map((it, i) => (
          <button key={it}
            onClick={(e) => { e.stopPropagation(); onAction && onAction(it); onClose(); }}
            style={{
              all: 'unset', cursor: 'pointer', display: 'block',
              width: '100%', boxSizing: 'border-box',
              padding: '10px 14px',
              fontFamily: _OD_FONT_UI, fontSize: 13, fontWeight: 400,
              color: it === 'Report' ? '#d18a8a' : '#F0EDE8',
              borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>{it}</button>
        ))}
      </div>
    </>
  );
}

function ODTag({ children, tone = 'default' }) {
  const W = window.Tag;
  if (W) return React.createElement(W, { tone }, children);
  const styles = {
    default: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.10)', color: 'var(--text-2)' },
    live:    { bg: 'rgba(126,201,166,0.12)', border: 'rgba(126,201,166,0.4)',  color: '#9DD9BD' },
    gold:    { bg: 'rgba(201,148,42,0.10)',  border: 'rgba(201,148,42,0.4)',   color: '#D6A93C' },
  };
  const s = styles[tone] || styles.default;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      fontFamily: _OD_FONT_UI, fontSize: 10, fontWeight: 500,
      letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// Sticky gold redeem CTA — visual cycle only, no real state machine.
function ODStickyCTA({ offer, onConfirm }) {
  const [phase, setPhase] = React.useState('idle');
  const timers = React.useRef([]);
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const onClick = (e) => {
    e?.stopPropagation?.();
    if (phase !== 'idle') return;
    setPhase('pressed');
    timers.current.push(setTimeout(() => setPhase('confirmed'), 120));
    timers.current.push(setTimeout(() => setPhase('idle'), 2400));
    onConfirm && onConfirm(offer);
  };
  const isConfirmed = phase === 'confirmed';
  const isPressed   = phase === 'pressed';
  return (
    <div style={{
      position: 'sticky', bottom: 0, left: 0, right: 0,
      padding: `16px ${_OD_PAD}px 22px`,
      background: 'linear-gradient(to top, rgba(7,9,14,1) 0%, rgba(7,9,14,0.92) 65%, rgba(7,9,14,0) 100%)',
      zIndex: 30,
    }}>
      <button onClick={onClick} style={{
        all: 'unset', cursor: phase === 'idle' ? 'pointer' : 'default',
        pointerEvents: phase !== 'idle' ? 'none' : 'auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', height: 52, boxSizing: 'border-box',
        borderRadius: 14,
        background: isConfirmed ? '#A67820' : '#C9942A',
        color: isConfirmed ? '#fff' : '#07090E',
        fontFamily: _OD_FONT_UI, fontWeight: 600, fontSize: 15, letterSpacing: '0.04em',
        boxShadow: '0 14px 32px rgba(201,148,42,0.32), inset 0 1px 0 rgba(255,255,255,0.22)',
        transform: isPressed ? 'scale(0.97)' : 'scale(1)',
        opacity: isPressed ? 0.88 : 1,
        transition: 'transform 120ms cubic-bezier(.2,.7,.2,1), opacity 120ms ease, background-color 240ms ease, color 240ms ease',
      }}>{isConfirmed ? 'Code Copied ✓' : 'Redeem Now'}</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OfferDetailPage — visual port of detail-screen.jsx → OfferDetail.
// Same banner + medallion overlap, status chips, Miles Impact block,
// Reward Details 2×2 grid, How to Redeem 1-2-3, sticky CTA.
// ─────────────────────────────────────────────────────────────
function OfferDetailPage({ offer, variant = 'default', onBack, onConfirm, onToast }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  if (!offer) return null;

  const isForYou = variant === 'for-you';
  const milesGoal = _OD_MEMBER.miles + _OD_MEMBER.toNextTier;
  const pct = Math.min(100, Math.round(((_OD_MEMBER.miles + (offer.miles || 0)) / milesGoal) * 100));
  const left = Math.max(0, milesGoal - _OD_MEMBER.miles - (offer.miles || 0));

  return (
    <div style={{
      position: 'relative', background: '#07090E',
      display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: 0,
    }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'visible', position: 'relative' }}>
        {/* Sticky header — back · OFFER label · ⋯ */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          height: 52, padding: '0 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(7,9,14,0.72)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <button onClick={onBack} style={{
            all: 'unset', cursor: onBack ? 'pointer' : 'default',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, opacity: onBack ? 1 : 0.3,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2 L3 7 L9 12" stroke="var(--text-1)" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div style={{
            flex: 1, padding: '0 12px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: _OD_FONT_UI, fontSize: 11, fontWeight: 500,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: isForYou ? '#fff' : 'var(--text-2)',
            whiteSpace: 'nowrap', overflow: 'hidden',
          }}>
            {isForYou && (
              <svg width="10" height="10" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                <path d="M7 0 L8.2 5.8 L14 7 L8.2 8.2 L7 14 L5.8 8.2 L0 7 L5.8 5.8 Z" fill="#C9942A"/>
              </svg>
            )}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isForYou ? 'For You' : 'Offer'}
            </span>
          </div>

          <div style={{ position: 'relative', flexShrink: 0 }}>
            <ODMoreDots light onClick={() => setMenuOpen(o => !o)} />
            <ODMoreMenu open={menuOpen}
              items={['Save', 'Share', 'Report']}
              onClose={() => setMenuOpen(false)}
              onAction={(it) => onToast && onToast(`${it} — ${offer.title}`)} />
          </div>
        </div>

        {/* Banner */}
        <div style={{
          position: 'relative', height: 220,
          background: `linear-gradient(135deg, ${(offer.swatch && offer.swatch[0]) || '#3a2a1a'}, ${(offer.swatch && offer.swatch[1]) || '#1a1208'})`,
          overflow: 'visible',
        }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {offer.image && (
              <img src={offer.image} alt="" referrerPolicy="no-referrer"
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', opacity: 0.85,
                }} />
            )}
            <div style={{
              position: 'absolute', inset: 0,
              background: isForYou
                ? 'linear-gradient(to bottom, rgba(88,28,255,0.25) 0%, rgba(88,28,255,0.15) 30%, rgba(88,28,255,0.4) 70%, rgba(12,15,22,1) 100%)'
                : 'linear-gradient(to bottom, rgba(7,9,14,0.4) 0%, rgba(7,9,14,0) 30%, rgba(7,9,14,0) 55%, rgba(7,9,14,1) 95%)',
            }} />
          </div>
          {/* Partner medallion */}
          <div style={{ position: 'absolute', left: _OD_PAD, bottom: -26, zIndex: 4 }}>
            <ODPartnerLogo domain={offer.domain} size={52} />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: `40px ${_OD_PAD}px 0`, textAlign: 'left' }}>
          <div style={{
            fontFamily: _OD_FONT_UI, fontWeight: 400,
            fontSize: 13, color: 'var(--gold-dim)', letterSpacing: '0.04em',
          }}>{offer.partner}</div>

          <div style={{
            marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}>
            <ODTag tone="live">
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#7ec9a6', boxShadow: '0 0 6px rgba(126,201,166,0.7)',
              }} />
              LIVE
            </ODTag>
            <ODTag tone="default">⏳ 60 DAYS LEFT</ODTag>
            {offer.elite && <ODTag tone="gold">✦ ELITE FAVORITE</ODTag>}
          </div>

          <h1 style={{
            margin: '14px 0 10px',
            fontFamily: _OD_FONT_DISPLAY, fontWeight: 300, fontSize: 32, lineHeight: 1.15,
            color: 'var(--text-1)', letterSpacing: '-0.015em',
          }}>{offer.title}</h1>

          <p style={{
            margin: 0, maxWidth: 360,
            fontFamily: _OD_FONT_UI, fontWeight: 400, fontSize: 13.5, lineHeight: 1.6,
            color: 'var(--text-2)',
          }}>
            {offer.desc} Stack with any base earn rate. Subject to inventory and blackout dates outlined below.
          </p>

          <div style={{
            marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}>
            {[offer.tier, offer.mechanic, offer.region, 'Stack with miles']
              .filter(Boolean)
              .map(t => <ODTag key={String(t)} tone="default">{t}</ODTag>)}
          </div>
        </div>

        {/* MILES IMPACT — two clear sections */}
        <div style={{ padding: `${_OD_GAP}px ${_OD_PAD}px 0` }}>
          <div style={{
            background: 'rgba(201,148,42,0.06)',
            border: '1px solid rgba(201,148,42,0.2)',
            borderRadius: 12,
            padding: '16px 20px',
          }}>
            <div style={{
              fontFamily: _OD_FONT_DISPLAY, fontWeight: 300, fontSize: 15,
              color: 'rgba(240,237,232,0.7)', letterSpacing: '0.02em',
            }}>You will earn</div>
            <div style={{
              marginTop: 8,
              fontFamily: _OD_FONT_DISPLAY, fontWeight: 300, fontSize: 32,
              lineHeight: 1, color: '#52C08A', letterSpacing: '-0.01em',
            }}>+{(offer.miles || 0).toLocaleString()} miles</div>
            <div style={{
              marginTop: 4,
              fontFamily: _OD_FONT_UI, fontWeight: 400, fontSize: 12,
              color: 'var(--text-2)',
            }}>from this offer</div>

            <div style={{ height: 1, margin: '16px 0', background: 'rgba(255,255,255,0.06)' }} />

            <div style={{
              fontFamily: _OD_FONT_DISPLAY, fontWeight: 300, fontSize: 15,
              color: 'rgba(240,237,232,0.7)', letterSpacing: '0.02em',
            }}>After redeeming this offer</div>
            <div style={{
              marginTop: 10, height: 4, borderRadius: 4,
              background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0, width: `${pct}%`,
                background: '#C9942A', borderRadius: 4,
                boxShadow: '0 0 8px rgba(201,148,42,0.4)',
              }} />
            </div>
            <div style={{
              marginTop: 6,
              display: 'flex', justifyContent: 'space-between',
              fontFamily: _OD_FONT_UI, fontWeight: 400, fontSize: 10,
              color: 'var(--text-3)', letterSpacing: '0.06em',
            }}>
              <span style={{ color: '#C9942A' }}>{_OD_MEMBER.tier}</span>
              <span style={{ color: '#C9942A' }}>{pct}%</span>
              <span>{_OD_MEMBER.nextTier}</span>
            </div>
            <div style={{
              marginTop: 12,
              fontFamily: _OD_FONT_UI, fontWeight: 400, fontSize: 12,
              color: 'var(--text-2)',
            }}>
              <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{left.toLocaleString()}</span>{' '}
              miles still to {_OD_MEMBER.nextTier}
            </div>
          </div>
        </div>

        {/* Reward details 2×2 */}
        <div style={{ padding: `${_OD_GAP}px ${_OD_PAD}px 0` }}>
          <div style={{
            fontFamily: _OD_FONT_DISPLAY, fontWeight: 300, fontSize: 15,
            letterSpacing: '0.02em',
            color: 'rgba(240,237,232,0.7)', marginBottom: 14,
          }}>Reward details</div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 1, background: 'rgba(255,255,255,0.08)',
            borderRadius: _OD_RADIUS, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            {[
              ['Min Stay',  offer.minStay  || '2 nights'],
              ['Min Spend', offer.minSpend || 'AED 800/night'],
              ['Valid',     offer.valid    || 'Jun 1 – Jul 31'],
              ['Max',       offer.max      || '1 redemption'],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: 16, background: 'var(--surface, #0C0F16)' }}>
                <div style={{
                  fontFamily: _OD_FONT_UI, fontSize: 10, color: 'var(--text-3)',
                  textTransform: 'uppercase', letterSpacing: '0.18em',
                }}>{k}</div>
                <div style={{
                  marginTop: 6, fontFamily: _OD_FONT_UI, fontSize: 14, fontWeight: 500,
                  color: 'var(--text-1)',
                }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Redeem */}
        <div style={{ padding: `${_OD_GAP}px ${_OD_PAD}px 0` }}>
          <div style={{
            fontFamily: _OD_FONT_DISPLAY, fontWeight: 300, fontSize: 15,
            letterSpacing: '0.02em',
            color: 'rgba(240,237,232,0.7)', marginBottom: 14,
          }}>How to redeem</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Tap Redeem to generate your unique partner code.',
              `Present the code at ${offer.partner} at time of purchase.`,
              'Miles credit to your account within 7 days.',
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  border: '1px solid rgba(201,148,42,0.5)',
                  color: '#C9942A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: _OD_FONT_UI, fontWeight: 500, fontSize: 13,
                  flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{
                  fontFamily: _OD_FONT_UI, fontWeight: 400, fontSize: 13, lineHeight: 1.55,
                  color: 'var(--text-2)', marginTop: 3,
                }}>{t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom breathing room before sticky CTA */}
        <div style={{ height: 40 }} />
      </div>

      <ODStickyCTA offer={offer} onConfirm={onConfirm} />
    </div>
  );
}

// Mobile already has `window.OfferDetail` from mobile/detail-screen.jsx (the
// real stateful one). We expose a NEW name so we never clobber it. The web
// editor imports this name explicitly.
window.OfferDetailPage = OfferDetailPage;
})();
