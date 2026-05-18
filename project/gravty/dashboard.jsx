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
  const camps = OFFERS_DATA
    .filter(o => o.status === 'live')
    .map(o => ({
      id: o.id, code: o.code, brand: o.brand, name: o.name, cat: o.cat, mech: o.mech,
      tiers: Array.isArray(o.tiers) ? o.tiers.join(' · ') : o.tiers,
      region: Array.isArray(o.region) ? o.region.join(' · ') : o.region,
      sig: o.signal, health: o.health, delta: o.delta, kind: o.status, trend7: o.trend7 || [],
    }));

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

  const iconCornerStyle = { position:'absolute', top:16, right:16, opacity:0.9, zIndex:2, display:'inline-flex' };

  return (
    <PageLayout>
      <div className="dash-ref">
        {/* GREETING ─────────────────────────────────── */}
        <div className="dash-ref-greet">
          <h1>Good morning, <em>Priya</em></h1>
          <div className="sub">Tuesday · 14 May 2024 · Emirates Skywards · UAE Region</div>
        </div>

        {/* INTELLIGENCE STRIP — unchanged ──────────────── */}
        <div className="dash-ref-strip">
          <div className="dash-ref-strip-head">
            <span className="dash-ref-label">What needs your attention</span>
          </div>
          <div className="dash-ref-strip-grid">

            <div className="dash-ref-insight dominant" style={{minHeight:160, display:'flex', flexDirection:'column'}} onClick={()=>goTo('offers', {filter:'gold'})}>
              <span style={iconCornerStyle}><Icon name="TrendingDown" size={16} color="#ff6161"/></span>
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
              <span style={iconCornerStyle}><Icon name="TrendingUp" size={16} color="#59d499"/></span>
              <h4 className="ic-title-row">Weekend BOGO — 340% Above Forecast</h4>
              <p className="ic-body">Dubai · Marriott Bonvoy</p>
              <span className="ic-cta" style={{marginTop:'auto'}}>View Offer <Icon name="ArrowRight" size={11}/></span>
            </div>

            <div className="dash-ref-insight" style={{minHeight:160, display:'flex', flexDirection:'column'}} onClick={()=>goTo('offers', {tab:'drafts'})}>
              <span style={iconCornerStyle}><Icon name="AlertTriangle" size={16} color="#ffc533"/></span>
              <h4 className="ic-title-row">Draft Stalled — Ramadan Miles Bonus</h4>
              <p className="ic-body">3 offers expiring this week</p>
              <span className="ic-cta" style={{marginTop:'auto'}}>Resume Draft <Icon name="ArrowRight" size={11}/></span>
            </div>

            <div className="dash-ref-insight" style={{minHeight:160, display:'flex', flexDirection:'column'}} onClick={()=>window.__toast && window.__toast('Coming in the next release.')}>
              <span style={iconCornerStyle}><Icon name="DollarSign" size={16} color="#57c1ff"/></span>
              <h4 className="ic-title-row">Reward Liability Up 12% This Month</h4>
              <p className="ic-body">Platinum upgrades driving increase</p>
              <span className="ic-cta" style={{marginTop:'auto'}}>View Report <Icon name="ArrowRight" size={11}/></span>
            </div>
          </div>
        </div>

        {/* OFFER PIPELINE — transparent, single continuous line ─── */}
        <div className="dash-ref-pipeline-strip">
          <div className="dash-ref-pipeline-row">
            {pipeline.flatMap((p, i) => {
              const cell = (
                <div className="dash-ref-pipe-cell" key={`stage-${p.stage}`}
                     onClick={()=>goTo('offers', {status: p.stage})}>
                  <span className="dash-ref-pipe-dot" style={{background:p.color}}/>
                  <div className="dash-ref-pipe-meta">
                    <span className="dash-ref-pipe-stage">{p.stage}</span>
                    <span className="dash-ref-pipe-count">{p.count}</span>
                  </div>
                </div>
              );
              if (i === pipeline.length - 1) return [cell];
              const connector = (
                <span className="dash-ref-pipe-connector" key={`conn-${i}`} aria-hidden="true">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <polyline points="2,1.5 5,4 2,6.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              );
              return [cell, connector];
            })}
          </div>
        </div>

        {/* MAIN ROW — Live Offers | Side panel ───── */}
        <div className="dash-ref-main">

          {/* LEFT COLUMN */}
          <div>
            {/* Live Offers */}
            <div className="dash-ref-section-head">
              <span className="dash-ref-label">Live Offers <span style={{marginLeft:8, padding:'3px 8px', borderRadius:10, background:'#1a1d24', color:'var(--text-muted)', fontSize:11, fontWeight:500}}>{camps.length} active</span></span>
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
                  View All Offers <Icon name="ArrowRight" size={11}/>
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
                  edges={[
                    {a:1, b:5, group:'BOGO mechanic'},
                    {a:1, b:6, group:'BOGO mechanic'},
                    {a:5, b:6, group:'BOGO mechanic'},
                    {a:2, b:3, group:'Bonus mechanic'},
                  ]}
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

            {/* Program Health — 6 KPIs */}
            <div className="dash-ref-side-card">
              <div className="dash-ref-side-head">Program Health</div>
              <div className="dash-ref-kpi-grid">
                <div className="dash-ref-kpi"><span className="kpi-l"><Icon name="Users" size={11}/> Active Members</span><span className="kpi-v">12.4M</span><span className="kpi-c up"><Icon name="ArrowUp" size={9}/>3.2%</span></div>
                <div className="dash-ref-kpi"><span className="kpi-l"><Icon name="Tag" size={11}/> Offers Live</span><span className="kpi-v">128</span><span className="kpi-c up"><Icon name="ArrowUp" size={9}/>4</span></div>
                <div className="dash-ref-kpi"><span className="kpi-l"><Icon name="Zap" size={11}/> Redemption Rate</span><span className="kpi-v">18.6%</span><span className="kpi-c down"><Icon name="ArrowDown" size={9}/>1.8pp</span></div>
                <div className="dash-ref-kpi"><span className="kpi-l"><Icon name="BarChart2" size={11}/> Miles Issued</span><span className="kpi-v">3.2B</span><span className="kpi-c up"><Icon name="ArrowUp" size={9}/>6.7%</span></div>
                <div className="dash-ref-kpi"><span className="kpi-l"><Icon name="Gift" size={11}/> Rewards Triggered</span><span className="kpi-v">86.1K</span><span className="kpi-c up"><Icon name="ArrowUp" size={9}/>7.3%</span></div>
                <div className="dash-ref-kpi"><span className="kpi-l"><Icon name="Clock" size={11}/> Expiring in 7 Days</span><span className="kpi-v">3</span><span className="kpi-c warn"><Icon name="AlertTriangle" size={9}/>attention</span></div>
              </div>
            </div>

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
