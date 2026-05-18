// REDEMPTION CONFIRMATION SCREEN — Emirates Skywards
// 4 cases driven by offer.mechanic:
//   - code:    FLAT OFF, % OFF (any "% OFF" or "FLAT")  → code block
//   - voucher: BUNDLE, COMPANION-ground (offline) → QR + barcode
//   - linked:  N× MILES → auto-apply on linked card
//   - deeplink: COMPANION (flight) → opens partner app
// Slides up from below, full screen overlay above OfferDetail.

function classifyMechanic(offer) {
  const m = (offer.mechanic || '').toUpperCase();
  if (m === 'BUNDLE') return 'voucher';
  if (m === 'COMPANION') return 'deeplink';
  if (/MILES/.test(m)) return 'linked';
  return 'code';
}

// Deterministic pseudo-random per offer.id for QR pattern
function rng(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

// SVG QR-like pattern, 21×21 modules. Real enough for visual fidelity.
function QRCode({ value, size = 160 }) {
  const cells = 25;
  const cell = size / cells;
  const r = rng(value);
  const grid = React.useMemo(() => {
    const g = [];
    for (let y = 0; y < cells; y++) {
      const row = [];
      for (let x = 0; x < cells; x++) row.push(r() > 0.5 ? 1 : 0);
      g.push(row);
    }
    // Three finder patterns (corners): 7×7 with ring
    const finder = (cx, cy) => {
      for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
        const inOuter = x === 0 || x === 6 || y === 0 || y === 6;
        const inInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        g[cy + y][cx + x] = (inOuter || inInner) ? 1 : 0;
      }
    };
    finder(0, 0); finder(cells - 7, 0); finder(0, cells - 7);
    // Quiet zone around finders
    const clear = (cx, cy, w, h) => {
      for (let y = cy; y < cy + h && y < cells; y++)
        for (let x = cx; x < cx + w && x < cells; x++)
          if (x === cx + w - 1 || y === cy + h - 1) g[y][x] = 0;
    };
    clear(0, 7, 8, 1); clear(7, 0, 1, 8);
    clear(cells - 8, 7, 8, 1); clear(cells - 8, 0, 1, 7);
    clear(0, cells - 8, 8, 1); clear(7, cells - 8, 1, 8);
    return g;
  }, [value]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', background: '#fff', borderRadius: 8 }}>
      {grid.map((row, y) =>
        row.map((v, x) => v ? (
          <rect key={`${x}-${y}`} x={x * cell} y={y * cell}
            width={cell} height={cell} fill="#07090E" />
        ) : null)
      )}
    </svg>
  );
}

// Small barcode (Code 128-ish stripes — visual only)
function Barcode({ value, width = 220, height = 44 }) {
  const r = rng(value + 'bar');
  const bars = React.useMemo(() => {
    const arr = [];
    let x = 0;
    while (x < width) {
      const w = 1 + Math.floor(r() * 4);
      arr.push({ x, w });
      x += w + 1 + Math.floor(r() * 2);
    }
    return arr;
  }, [value, width]);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', background: '#fff', borderRadius: 4 }}>
      {bars.map((b, i) => (
        <rect key={i} x={b.x + 6} y={4} width={b.w} height={height - 8} fill="#07090E" />
      ))}
    </svg>
  );
}

// Confetti burst — 14 gold sparkles, 1s, then auto-stops
function Confetti() {
  const pieces = React.useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      k: i,
      x: 50 + (Math.random() - 0.5) * 30,
      tx: (Math.random() - 0.5) * 280,
      ty: -120 - Math.random() * 220,
      rot: Math.random() * 360,
      d: Math.random() * 120,
      hue: Math.random() > 0.5 ? '#C9942A' : '#F0D684',
      size: 4 + Math.random() * 4,
    }));
  }, []);
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      overflow: 'hidden', zIndex: 30,
    }}>
      {pieces.map(p => (
        <span key={p.k} style={{
          position: 'absolute', top: '40%', left: `${p.x}%`,
          width: p.size, height: p.size, borderRadius: 1,
          background: p.hue,
          boxShadow: `0 0 6px ${p.hue}`,
          opacity: 0,
          transform: `translate(0,0) rotate(0deg)`,
          animation: `confettiBurst 1100ms cubic-bezier(.15,.7,.25,1) ${p.d}ms forwards`,
          '--tx': `${p.tx}px`, '--ty': `${p.ty}px`, '--rot': `${p.rot}deg`,
        }} />
      ))}
    </div>
  );
}

// Big green check that draws in 300ms
function SuccessCheck({ size = 56 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'rgba(82,192,138,0.12)',
      border: '1.5px solid rgba(82,192,138,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 24px rgba(82,192,138,0.25)',
      animation: 'checkPop 320ms cubic-bezier(.2,.7,.2,1) both',
    }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 16 16" fill="none">
        <path d="M3 8.5 L7 12 L14 4"
          stroke="#52C08A" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            strokeDasharray: 22, strokeDashoffset: 22,
            animation: 'checkDraw 300ms 120ms cubic-bezier(.2,.7,.2,1) forwards',
          }} />
      </svg>
    </div>
  );
}

// Miles earned + progress block — shared across all 4 cases
function MilesEarnedBlock({ offer }) {
  const milesGoal = MEMBER.miles + MEMBER.toNextTier;
  const newBalance = MEMBER.miles + offer.miles;
  const pct = Math.min(100, Math.round((newBalance / milesGoal) * 100));
  return (
    <div style={{
      background: 'rgba(201,148,42,0.06)',
      border: '1px solid rgba(201,148,42,0.2)',
      borderRadius: 12, padding: '16px 20px',
    }}>
      <div style={{
        fontFamily: FONT_UI, fontWeight: 500, fontSize: 10,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--text-2)',
      }}>You earned</div>
      <div style={{
        marginTop: 6,
        fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 32,
        lineHeight: 1, color: '#52C08A', letterSpacing: '-0.01em',
      }}>+{offer.miles.toLocaleString()} miles</div>
      <div style={{
        marginTop: 6,
        fontFamily: FONT_UI, fontWeight: 400, fontSize: 12,
        color: 'var(--text-2)',
      }}>
        Your balance:{' '}
        <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>
          {newBalance.toLocaleString()} miles
        </span>
      </div>
      <div style={{
        marginTop: 12, height: 4, borderRadius: 4,
        background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${pct}%`,
          background: '#C9942A', borderRadius: 4,
          boxShadow: '0 0 8px rgba(201,148,42,0.4)',
          transformOrigin: 'left',
          animation: 'fillBar 900ms cubic-bezier(.2,.7,.2,1) 400ms both',
          '--p': 1,
        }} />
      </div>
      <div style={{
        marginTop: 8, display: 'flex', justifyContent: 'space-between',
        fontFamily: FONT_UI, fontWeight: 400, fontSize: 10,
        letterSpacing: '0.06em',
      }}>
        <span style={{ color: '#C9942A' }}>{pct}% to {MEMBER.nextTier}</span>
        <span style={{ color: 'var(--text-3)' }}>{MEMBER.nextTier}</span>
      </div>
    </div>
  );
}

// Numbered step list — shared
function StepList({ steps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {steps.map((t, i) => (
        <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            border: '1px solid rgba(201,148,42,0.5)',
            color: '#C9942A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT_UI, fontWeight: 500, fontSize: 12,
            flexShrink: 0,
          }}>{i + 1}</div>
          <div style={{
            fontFamily: FONT_UI, fontWeight: 400, fontSize: 13, lineHeight: 1.55,
            color: 'var(--text-2)', marginTop: 2,
          }}>{t}</div>
        </div>
      ))}
    </div>
  );
}

// Ghost button — outlined, for secondary actions
function GhostButton({ children, onClick, gold = true }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick?.(); }} style={{
      all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: '100%', height: 44, borderRadius: 12,
      border: `1px solid ${gold ? 'rgba(201,148,42,0.5)' : 'rgba(255,255,255,0.12)'}`,
      background: gold ? 'rgba(201,148,42,0.04)' : 'transparent',
      color: gold ? '#C9942A' : 'var(--text-1)',
      fontFamily: FONT_UI, fontWeight: 500, fontSize: 13,
      letterSpacing: '0.04em',
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────
function RedemptionScreen({ offer, onBack, onBackToOffers, onToast }) {
  if (!offer) return null;
  const caseType = classifyMechanic(offer);
  const isDeeplink = caseType === 'deeplink';
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [qrFullscreen, setQrFullscreen] = React.useState(false);

  // Build a stable reference code from offer id + member tier suffix
  const code = React.useMemo(() => {
    const partnerKey = offer.partner.slice(0, 3).toUpperCase();
    const idHash = offer.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const suffix = (idHash % 9000 + 1000).toString();
    const letter = String.fromCharCode(65 + (idHash % 26));
    return `EK-${partnerKey}-2024-${suffix.slice(0, 1)}${letter}${suffix.slice(1, 2)}${letter[0] === 'K' ? 'M' : 'K'}`;
  }, [offer.id, offer.partner]);

  const copyCode = (e) => {
    e?.stopPropagation?.();
    try {
      navigator.clipboard?.writeText(code);
    } catch (_) { /* noop */ }
    onToast?.('Copied!');
  };

  const title = isDeeplink ? 'Redirecting' : 'Offer Redeemed';

  return (
    <div data-screen-label="07 Redemption" style={{
      position: 'absolute', inset: 0, background: '#07090E',
      zIndex: 50, animation: 'slideUp 320ms cubic-bezier(.2,.7,.2,1)',
      display: 'flex', flexDirection: 'column',
      paddingTop: 56, overflow: 'hidden',
    }}>
      <Confetti />

      {/* gold glow */}
      <div style={{
        position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)',
        width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,148,42,0.16), transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'visible', paddingBottom: 24, position: 'relative', zIndex: 1 }}>
        {/* Sticky header — back · title · more */}
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
            all: 'unset', cursor: 'pointer',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2 L3 7 L9 12" stroke="var(--text-1)" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{
            flex: 1, padding: '0 12px', textAlign: 'center',
            fontFamily: FONT_UI, fontSize: 11, fontWeight: 500,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--text-2)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{isDeeplink ? 'Redirecting' : 'Redeemed'}</div>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <MoreDots light onClick={() => setMenuOpen(o => !o)} />
            <MoreMenu open={menuOpen}
              items={['Save', 'Share', 'Report']}
              onClose={() => setMenuOpen(false)}
              onAction={(it) => onToast?.(`${it} — ${offer.title}`)} />
          </div>
        </div>

        {/* Hero: check + partner logo + title */}
        <div style={{
          padding: `8px ${PAD}px 0`,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          gap: 14,
        }}>
          {isDeeplink ? (
            <PartnerLogo domain={offer.domain} size={56} />
          ) : (
            <SuccessCheck size={56} />
          )}
          <div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 24,
              color: 'var(--text-1)', letterSpacing: '-0.01em', lineHeight: 1.15,
            }}>{title}</div>
            <div style={{
              marginTop: 6,
              fontFamily: FONT_UI, fontWeight: 400, fontSize: 13,
              color: 'var(--text-2)', lineHeight: 1.45,
            }}>
              <span style={{ color: 'var(--gold-dim)' }}>{offer.partner}</span>
              {' · '}{offer.title}
            </div>
          </div>
        </div>

        {/* Case-specific content */}
        <div style={{ padding: `28px ${PAD}px 0` }}>
          {caseType === 'code' && (
            <CodeCase code={code} onCopy={copyCode} />
          )}
          {caseType === 'voucher' && (
            <VoucherCase code={code}
              onExpandQR={() => setQrFullscreen(true)}
              onCopy={copyCode} />
          )}
          {caseType === 'linked' && (
            <LinkedCardCase />
          )}
          {caseType === 'deeplink' && (
            <DeeplinkCase code={code} onCopy={copyCode}
              onOpen={() => onToast?.(`Opening ${offer.partner}…`)} />
          )}
        </div>

        {/* How to use */}
        <div style={{ padding: `28px ${PAD}px 0` }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 15,
            letterSpacing: '0.02em',
            color: 'rgba(240,237,232,0.7)', marginBottom: 14,
          }}>
            {caseType === 'linked' ? 'How it works' : 'How to use'}
          </div>
          <StepList steps={STEPS[caseType](offer)} />
        </div>

        {/* Miles earned */}
        <div style={{ padding: `28px ${PAD}px 0` }}>
          <MilesEarnedBlock offer={offer} />
        </div>

        {/* Bottom actions — vary per case */}
        <div style={{ padding: `24px ${PAD}px 0`, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {caseType === 'code' && (
            <>
              <GhostButton gold onClick={() => onToast?.('Saved to Wallet')}>Add to Wallet</GhostButton>
              <GhostButton gold={false} onClick={() => onToast?.('Share sheet opened')}>Share Code</GhostButton>
            </>
          )}
          {caseType === 'voucher' && (
            <>
              <GhostButton gold onClick={() => onToast?.('Saved to Wallet')}>Add to Wallet</GhostButton>
              <GhostButton gold={false} onClick={() => onToast?.('Share sheet opened')}>Share Voucher</GhostButton>
            </>
          )}
          {caseType === 'linked' && (
            <>
              <GhostButton gold onClick={() => onToast?.('Manage linked cards')}>Manage Linked Cards</GhostButton>
            </>
          )}
          {caseType === 'deeplink' && (
            <>
              <GoldButton onClick={() => onToast?.(`Opening ${offer.partner} app`)}
                confirmLabel="Opening">
                Open {offer.partner} →
              </GoldButton>
              <button onClick={copyCode} style={{
                all: 'unset', cursor: 'pointer', textAlign: 'center',
                fontFamily: FONT_UI, fontSize: 12, color: '#C9942A',
                letterSpacing: '0.04em', padding: '8px 0',
              }}>Or copy link instead</button>
            </>
          )}
        </div>

        {/* Back to offers — always at the very bottom */}
        <div style={{ padding: `24px ${PAD}px 24px`, textAlign: 'center' }}>
          <button onClick={onBackToOffers} style={{
            all: 'unset', cursor: 'pointer',
            fontFamily: FONT_UI, fontSize: 13, fontWeight: 400,
            color: '#C9942A', letterSpacing: '0.04em',
          }}>Back to Offers</button>
        </div>
      </div>

      {/* Fullscreen QR overlay */}
      {qrFullscreen && (
        <div onClick={() => setQrFullscreen(false)} style={{
          position: 'absolute', inset: 0, zIndex: 100,
          background: 'rgba(7,9,14,0.96)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 24,
          animation: 'fadeRise 240ms ease both',
        }}>
          <button onClick={() => setQrFullscreen(false)} style={{
            position: 'absolute', top: 56, right: 20,
            all: 'unset', cursor: 'pointer',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT_UI, fontSize: 18, color: 'var(--text-1)',
          }}>×</button>
          <div style={{ background: '#fff', padding: 20, borderRadius: 16 }}>
            <QRCode value={code} size={280} />
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 16, color: '#C9942A', letterSpacing: '0.12em',
          }}>{code}</div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Case bodies
// ─────────────────────────────────────────────────────────────

function CodeCase({ code, onCopy }) {
  return (
    <>
      <button onClick={onCopy} style={{
        all: 'unset', cursor: 'pointer', display: 'block', width: '100%', boxSizing: 'border-box',
        background: 'rgba(201,148,42,0.08)',
        border: '1px solid rgba(201,148,42,0.4)',
        borderRadius: 12,
        padding: '20px',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: FONT_UI, fontWeight: 500, fontSize: 10,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--text-2)',
        }}>Your redemption code</div>
        <div style={{
          marginTop: 14,
          fontFamily: 'JetBrains Mono, ui-monospace, "SF Mono", monospace',
          fontWeight: 500, fontSize: 24, color: '#C9942A',
          letterSpacing: '0.08em',
        }}>{code}</div>
        <div style={{
          marginTop: 12,
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
          color: 'var(--text-2)',
        }}>Tap to copy</div>
      </button>
      <div style={{
        marginTop: 14, textAlign: 'center',
        fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
        color: '#C9942A', letterSpacing: '0.04em',
      }}>Valid for 7 days · Single use only</div>
    </>
  );
}

function VoucherCase({ code, onExpandQR, onCopy }) {
  return (
    <>
      <div style={{
        background: 'rgba(201,148,42,0.06)',
        border: '1px solid rgba(201,148,42,0.3)',
        borderRadius: 12, padding: '20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          fontFamily: FONT_UI, fontWeight: 500, fontSize: 10,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--text-2)',
        }}>Show this at the store</div>
        <button onClick={onExpandQR} style={{
          all: 'unset', cursor: 'pointer',
          padding: 10, background: '#fff', borderRadius: 8,
          boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
        }}>
          <QRCode value={code} size={160} />
        </button>
        <button onClick={onCopy} style={{
          all: 'unset', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        }}>
          <Barcode value={code} width={240} height={42} />
          <div style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 11, color: 'var(--text-2)', letterSpacing: '0.08em',
          }}>{code}</div>
        </button>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 999,
          background: 'rgba(201,148,42,0.1)',
          border: '1px solid rgba(201,148,42,0.4)',
          fontFamily: FONT_UI, fontWeight: 500, fontSize: 11,
          color: '#C9942A',
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%', background: '#C9942A',
            boxShadow: '0 0 6px rgba(201,148,42,0.6)',
          }} />
          Expires in 6 days
        </div>
      </div>
      <div style={{
        marginTop: 12, textAlign: 'center',
        fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
        color: 'var(--text-2)',
      }}>Tap QR to expand fullscreen</div>
    </>
  );
}

function LinkedCardCase() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{
        display: 'inline-flex', alignSelf: 'flex-start',
        alignItems: 'center', gap: 6,
        padding: '5px 12px', borderRadius: 999,
        background: 'rgba(82,192,138,0.1)',
        border: '1px solid rgba(82,192,138,0.4)',
        fontFamily: FONT_UI, fontWeight: 500, fontSize: 11,
        color: '#52C08A', letterSpacing: '0.1em',
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%', background: '#52C08A',
          boxShadow: '0 0 6px rgba(82,192,138,0.6)',
        }} />
        OFFER ACTIVATED
      </div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 20,
        color: 'var(--text-1)', lineHeight: 1.3, letterSpacing: '-0.005em',
      }}>This offer is now active on your linked card</div>
      <div style={{
        fontFamily: FONT_UI, fontWeight: 400, fontSize: 13,
        color: 'var(--text-2)', lineHeight: 1.55,
      }}>
        Just pay with your linked Visa or Mastercard at the partner outlet —
        miles credited automatically.
      </div>

      {/* Card chip */}
      <div style={{
        marginTop: 4,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: '16px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 38, height: 28, borderRadius: 4,
          background: 'linear-gradient(135deg, #d4a437, #8a6418)',
          flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 14, color: 'var(--text-1)', letterSpacing: '0.16em',
          }}>•••• •••• •••• 4829</div>
          <div style={{
            marginTop: 4,
            fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
            color: 'var(--text-2)',
          }}>Visa · Default for offers</div>
        </div>
        <span style={{
          fontFamily: FONT_UI, fontWeight: 700, fontSize: 13,
          fontStyle: 'italic', color: '#1A1F71', letterSpacing: '-0.04em',
          background: '#fff', padding: '3px 8px', borderRadius: 4,
        }}>VISA</span>
      </div>
      <div style={{
        marginTop: -4,
        fontFamily: FONT_UI, fontWeight: 500, fontSize: 11,
        color: '#C9942A', letterSpacing: '0.04em',
      }}>Active for 30 days</div>
    </div>
  );
}

function DeeplinkCase({ code, onCopy, onOpen }) {
  return (
    <>
      <div style={{
        fontFamily: FONT_UI, fontWeight: 500, fontSize: 10,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--text-2)', marginBottom: 16,
      }}>Opening partner app</div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 20,
        color: 'var(--text-1)', lineHeight: 1.3, letterSpacing: '-0.005em',
      }}>You're being redirected</div>
      <div style={{
        marginTop: 10,
        fontFamily: FONT_UI, fontWeight: 400, fontSize: 13,
        color: 'var(--text-2)', lineHeight: 1.55,
      }}>
        Your offer is pre-loaded and ready to apply once the partner app opens.
      </div>
      <div style={{
        marginTop: 20,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, padding: '12px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div>
          <div style={{
            fontFamily: FONT_UI, fontWeight: 400, fontSize: 10,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--text-3)',
          }}>Reference code</div>
          <div style={{
            marginTop: 4,
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 13, color: 'var(--text-1)', letterSpacing: '0.08em',
          }}>{code}</div>
        </div>
        <button onClick={onCopy} style={{
          all: 'unset', cursor: 'pointer',
          fontFamily: FONT_UI, fontSize: 12, fontWeight: 500,
          color: '#C9942A', letterSpacing: '0.04em',
        }}>Copy</button>
      </div>
    </>
  );
}

const STEPS = {
  code: (offer) => [
    `Present this code at ${offer.partner} when checking out.`,
    'Code is verified at checkout — discount applied automatically.',
    'Miles credited to your account within 48 hours.',
  ],
  voucher: (offer) => [
    `Open this screen at the ${offer.partner} reception or counter.`,
    'Ask staff to scan the QR code or barcode.',
    'Discount applied — miles credited within 48 hours.',
  ],
  linked: (offer) => [
    'Pay with your linked card at the partner outlet.',
    'Transaction detected automatically — no code needed.',
    'Miles credited within 24 hours of the transaction.',
  ],
  deeplink: (offer) => [
    `Tap Open ${offer.partner} to launch the partner app.`,
    'Your offer is pre-loaded — complete booking inside the app.',
    'Miles credited within 7 days of confirmed booking.',
  ],
};

Object.assign(window, { RedemptionScreen, classifyMechanic, QRCode, Barcode });
