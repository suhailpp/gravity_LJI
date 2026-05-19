// ============ SCREEN 1 · DASHBOARD ============
// Monitoring screen for Priya. Layout:
// greeting → attention strip (4 cards) →
// main row (Live Offers grid + Pipeline | Side panel with Program Health,
// Redemption Trend, Top Performers, Expiring Soon) →
// full-width Partner Activity strip.

function Dashboard({ goTo, openAi, openDrawer }) {
  const [view, setView] = useState('table');


  // Live Offers grid is derived from the canonical OFFERS_DATA (status='live').
  // Some offer-card fields need to be in the shape OfferCard expects, so we map
  // tiers/region arrays to display strings and re-alias `signal`→`sig`, `status`→`kind`.
  const allLive = OFFERS_DATA
    .filter(o => o.status === 'live')
    .map(o => ({
      id: o.id, code: o.code, brand: o.brand, name: o.name, cat: o.cat, mech: o.mech,
      tiers: Array.isArray(o.tiers) ? o.tiers.join(' · ') : o.tiers,
      region: Array.isArray(o.region) ? o.region.join(' · ') : o.region,
      sig: o.signal, health: o.health, delta: o.delta, kind: o.status, trend7: o.trend7 || [],
      _range: o.range,
    }));

  // Derive an absolute end timestamp from the offer's range field so we can sort
  // by soonest expiry. Falls back to +Infinity when no end date is parseable.
  const endTs = (o) => {
    const r = o._range;
    if (!r) return Infinity;
    if (r.kind === 'range' || r.kind === 'range-expiring') {
      const d = new Date(`${r.to} ${new Date().getFullYear()}`);
      return isNaN(d) ? Infinity : d.getTime();
    }
    if (r.kind === 'expiring') {
      const m = (r.label || '').match(/(\d+)/);
      const days = m ? parseInt(m[1], 10) : 999;
      return Date.now() + days * 86400000;
    }
    return Infinity;
  };

  // Days remaining for the Expiring Soon label ("Expiring in 4d").
  const daysUntilEnd = (o) => {
    const r = o._range;
    if (!r) return null;
    if (r.kind === 'expiring') {
      const m = (r.label || '').match(/(\d+)/);
      return m ? parseInt(m[1], 10) : null;
    }
    if (r.kind === 'range' || r.kind === 'range-expiring') {
      const d = new Date(`${r.to} ${new Date().getFullYear()}`);
      if (isNaN(d)) return null;
      return Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));
    }
    return null;
  };

  // Reason badges shown below the health donut on each card.
  const REASON_TOP       = { icon:'↑', text:'Top Performer',   color:'#52C08A' };
  const REASON_ATTENTION = { icon:'⚠', text:'Needs Attention', color:'#E8A030' };
  const REASON_JUSTLIVE  = { icon:'●', text:'Just Live',       color:'#52C08A' };
  const reasonExpiring   = (days) => ({
    icon:'⏳',
    text: days != null ? `Expiring in ${days}d` : 'Expiring Soon',
    color:'#E05252'
  });

  // Strict 6-slot pick — no duplicates across slots; first-match-wins per slot.
  // Slot 1 & 2: highest health (Top Performer).
  // Slot 3:     lowest-health losing-momentum offer (Needs Attention).
  // Slot 4:     lowest-health offer below 65 that's not already used (Needs Attention).
  // Slot 5:     soonest expiry not yet used (Expiring in Xd).
  // Slot 6:     most recently created — id desc as proxy (Just Live).
  const pickTop6 = (live) => {
    const used = new Set();
    const out = [];
    const takeFrom = (sorted, reason) => {
      for (const o of sorted) {
        if (used.has(o.id)) continue;
        const r = typeof reason === 'function' ? reason(o) : reason;
        out.push({ ...o, reason: r });
        used.add(o.id);
        return;
      }
    };
    const byHealthDesc = [...live].sort((a, b) => b.health - a.health);
    const byHealthAsc  = [...live].sort((a, b) => a.health - b.health);
    const byExpiryAsc  = [...live].sort((a, b) => endTs(a) - endTs(b));
    const byIdDesc     = [...live].sort((a, b) => b.id - a.id);

    const losingByHealthAsc = byHealthAsc.filter(o => o.sig === 'losing');
    const lowNonLosing      = byHealthAsc.filter(o => o.health < 65 && o.sig !== 'losing');

    // Slot 1 & 2 — Top Performers
    takeFrom(byHealthDesc, REASON_TOP);
    takeFrom(byHealthDesc, REASON_TOP);
    // Slot 3 — Needs Attention (losing momentum first, fallback to overall lowest)
    takeFrom(losingByHealthAsc.length ? losingByHealthAsc : byHealthAsc, REASON_ATTENTION);
    // Slot 4 — Needs Attention (non-losing below 65, fallback to overall lowest)
    takeFrom(lowNonLosing.length ? lowNonLosing : byHealthAsc, REASON_ATTENTION);
    // Slot 5 — Expiring Soon (label uses days remaining for the picked offer)
    takeFrom(byExpiryAsc, (o) => reasonExpiring(daysUntilEnd(o)));
    // Slot 6 — Just Live (id desc proxy for createdAt desc)
    takeFrom(byIdDesc, REASON_JUSTLIVE);

    // Safety fill if anything's missing
    if (out.length < 6) {
      for (const o of live) {
        if (out.length >= 6) break;
        if (!used.has(o.id)) { out.push({ ...o, reason: null }); used.add(o.id); }
      }
    }
    return out;
  };

  const camps = pickTop6(allLive);
  const liveTotal = allLive.length;

  // Pipeline counts — derived live from OFFERS_DATA. No hardcoded numbers.
  // Stages match the canonical lifecycle in ui.jsx; Paused is a side-state, not a pipeline step.
  const pipeline = [
    { stage:'Draft',     count: offerCounts.draft,     color:'#9c9c9d' },
    { stage:'Review',    count: offerCounts.review,    color:'#E8A030' },
    { stage:'Scheduled', count: offerCounts.scheduled, color:'#6B9FE4' },
    { stage:'Live',      count: offerCounts.live,      color:'#52C08A' },
    { stage:'Ended',     count: offerCounts.ended,     color:'#6a6b6c' },
  ];

  // 7-day redemption trend (counts of redemptions / day)
  const trend = [320, 410, 380, 520, 460, 610, 540];
  const trendMax = Math.max(...trend);

  // Top 3 performers (by health)
  const topPerformers = [...camps].sort((a,b)=>b.health-a.health).slice(0,3);

  // Expiring soon (mock dates)
  const expiring = [
    { id:5, code:'BM', brand:'BookMyShow',   name:'Buy 2 Tickets Get 1 Free',   days:2 },
    { id:3, code:'NO', brand:'Noon',         name:'3× Miles on All Bookings',   days:5 },
    { id:6, code:'EM', brand:'Emirates',     name:'Complimentary Upgrade',       days:7 },
  ];

  // Partner activity — logo, status, renewal date
  const partners = [
    { code:'MA', brand:'Marriott Bonvoy', status:'active',   renewal:'Aug 14, 2026' },
    { code:'CA', brand:'Careem',          status:'active',   renewal:'Sep 02, 2026' },
    { code:'NO', brand:'Noon',            status:'review',   renewal:'Jun 21, 2026' },
    { code:'CF', brand:'Cult.fit',        status:'active',   renewal:'Nov 08, 2026' },
    { code:'BM', brand:'BookMyShow',      status:'expiring', renewal:'Jun 02, 2026' },
    { code:'EM', brand:'Emirates',        status:'active',   renewal:'Dec 31, 2026' },
  ];
  const partnerStatusColor = { active:'#59d499', review:'#ffc533', expiring:'#ff6161', paused:'#9c9c9d' };

  // Filled circular icon badge for the attention cards — colored disc with a centered solid (not stroked) icon.
  const iconBadge = (color) => ({
    position:'absolute', top:16, right:16, zIndex:2,
    width:36, height:36, borderRadius:'50%',
    background: color,
    display:'inline-flex', alignItems:'center', justifyContent:'center',
  });
  // Solid-fill icon set — Material-Icons paths, rendered with fill (no stroke) so they
  // read as bold filled glyphs on the colored badges, unlike the thin Lucide line icons.
  const SolidIcon = ({ name, size = 20, color = '#0A0C10' }) => {
    const paths = {
      TrendingDown: 'M5 5v2h10.59L4 18.59 5.41 20 17 8.41V19h2V5z',
      TrendingUp:   'M5 17.59L15.59 7H7V5h12v12h-2V8.41L6.41 19 5 17.59z',
      AlertTriangle:'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
      DollarSign:   'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
    };
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
        <path d={paths[name]}/>
      </svg>
    );
  };

  return (
    <PageLayout>
      <div className="dash-ref">
        {/* GREETING ─────────────────────────────────── */}
        <div className="dash-ref-greet">
          <h1>Good morning, <em>Priya</em></h1>
          <div className="sub">Emirates Skywards · UAE Region</div>
        </div>

        {/* PROGRAM HEALTH — full-width banner above attention strip ─── */}
        <div style={{padding:'18px 0 22px', marginBottom:16, borderBottom:'1px solid var(--border-subtle)'}}>
          <div style={{marginBottom:14}}>
            <span className="dash-ref-label">Program Health</span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)'}}>
            {[
              { icon:'Users',      label:'Active Members',    value:'12.4M', delta:'3.2%', dir:'up'   },
              { icon:'Tag',        label:'Offers Live',       value:'128',   delta:'4',    dir:'up'   },
              { icon:'Zap',        label:'Redemption Rate',   value:'18.6%', delta:'1.8pp',dir:'down' },
              { icon:'BarChart2',  label:'Miles Issued',      value:'3.2B',  delta:'6.7%', dir:'up'   },
              { icon:'Gift',       label:'Rewards Triggered', value:'86.1K', delta:'7.3%', dir:'up'   },
            ].map((m, i) => (
              <div key={m.label} style={{
                padding: i === 0 ? '4px 24px 4px 0' : '4px 24px',
                borderLeft: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                display:'flex', flexDirection:'column', gap:6, minWidth:0
              }}>
                <span style={{font:'400 12px/1 Inter, sans-serif', color:'var(--text-secondary)'}}>
                  {m.label}
                </span>
                <span style={{font:'300 32px/1 Sora, sans-serif', color:'var(--text-primary)', letterSpacing:-0.5}}>
                  {m.value}
                </span>
                <span style={{display:'inline-flex', alignItems:'center', gap:6, font:'500 11px/1 Inter, sans-serif'}}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:2, color: m.dir === 'up' ? '#59d499' : '#ff6161'}}>
                    <Icon name={m.dir === 'up' ? 'ArrowUp' : 'ArrowDown'} size={10}/>{m.delta}
                  </span>
                  <span style={{color:'var(--text-muted)'}}>vs last month</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* INTELLIGENCE STRIP — unchanged ──────────────── */}
        <div className="dash-ref-strip">
          <div className="dash-ref-strip-head">
            <span className="dash-ref-label">What needs your attention</span>
          </div>
          <div className="dash-ref-strip-grid">

            <div className="dash-ref-insight dominant" style={{minHeight:160, display:'flex', flexDirection:'column'}} onClick={()=>goTo('offers', {filter:'gold'})}>
              <span style={iconBadge('#ff6161')}><SolidIcon name="TrendingDown" size={20}/></span>
              <span className="ic-watermark" aria-hidden="true">18%</span>
              <h4 className="ic-title-row">Gold Tier Redemption</h4>
              <div className="ic-body" style={{display:'flex', alignItems:'center', gap:6, flexWrap:'wrap'}}>
                <span style={{color:'var(--text-muted)'}}>Down</span>
                <span style={{display:'inline-flex', alignItems:'center', gap:4, color:'var(--accent-red)', fontWeight:600}}>
                  <Icon name="TrendingDown" size={12}/>18%
                </span>
                <span style={{color:'#4A5568', fontSize:11, width:'100%'}}>vs last week</span>
              </div>
              <span className="ic-cta" style={{marginTop:'auto'}}>View Offer <Icon name="ArrowRight" size={11}/></span>
            </div>

            <div className="dash-ref-insight" style={{minHeight:160, display:'flex', flexDirection:'column'}} onClick={()=>openDrawer(1)}>
              <span style={iconBadge('#59d499')}><SolidIcon name="TrendingUp" size={20}/></span>
              <h4 className="ic-title-row">Weekend BOGO — 340% Above Forecast</h4>
              <p className="ic-body">Dubai · Marriott Bonvoy</p>
              <span className="ic-cta" style={{marginTop:'auto'}}>View Offer <Icon name="ArrowRight" size={11}/></span>
            </div>

            <div className="dash-ref-insight" style={{minHeight:160, display:'flex', flexDirection:'column'}} onClick={()=>goTo('offers', {tab:'drafts'})}>
              <span style={iconBadge('#ffc533')}><SolidIcon name="AlertTriangle" size={20}/></span>
              <h4 className="ic-title-row">Draft Stalled — Ramadan Miles Bonus</h4>
              <p className="ic-body">3 offers expiring this week</p>
              <span className="ic-cta" style={{marginTop:'auto'}}>Resume Draft <Icon name="ArrowRight" size={11}/></span>
            </div>

            <div className="dash-ref-insight" style={{minHeight:160, display:'flex', flexDirection:'column'}} onClick={()=>window.__toast && window.__toast('Coming in the next release.')}>
              <span style={iconBadge('#57c1ff')}><SolidIcon name="DollarSign" size={20}/></span>
              <h4 className="ic-title-row">Reward Liability Up 12% This Month</h4>
              <p className="ic-body">Platinum upgrades driving increase</p>
              <span className="ic-cta" style={{marginTop:'auto'}}>View Report <Icon name="ArrowRight" size={11}/></span>
            </div>
          </div>
        </div>

        {/* MAIN ROW — Live Offers | Side panel ───── */}
        <div className="dash-ref-main">

          {/* LEFT COLUMN */}
          <div>
            {/* Live Offers */}
            <div className="dash-ref-section-head">
              <span className="dash-ref-label">
                Live Offers
                <span style={{marginLeft:8, padding:'3px 8px', borderRadius:10, background:'#1a1d24', color:'var(--text-muted)', fontSize:11, fontWeight:500}}>
                  {liveTotal} active
                </span>
                <span style={{marginLeft:10, color:'var(--text-muted)', fontSize:11, fontWeight:400, textTransform:'none', letterSpacing:0}}>
                  · Showing top {camps.length} of {liveTotal}
                </span>
              </span>
              <div style={{display:'flex', alignItems:'center', gap:16}}>
                <div className="dash-ref-toggle" role="tablist" aria-label="Live offers view">
                  <button type="button" className={view==='table' ? 'active' : ''}
                          aria-pressed={view==='table'}
                          onClick={()=>setView('table')}>
                    <Icon name="Table" size={12}/> Table
                  </button>
                  <button type="button" className={view==='map' ? 'active' : ''}
                          aria-pressed={view==='map'}
                          onClick={()=>setView('map')}>
                    <Icon name="Map" size={12}/> Map
                  </button>
                </div>
                <span className="dash-ref-link" onClick={()=>goTo('offers')}>
                  View All {liveTotal} <Icon name="ArrowRight" size={11}/>
                </span>
              </div>
            </div>
            {view === 'table' ? (
              <div className="dash-ref-offers-2col">
                {camps.map(c => (
                  <OfferCard key={c.id} c={c} onClick={()=>openDrawer(c.id)}/>
                ))}
              </div>
            ) : (
              <div style={{background:'var(--bg-surface)', border:'1px solid #1a1d24', borderRadius:10, padding:16}}>
                <RelationshipGraph
                  nodes={camps.map(c => ({ id:c.id, code:c.code, brand:c.brand, label:c.name, signal:c.sig, health:c.health, status:'live' }))}
                  edges={offerEdgesFromSegments(camps.map(c => c.id))}
                  height={360}
                  onNodeClick={(n)=>openDrawer(n.id)}
                  showLegend={true}
                />
              </div>
            )}

            {/* PARTNER ACTIVITY — flush under Live Offers grid ─── */}
            <div className="dash-ref-section-head" style={{marginTop:24}}>
              <span className="dash-ref-label">Partner Activity</span>
              <span className="dash-ref-link" onClick={()=>window.__toast && window.__toast('Coming in the next release.')}>
                View All Partners <Icon name="ArrowRight" size={11}/>
              </span>
            </div>
            <div className="dash-ref-partners">
              {partners.map(p => (
                <div key={p.code} className="dash-ref-partner-tile" onClick={()=>window.__toast && window.__toast(`${p.brand} renews ${p.renewal}`)}>
                  <Logo code={p.code} brand={p.brand} sm/>
                  <div className="dash-ref-partner-meta">
                    <span className="dash-ref-partner-brand">
                      {p.brand}
                      <span className="dash-ref-partner-status" style={{background: partnerStatusColor[p.status]}}/>
                    </span>
                    <span className="dash-ref-partner-renewal">Renews {p.renewal}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT COLUMN — Side panel */}
          <div className="dash-ref-side">

            {/* 7-day Redemption Trend */}
            <div className="dash-ref-side-card">
              <div className="dash-ref-side-head">
                <span>Redemption Trend</span>
                <span style={{font:'400 11px/1 Inter, sans-serif', color:'#4A5568'}}>last 7 days</span>
              </div>
              <div className="dash-ref-trend">
                <svg viewBox="0 0 280 60" preserveAspectRatio="none" width="100%" height="60">
                  {(() => {
                    const pts = trend.map((v, i) => {
                      const x = (i / (trend.length - 1)) * 280;
                      const y = 60 - (v / trendMax) * 50 - 4;
                      return [x, y];
                    });
                    const linePath = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
                    const areaPath = `${linePath} L 280 60 L 0 60 Z`;
                    return (
                      <>
                        <defs>
                          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E8B563" stopOpacity="0.30"/>
                            <stop offset="100%" stopColor="#E8B563" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <path d={areaPath} fill="url(#trendFill)"/>
                        <path d={linePath} fill="none" stroke="#E8B563" strokeWidth="1.5"/>
                        {pts.map((p, i) => (
                          <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 3 : 1.5} fill="#E8B563"/>
                        ))}
                      </>
                    );
                  })()}
                </svg>
                <div className="dash-ref-trend-labels">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <span key={d}>{d}</span>)}
                </div>
                <div className="dash-ref-trend-foot">
                  <span><b style={{color:'var(--text-primary)'}}>{trend[trend.length-1].toLocaleString()}</b> redemptions today</span>
                  <span style={{color:'#59d499'}}><Icon name="TrendingUp" size={10}/> +14% WoW</span>
                </div>
              </div>
            </div>

            {/* Top 3 Performing Offers */}
            <div className="dash-ref-side-card">
              <div className="dash-ref-side-head">Top Performing Offers</div>
              <ol className="dash-ref-top-list">
                {topPerformers.map((c, i) => (
                  <li key={c.id} onClick={()=>openDrawer(c.id)}>
                    <span className="rank">{i+1}</span>
                    <div className="meta">
                      <span className="title">{c.name}</span>
                      <span className="sub">{c.brand}</span>
                    </div>
                    <span className="score">{c.health}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Expiring Soon */}
            <div className="dash-ref-side-card">
              <div className="dash-ref-side-head">Expiring Soon</div>
              <ul className="dash-ref-expire-list">
                {expiring.map(e => (
                  <li key={e.id} onClick={()=>openDrawer(e.id)}>
                    <span className="dot" style={{background: e.days <= 3 ? '#ff6161' : '#ffc533'}}/>
                    <div className="meta">
                      <span className="title">{e.name}</span>
                      <span className="sub">{e.brand}</span>
                    </div>
                    <span className="when">{e.days}d</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </PageLayout>
  );
}

window.Dashboard = Dashboard;
