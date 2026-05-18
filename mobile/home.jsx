// OfferRow — compact list row, 68px, real Clearbit logo
function OfferRow({ offer, onOpen, onAction, isLast }) {
  return (
    <div style={{
      position: 'relative',
      borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)',
      overflow: 'visible'
    }}>
      <div onClick={onOpen} role="button" tabIndex={0} style={{
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 14,
        width: '100%', boxSizing: 'border-box',
        minHeight: 68, padding: '12px 0'
      }}>
        <PartnerLogo domain={offer.domain} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 17,
            color: 'var(--text-1)', lineHeight: 1.2,
            letterSpacing: '-0.005em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>{offer.title}</div>
          <div style={{
            marginTop: 4,
            fontFamily: FONT_UI, fontWeight: 400, fontSize: 11.5, color: 'var(--text-2)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>{offer.partner} · {offer.tier} · exp {offer.expires}</div>
          <div style={{
            marginTop: 4,
            fontFamily: FONT_UI, fontSize: 11.5, color: '#C9942A', fontWeight: 500
          }}>+{offer.miles} mi</div>
        </div>
        <Tag tone="default">{offer.mechanic}</Tag>
        <span style={{
          color: 'var(--text-3)', fontFamily: FONT_UI, fontSize: 16,
          marginLeft: 4
        }}>›</span>
      </div>
    </div>);

}

// HOME SCREEN
function HomeScreen({ onOpenOffer, onGotoTab, onToast, onConfirmRedeem }) {
  const featured = OFFERS.slice(0, 5);
  const nearby = OFFERS.slice(2, 6);
  const all = OFFERS.slice(0, 3);

  return (
    <div data-screen-label="01 Home" className="screen-fade" style={{ paddingBottom: 96, margin: "0px", opacity: "1" }}>
      <TopBar unread />
      <HeroSky />
      <MilesBlock />

      <SectionHeader label="For you, Aisha" mt={GAP} />
      <div style={{ marginTop: 0 }}>
        <SmartNudge
          onClick={() => onOpenOffer('off-marriott', 'for-you')}
          onConfirmRedeem={onConfirmRedeem}
          onDismiss={(it) => onToast?.(`${it} — For You nudge`)} />
        
      </div>

      <SectionHeader label="Your birthday offer" mt={GAP} />
      <div style={{ marginTop: 0 }}>
        <BirthdayCard
          onRedeem={onConfirmRedeem}
          onMore={(it) => onToast?.(`${it} — Birthday offer`)} />
        
      </div>

      <SectionHeader label="Your challenges" right="View All"
      onRight={() => onGotoTab('loyalty')} />
      <div style={{
        display: 'flex', gap: 14, overflowX: 'auto', overflowY: 'visible',
        padding: `8px ${PAD}px 8px`, scrollSnapType: 'x mandatory',
        scrollPaddingLeft: PAD
      }}>
        {CHALLENGES.slice(0, 3).map((ch) =>
        <div key={ch.id} style={{ scrollSnapAlign: 'start', width: 280, flexShrink: 0 }}>
            <ChallengeCard ch={ch}
          onClick={() => onToast?.(`${ch.title} — continue`)} />
          </div>
        )}
      </div>

      <SectionHeader label="Picked for you" right="View All"
      onRight={() => onGotoTab('offers')} />
      <div style={{
        display: 'flex', gap: 14, overflowX: 'auto', overflowY: 'visible',
        padding: `8px ${PAD}px 24px`, scrollSnapType: 'x mandatory',
        scrollPaddingLeft: PAD
      }}>
        {featured.map((o) =>
        <div key={o.id} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
            <OfferCard offer={o}
          onOpen={() => onOpenOffer(o.id)}
          onAction={(k) => onToast?.(`${k} — ${o.title}`)} />
          </div>
        )}
      </div>

      <div style={{
        padding: `0 ${PAD}px`,
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginTop: GAP - 16, marginBottom: 14
      }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 15,
          letterSpacing: '0.02em',
          color: 'rgba(240,237,232,0.7)'
        }}>Near you in Dubai</div>
        <div style={{
          fontFamily: FONT_UI, fontSize: 12, color: 'var(--text-3)'
        }}>Dubai Marina · 1.2 km</div>
      </div>
      <div style={{
        display: 'flex', gap: 14, overflowX: 'auto', overflowY: 'visible',
        padding: `8px ${PAD}px 24px`, scrollSnapType: 'x mandatory',
        scrollPaddingLeft: PAD
      }}>
        {nearby.map((o) =>
        <div key={'n-' + o.id} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
            <OfferCard offer={o} distance={o.distance}
          onOpen={() => onOpenOffer(o.id)}
          onAction={(k) => onToast?.(`${k} — ${o.title}`)} />
          </div>
        )}
      </div>

      <SectionHeader label="All offers" right="View All"
      onRight={() => onGotoTab('offers')} mt={16} />
      <div style={{ margin: `0 ${PAD}px` }}>
        {all.map((o, i) =>
        <OfferRow key={'all-' + o.id} offer={o}
        isLast={i === all.length - 1}
        onOpen={() => onOpenOffer(o.id)}
        onAction={(k) => onToast?.(`${k} — ${o.title}`)} />
        )}
      </div>

      <div style={{
        padding: `28px ${PAD}px 12px`, display: 'flex', justifyContent: 'center'
      }}>
        <button onClick={() => onGotoTab('offers')} style={{
          all: 'unset', cursor: 'pointer',
          fontFamily: FONT_UI, fontWeight: 500, fontSize: 13,
          color: '#C9942A', letterSpacing: '0.05em'
        }}>View All Offers →</button>
      </div>
    </div>);

}

Object.assign(window, { HomeScreen, OfferRow });