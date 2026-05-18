// OFFERS LIST SCREEN — no donut, miles/% text line under each card

function OffersScreen({ onOpenOffer, onToast }) {
  const [query, setQuery] = React.useState('');
  const [tier, setTier] = React.useState('Gold');
  const [cat, setCat] = React.useState('All');
  const ctx = React.useContext(window.RedemptionContext);

  const filtered = OFFERS.filter(o => {
    if (query && !(o.title + ' ' + o.partner + ' ' + o.desc).toLowerCase().includes(query.toLowerCase())) return false;
    if (tier !== 'All Tiers' && o.tier !== tier) return false;
    return true;
  }).sort((a, b) => {
    // Redeemed offers sink to the bottom
    const ar = ctx?.isRedeemed?.(a.id) ? 1 : 0;
    const br = ctx?.isRedeemed?.(b.id) ? 1 : 0;
    return ar - br;
  });

  const activeFilters = [];
  if (tier !== 'All Tiers') activeFilters.push({ k: 'tier', label: tier });
  if (cat !== 'All') activeFilters.push({ k: 'cat', label: cat });

  return (
    <div data-screen-label="02 Offers" className="screen-fade" style={{ paddingBottom: 100 }}>
      <div style={{
        padding: `8px ${PAD}px 4px`,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 22,
            color: 'var(--text-1)', letterSpacing: '-0.015em', lineHeight: 1.1,
          }}>Offers</div>
          <div style={{
            marginTop: 8,
            fontFamily: FONT_UI, fontSize: 12, fontWeight: 400, color: 'var(--text-2)',
          }}>
            <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>
              {filtered.length}
            </span>{' '}of {OFFERS.length} · {MEMBER.tier} member · Dubai
          </div>
        </div>
        <NotificationBell unread />
      </div>

      <div style={{ padding: `16px ${PAD}px 12px` }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: '12px 14px',
          minHeight: 48, boxSizing: 'border-box',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="6" cy="6" r="4.5" stroke="rgba(240,237,232,0.45)" strokeWidth="1.4" fill="none"/>
            <path d="M9.5 9.5 L13 13" stroke="rgba(240,237,232,0.45)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search offers, partners..."
            style={{
              flex: 1, all: 'unset',
              fontFamily: FONT_UI, fontSize: 13, color: 'var(--text-1)',
            }} />
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 8, padding: `0 ${PAD}px 10px`,
        overflowX: 'auto',
      }}>
        {TIERS.map(t => (
          <button key={t} onClick={() => setTier(t)} style={{
            all: 'unset', cursor: 'pointer',
            padding: '8px 14px', borderRadius: 999,
            border: `1px solid ${tier === t ? 'rgba(201,148,42,0.5)' : 'rgba(255,255,255,0.1)'}`,
            background: tier === t ? 'rgba(201,148,42,0.1)' : 'transparent',
            color: tier === t ? '#C9942A' : 'var(--text-2)',
            fontFamily: FONT_UI, fontSize: 11, fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>{t}</button>
        ))}
      </div>

      <div style={{
        display: 'flex', gap: 8, padding: `0 ${PAD}px 14px`,
        overflowX: 'auto',
      }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            all: 'unset', cursor: 'pointer',
            padding: '7px 12px', borderRadius: 999,
            border: `1px solid ${cat === c ? 'rgba(240,237,232,0.4)' : 'rgba(255,255,255,0.08)'}`,
            background: cat === c ? 'rgba(255,255,255,0.06)' : 'transparent',
            color: cat === c ? 'var(--text-1)' : 'var(--text-3)',
            fontFamily: FONT_UI, fontSize: 11.5, fontWeight: 400,
            letterSpacing: '0.02em', whiteSpace: 'nowrap',
          }}>{c}</button>
        ))}
      </div>

      {activeFilters.length > 0 && (
        <div style={{
          padding: `0 ${PAD}px 14px`, display: 'flex', alignItems: 'center', gap: 8,
          flexWrap: 'wrap',
        }}>
          {activeFilters.map(f => (
            <span key={f.k} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(201,148,42,0.08)',
              border: '1px solid rgba(201,148,42,0.25)',
              fontFamily: FONT_UI, fontSize: 11, color: '#C9942A',
            }}>
              {f.label}
              <button onClick={() => f.k === 'tier' ? setTier('All Tiers') : setCat('All')}
                style={{ all: 'unset', cursor: 'pointer', color: 'rgba(201,148,42,0.7)' }}>×</button>
            </span>
          ))}
          <button onClick={() => { setTier('All Tiers'); setCat('All'); }}
            style={{
              all: 'unset', cursor: 'pointer',
              fontFamily: FONT_UI, fontSize: 11, color: '#C9942A',
              letterSpacing: '0.02em',
            }}>Clear All</button>
        </div>
      )}

      <div style={{ padding: `0 ${PAD}px`, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {filtered.map(o => {
          const locked = o.locked && MEMBER.tier !== 'Platinum';
          return (
            <div key={o.id} style={{ position: 'relative' }}>
              <div style={{ opacity: locked ? 0.45 : 1 }}>
                <OfferCard offer={o} width="100%"
                  onOpen={() => !locked && onOpenOffer(o.id)}
                  onAction={(k) => onToast?.(`${k} — ${o.title}`)} />
                {/* miles + tier impact line (replaces donut) */}
                {!locked && (
                  <div style={{
                    padding: `10px 4px 0`,
                    fontFamily: FONT_UI, fontSize: 12, color: 'var(--text-2)',
                  }}>
                    <span style={{ color: '#C9942A', fontWeight: 500 }}>+{o.miles} miles</span>
                    <span style={{ color: 'var(--text-3)', margin: '0 8px' }}>·</span>
                    <span>{o.health}% to {MEMBER.nextTier}</span>
                  </div>
                )}
              </div>
              {locked && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(180deg, rgba(7,9,14,0.25), rgba(7,9,14,0.55))',
                  borderRadius: RADIUS, pointerEvents: 'none',
                }}>
                  <span style={{
                    display: 'inline-flex', gap: 8, alignItems: 'center',
                    padding: '10px 16px', borderRadius: 999,
                    background: 'rgba(7,9,14,0.85)',
                    border: '1px solid rgba(201,148,42,0.4)',
                    color: '#C9942A',
                    fontFamily: FONT_UI, fontSize: 11.5, fontWeight: 500,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                  }}>
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                      <rect x="1" y="5" width="8" height="6.5" rx="1" stroke="#C9942A" strokeWidth="1.2"/>
                      <path d="M2.5 5 V3.5 C2.5 2 3.6 1 5 1 C6.4 1 7.5 2 7.5 3.5 V5" stroke="#C9942A" strokeWidth="1.2"/>
                    </svg>
                    Reach Platinum to unlock
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { OffersScreen });
