// OFFER DETAIL — 52px Clearbit logo centered on banner/content boundary
// ... menu: Save · Share · Report. Similar offers use the 280px OfferCard.

function OfferDetail({ offer, variant, balance, isRedeemed, onBack, onOpenOffer, onConfirm, onBackToOffers, onToast }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  if (!offer) return null;

  const isForYou = variant === 'for-you';
  const PURPLE = 'rgba(88,28,255,0.85)';
  const PURPLE_BORDER = 'rgba(139,92,246,0.25)';

  const milesGoal = MEMBER.miles + MEMBER.toNextTier;
  const pct = Math.min(100, Math.round(((MEMBER.miles + offer.miles) / milesGoal) * 100));
  const left = Math.max(0, milesGoal - MEMBER.miles - offer.miles);
  const similar = OFFERS.filter(o => o.id !== offer.id).slice(0, 4);

  return (
    <div data-screen-label="03 Offer Detail" style={{
      position: 'absolute', inset: 0, background: '#07090E',
      zIndex: 40, animation: 'slideUp 320ms cubic-bezier(.2,.7,.2,1)',
      display: 'flex', flexDirection: 'column',
      paddingTop: 56,
    }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'visible', paddingBottom: 240, position: 'relative' }}>
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
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div style={{
            flex: 1, padding: '0 12px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: FONT_UI, fontSize: 11, fontWeight: 500,
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
            <MoreDots light onClick={() => setMenuOpen(o => !o)} />
            <MoreMenu open={menuOpen}
              items={['Save', 'Share', 'Report']}
              onClose={() => setMenuOpen(false)}
              onAction={(it) => onToast?.(`${it} — ${offer.title}`)} />
          </div>
        </div>

        {/* banner */}
        <div style={{
          position: 'relative', height: 220,
          background: `linear-gradient(135deg, ${offer.swatch[0]}, ${offer.swatch[1]})`,
          overflow: 'visible',
          margin: '0',
        }}>
          <div style={{
            position: 'absolute', inset: 0, overflow: 'hidden',
          }}>
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

          {/* 52px partner logo, left-aligned to match logo padding */}
          <div style={{
            position: 'absolute', left: PAD, bottom: -26,
            zIndex: 4,
          }}>
            <PartnerLogo domain={offer.domain} size={52} />
          </div>
        </div>

        {/* content */}
        <div style={{ padding: `40px ${PAD}px 0`, textAlign: 'left' }}>
          <div style={{
            fontFamily: FONT_UI, fontWeight: 400,
            fontSize: 13, color: 'var(--gold-dim)', letterSpacing: '0.04em',
          }}>{offer.partner}</div>

          <div style={{
            marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}>
            <Tag tone="live">
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#7ec9a6', boxShadow: '0 0 6px rgba(126,201,166,0.7)',
              }} />
              LIVE
            </Tag>
            <Tag tone="default">⏳ 60 DAYS LEFT</Tag>
            {offer.elite && <Tag tone="gold">✦ ELITE FAVORITE</Tag>}
          </div>

          <h1 style={{
            margin: '14px 0 10px',
            fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 32, lineHeight: 1.15,
            color: 'var(--text-1)', letterSpacing: '-0.015em',
          }}>{offer.title}</h1>

          <p style={{
            margin: 0, maxWidth: 320,
            fontFamily: FONT_UI, fontWeight: 400, fontSize: 13.5, lineHeight: 1.6,
            color: 'var(--text-2)',
          }}>
            {offer.desc} Stack with any base earn rate. Subject to inventory and blackout dates outlined below.
          </p>

          <div style={{
            marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}>
            {[offer.tier, offer.mechanic, offer.region, 'Stack with miles'].map(t => (
              <Tag key={t} tone="default">{t}</Tag>
            ))}
          </div>
        </div>

        {/* MILES IMPACT — two clear sections */}
        <div style={{ padding: `${GAP}px ${PAD}px 0` }}>
          <div style={{
            background: 'rgba(201,148,42,0.06)',
            border: '1px solid rgba(201,148,42,0.2)',
            borderRadius: 12,
            padding: '16px 20px',
          }}>
            {/* Section 1: what you earn */}
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 15,
              color: 'rgba(240,237,232,0.7)',
              letterSpacing: '0.02em',
            }}>You will earn</div>
            <div style={{
              marginTop: 8,
              fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 32,
              lineHeight: 1, color: '#52C08A', letterSpacing: '-0.01em',
            }}>+{offer.miles.toLocaleString()} miles</div>
            <div style={{
              marginTop: 4,
              fontFamily: FONT_UI, fontWeight: 400, fontSize: 12,
              color: 'var(--text-2)',
            }}>from this offer</div>

            {/* Divider */}
            <div style={{
              height: 1, margin: '16px 0',
              background: 'rgba(255,255,255,0.06)',
            }} />

            {/* Section 2: tier progress after */}
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 15,
              color: 'rgba(240,237,232,0.7)',
              letterSpacing: '0.02em',
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
                transformOrigin: 'left',
                animation: 'fillBar 900ms cubic-bezier(.2,.7,.2,1) 200ms both',
                '--p': 1,
              }} />
            </div>
            <div style={{
              marginTop: 6,
              display: 'flex', justifyContent: 'space-between',
              fontFamily: FONT_UI, fontWeight: 400, fontSize: 10,
              color: 'var(--text-3)', letterSpacing: '0.06em',
            }}>
              <span style={{ color: '#C9942A' }}>{MEMBER.tier}</span>
              <span style={{ color: '#C9942A' }}>{pct}%</span>
              <span>{MEMBER.nextTier}</span>
            </div>
            <div style={{
              marginTop: 12,
              fontFamily: FONT_UI, fontWeight: 400, fontSize: 12,
              color: 'var(--text-2)',
            }}>
              <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>
                {left.toLocaleString()}
              </span>{' '}miles still to {MEMBER.nextTier}
            </div>
          </div>
        </div>

        {/* Reward details 2×2 */}
        <div style={{ padding: `${GAP}px ${PAD}px 0` }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 15,
            letterSpacing: '0.02em',
            color: 'rgba(240,237,232,0.7)', marginBottom: 14,
          }}>Reward details</div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 1, background: 'rgba(255,255,255,0.08)',
            borderRadius: RADIUS, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            {[
              ['Min Stay', offer.minStay],
              ['Min Spend', offer.minSpend],
              ['Valid', offer.valid],
              ['Max', offer.max],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: 16, background: 'var(--surface)' }}>
                <div style={{
                  fontFamily: FONT_UI, fontSize: 10, color: 'var(--text-3)',
                  textTransform: 'uppercase', letterSpacing: '0.18em',
                }}>{k}</div>
                <div style={{
                  marginTop: 6, fontFamily: FONT_UI, fontSize: 14, fontWeight: 500,
                  color: 'var(--text-1)',
                }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Redeem */}
        <div style={{ padding: `${GAP}px ${PAD}px 0` }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 15,
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
                  fontFamily: FONT_UI, fontWeight: 500, fontSize: 13,
                  flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{
                  fontFamily: FONT_UI, fontWeight: 400, fontSize: 13, lineHeight: 1.55,
                  color: 'var(--text-2)', marginTop: 3,
                }}>{t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar offers — use the 280px OfferCard */}
        <div style={{ marginTop: GAP }}>
          <SectionHeader label="You might also like" mt={0} />
          <div style={{
            display: 'flex', gap: 14, overflowX: 'auto', overflowY: 'visible',
            padding: `8px ${PAD}px 24px`,
            scrollPaddingLeft: PAD,
          }}>
            {similar.map(o => (
              <div key={'sim-' + o.id} style={{ flexShrink: 0 }}>
                <OfferCard offer={o}
                  onOpen={() => onOpenOffer(o.id)}
                  onAction={(k) => onToast?.(`${k} — ${o.title}`)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <MechanicCTASection
        offer={offer}
        balance={balance ?? MEMBER.miles}
        onBackToOffers={onBackToOffers}
        onToast={onToast}
      />
    </div>
  );
}

Object.assign(window, { OfferDetail });
