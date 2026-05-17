// Screen 2 — Offer list + contextual drawer
function Screen2({ goTo, initialFilter }) {
  const [tab, setTab] = useState('all');
  const [savedView, setSavedView] = useState(initialFilter === 'gold' ? 'gold' : null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const allRows = [
    {i:1, code:'MH', sponsor:'Meridian', name:'Weekend City Escape', cid:'APAC_WCE_SG_24', type:'Tier Exclusive', reward:'3x Points · Min 2 nights', tiers:{g:1,p:1,s:0}, status:{dot:'green', label:'Live'}, signal:'🔥 Trending', sigKind:'amber', region:'SG', health:78, hk:'green', actions:['View','Edit','Duplicate']},
    {i:2, code:'HG', sponsor:'Halcyon',  name:'Business Traveler Bonus', cid:'IN_BTB_CORP_24', type:'Cashback', reward:'5% cashback · Corp bookings', tiers:{g:1,p:1,s:0}, status:{dot:'green', label:'Live'}, signal:'⭐ Elite Favorite', sigKind:'gold', region:'IN', health:52, hk:'amber', actions:['View','Edit','Duplicate']},
    {i:3, code:'IS', sponsor:'Indigo Stays', name:'Monsoon Getaway Bonus', cid:'TH_MGB_MON_24', type:'Seasonal', reward:'2x Points · Monsoon stays', tiers:{g:1,p:0,s:1}, status:{dot:'green', label:'Live'}, signal:'📉 Losing Momentum', sigKind:'red', region:'TH', health:23, hk:'red', actions:['View','Edit','Pause']},
    {i:4, code:'AT', sponsor:'Atlas',    name:'Summer Points Multiplier', cid:'APAC_SUM24_GOLD_V2', type:'Milestone', reward:'3x Points · Hotel stays', tiers:{g:1,p:1,s:1}, status:{dot:'green', label:'Live'}, signal:'⚡ Fast Growing', sigKind:'blue', region:'All APAC', health:41, hk:'amber', actions:['View','Edit','Duplicate']},
    {i:5, code:'HB', sponsor:'Harbor',   name:'Loyalty Upgrade Week', cid:'APAC_LUW_FLASH_24', type:'Flash Campaign', reward:'Free upgrade · 3-night min', tiers:{g:0,p:1,s:0}, status:{dot:'green', label:'Live'}, signal:'⏳ Expiring Soon', sigKind:'amber', region:'ID', health:89, hk:'green', actions:['View','Edit','Extend']},
    {i:6, code:'RR', sponsor:'Ridgepoint', name:'Referral Summer Bonus', cid:'IN_REF_SUM_24', type:'Referral', reward:'500 pts per referral', tiers:{g:1,p:0,s:1}, status:{dot:'amber', label:'Scheduled'}, signal:null, sigKind:null, region:'IN', health:34, hk:'amber', actions:['View','Edit','Duplicate']},
    {i:7, code:'MH', sponsor:'Meridian', name:'Early Bird Summer', cid:'APAC_EBS_MAY_24', type:'Limited Time', reward:'15% discount · Early booking', tiers:{g:1,p:1,s:1}, status:{dot:'blue', label:'Scheduled'}, signal:null, sigKind:null, region:'All APAC', health:null, hk:null, actions:['View','Edit','Cancel']},
    {i:8, code:'HG', sponsor:'Halcyon',  name:'Platinum Winter Preview', cid:'IN_PLT_WIN_23', type:'Tier Exclusive', reward:'2x Points + Lounge access', tiers:{g:0,p:1,s:0}, status:{dot:'gray', label:'Ended'}, signal:null, sigKind:null, region:'IN', health:100, hk:'gray', actions:['View','Duplicate','Archive']},
  ];

  let rows = allRows;
  if (tab === 'mine') rows = allRows.filter(r => [1,2,3].includes(r.i));
  if (tab === 'drafts') rows = [];
  if (tab === 'arch') rows = allRows.filter(r => r.status.label === 'Ended');
  if (savedView === 'gold') rows = rows.filter(r => r.tiers.g === 1);

  const TickCross = ({v}) => <span style={{fontWeight:700, color: v ? 'var(--green)' : 'var(--ink-mute)'}}>{v ? '✓' : '✗'}</span>;

  return (
    <div className="content" style={{position:'relative'}}>
      <div className="row between" style={{alignItems:'end'}}>
        <ScribbleHeading size={42}>Offers</ScribbleHeading>
        <div className="row gap-8">
          <Btn kind="ghost" sm>⤓ Export</Btn>
          <Btn kind="primary" onClick={()=>goTo(3)}>+ Create Offer</Btn>
        </div>
      </div>

      {/* TABS */}
      <div className="row gap-4 mt-16" style={{borderBottom:'1.5px dashed var(--ink)', paddingBottom:6}}>
        {[
          {id:'all', label:'All Offers (34)'},
          {id:'mine', label:'My Offers (12)'},
          {id:'drafts', label:'Drafts (2)'},
          {id:'arch', label:'Archived (18)'}
        ].map(t => (
          <span key={t.id} onClick={()=>setTab(t.id)}
            className={"h-hand text-md"} style={{
              cursor:'pointer', padding:'4px 10px',
              fontWeight:700,
              borderBottom: tab===t.id ? '4px solid var(--gold)' : '4px solid transparent',
              color: tab===t.id ? 'var(--ink)' : 'var(--ink-mute)'
            }}>{t.label}</span>
        ))}
      </div>

      {/* FILTER ROW */}
      <div className="row between mt-12" style={{flexWrap:'wrap', gap:8}}>
        <div className="row gap-8" style={{flexWrap:'wrap'}}>
          {['Tier ▾','Region ▾','Offer Type ▾','Status ▾','Date Range ▾'].map(f => (
            <span key={f} className="pill ghost" style={{padding:'5px 12px', cursor:'pointer'}}>{f}</span>
          ))}
        </div>
        <div className="row gap-8">
          <span className="text-mute text-sm">Saved Views:</span>
          {[
            {id:'gold', label:'Gold Tier Campaigns'},
            {id:'exp', label:'Expiring This Week'},
            {id:'apac', label:'APAC Region'}
          ].map(v => (
            <span key={v.id}
              onClick={()=>setSavedView(savedView===v.id ? null : v.id)}
              className={"pill " + (savedView===v.id ? 'gold' : 'ghost')}
              style={{cursor:'pointer'}}>{v.label}</span>
          ))}
        </div>
      </div>

      {savedView && (
        <div className="text-sm text-mute mt-8 row gap-8">
          <span className="h-hand" style={{fontWeight:700}}>filtered by:</span>
          <Pill kind="dark">{savedView==='gold'?'Gold Tier Campaigns':savedView==='exp'?'Expiring This Week':'APAC Region'} ×</Pill>
          <span style={{cursor:'pointer'}} onClick={()=>setSavedView(null)}>clear ×</span>
        </div>
      )}

      {/* TABLE */}
      <div className="sk mt-16" style={{padding:0, overflow:'hidden'}}>
        <div className="ot-row head">
          <span>Sponsor</span><span>Campaign</span><span>Type</span><span>Reward</span>
          <span>Tiers (S·G·P)</span><span>Status</span><span>Signal</span><span>Region</span>
          <span>Health</span><span>Actions</span>
        </div>
        {rows.length === 0 && (
          <div style={{padding:'24px', textAlign:'center'}} className="text-mute">
            No rows for this filter.
          </div>
        )}
        {rows.map(r => (
          <div key={r.i} className="ot-row" onClick={()=> r.i===3 && setDrawerOpen(true)}>
            <span className="row gap-6"><span className="logo-sq" style={{width:26, height:26, fontSize:11}}>{r.code}</span><span className="text-sm">{r.sponsor}</span></span>
            <span>
              <div style={{fontWeight:700}} className="h-hand">{r.name}</div>
              <div className="mono text-mute" style={{fontSize:11}}>{r.cid}</div>
            </span>
            <span><Pill>{r.type}</Pill></span>
            <span className="text-sm">{r.reward}</span>
            <span className="row gap-6 text-sm">
              <TickCross v={r.tiers.s}/><TickCross v={r.tiers.g}/><TickCross v={r.tiers.p}/>
            </span>
            <span><span className={"dot " + r.status.dot}/>{r.status.label}</span>
            <span>{r.signal ? <Pill kind={r.sigKind}>{r.signal}</Pill> : <span className="text-mute">—</span>}</span>
            <span className="mono text-sm">{r.region}</span>
            <span>
              {r.health == null ? <span className="text-mute text-sm">—</span> : (
                <div>
                  <div className={"progress " + (r.hk||'')}><div style={{width:r.health+'%'}}/></div>
                  <div className="text-sm text-mute">{r.health}%</div>
                </div>
              )}
            </span>
            <span className="row gap-4">
              {r.actions.map(a => <Btn key={a} kind="ghost" sm>{a}</Btn>)}
            </span>
          </div>
        ))}
      </div>

      <div className="row between mt-12 text-sm text-mute">
        <span>Showing {rows.length} of {allRows.length}</span>
        <span className="row gap-8"><span>‹ Prev</span><span className="pill dark">1</span><span>2</span><span>3</span><span>Next ›</span></span>
      </div>

      <Annotation style={{top:120, right:18, maxWidth:170}}>
        click Row 3 →<br/>drawer slides in
      </Annotation>

      {/* DRAWER */}
      <div className={"drawer " + (drawerOpen ? 'open' : '')}>
        <div className="drawer-hd">
          <div className="logo-sq">IS</div>
          <div>
            <div className="h-hand text-lg" style={{fontWeight:700}}>Monsoon Getaway Bonus</div>
            <div className="row gap-6 mt-4">
              <Pill kind="green"><span className="dot green" style={{margin:0}}/> Live</Pill>
              <Pill kind="red">📉 Losing Momentum</Pill>
            </div>
          </div>
          <button className="drawer-close" onClick={()=>setDrawerOpen(false)}>✕</button>
        </div>
        <div className="drawer-body">
          <div className="drawer-section">
            <h5>Performance Snapshot</h5>
            <div className="sk-soft" style={{padding:'10px 12px'}}>
              <div className="row between" style={{alignItems:'end'}}>
                <div>
                  <div className="h-display" style={{fontSize:44, lineHeight:1}}>23%</div>
                  <div className="text-sm" style={{color:'var(--red)'}}>Target was 55%</div>
                </div>
                <Sparkline declining={true}/>
              </div>
              <div className="text-sm mt-8">Redeemed: <b>1,150 / 5,000</b> quota</div>
            </div>
          </div>
          <div className="drawer-section">
            <h5>Campaign Details</h5>
            <div className="text-sm" style={{lineHeight:1.6}}>
              <div className="row between"><span className="text-mute">Region</span><span>Thailand</span></div>
              <div className="row between"><span className="text-mute">Tiers</span><span>Gold, Silver</span></div>
              <div className="row between"><span className="text-mute">Ends</span><span>Jun 15, 2024 · 12 days</span></div>
              <div className="row between"><span className="text-mute">Reward</span><span>2x Points · Monsoon stays</span></div>
            </div>
          </div>
          <div className="drawer-section">
            <h5>Insight</h5>
            <div className="insight-card amber" style={{padding:'10px 12px'}}>
              <div className="row gap-6"><span className="h-display text-xl">✦</span><b className="h-hand">Recommendation</b></div>
              <p style={{margin:'6px 0 0'}}>This offer is underperforming with Gold tier in Thailand — consider increasing reward value or extending the campaign window by 14 days.</p>
            </div>
          </div>
          <div className="drawer-section">
            <h5>Quick Actions</h5>
            <div className="grid g-2" style={{gap:8}}>
              <Btn kind="primary">Edit Campaign</Btn>
              <Btn kind="ghost">Duplicate</Btn>
              <Btn kind="ghost">Extend Dates</Btn>
              <Btn kind="ghost">Pause</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.Screen2 = Screen2;
