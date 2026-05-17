// ============ SCREEN 1 · DASHBOARD ============
function Dashboard({ goTo, openAi, openDrawer }) {
  const [view, setView] = useState('table');
  const [mapMode, setMapMode] = useState('segment');

  const heat = {
    Blue:     [0.8, 0.7, 0.9, 0.6, 0.8, 0.5, 0.7],
    Silver:   [0.9, 0.8, 0.7, 0.6, 0.7, 0.9, 0.8],
    Gold:     [0.7, 0.5, 0.6, 0.2, 0.2, 0.3, 0.6],
    Platinum: [0.9, 0.9, 0.8, 0.7, 0.9, 0.9, 0.8],
  };
  const tierBase = { Blue:'74,144,217', Silver:'136,146,164', Gold:'212,168,83', Platinum:'232,237,245' };
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  const camps = [
    { id:1, code:'MA', brand:'Marriott Bonvoy', cat:'Hotels',         name:'Flat 50% Off Weekend Stays',     mech:'BOGO',        tiers:'Gold · Platinum', sig:'trending', region:'Dubai · Abu Dhabi', health:87, delta:12, pct:78, q:'3,900 / 5,000' },
    { id:2, code:'CA', brand:'Careem',          cat:'Rides',          name:'10% Cashback on Every Ride',     mech:'Cashback',    tiers:'Blue · Silver',    sig:'fast',     region:'Dubai · Sharjah',   health:74, delta:8,  pct:52, q:'2,600 / 5,000' },
    { id:3, code:'NO', brand:'Noon',            cat:'E-commerce',     name:'3× Miles on All Bookings',       mech:'Points ×3',   tiers:'All Tiers',        sig:'losing',   region:'All UAE',           health:41, delta:-15,pct:23, q:'1,150 / 5,000' },
    { id:4, code:'CF', brand:'Cult.fit',        cat:'Lifestyle',      name:'1 Month Free Cult.fit Access',   mech:'Voucher',     tiers:'Gold',             sig:'elite',    region:'Dubai',             health:81, delta:5,  pct:67, q:'3,350 / 5,000' },
    { id:5, code:'BM', brand:'BookMyShow',      cat:'Entertainment',  name:'Buy 2 Tickets Get 1 Free',       mech:'BOGO',        tiers:'Silver · Gold',    sig:'expiring', region:'Dubai · Abu Dhabi', health:89, delta:0,  pct:89, q:'8,900 / 10,000' },
    { id:6, code:'EM', brand:'Emirates',        cat:'Travel',         name:'Complimentary Business Upgrade', mech:'BOGO',        tiers:'Platinum',         sig:null,       region:'DXB · AUH',         health:63, delta:0,  pct:34, q:'1,700 / 5,000' },
  ];

  const segments = {
    'High-Value UAE Travelers': [1,3,6],
    'Active Lifestyle Members': [2,4,5]
  };

  // Edges by mode for the relationship graph
  const edges = useMemo(() => {
    const e = [];
    if (mapMode === 'segment') {
      Object.entries(segments).forEach(([seg, ids]) => {
        for (let i=0;i<ids.length;i++) for (let j=i+1;j<ids.length;j++) e.push({a:ids[i], b:ids[j], group:seg});
      });
    } else if (mapMode === 'sponsor') {
      // Connect offers sharing a sponsor (Noon appears twice in our larger set)
      e.push({a:1, b:5, group:'Hospitality cluster'});
      e.push({a:3, b:4, group:'Lifestyle cluster'});
    } else { // reward
      e.push({a:1, b:5, group:'BOGO mechanic'});
      e.push({a:1, b:6, group:'BOGO mechanic'});
      e.push({a:5, b:6, group:'BOGO mechanic'});
      e.push({a:2, b:3, group:'Bonus mechanic'});
    }
    return e;
  }, [mapMode]);

  // Graph nodes shaped for RelationshipGraph component
  const graphNodes = camps.map(c => ({
    id: c.id, code: c.code, brand: c.brand,
    label: c.name, signal: c.sig, health: c.health, status: 'live'
  }));

  return (
    <div className="content col gap-24">
      {/* Greeting */}
      <div className="row between" style={{alignItems:'flex-end'}}>
        <div>
          <h1 className="h-greet">Good morning, Priya.</h1>
          <div className="mute" style={{fontSize:13, marginTop:6}}>
            Tuesday, 14 May 2024 · Emirates Skywards · UAE Region
          </div>
        </div>
        <Btn kind="primary" lg icon={<Icon name="Plus" size={14}/>} onClick={()=>goTo('templates')}>Create Offer</Btn>
      </div>

      {/* ZONE 1 — Intelligence strip */}
      <div className="col gap-12">
        <div className="lbl-cap">What needs your attention</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16}}>
          <InsightCard tone="red"
            icon={<Icon name="TrendingDown" size={14} color="var(--accent-red)"/>}
            headline="Gold Tier Redemption Down 18%"
            body="3 offers expiring this week may be contributing."
            ctaLabel="View Offers"
            onClick={()=>goTo('offers', {filter:'gold'})}/>
          <InsightCard tone="green"
            icon={<Icon name="TrendingUp" size={14} color="var(--accent-green)"/>}
            headline="Weekend BOGO — 340% Above Forecast"
            body="Dubai · Marriott Bonvoy · Consider extending the offer window."
            ctaLabel="Review Offer"
            onClick={()=>openDrawer(1)}/>
          <InsightCard tone="amber"
            icon={<Icon name="FileEdit" size={14} color="var(--accent-amber)"/>}
            headline="Draft Stalled — Ramadan Miles Bonus"
            body="Last edited 6 days ago · Eligibility rules incomplete."
            ctaLabel="Resume Draft"
            onClick={()=>goTo('offers', {tab:'drafts'})}/>
          <InsightCard tone="blue"
            icon={<Icon name="DollarSign" size={14} color="var(--accent-blue)"/>}
            headline="Reward Liability Up 12% This Month"
            body="Platinum upgrades driving spike · Finance team flagged for review."
            ctaLabel="View Report"
            onClick={()=>window.__toast && window.__toast('Coming in the next release.')}/>
        </div>
      </div>

      {/* ZONE 2 — Program health */}
      <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:24}}>
        {/* Metric tiles */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
          {[
            { l:'Active Members (30d)',  v:'1.24M',  mc:'▲ 3.1%', mck:'up' },
            { l:'Offers Live',           v:'34',     mc:'—',      mck:'flat' },
            { l:'Avg Redemption Rate',   v:'12.4%',  mc:'▼ 1.8%', mck:'down' },
            { l:'Miles Issued (MTD)',    v:'84.2M',  unit:'mi',   mc:'▲ 6.7%', mck:'up' },
            { l:'Expiring in 7 Days',    v:'3',      mc:'⚠ attention', mck:'warn', click:()=>goTo('offers',{view:'expiring'}) },
            { l:'Rewards Triggered',     v:'2,847',  mc:'▲ 12%',  mck:'up' },
          ].map((t,i)=>(
            <MetricTile key={i} label={t.l} value={t.v} unit={t.unit}
                        change={t.mc} changeKind={t.mck} onClick={t.click}/>
          ))}
        </div>

        {/* Heatmap */}
        <div className="card">
          <div className="lbl-cap" style={{marginBottom:4}}>Skywards Miles Activity</div>
          <div className="mute" style={{fontSize:12, marginBottom:14}}>Last 7 days · by tier</div>

          <div className="heatmap">
            <div></div>
            {days.map(d => <div key={d} className="heat-label text-c">{d}</div>)}
            {['Blue','Silver','Gold','Platinum'].map(tier => (
              <React.Fragment key={tier}>
                <div className="heat-label">{tier}</div>
                {heat[tier].map((v,di)=>(
                  <div key={di} className="heat-cell"
                       style={{background:`rgba(${tierBase[tier]}, ${v})`}}>
                    {tier==='Gold' && days[di]==='Thu' && (
                      <div className="heat-tip">{tier} Tier · {days[di]} · 142 redemptions · ↓67% below peak</div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          <div className="divider" style={{margin:'16px 0'}}/>

          <div className="tier-bar">
            {[
              { t:'Blue',     pct:28, ct:'1.38M members', color:'var(--accent-blue)'},
              { t:'Silver',   pct:35, ct:'1.72M members', color:'var(--text-secondary)'},
              { t:'Gold',     pct:25, ct:'1.23M members', color:'var(--accent-gold)'},
              { t:'Platinum', pct:12, ct:'590K members',  color:'var(--accent-platinum)'},
            ].map(t=>(
              <div className="tier-row" key={t.t}>
                <div className="row gap-6"><span className="dot" style={{background:t.color}}/><span style={{fontSize:12,color:'var(--text-primary)'}}>{t.t}</span></div>
                <div className="tier-meter"><div style={{width:t.pct+'%', background:t.color}}/></div>
                <div className="row gap-4" style={{fontSize:11,color:'var(--text-secondary)',justifyContent:'flex-end'}}><b style={{color:'var(--text-primary)',fontWeight:600}}>{t.pct}%</b> · {t.ct}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ZONE 3 — Live Offers */}
      <div className="col gap-12">
        <div className="row between">
          <div className="row gap-12">
            <h2 className="h-2">Live Offers</h2>
            <Pill kind="solid-dark">{camps.length} active</Pill>
          </div>
          <div className="row gap-10">
            <ViewToggle value={view} onChange={setView}
                        options={[{id:'table', label:'Table', icon:'Table'},
                                  {id:'map',   label:'Map',   icon:'Map'}]}/>
            <div className="btn-link row gap-4" onClick={()=>goTo('offers')}>View All <Icon name="ArrowRight" size={12}/></div>
          </div>
        </div>

        {view === 'table' && (
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16}}>
            {camps.map(c => (
              <OfferCard key={c.id} c={c} onClick={()=>openDrawer(c.id)}/>
            ))}
          </div>
        )}

        {view === 'map' && (
          <div className="col gap-12">
            <div className="row gap-8">
              <div className="mute" style={{fontSize:12}}>Connection mode:</div>
              {[{id:'segment', label:'By Segment'},{id:'sponsor',label:'By Sponsor'},{id:'reward',label:'By Reward'}].map(m => (
                <FilterChip key={m.id} label={m.label} active={mapMode===m.id} onClick={()=>setMapMode(m.id)}/>
              ))}
            </div>
            <RelationshipGraph
              nodes={graphNodes}
              edges={edges}
              height={460}
              onNodeClick={(n)=>openDrawer(n.id)}
              showLegend={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
