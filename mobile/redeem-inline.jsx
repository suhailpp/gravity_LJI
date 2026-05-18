// REDEEM INLINE — 3-state CTA + inline code block.
//
// State 1 (idle):       gold #C9942A  "Claim for 1,500 mi" / "Activate Free"
// State 2 (loading 800ms): dark gold #8B6510 + spinner + "Processing..."
// State 3 (confirmed):  gold #C9942A  "✓ Redeem Now"  — PERMANENT
//                       Code block / QR slides up ABOVE the CTA.
//                       Tapping the CTA again re-copies the code.
//
// Never navigates away. Never closes.

// ─────────────────────────────────────────────────────────────
// Mechanic taxonomy + per-kind config
// ─────────────────────────────────────────────────────────────
function classifyMechanic2(mechanic) {
  const m = (mechanic || '').toUpperCase();
  if (m.includes('BOGO')) return 'bogo';
  if (m.includes('BUNDLE')) return 'voucher';
  if (m.includes('COMPANION') || m.includes('PARTNER')) return 'partner';
  if (m.includes('FLASH')) return 'flash';
  if (m.includes('CASHBACK')) return 'cashback';
  if (m.includes('MILES')) return 'multiplier';
  if (m.includes('BIRTHDAY')) return 'birthday';
  return 'flat'; // FLAT OFF, % OFF
}

// Default cost fallback if offer doesn't define `cost` (and isn't free).
const DEFAULT_COST = {
  bogo: 2500, flat: 1500, voucher: 1000, flash: 500, partner: 2000,
  multiplier: 0, cashback: 0, birthday: 0,
};

// Per-mechanic: which reveal block + processing/verb labels.
// Reveal kinds:
//   'code'  → code block (text)
//   'qr'    → QR + code label
//   'none'  → no reveal (cashback / multiplier / birthday)
const MECHANIC_CFG = {
  bogo:       { reveal: 'code', verb: 'Claim',    processing: 'Processing...' },
  flat:       { reveal: 'code', verb: 'Claim',    processing: 'Processing...' },
  voucher:    { reveal: 'qr',   verb: 'Claim',    processing: 'Generating...' },
  flash:      { reveal: 'code', verb: 'Claim',    processing: 'Securing...' },
  partner:    { reveal: 'code', verb: 'Claim',    processing: 'Preparing...' },
  multiplier: { reveal: 'none', verb: 'Activate', processing: 'Activating...' },
  cashback:   { reveal: 'none', verb: 'Activate', processing: 'Activating...' },
  birthday:   { reveal: 'none', verb: 'Claim',    processing: 'Activating...' },
};

function bonusMilesFor(offer) {
  return offer.miles || 0;
}

function costFor(offer) {
  if (typeof offer.cost === 'number') return offer.cost;
  const kind = classifyMechanic2(offer.mechanic);
  return DEFAULT_COST[kind] ?? 1000;
}

function isFreeOffer(offer) {
  return costFor(offer) === 0;
}

// Build a stable redemption code per offer
function buildCode(offer) {
  const partnerKey = (offer.partner || 'XX').slice(0, 3).toUpperCase();
  const idHash = (offer.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const suffix = (idHash % 9000 + 1000).toString();
  const letter = String.fromCharCode(65 + (idHash % 26));
  return `EK-${partnerKey}-2024-${suffix.slice(0, 1)}${letter}${suffix.slice(1, 2)}K`;
}

// ─────────────────────────────────────────────────────────────
// Spinner + checkmark glyphs
// ─────────────────────────────────────────────────────────────
function CTASpinner({ color = '#fff', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeOpacity="0.3" strokeWidth="2.4" />
      <path d="M21 12 A9 9 0 0 0 12 3" fill="none" stroke={color} strokeWidth="2.4"
        strokeLinecap="round"
        style={{ transformOrigin: '12px 12px', animation: 'spin 800ms linear infinite' }} />
    </svg>
  );
}

function CTACheck({ color = '#fff', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 8.5 L7 12 L14 4" stroke={color} strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{
          strokeDasharray: 20, strokeDashoffset: 20,
          animation: 'checkDraw 200ms cubic-bezier(.2,.7,.2,1) forwards',
        }} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 3-state CTA
// State 3 has NO checkmark. Label is "Redeem Now" by default;
// when the user taps it (re-copy), label flips to "Copy Code"
// for ~1.5s, then back. The button is permanent and always interactive.
// ─────────────────────────────────────────────────────────────
function MechanicCTA({ phase, cost, free, processingLabel, verb, disabled, onTap, tone = 'gold', height = 50, confirmedLabel = 'Redeem Now' }) {
  const isProcessing = phase === 'processing';
  const isConfirmed = phase === 'confirmed';
  const isAnimating = phase !== 'idle';

  const tones = {
    gold:   { idle1: '#C9942A', idle2: '#B07C1C', dark: '#8B6510',
              shadow: '0 8px 22px rgba(201,148,42,0.28), inset 0 1px 0 rgba(255,255,255,0.18)' },
    purple: { idle1: 'rgba(124,58,237,0.95)', idle2: 'rgba(88,28,255,0.95)', dark: 'rgba(58,18,180,0.95)',
              shadow: '0 10px 24px -8px rgba(88,28,255,0.5), inset 0 1px 0 rgba(255,255,255,0.18)' },
  };
  const t = tones[tone] || tones.gold;

  const bg = disabled ? 'rgba(120,120,120,0.18)'
    : isProcessing ? t.dark
    : t.idle1;
  const bg2 = disabled ? 'rgba(120,120,120,0.18)'
    : isProcessing ? t.dark
    : t.idle2;
  const shadow = disabled ? 'none' : t.shadow;

  return (
    <button
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); if (!isProcessing && !disabled) onTap?.(e); }}
      style={{
        all: 'unset', boxSizing: 'border-box',
        cursor: disabled ? 'not-allowed' : (isProcessing ? 'default' : 'pointer'),
        pointerEvents: isProcessing ? 'none' : 'auto',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        width: '100%', height, borderRadius: 12,
        background: isProcessing || disabled ? bg : `linear-gradient(180deg, ${bg} 0%, ${bg2} 100%)`,
        color: '#fff',
        boxShadow: shadow,
        opacity: disabled ? 0.85 : 1,
        transition: 'background-color 300ms ease, box-shadow 300ms ease',
      }}>
      {isProcessing && <CTASpinner color="#fff" size={16} />}
      {/* No tick mark in confirmed state — just the label */}

      {phase === 'idle' && (
        free ? (
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 6, whiteSpace: 'nowrap' }}>
            <span style={{
              fontFamily: FONT_UI, fontWeight: 500, fontSize: 13,
              color: '#fff', letterSpacing: '0.02em',
            }}>{verb}</span>
            <span style={{
              fontFamily: FONT_UI, fontWeight: 600, fontSize: 15,
              color: '#fff', letterSpacing: '0.01em',
            }}>Free</span>
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 6, whiteSpace: 'nowrap' }}>
            <span style={{
              fontFamily: FONT_UI, fontWeight: 500, fontSize: 13,
              color: '#fff', letterSpacing: '0.02em',
            }}>{verb} for</span>
            <span style={{
              fontFamily: FONT_UI, fontWeight: 600, fontSize: 15,
              color: '#fff', letterSpacing: '0.01em',
            }}>{cost.toLocaleString()} mi</span>
          </span>
        )
      )}

      {phase === 'processing' && (
        <span style={{
          fontFamily: FONT_UI, fontWeight: 500, fontSize: 14,
          letterSpacing: '0.04em', color: '#fff',
        }}>{processingLabel}</span>
      )}

      {phase === 'confirmed' && (
        <span style={{
          fontFamily: FONT_UI, fontWeight: 600, fontSize: 14,
          letterSpacing: '0.04em', color: '#fff',
        }}>{confirmedLabel}</span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// 2-column transaction summary
//   You spend         You earn
//   1,500 mi    →     +500 bonus mi
//   Balance after this offer: 41,300 mi
// ─────────────────────────────────────────────────────────────
function TransactionSummary({ cost, bonus, balance, insufficient, onBuyMiles, free }) {
  if (insufficient) {
    const need = cost - balance;
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8, marginBottom: 10,
        background: 'rgba(217,170,90,0.06)',
        border: '1px solid rgba(217,170,90,0.25)',
        borderRadius: 10, padding: '10px 14px',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 12,
          color: 'rgba(217,170,90,0.95)',
        }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5 L13 12 L1 12 Z" stroke="rgba(217,170,90,0.95)" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M7 5.5 V8" stroke="rgba(217,170,90,0.95)" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="7" cy="10" r="0.7" fill="rgba(217,170,90,0.95)" />
          </svg>
          Need {need.toLocaleString()} more miles
        </div>
        <button onClick={(e) => { e.stopPropagation(); onBuyMiles?.(); }} style={{
          all: 'unset', cursor: 'pointer',
          fontFamily: FONT_UI, fontWeight: 500, fontSize: 12,
          color: '#C9942A', letterSpacing: '0.02em',
        }}>Buy Miles →</button>
      </div>
    );
  }

  const balanceAfter = balance - cost;
  return (
    <div style={{
      marginBottom: 12,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10,
      padding: '14px 20px',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', columnGap: 12,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left' }}>
          <div style={{
            fontFamily: FONT_UI, fontWeight: 400, fontSize: 10,
            color: 'var(--text-2)', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>You spend</div>
          <div style={{
            fontFamily: FONT_UI, fontWeight: 600, fontSize: 16, lineHeight: 1.1,
            color: free ? '#52C08A' : '#fff', letterSpacing: '0.01em',
          }}>{free ? 'Free' : `${cost.toLocaleString()} mi`}</div>
        </div>
        <span style={{
          fontFamily: FONT_UI, fontSize: 16,
          color: 'rgba(240,237,232,0.3)', lineHeight: 1, padding: '0 4px',
        }}>→</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right' }}>
          <div style={{
            fontFamily: FONT_UI, fontWeight: 400, fontSize: 10,
            color: 'var(--text-2)', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>You earn</div>
          <div style={{
            fontFamily: FONT_UI, fontWeight: 600, fontSize: 16, lineHeight: 1.1,
            color: '#fff', letterSpacing: '0.01em',
          }}>+{bonus.toLocaleString()} bonus mi</div>
        </div>
      </div>
      {!free && (
        <div style={{
          marginTop: 10, paddingTop: 10,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
          color: 'var(--text-2)', textAlign: 'center',
        }}>
          Balance after this offer:{' '}
          <span style={{ color: 'rgba(240,237,232,0.85)', fontWeight: 500 }}>
            {balanceAfter.toLocaleString()} mi
          </span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inline code block — slides up above the CTA after confirm
// ─────────────────────────────────────────────────────────────
function CodeBlockInline({ code, validity = 'Valid 7 days · Single use', copied, onCopy }) {
  return (
    <div style={{
      animation: 'revealUp 320ms cubic-bezier(.2,.7,.2,1) both',
      background: 'rgba(12,15,22,0.97)',
      borderTop: '1px solid rgba(201,148,42,0.3)',
      borderLeft: '1px solid rgba(201,148,42,0.18)',
      borderRight: '1px solid rgba(201,148,42,0.18)',
      borderRadius: '12px 12px 0 0',
      padding: '14px 18px 22px',
      marginBottom: -10,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, marginBottom: 8,
      }}>
        <div style={{
          fontFamily: FONT_UI, fontWeight: 500, fontSize: 10,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--text-2)',
        }}>Voucher code</div>
        <button onClick={(e) => { e.stopPropagation(); onCopy?.(); }} style={{
          all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '5px 12px', borderRadius: 999,
          border: `1px solid ${copied ? 'rgba(82,192,138,0.5)' : 'rgba(201,148,42,0.5)'}`,
          background: copied ? 'rgba(82,192,138,0.08)' : 'rgba(201,148,42,0.06)',
          color: copied ? '#52C08A' : '#C9942A',
          fontFamily: FONT_UI, fontWeight: 500, fontSize: 11,
          letterSpacing: '0.04em',
          transition: 'all 200ms ease',
        }}>{copied ? '✓ Copied' : 'Copy'}</button>
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, ui-monospace, "SF Mono", monospace',
        fontWeight: 500, fontSize: 18, color: '#C9942A',
        letterSpacing: '0.08em',
        textAlign: 'center', padding: '4px 0',
      }}>{code}</div>
      <div style={{
        marginTop: 8,
        fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
        color: 'rgba(217,170,90,0.85)', textAlign: 'center',
      }}>{validity}</div>
    </div>
  );
}

function QRBlockInline({ code, copied, onCopy, onExpand }) {
  return (
    <div style={{
      animation: 'revealUp 320ms cubic-bezier(.2,.7,.2,1) both',
      background: 'rgba(12,15,22,0.97)',
      borderTop: '1px solid rgba(201,148,42,0.3)',
      borderLeft: '1px solid rgba(201,148,42,0.18)',
      borderRight: '1px solid rgba(201,148,42,0.18)',
      borderRadius: '12px 12px 0 0',
      padding: '14px 18px 22px',
      marginBottom: -10,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, marginBottom: 12,
      }}>
        <div style={{
          fontFamily: FONT_UI, fontWeight: 500, fontSize: 10,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--text-2)',
        }}>Show at the store</div>
        <button onClick={(e) => { e.stopPropagation(); onCopy?.(); }} style={{
          all: 'unset', cursor: 'pointer',
          padding: '5px 12px', borderRadius: 999,
          border: `1px solid ${copied ? 'rgba(82,192,138,0.5)' : 'rgba(201,148,42,0.5)'}`,
          background: copied ? 'rgba(82,192,138,0.08)' : 'rgba(201,148,42,0.06)',
          color: copied ? '#52C08A' : '#C9942A',
          fontFamily: FONT_UI, fontWeight: 500, fontSize: 11,
          letterSpacing: '0.04em',
        }}>{copied ? '✓ Copied' : 'Copy code'}</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={(e) => { e.stopPropagation(); onExpand?.(); }} style={{
          all: 'unset', cursor: 'pointer',
          padding: 8, background: '#fff', borderRadius: 8,
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
        }}>
          <QRCode value={code} size={120} />
        </button>
      </div>
      <div style={{
        marginTop: 10, textAlign: 'center',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 11, color: 'rgba(217,170,90,0.85)', letterSpacing: '0.08em',
      }}>{code}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MechanicCTASection — full sticky bar on Offer Detail.
// Shows: transaction summary above (when idle), CTA, and inline code
// block when confirmed. Stays here permanently — never navigates.
// ─────────────────────────────────────────────────────────────
function MechanicCTASection({ offer, balance, onToast, onBackToOffers }) {
  const ctx = React.useContext(window.RedemptionContext);
  const kind = classifyMechanic2(offer.mechanic);
  const cfg = MECHANIC_CFG[kind] || MECHANIC_CFG.flat;
  const cost = costFor(offer);
  const free = isFreeOffer(offer);
  const bonus = bonusMilesFor(offer);
  const code = React.useMemo(() => buildCode(offer), [offer.id, offer.partner]);
  const liveBalance = balance ?? ctx?.balance ?? MEMBER.miles;

  // Start in confirmed state if already redeemed
  const isAlreadyRedeemed = ctx?.isRedeemed?.(offer.id);
  const [phase, setPhase] = React.useState(isAlreadyRedeemed ? 'confirmed' : 'idle');
  const [copied, setCopied] = React.useState(false);
  const [ctaLabelFlipped, setCtaLabelFlipped] = React.useState(false);
  const [qrFullscreen, setQrFullscreen] = React.useState(false);
  const timers = React.useRef([]);
  const copyTimer = React.useRef(null);
  const ctaFlipTimer = React.useRef(null);

  React.useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    clearTimeout(copyTimer.current);
    clearTimeout(ctaFlipTimer.current);
  }, []);

  // Reset phase when offer changes
  React.useEffect(() => {
    setPhase(isAlreadyRedeemed ? 'confirmed' : 'idle');
  }, [offer.id, isAlreadyRedeemed]);

  const insufficient = !free && liveBalance < cost;
  const disabled = insufficient;

  const doCopy = () => {
    try { navigator.clipboard?.writeText(code); } catch (_) {}
    setCopied(true);
    onToast?.('Copied!');
    // Copy chip stays "✓ Copied" while on this screen — no auto-revert.
    // It resets to "Copy" on next screen visit (component remount).
  };

  const handleTap = () => {
    if (phase === 'processing') return;
    if (phase === 'confirmed') {
      // Re-copy on tap (for code/qr mechanics). Flip the CTA label to
      // "Copy Code" for 1.5s so the user knows what just happened.
      if (cfg.reveal !== 'none') {
        doCopy();
        setCtaLabelFlipped(true);
        clearTimeout(ctaFlipTimer.current);
        ctaFlipTimer.current = setTimeout(() => setCtaLabelFlipped(false), 1500);
      }
      return;
    }
    if (disabled) return;

    setPhase('processing');
    timers.current.push(setTimeout(() => {
      setPhase('confirmed');
      // Mark redeemed once we've reached confirmed — balance drops, list reorders,
      // other cards switch to confirmed state too.
      ctx?.markRedeemed?.(offer, { cost, bonus });
      // For code/qr, auto-copy on first reveal
      if (cfg.reveal !== 'none') doCopy();
    }, 800));
  };

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4,
      background: 'rgba(7,9,14,0.97)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: `14px ${PAD}px 28px`,
    }}>
      {/* Transaction summary — shown only in idle state */}
      {phase === 'idle' && (
        <TransactionSummary
          cost={cost} bonus={bonus} balance={liveBalance}
          free={free} insufficient={insufficient}
          onBuyMiles={() => onToast?.('Buy Miles — Coming Soon')}
        />
      )}

      {/* Inline code/QR block — shown only when confirmed and reveal is set */}
      {phase === 'confirmed' && cfg.reveal === 'code' && (
        <CodeBlockInline
          code={code}
          validity={kind === 'flash' ? 'Limited time · Single use' : 'Valid 7 days · Single use'}
          copied={copied}
          onCopy={doCopy}
        />
      )}
      {phase === 'confirmed' && cfg.reveal === 'qr' && (
        <QRBlockInline
          code={code}
          copied={copied}
          onCopy={doCopy}
          onExpand={() => setQrFullscreen(true)}
        />
      )}

      <MechanicCTA
        phase={phase}
        cost={cost}
        free={free}
        processingLabel={cfg.processing}
        verb={cfg.verb}
        disabled={disabled}
        onTap={handleTap}
        confirmedLabel={ctaLabelFlipped ? 'Copy Code' : 'Redeem Now'}
      />

      {/* Fullscreen QR */}
      {qrFullscreen && (
        <div onClick={() => setQrFullscreen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(7,9,14,0.96)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 24,
          animation: 'fadeRise 220ms ease both',
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
// CardCTA — self-contained 3-state button for offer/nudge/birthday cards.
// Same gold→dark gold→gold animation. No inline reveal. After confirm,
// stays at "✓ Redeem Now" — tapping again does nothing (cards have no code).
// To see / copy code: tap card body to open Offer Detail (the reveal lives there).
// ─────────────────────────────────────────────────────────────
function CardCTA({ offer, tone = 'gold', height = 44 }) {
  const ctx = React.useContext(window.RedemptionContext);
  const balance = ctx?.balance ?? MEMBER.miles;
  const kind = classifyMechanic2(offer.mechanic);
  const cfg = MECHANIC_CFG[kind] || MECHANIC_CFG.flat;
  const cost = costFor(offer);
  const free = isFreeOffer(offer);
  const isAlreadyRedeemed = ctx?.isRedeemed?.(offer.id);

  const [phase, setPhase] = React.useState(isAlreadyRedeemed ? 'confirmed' : 'idle');
  const [ctaLabelFlipped, setCtaLabelFlipped] = React.useState(false);
  const timers = React.useRef([]);
  const flipTimer = React.useRef(null);
  React.useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    clearTimeout(flipTimer.current);
  }, []);

  React.useEffect(() => {
    setPhase(isAlreadyRedeemed ? 'confirmed' : 'idle');
  }, [offer.id, isAlreadyRedeemed]);

  const insufficient = !free && balance < cost;
  const disabled = insufficient;

  const handleTap = () => {
    if (phase === 'processing') return;

    if (phase === 'confirmed') {
      // Copy the code (for code/qr mechanics), flip label to "Code Copied"
      // for 1.5s, then back to "Redeem Now". Cycle repeats on every tap.
      if (cfg.reveal !== 'none') {
        try { navigator.clipboard?.writeText(buildCode(offer)); } catch (_) {}
      }
      setCtaLabelFlipped(true);
      clearTimeout(flipTimer.current);
      flipTimer.current = setTimeout(() => setCtaLabelFlipped(false), 1500);
      return;
    }

    if (disabled) return;
    setPhase('processing');
    timers.current.push(setTimeout(() => {
      setPhase('confirmed');
      ctx?.markRedeemed?.(offer, { cost, bonus: bonusMilesFor(offer) });
    }, 800));
  };

  return (
    <MechanicCTA
      phase={phase}
      cost={cost}
      free={free}
      processingLabel={cfg.processing}
      verb={cfg.verb}
      disabled={disabled}
      onTap={handleTap}
      tone={tone}
      height={height}
      confirmedLabel={ctaLabelFlipped ? 'Code Copied' : 'Redeem Now'}
    />
  );
}

Object.assign(window, {
  MechanicCTASection, MechanicCTA, CardCTA,
  MechanicCfg: MECHANIC_CFG,
  classifyMechanic2, TransactionSummary,
  CodeBlockInline, QRBlockInline,
  costFor, isFreeOffer, buildCode, bonusMilesFor,
});
