// ============ SCREEN 2 · OFFER LIST ============
function OfferList({ goTo, openDrawer, initial, pendingOffers = [] }) {
  const [tab, setTab] = useState(initial?.tab || 'all');
  const [view, setView] = useState('table');
  const [filterOpen, setFilterOpen] = useState(false);
  // appliedFilters = state that actually filters the table
  // pendingFilters = what user is building inside the panel
  const emptyFilters = () => ({
    sponsor: new Set(), type: new Set(), tier: new Set(), region: new Set(), status: new Set()
  });
  const [appliedFilters, setAppliedFilters] = useState(() => {
    const f = emptyFilters();
    if (initial?.filter === 'gold') f.tier.add('Gold');
    return f;
  });
  const [pendingFilters, setPendingFilters] = useState(appliedFilters);

  // Open panel → sync pending from applied
  useEffect(() => {
    if (filterOpen) setPendingFilters(cloneFilters(appliedFilters));
  }, [filterOpen]);

  const cloneFilters = (f) => ({
    sponsor: new Set(f.sponsor), type: new Set(f.type), tier: new Set(f.tier),
    region: new Set(f.region), status: new Set(f.status)
  });

  const pendingToggle = (key, val) => {
    setPendingFilters(f => {
      const s = new Set(f[key]);
      s.has(val) ? s.delete(val) : s.add(val);
      return { ...f, [key]: s };
    });
  };
  const pendingClear = () => setPendingFilters(emptyFilters());
  const applyPending = () => {
    setAppliedFilters(cloneFilters(pendingFilters));
    setFilterOpen(false);
  };
  const closeWithoutApplying = () => { setFilterOpen(false); /* pending will be reset on next open */ };

  const activeFilterCount =
    appliedFilters.sponsor.size + appliedFilters.type.size + appliedFilters.tier.size + appliedFilters.region.size + appliedFilters.status.size;
  const pendingFilterCount =
    pendingFilters.sponsor.size + pendingFilters.type.size + pendingFilters.tier.size + pendingFilters.region.size + pendingFilters.status.size;

  const all = [
    { id:1, code:'MA', sponsor:'Marriott Bonvoy', cat:'Hotels',         offer:'Flat 50% Off Weekend Stays',     cid:'EMSK_MA_BOGO_MAY24',  mech:'BOGO',      tiers:['Gold','Plat'],   region:['Dubai','Abu Dhabi'],            range:'May 1 → Jun 30',          sig:'trending', kind:'live',     health:87, delta:12, trophy:false },
    { id:2, code:'CA', sponsor:'Careem',          cat:'Rides',          offer:'10% Cashback on Every Ride',      cid:'EMSK_CA_EARN_MAY24',  mech:'Cashback',  tiers:['Blue','Silver'], region:['Dubai','Sharjah'],              range:'May 5 → Jun 15',          sig:'fast',     kind:'live',     health:74, delta:8,  trophy:false },
    { id:3, code:'NO', sponsor:'Noon',            cat:'E-commerce',     offer:'3× Miles on All Bookings',        cid:'EMSK_NO_RAM_MAY24',   mech:'Points ×N', tiers:['All Tiers'],     region:['All UAE'],                      range:'May 5 → Jun 15 · 12d',    sig:'losing',   kind:'live',     health:41, delta:-15,trophy:true  },
    { id:4, code:'CF', sponsor:'Cult.fit',        cat:'Lifestyle',      offer:'1 Month Free Cult.fit Access',    cid:'EMSK_CF_FIT_MAY24',   mech:'Voucher',   tiers:['Gold'],          region:['Dubai'],                        range:'May 10 → Jul 31',         sig:'elite',    kind:'live',     health:81, delta:5,  trophy:false },
    { id:5, code:'BM', sponsor:'BookMyShow',      cat:'Entertainment',  offer:'Buy 2 Tickets Get 1 Free',        cid:'EMSK_BM_EXP_MAY24',   mech:'BOGO',      tiers:['Silver','Gold'], region:['Dubai','Abu Dhabi'],            range:'⏳ 4 days left',           sig:'expiring', kind:'live',     health:89, delta:0,  trophy:false },
    { id:6, code:'EM', sponsor:'Emirates',        cat:'Travel',         offer:'Complimentary Business Upgrade',  cid:'EMSK_EM_BIZ_APR24',   mech:'BOGO',      tiers:['Platinum'],      region:['DXB','AUH'],                    range:'Apr 1 → Jun 30',          sig:null,       kind:'live',     health:63, delta:0,  trophy:false },
    { id:7, code:'CH', sponsor:'Chalhoub',        cat:'Luxury',         offer:'20% Off Luxury Collections',      cid:'EMSK_CH_LUX_JUN24',   mech:'Flat Off',  tiers:['Gold','Plat'],   region:['Dubai'],                        range:'Starts Jun 1',            sig:null,       kind:'scheduled',health:null,delta:0, trophy:false },
    { id:8, code:'NO', sponsor:'Noon',            cat:'E-commerce',     offer:'Eid Exclusive Gift Voucher',      cid:'EMSK_NO_EID_APR24',   mech:'Voucher',   tiers:['All Tiers'],     region:['All UAE'],                      range:'Ended Apr 25',            sig:null,       kind:'ended',    health:null,delta:0, trophy:false },
  ];

  // Apply tabs + applied filters to compute visible rows
  const applyAll = (filters) => {
    let rows = all;
    if (tab === 'mine') rows = rows.filter(r => [1,2,3].includes(r.id));
    else if (tab === 'drafts') rows = rows.filter(r => r.kind === 'draft');
    else if (tab === 'scheduled') rows = rows.filter(r => r.kind === 'scheduled');
    else if (tab === 'archived') rows = rows.filter(r => r.kind === 'ended');
    if (filters.sponsor.size) rows = rows.filter(r => filters.sponsor.has(r.sponsor));
    if (filters.type.size)    rows = rows.filter(r => filters.type.has(r.mech));
    if (filters.tier.size)    rows = rows.filter(r => r.tiers.some(t => filters.tier.has(t === 'Plat' ? 'Platinum' : t)));
    if (filters.region.size)  rows = rows.filter(r => r.region.some(g => filters.region.has(g)));
    if (filters.status.size)  rows = rows.filter(r => filters.status.has({live:'Live',scheduled:'Scheduled',ended:'Ended',paused:'Paused'}[r.kind]));
    return rows;
  };

  const baseRows = applyAll(appliedFilters);
  const rows = tab === 'all' ? [...pendingOffers, ...baseRows] : baseRows;
  const pendingMatchCount = applyAll(pendingFilters).length;

  // Map nodes reflect the current tab's filtered set (same as table rows)
  const graphNodes = rows.map(r => ({
    id: r.id, code: r.code, brand: r.sponsor, label: r.offer, signal: r.sig, health: r.health, status: r.kind
  }));

  const tierColor = (t) => ({Gold:'gold', Plat:'plat', Platinum:'plat', Silver:'solid-dark', Blue:'blue', 'All UAE':'solid-dark'}[t] || 'solid-dark');
  const statusInfo = (k) => ({
    live:        { label:'Live' },
    scheduled:   { label:'Scheduled' },
    ended:       { label:'Ended' },
    paused:      { label:'Paused' },
    'in-review': { label:'In Review' },
  }[k] || { label:'—' });
  const stateActions = (kind) => {
    if (kind === 'live')      return [{i:'Edit',ic:'Edit'},{i:'Pause',ic:'Pause'},{i:'More',ic:'MoreHorizontal'}];
    if (kind === 'scheduled') return [{i:'Edit',ic:'Edit'},{i:'Cancel',ic:'X'},{i:'More',ic:'MoreHorizontal'}];
    if (kind === 'ended')     return [{i:'Duplicate',ic:'Copy'},{i:'Archive',ic:'Bookmark'}];
    return [{i:'Edit',ic:'Edit'},{i:'More',ic:'MoreHorizontal'}];
  };

  // Compact half-pie health indicator for table rows
  const MiniHealth = ({ value, delta }) => {
    if (value == null) return <span style={{color:'var(--text-muted)', fontSize:12}}>—</span>;
    const hc = getHealthColor(value);
    const r = 30, sw = 7;
    const circ = Math.PI * r;
    const pct = Math.max(0, Math.min(100, value)) / 100;
    return (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
        <svg width="80" height="40" viewBox="0 0 80 40" style={{overflow:'visible', display:'block'}}>
          <path d="M 10 40 A 30 30 0 0 1 70 40" fill="none" stroke="#252A35" strokeWidth={sw} strokeLinecap="round"/>
          <path d="M 10 40 A 30 30 0 0 1 70 40" fill="none" stroke={hc} strokeWidth={sw} strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
                style={{transition:'stroke-dashoffset .5s ease'}}/>
        </svg>
        <span style={{fontFamily:'Sora, sans-serif', fontWeight:700, fontSize:16, color:hc, lineHeight:1}}>{value}</span>
        {delta != null && delta !== 0 && (
          <span style={{fontSize:11, fontWeight:500, color: delta > 0 ? '#2DD4A0' : '#F26B6B', lineHeight:1}}>
            {delta > 0 ? '↑' : '↓'}{Math.abs(delta)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="offers-screen">
      {/* Fixed header + tabs */}
      <div className="offers-fixed">
        <div className="row between" style={{alignItems:'flex-end'}}>
          <div>
            <h1 className="h-page" style={{fontSize:24}}>Offers</h1>
            <div className="mute" style={{fontSize:13, marginTop:6}}>
              34 offers active · 3 expiring this week · 2 drafts incomplete
            </div>
          </div>
          <div className="row gap-10">
            <div className="row gap-4" style={{padding:'3px',background:'var(--bg-elevated)',borderRadius:8,border:'1px solid var(--border-default)'}}>
              <button className={"btn sm ghost"} style={{background:view==='table'?'var(--accent-gold)':'transparent',color:view==='table'?'#0A0C10':'var(--text-secondary)'}} onClick={()=>setView('table')}><Icon name="Table" size={13}/> Table</button>
              <button className={"btn sm ghost"} style={{background:view==='map'?'var(--accent-gold)':'transparent',color:view==='map'?'#0A0C10':'var(--text-secondary)'}} onClick={()=>setView('map')}><Icon name="Map" size={13}/> Map</button>
            </div>
            <button className="filter-icon-btn" onClick={()=>setFilterOpen(true)} title="Filter">
              <Icon name="Filter" size={16}/>
              {activeFilterCount > 0 && <span className="count-badge">{activeFilterCount}</span>}
            </button>
            <Btn kind="primary" lg icon={<Icon name="Plus" size={14}/>} onClick={()=>goTo('templates')}>Create Offer</Btn>
          </div>
        </div>

        <div className="tab-bar" style={{marginTop:18}}>
          {[
            {id:'all',       label:'All Offers',  count: all.length + pendingOffers.length},
            {id:'mine',      label:'My Offers',   count: all.filter(r=>[1,2,3].includes(r.id)).length},
            {id:'drafts',    label:'Drafts',      count: all.filter(r => r.kind === 'draft').length},
            {id:'scheduled', label:'Scheduled',   count: all.filter(r=>r.kind==='scheduled').length},
            {id:'archived',  label:'Archived',    count: all.filter(r=>r.kind==='ended').length}
          ].map(t => (
            <div key={t.id} className={"tab " + (tab===t.id?'active':'')} onClick={()=>setTab(t.id)}>
              {t.label} <span className="mute" style={{fontWeight:400}}>({t.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling content */}
      <div className="offers-scroll">
        {view === 'map' && (
          <div className="col gap-12">
            <div className="mute" style={{fontSize:12}}>
              {graphNodes.length > 0
                ? `${graphNodes.length} offer${graphNodes.length !== 1 ? 's' : ''} in this view`
                : 'No offers in this view'}
            </div>
            {graphNodes.length > 0 ? (
              <RelationshipGraph
                nodes={graphNodes}
                edges={[]}
                height={500}
                onNodeClick={(n)=>openDrawer(n.id)}
                showLegend={true}
              />
            ) : (
              <div style={{height:200, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', fontSize:14, background:'var(--bg-elevated)', borderRadius:12, border:'1px solid var(--border-default)'}}>
                No offers in this view
              </div>
            )}
          </div>
        )}
        {view === 'table' && (rows.length > 0 ? (
          <div className="tbl" style={{overflowX:'auto'}}>
            {/* SPONSOR 100 | OFFER 1fr | MECHANIC 90 | TIER 110 | REGION 100 | TIMELINE 110 | SIGNAL 140 | STATUS 90 | HEALTH 80 | ACTIONS 70 */}
            <div className="tbl-head" style={{gridTemplateColumns:'100px 1fr 90px 110px 100px 110px 140px 90px 80px 70px', columnGap:'24px', minWidth:1300, padding:'8px 24px'}}>
              <span>Sponsor</span>
              <span>Offer</span>
              <span>Mechanic</span>
              <span>Tier</span>
              <span>Region</span>
              <span>Timeline</span>
              <span>Signal</span>
              <span>Status</span>
              <span style={{overflow:'visible', textAlign:'center'}}>Health</span>
              <span></span>
            </div>
            {rows.map(r => {
              const si = statusInfo(r.kind);
              const tl = r.range || '';
              const tlEl = tl.startsWith('⏳') ? <span style={{color:'var(--accent-amber)', fontSize:11}}>{tl}</span>
                         : tl.startsWith('Starts') ? <span style={{color:'var(--accent-blue)', fontSize:11}}>{tl}</span>
                         : tl.startsWith('Ended') ? <span style={{color:'var(--text-muted)', fontSize:11, opacity:0.6}}>{tl}</span>
                         : tl.includes(' · ') ? (
                             <span style={{fontSize:11}}>
                               <span style={{color:'var(--text-secondary)'}}>{tl.split(' · ')[0]}</span>
                               {' '}<span style={{color:'var(--accent-amber)'}}>⏳ {tl.split(' · ')[1]}</span>
                             </span>
                           )
                         : <span style={{color:'var(--text-secondary)', fontSize:11}}>{tl}</span>;
              const validTiers = ['Blue','Silver','Gold','Platinum','Plat'];
              const tierChips = r.tiers[0] === 'All Tiers'
                ? [<Pill key="all" kind="solid-dark" style={{fontSize:11, padding:'2px 8px', whiteSpace:'nowrap', flexShrink:0}}>All Tiers</Pill>]
                : r.tiers.filter(t => validTiers.includes(t)).map(t => (
                    <Pill key={t} kind={tierColor(t)} style={{fontSize:11, padding:'2px 8px', whiteSpace:'nowrap', flexShrink:0}}>
                      {t === 'Plat' ? 'Plat' : t}
                    </Pill>
                  ));
              const regionShown = r.region.slice(0, 3);
              const regionExtra = r.region.length - 3;
              return (
                <div key={r.id} className="tbl-row" style={{gridTemplateColumns:'100px 1fr 90px 110px 100px 110px 140px 90px 80px 70px', columnGap:'24px', minWidth:1300, padding:'10px 24px'}} onClick={()=>openDrawer(r.id)}>
                  {/* Sponsor — 100px */}
                  <div style={{display:'flex', gap:8, alignItems:'center', overflow:'hidden'}}>
                    <Logo code={r.code} brand={r.sponsor} style={{flexShrink:0}}/>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:12, color:'var(--text-primary)', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{r.sponsor}</div>
                      <div className="mute" style={{fontSize:10}}>{r.cat}</div>
                    </div>
                  </div>
                  {/* Offer — 1fr, no truncation */}
                  <div style={{display:'flex', gap:4, alignItems:'center', minWidth:0}}>
                    <span style={{fontSize:12, fontWeight:500, color:'var(--text-primary)'}}>{r.offer}</span>
                    {r.trophy && <span style={{color:'var(--accent-gold)', flexShrink:0}}><Icon name="Trophy" size={12}/></span>}
                  </div>
                  {/* Mechanic — 90px, outlined dashed pill */}
                  <div style={{overflow:'hidden'}}>
                    <Pill style={{fontSize:11, background:'transparent', border:'1.5px dashed var(--text-muted)', color:'var(--text-secondary)'}}>{r.mech}</Pill>
                  </div>
                  {/* Tier — 110px, solid filled, no wrapping */}
                  <div style={{display:'flex', gap:3, flexWrap:'nowrap', alignItems:'center', overflow:'hidden'}}>{tierChips}</div>
                  {/* Region — 100px, max 3 then +N */}
                  <div style={{fontSize:11, color:'var(--text-secondary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                    {regionShown.join(' · ')}{regionExtra > 0 && <span style={{opacity:0.6}}> · +{regionExtra}</span>}
                  </div>
                  {/* Timeline — 110px, never cropped */}
                  <div style={{overflow:'visible', whiteSpace:'nowrap'}}>{tlEl}</div>
                  {/* Signal — 140px, never cropped */}
                  <div style={{overflow:'visible', whiteSpace:'nowrap'}}><SignalBadge signal={r.sig}/></div>
                  {/* Status — 90px */}
                  <div style={{overflow:'hidden'}}><Status kind={r.kind} label={si.label}/></div>
                  {/* Health — 80px, half-pie + score + delta */}
                  <div style={{display:'flex', justifyContent:'center', alignItems:'flex-start', overflow:'visible'}}>
                    <MiniHealth value={r.health} delta={r.delta}/>
                  </div>
                  {/* Actions — 70px, rightmost. Hover-only via shared TableRowActions. */}
                  <TableRowActions>
                    {stateActions(r.kind).map((a,i)=>(
                      <button key={i} className="btn icon-only sm ghost" title={a.i} onClick={(e)=>e.stopPropagation()}>
                        <Icon name={a.ic} size={13}/>
                      </button>
                    ))}
                  </TableRowActions>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyOffers tab={tab} onCreate={()=>goTo('templates')} onClear={()=>{setTab('all'); setAppliedFilters(emptyFilters());}}/>
        ))}

      </div>

      {/* Pagination — shared TablePagination (fixed bottom, conditional controls) */}
      {rows.length > 0 && (
        <TablePagination total={rows.length} noun={rows.length === 1 ? 'offer' : 'offers'} pageSize={25}/>
      )}

      {/* Filter slide-in panel */}
      <FilterPanel
        open={filterOpen}
        onClose={closeWithoutApplying}
        pending={pendingFilters}
        toggleIn={pendingToggle}
        clearAll={pendingClear}
        pendingCount={pendingFilterCount}
        matchCount={pendingMatchCount}
        onApply={applyPending}
      />
    </div>
  );
}

// ─── Filter slide-in panel (apply-on-click + live count) ───
function FilterPanel({ open, onClose, pending, toggleIn, clearAll, pendingCount, matchCount, onApply }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const sponsors  = ['Marriott Bonvoy','Careem','Noon','Cult.fit','BookMyShow','Emirates','Chalhoub'];
  const types     = ['BOGO','Cashback','Points ×N','Flat Off','Voucher','Cause','Referral','Flash'];
  const tiers     = ['Blue','Silver','Gold','Platinum'];
  const regions   = ['Dubai','Abu Dhabi','Sharjah','All UAE','DXB','AUH'];
  const statuses  = ['Live','Scheduled','Draft','Paused','Ended'];

  const Check = ({k, val}) => (
    <div className={"filter-check " + (pending[k].has(val) ? 'on' : '')} onClick={()=>toggleIn(k, val)}>
      <span className="box"><Icon name="Check" size={11} stroke={2.5}/></span>
      {val}
    </div>
  );
  const Chip = ({k, val}) => (
    <button className={"filter-pill " + (pending[k].has(val) ? 'active' : '')} onClick={()=>toggleIn(k, val)}>{val}</button>
  );

  return (
    <>
      <div className={"filter-scrim " + (open?'open':'')} onClick={onClose}/>
      <div className={"filter-panel " + (open?'open':'')}>
        <div className="filter-panel-head">
          <div className="row gap-8">
            <Icon name="Filter" size={14}/>
            <span className="sora" style={{fontSize:15, fontWeight:600}}>Filter Offers</span>
            {pendingCount > 0 && <Pill kind="solid-gold">{pendingCount}</Pill>}
          </div>
          <button className="icon-btn" onClick={onClose} style={{width:28,height:28}}><Icon name="X" size={14}/></button>
        </div>

        <div className="filter-panel-body">
          <div className="filter-section">
            <h6>Sponsor</h6>
            <div className="col">{sponsors.map(s => <Check key={s} k="sponsor" val={s}/>)}</div>
          </div>
          <div className="filter-section">
            <h6>Offer Type</h6>
            <div className="col">{types.map(t => <Check key={t} k="type" val={t}/>)}</div>
          </div>
          <div className="filter-section">
            <h6>Tier</h6>
            <div className="row gap-6 wrap">{tiers.map(t => <Chip key={t} k="tier" val={t}/>)}</div>
          </div>
          <div className="filter-section">
            <h6>Region</h6>
            <div className="col">{regions.map(r => <Check key={r} k="region" val={r}/>)}</div>
          </div>
          <div className="filter-section">
            <h6>Status</h6>
            <div className="row gap-6 wrap">{statuses.map(s => <Chip key={s} k="status" val={s}/>)}</div>
          </div>
        </div>

        <div className="filter-panel-foot">
          <Btn kind="ghost" onClick={clearAll}>Clear All</Btn>
          <Btn kind="primary" onClick={onApply}>
            Apply Filters <span style={{opacity:.7, marginLeft:4}}>({matchCount})</span>
          </Btn>
        </div>
      </div>
    </>
  );
}

// Empty state
function EmptyOffers({ tab, onCreate, onClear }) {
  const isFiltered = tab !== 'all' && tab !== 'drafts';
  const drafts = tab === 'drafts';
  return (
    <div className="col" style={{flex:1, alignItems:'center', justifyContent:'center', textAlign:'center', gap:14}}>
      <EmptyArt kind={drafts ? 'drafts' : (isFiltered ? 'funnel' : 'stage')} />
      <div className="sora" style={{fontSize:18, fontWeight:600, marginTop:8}}>
        {drafts ? 'No drafts in progress' : isFiltered ? 'No offers match these filters' : 'Your offer stage is empty'}
      </div>
      <div className="mute" style={{fontSize:13, maxWidth:340}}>
        {drafts ? 'Start a new offer and your in-progress work will live here.' :
         isFiltered ? 'Try adjusting your filters or clearing them.' :
         'Create your first offer to start reaching your members.'}
      </div>
      <div className="row gap-8" style={{marginTop:8}}>
        {isFiltered ? (
          <Btn onClick={onClear}>Clear Filters</Btn>
        ) : (
          <Btn kind="primary" icon={<Icon name="Plus" size={13}/>} onClick={onCreate}>{drafts ? 'Start an Offer' : 'Create Your First Offer'}</Btn>
        )}
      </div>
    </div>
  );
}

// ─── Empty state SVG art (line geometric) ───
function EmptyArt({ kind }) {
  const stroke = "var(--text-muted)";
  if (kind === 'stage') return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
      <rect x="20" y="22" width="22" height="36" rx="3" stroke={stroke} strokeWidth="1.5"/>
      <rect x="50" y="14" width="22" height="44" rx="3" stroke={stroke} strokeWidth="1.5"/>
      <rect x="80" y="30" width="22" height="28" rx="3" stroke={stroke} strokeWidth="1.5"/>
      <line x1="10" y1="62" x2="112" y2="62" stroke="var(--accent-gold)" strokeWidth="1" strokeDasharray="3 4"/>
      <circle cx="61" cy="20" r="2" fill="var(--accent-gold)"/>
    </svg>
  );
  if (kind === 'funnel') return (
    <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
      <path d="M15 14h70l-25 30v22l-20-8v-14z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="50" cy="68" r="2" fill="var(--accent-gold)"/>
    </svg>
  );
  if (kind === 'drafts') return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
      <rect x="30" y="14" width="60" height="58" rx="4" stroke={stroke} strokeWidth="1.5"/>
      <line x1="40" y1="28" x2="80" y2="28" stroke={stroke} strokeWidth="1.5"/>
      <line x1="40" y1="40" x2="80" y2="40" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 3"/>
      <line x1="40" y1="52" x2="65" y2="52" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 3"/>
      <circle cx="86" cy="60" r="6" stroke="var(--accent-gold)" strokeWidth="1.5"/>
      <line x1="83" y1="60" x2="89" y2="60" stroke="var(--accent-gold)"/>
      <line x1="86" y1="57" x2="86" y2="63" stroke="var(--accent-gold)"/>
    </svg>
  );
  return null;
}

window.OfferList = OfferList;
window.EmptyArt = EmptyArt;
