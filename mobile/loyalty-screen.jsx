// LOYALTY HUB — clean member card + gold ◆ divider + 2×2 challenge grid

function GoldDivider() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      padding: `${GAP}px ${PAD}px 0`,
    }}>
      <div style={{
        flex: 1, maxWidth: 80, height: 1,
        background: 'rgba(201,148,42,0.3)',
      }} />
      <svg width="9" height="9" viewBox="0 0 9 9">
        <path d="M4.5 0 L9 4.5 L4.5 9 L0 4.5 Z" fill="rgba(201,148,42,0.65)"/>
      </svg>
      <div style={{
        flex: 1, maxWidth: 80, height: 1,
        background: 'rgba(201,148,42,0.3)',
      }} />
    </div>
  );
}

// BareChallenge — chrome-less challenge content for the Loyalty Hub quadrant grid
function BareChallenge({ ch, onClick }) {
  const pct = Math.round(ch.cur / ch.tot * 100);
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer',
      padding: 20, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column',
      position: 'relative', zIndex: 0,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '1px solid rgba(201,148,42,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
      }}>
        <ChallengeIcon kind={ch.iconKey} size={22} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 15, lineHeight: 1.2,
          color: 'var(--text-1)', letterSpacing: '-0.005em', marginBottom: 4,
        }}>{ch.title}</div>
        <div style={{
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
          color: 'var(--text-2)',
        }}>{ch.cur}/{ch.tot} · {ch.sub}</div>
      </div>
      <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          flex: 1, height: 4, borderRadius: 4,
          background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0, width: `${pct}%`,
            background: '#C9942A', borderRadius: 4,
            transformOrigin: 'left',
            animation: 'fillBar 800ms cubic-bezier(.2,.7,.2,1) 200ms both',
            '--p': 1,
          }} />
        </div>
        <div style={{
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
          color: 'var(--text-3)',
        }}>{pct}%</div>
      </div>
      <div style={{
        fontFamily: FONT_UI, fontWeight: 400, fontSize: 11,
        color: 'var(--gold-dim)',
      }}>
        Award: <span style={{ color: '#C9942A', fontWeight: 500 }}>+{ch.award.toLocaleString()} mi</span>
      </div>
    </button>
  );
}

// Tier benefits — per-tier list with optional "locked" premium items
const TIER_BENEFITS = {
  Blue: {
    color: '#5fa8e8',
    items: [
      { text: 'Earn Skywards Miles on all Emirates flights' },
      { text: 'Access to Skywards Everyday partner offers' },
      { text: 'Online check-in access' },
      { text: 'Skywards Miles Mall access' },
    ],
  },
  Silver: {
    color: '#d6d6dc',
    items: [
      { text: 'All Blue benefits' },
      { text: '25% bonus miles on flights' },
      { text: '1 complimentary lounge visit per year' },
      { text: 'Extra 5kg baggage allowance' },
      { text: 'Priority check-in counter access' },
    ],
  },
  Gold: {
    color: '#C9942A',
    items: [
      { text: 'All Silver benefits' },
      { text: '20% bonus miles on all flights' },
      { text: '2 complimentary lounge visits' },
      { text: 'Extra 10kg baggage allowance' },
      { text: 'Complimentary seat upgrades (subject to availability)' },
      { text: 'Dedicated Gold member service line' },
    ],
  },
  Platinum: {
    color: '#e9e5d7',
    items: [
      { text: 'All Gold benefits' },
      { text: '50% bonus miles on all flights', locked: true },
      { text: 'Unlimited lounge access worldwide', locked: true },
      { text: 'Extra 20kg baggage allowance', locked: true },
      { text: 'Guaranteed seat upgrades on Emirates flights', locked: true },
      { text: 'Dedicated Platinum concierge service', locked: true },
      { text: 'Invitation to exclusive Emirates events', locked: true },
      { text: 'iO tier consideration for most frequent travelers', locked: true },
    ],
  },
};

const TIER_ORDER = ['Blue', 'Silver', 'Gold', 'Platinum'];

// Inline benefits panel rendered below the tier track
function TierBenefitsPanel({ tier, onClose, onSeeNext }) {
  if (!tier) return null;
  const t = TIER_BENEFITS[tier];
  const idx = TIER_ORDER.indexOf(tier);
  const nextTier = TIER_ORDER[idx + 1];
  const isLocked = tier === 'Platinum'; // anything beyond current
  return (
    <div style={{
      marginTop: 18,
      background: 'rgba(12,15,22,0.97)',
      border: '1px solid rgba(201,148,42,0.25)',
      borderRadius: '16px 16px 16px 16px',
      animation: 'fadeRise 280ms cubic-bezier(.2,.7,.2,1) both',
      overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px 12px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 16,
          letterSpacing: '0.04em',
          color: t.color,
        }}>
          <svg width="10" height="10" viewBox="0 0 9 9">
            <path d="M4.5 0 L9 4.5 L4.5 9 L0 4.5 Z" fill={t.color}/>
          </svg>
          {tier.toUpperCase()} BENEFITS
        </div>
        <button onClick={onClose} style={{
          all: 'unset', cursor: 'pointer',
          width: 28, height: 28, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M1 1 L9 9 M9 1 L1 9" stroke="rgba(240,237,232,0.6)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* benefits */}
      <div style={{
        padding: '14px 20px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {t.items.map((it, i) => {
          const locked = it.locked && isLocked;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              opacity: locked ? 0.55 : 1,
            }}>
              <div style={{
                width: 16, height: 16, flexShrink: 0, marginTop: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {locked ? (
                  <svg width="11" height="13" viewBox="0 0 10 12" fill="none">
                    <rect x="1" y="5" width="8" height="6.5" rx="1" stroke="#C9942A" strokeWidth="1.2"/>
                    <path d="M2.5 5 V3.5 C2.5 2 3.6 1 5 1 C6.4 1 7.5 2 7.5 3.5 V5" stroke="#C9942A" strokeWidth="1.2"/>
                  </svg>
                ) : (
                  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M1.5 5.5 L5.5 9.5 L12.5 1.5" stroke="#C9942A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div style={{
                fontFamily: FONT_UI, fontWeight: 400, fontSize: 13,
                lineHeight: 1.5, color: 'var(--text-1)',
              }}>{it.text}</div>
            </div>
          );
        })}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* footer */}
      <div style={{ padding: '14px 20px 16px' }}>
        {isLocked ? (
          <>
            <div style={{
              fontFamily: FONT_UI, fontWeight: 400, fontSize: 12,
              color: 'var(--text-2)', marginBottom: 12,
            }}>
              <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>
                {MEMBER.toNextTier.toLocaleString()}
              </span>{' '}miles away
            </div>
            <GoldButton onClick={onClose} height={44}>
              Start earning toward Platinum →
            </GoldButton>
          </>
        ) : nextTier ? (
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            gap: 12, flexWrap: 'wrap',
          }}>
            <div style={{
              fontFamily: FONT_UI, fontWeight: 400, fontSize: 12,
              color: 'var(--text-2)',
            }}>
              Next tier: <span style={{ color: 'var(--text-1)' }}>{nextTier}</span>
              {tier === 'Gold' && (
                <> — <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>
                  {MEMBER.toNextTier.toLocaleString()}
                </span> miles away</>
              )}
            </div>
            <button onClick={() => onSeeNext(nextTier)} style={{
              all: 'unset', cursor: 'pointer',
              fontFamily: FONT_UI, fontWeight: 500, fontSize: 12,
              color: '#C9942A', letterSpacing: '0.02em',
            }}>See {nextTier} Benefits →</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Tier journey track — Blue · Silver · Gold (current) · Platinum
function TierJourney() {
  const [selected, setSelected] = React.useState(null);
  const TIERS_FLOW = [
    { name: 'Blue',     state: 'done' },
    { name: 'Silver',   state: 'done' },
    { name: 'Gold',     state: 'current' },
    { name: 'Platinum', state: 'next' },
  ];
  const currentIdx = TIERS_FLOW.findIndex(t => t.state === 'current');
  const filledPct = (currentIdx / (TIERS_FLOW.length - 1)) * 100;
  const memberPct = 93;
  return (
    <div style={{ padding: `${GAP}px ${PAD}px 0` }}>
      <div style={{
        fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 15,
        letterSpacing: '0.02em',
        color: 'rgba(240,237,232,0.7)', marginBottom: 22,
      }}>Your tier journey</div>

      {/* track with nodes */}
      <div style={{ position: 'relative', height: 50 }}>
        <div style={{
          position: 'absolute', left: 7, right: 7, top: 24,
          height: 1.5, background: 'rgba(255,255,255,0.12)',
        }} />
        <div style={{
          position: 'absolute', left: 7, top: 24,
          width: `calc((100% - 14px) * ${filledPct / 100})`,
          height: 1.5, background: '#C9942A',
          boxShadow: '0 0 6px rgba(201,148,42,0.5)',
        }} />

        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0,
          display: 'flex', justifyContent: 'space-between',
        }}>
          {TIERS_FLOW.map((t, i) => {
            const isCurrent = t.state === 'current';
            const isDone = t.state === 'done';
            const isSelected = selected === t.name;
            const dotSize = isCurrent ? 14 : 10;
            const dotColor = isDone || isCurrent ? '#C9942A' : 'transparent';
            const ring = isCurrent
              ? '0 0 0 4px rgba(201,148,42,0.15)'
              : isSelected
                ? '0 0 0 4px rgba(201,148,42,0.25)'
                : 'none';
            return (
              <button key={t.name}
                onClick={() => setSelected(s => s === t.name ? null : t.name)}
                className={isCurrent ? '' : 'press'}
                style={{
                all: 'unset', cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', width: 56, gap: 8,
              }}>
                <div style={{ height: 10, display: 'flex', alignItems: 'center' }}>
                  {isCurrent && (
                    <svg width="9" height="9" viewBox="0 0 9 9">
                      <path d="M4.5 0 L9 4.5 L4.5 9 L0 4.5 Z" fill="#C9942A"/>
                    </svg>
                  )}
                </div>
                <div className={isCurrent ? 'pulse-gold' : ''} style={{
                  width: dotSize, height: dotSize, borderRadius: '50%',
                  background: dotColor,
                  border: !isDone && !isCurrent
                    ? '1.5px solid rgba(255,255,255,0.25)'
                    : 'none',
                  boxShadow: isCurrent ? undefined : ring,
                  transition: 'box-shadow 200ms ease',
                  position: 'relative', zIndex: 2,
                }} />
                <div style={{
                  fontFamily: FONT_UI,
                  fontSize: 11,
                  fontWeight: isCurrent ? 600 : isSelected ? 500 : 400,
                  letterSpacing: '0.04em',
                  color: isCurrent ? '#C9942A'
                    : isSelected ? '#C9942A'
                    : isDone ? 'rgba(201,148,42,0.7)'
                    : 'var(--text-3)',
                  whiteSpace: 'nowrap',
                }}>{t.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* progress bar below */}
      <div style={{
        marginTop: 16,
        height: 4, borderRadius: 4,
        background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${memberPct}%`,
          background: '#C9942A', borderRadius: 4,
          boxShadow: '0 0 8px rgba(201,148,42,0.4)',
          transformOrigin: 'left',
          animation: 'fillBar 900ms cubic-bezier(.2,.7,.2,1) 200ms both',
          '--p': 1,
        }} />
      </div>
      <div style={{
        marginTop: 10,
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        fontFamily: FONT_UI, fontSize: 12, color: 'var(--text-2)',
      }}>
        <span>
          <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>
            {MEMBER.toNextTier.toLocaleString()}
          </span>{' '}miles to Platinum
        </span>
        <span style={{ color: 'var(--text-3)' }}>{memberPct}%</span>
      </div>

      <TierBenefitsPanel
        tier={selected}
        onClose={() => setSelected(null)}
        onSeeNext={(t) => setSelected(t)}
      />
    </div>
  );
}

function LoyaltyHubScreen({ onToast }) {
  return (
    <div data-screen-label="04 Loyalty Hub" className="screen-fade" style={{ paddingBottom: 110, position: 'relative' }}>
      {/* gold radial glow at top center */}
      <div className="glow-breathe" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 320,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201,148,42,0.12) 0%, transparent 55%)',
        pointerEvents: 'none', zIndex: 0,
        transformOrigin: 'top center',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          padding: `8px ${PAD}px 0`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 28,
              color: 'var(--text-1)', letterSpacing: '-0.015em', lineHeight: 1.1,
            }}>Loyalty Hub</div>
            <div style={{
              marginTop: 8,
              fontFamily: FONT_UI, fontWeight: 400, fontSize: 13, color: 'var(--text-2)',
              lineHeight: 1.5,
            }}>Earn miles. Climb tiers. Unlock privileges.</div>
          </div>
          <NotificationBell unread />
        </div>

        {/* Member identity card */}
        <div style={{ padding: `${GAP - 8}px ${PAD}px 0` }}>
          <div style={{
            padding: 20, borderRadius: RADIUS,
            background: 'linear-gradient(135deg, rgba(201,148,42,0.12), rgba(12,15,22,0.9))',
            border: '1px solid rgba(201,148,42,0.25)',
            boxShadow: '0 12px 32px -16px rgba(201,148,42,0.25)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <TierPill tier={MEMBER.tier} size="md" />
              <span style={{
                fontFamily: FONT_UI, fontWeight: 500, fontSize: 10,
                color: 'var(--text-3)',
                letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>Member since 2021</span>
            </div>
            <div style={{
              marginTop: 18,
              display: 'flex', alignItems: 'baseline', gap: 10,
            }}>
              <span style={{
                fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 48,
                lineHeight: 1, color: '#C9942A', letterSpacing: '-0.015em',
              }}>{MEMBER.miles.toLocaleString()}</span>
              <span style={{
                fontFamily: FONT_UI, fontWeight: 400, fontSize: 13,
                color: 'var(--text-2)',
              }}>miles</span>
            </div>
            <div style={{
              marginTop: 8, fontFamily: FONT_UI, fontSize: 12, color: 'var(--text-2)',
            }}>
              <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>
                {MEMBER.toNextTier.toLocaleString()}
              </span>{' '}miles to {MEMBER.nextTier}
            </div>
          </div>
        </div>

        <TierJourney />

        <GoldDivider />

        <SectionHeader label="All challenges" mt={16} />
        <div style={{
          padding: `0 ${PAD}px`,
        }}>
          <div style={{
            position: 'relative',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
          }}>
            {/* horizontal gold line */}
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0,
              height: 1, background: 'rgba(201,148,42,0.25)',
              transform: 'translateY(-0.5px)',
              zIndex: 1,
            }} />
            {/* vertical gold line */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '50%',
              width: 1, background: 'rgba(201,148,42,0.25)',
              transform: 'translateX(-0.5px)',
              zIndex: 1,
            }} />
            {/* centered diamond at the intersection */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 14, height: 14,
              background: '#07090E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2,
            }}>
              <svg width="10" height="10" viewBox="0 0 9 9">
                <path d="M4.5 0 L9 4.5 L4.5 9 L0 4.5 Z" fill="rgba(201,148,42,0.7)"/>
              </svg>
            </div>

            {CHALLENGES.map(ch => (
              <BareChallenge key={ch.id} ch={ch}
                onClick={() => onToast?.(`${ch.title} — continue`)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StubScreen({ name, label }) {
  return (
    <div data-screen-label={label} className="screen-fade" style={{ paddingBottom: 96 }}>
      <PageHeader title={name} />
      <div style={{
        padding: '80px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 14,
      }}>
        <EmiratesMark size={64} />
        <div style={{
          fontFamily: FONT_UI, fontWeight: 600,
          fontSize: 18, color: 'rgba(201,148,42,0.85)', letterSpacing: '0.02em',
        }}>Coming soon</div>
        <div style={{
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 13, color: 'var(--text-2)',
          maxWidth: 260, lineHeight: 1.55,
        }}>
          This corner of your journey is being prepared. Check back soon.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LoyaltyHubScreen, StubScreen, GoldDivider, BareChallenge, TierJourney, TierBenefitsPanel, TIER_BENEFITS, TIER_ORDER });
