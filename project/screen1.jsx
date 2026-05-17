// Screen 1 — Dashboard wireframe
function Screen1({ goTo }) {
  // Heat values: 7 cols (Mon-Sun) × 3 rows (Silver, Gold, Platinum). Gold quieter Thu–Sun.
  const heat = [
    [0.6, 0.7, 0.8, 0.65, 0.75, 0.85, 0.6],     // silver
    [0.7, 0.75, 0.7, 0.3, 0.25, 0.2, 0.3],      // gold (quieter Thu–Sun)
    [0.55, 0.6, 0.5, 0.55, 0.65, 0.7, 0.5]      // platinum
  ];
  const tierColors = ['#cdcabe','#e8b53b','#eee8d2'];

  const camps = [
    {code:'MH', name:'Weekend City Escape', type:'Tier Exclusive', sig:'🔥 Trending', sigKind:'amber', pct:78, q:'3,900/5,000', region:'Singapore'},
    {code:'HG', name:'Business Traveler Bonus', type:'Cashback', sig:'⭐ Elite Favorite', sigKind:'gold', pct:52, q:'2,600/5,000', region:'India'},
    {code:'IS', name:'Monsoon Getaway Bonus', type:'Seasonal', sig:'📉 Losing Momentum', sigKind:'red', pct:23, q:'1,150/5,000', region:'Thailand'},
    {code:'AT', name:'Summer Points Multiplier', type:'Milestone', sig:'⚡ Fast Growing', sigKind:'blue', pct:41, q:'4,100/10,000', region:'All APAC'},
    {code:'HB', name:'Loyalty Upgrade Week', type:'Flash Campaign', sig:'⏳ Expiring Soon', sigKind:'amber', pct:89, q:'8,900/10,000', region:'Indonesia'},
    {code:'RR', name:'Referral Summer Bonus', type:'Referral', sig:null, sigKind:null, pct:34, q:'1,700/5,000', region:'India'}
  ];

  return (
    <div className="content" style={{position:'relative'}}>
      <Annotation style={{top:-4, right:18}}>
        ✎ sketch / not final visuals <span className="arrow">↘</span>
      </Annotation>

      <div className="row between" style={{alignItems:'end'}}>
        <div>
          <ScribbleHeading>Good morning, Priya.</ScribbleHeading>
          <div className="text-mute text-md mt-4">
            Tuesday, 14 May 2024 · APAC Region · <span className="hl-gold">Gold Tier redemption needs attention</span>
          </div>
        </div>
        <div className="row gap-8">
          <Btn kind="ghost" sm>⌕ Search</Btn>
          <Btn kind="primary" onClick={() => goTo(2)}>+ Create Offer</Btn>
        </div>
      </div>

      {/* BAND 1 — Operational insight strip */}
      <div className="mt-20">
        <div className="text-mute text-sm h-hand" style={{textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8}}>What needs you today</div>
        <div className="grid g-4">
          <div className="insight-card red">
            <div className="row between">
              <span className="icon-circle ic-red">↓</span>
              <span className="text-mute text-sm">Alert</span>
            </div>
            <h4>Gold Tier Redemption Down 18%</h4>
            <p>3 campaigns expiring this week may be contributing</p>
            <Btn sm onClick={() => goTo(2, {tier:'gold'})}>View Campaigns →</Btn>
          </div>
          <div className="insight-card green">
            <div className="row between">
              <span className="icon-circle ic-green">↑</span>
              <span className="text-mute text-sm">Positive</span>
            </div>
            <h4>Weekend City Escape — 340% above forecast</h4>
            <p>Singapore · Consider extending campaign window</p>
            <Btn sm>Review Campaign →</Btn>
          </div>
          <div className="insight-card amber">
            <div className="row between">
              <span className="icon-circle ic-amber">✎</span>
              <span className="text-mute text-sm">Draft warning</span>
            </div>
            <h4>Monsoon Getaway Bonus — Draft Stalled</h4>
            <p>Last edited 6 days ago · Eligibility rules missing</p>
            <Btn sm>Resume Draft →</Btn>
          </div>
          <div className="insight-card blue">
            <div className="row between">
              <span className="icon-circle ic-blue">$</span>
              <span className="text-mute text-sm">Finance</span>
            </div>
            <h4>Reward Liability Up 12% This Month</h4>
            <p>Primarily Platinum hotel upgrades · Finance flagged</p>
            <Btn sm>View Report →</Btn>
          </div>
        </div>
      </div>

      {/* BAND 2 — Program health */}
      <div className="mt-24">
        <div className="text-mute text-sm h-hand" style={{textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8}}>Program health</div>
        <div className="grid g-2" style={{gridTemplateColumns:'1.4fr 1fr'}}>
          {/* Stat grid */}
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr', gridGap:10}}>
            <div className="metric">
              <div className="lbl">Active Members (30d)</div>
              <div className="val">1.24M</div>
              <div className="chg up">▲ 3.1%</div>
            </div>
            <div className="metric">
              <div className="lbl">Offers Live</div>
              <div className="val">34</div>
              <div className="chg text-mute">—</div>
            </div>
            <div className="metric">
              <div className="lbl">Avg. Redemption Rate</div>
              <div className="val">12.4%</div>
              <div className="chg down">▼ 1.8%</div>
            </div>
            <div className="metric">
              <div className="lbl">Points Issued (MTD)</div>
              <div className="val">84.2M <span style={{fontSize:14}}>pts</span></div>
              <div className="chg up">▲ 6.7%</div>
            </div>
            <div className="metric">
              <div className="lbl">Expiring in 7 Days</div>
              <div className="val">3 <span style={{fontSize:14}}>campaigns</span></div>
              <div className="chg warn">⚠ attention</div>
            </div>
            <div className="metric">
              <div className="lbl">Draft Offers</div>
              <div className="val">2</div>
              <div className="chg text-mute">—</div>
            </div>
          </div>
          {/* Tier distribution */}
          <div className="metric" style={{position:'relative'}}>
            <div className="lbl">Tier Distribution</div>
            <div className="stack-bar mt-8">
              <div className="seg-silver" style={{width:'61%'}}>Silver · 61%</div>
              <div className="seg-gold" style={{width:'27%'}}>Gold · 27%</div>
              <div className="seg-plat" style={{width:'12%'}}>Plat · 12%</div>
            </div>
            <div className="row between mt-8 text-sm">
              <span><span className="dot gray"/>Silver · 2.56M</span>
              <span><span className="dot gold"/>Gold · 1.13M</span>
              <span><span className="dot" style={{background:'#eee8d2'}}/>Plat · 504K</span>
            </div>
            <div className="lbl mt-16">7-day activity · tier × day</div>
            <div className="row gap-8 mt-4" style={{alignItems:'start'}}>
              <div style={{display:'flex', flexDirection:'column', gap:3, fontSize:11, marginTop:18}} className="text-mute">
                <span>Slv</span><span>Gld</span><span>Plt</span>
              </div>
              <div style={{flex:1}}>
                <div className="row" style={{justifyContent:'space-between', fontSize:11, color:'var(--ink-mute)', marginBottom:2}}>
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
                <div className="heat">
                  {heat.map((row, ri) => row.map((v, ci) => (
                    <div key={ri+'-'+ci} className="heat-cell"
                      style={{background: tierColors[ri], opacity: 0.25 + v*0.75}}/>
                  )))}
                </div>
              </div>
            </div>
            <Annotation style={{bottom:10, right:10, fontSize:14}}>
              note: Gold ↓ Thu–Sun
            </Annotation>
          </div>
        </div>
      </div>

      {/* BAND 3 — Live campaigns */}
      <div className="mt-24">
        <div className="row between">
          <div className="h-hand text-lg" style={{fontWeight:700}} >Live Campaigns</div>
          <a className="h-hand" style={{cursor:'pointer', borderBottom:'2px solid var(--ink)'}} onClick={()=>goTo(2)}>View All →</a>
        </div>
        <div className="grid g-3 mt-12">
          {camps.map((c,i)=>(
            <div className="camp-card" key={i}>
              <div className="row between">
                <div className="row gap-8">
                  <div className="logo-sq">{c.code}</div>
                  <div>
                    <div className="h-hand" style={{fontWeight:700}}>{c.name}</div>
                    <div className="text-sm text-mute">{c.region}</div>
                  </div>
                </div>
                {c.sig && <Pill kind={c.sigKind}>{c.sig}</Pill>}
              </div>
              <div className="mt-8"><Pill>{c.type}</Pill></div>
              <div className="mt-12">
                <div className={"progress " + (c.pct>=70?'green':(c.pct<30?'red':'amber'))}>
                  <div style={{width: c.pct+'%'}}/>
                </div>
                <div className="row between text-sm mt-4">
                  <span>{c.pct}%</span>
                  <span className="text-mute">{c.q}</span>
                </div>
              </div>
              <div className="row gap-8 mt-12">
                <Btn kind="ghost" sm>Edit</Btn>
                <Btn kind="ghost" sm>Pause</Btn>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
window.Screen1 = Screen1;
