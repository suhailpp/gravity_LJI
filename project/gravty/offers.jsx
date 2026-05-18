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
    // Status passed in from dashboard pipeline (Draft, Review, Scheduled, Live, Ended).
    // Pre-applies a status chip so the table is filtered on first render.
    if (initial?.status) f.status.add(initial.status);
    return f;
  });
  const [pendingFilters, setPendingFilters] = useState(appliedFilters);

  // Open panel to sync pending from applied
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

  // Single source of truth — derive from OFFERS_DATA. Map to the row shape this
  // screen expects: `offer` for the name and `kind` for status.
  const all = OFFERS_DATA.map(o => ({
    id: o.id, code: o.code, sponsor: o.sponsor, cat: o.cat,
    offer: o.name, cid: o.cid, mech: o.mech,
    tiers: o.tiers, region: o.region,
    range: o.range, sig: o.signal,
    kind: o.status,
    health: o.health, delta: o.delta, trophy: o.trophy,
  }));

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
    if (filters.status.size)  rows = rows.filter(r => filters.status.has({draft:'Draft',review:'Review',scheduled:'Scheduled',live:'Live',paused:'Paused',ended:'Ended'}[r.kind]));
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
    draft:     { label:'Draft' },
    review:    { label:'Review' },
    scheduled: { label:'Scheduled' },
    live:      { label:'Live' },
    paused:    { label:'Paused' },
    ended:     { label:'Ended' },
  }[k] || { label:'—' });
  const stateActions = (kind) => {
    if (kind === 'live')      return [{i:'Edit',ic:'Edit'},{i:'Pause',ic:'Pause'},{i:'More',ic:'MoreHorizontal'}];
    if (kind === 'scheduled') return [{i:'Edit',ic:'Edit'},{i:'Cancel',ic:'X'},{i:'More',ic:'MoreHorizontal'}];
    if (kind === 'ended')     return [{i:'Duplicate',ic:'Copy'},{i:'Archive',ic:'Bookmark'}];
    return [{i:'Edit',ic:'Edit'},{i:'More',ic:'MoreHorizontal'}];
  };

  // Sticky offsets — app bar is 84px (shell padding-top). Page header ≈76, tab row ≈40, filter chips row ≈48 when shown.
  const STICKY_TOP = 84;
  const HEADER_H = 76;
  const TABS_H = 40;
  const CHIPS_H = activeFilterCount > 0 ? 48 : 0;

  // Solid fill that exactly matches the page background — used by every
  // sticky band on this screen so table rows scrolling underneath are fully
  // occluded. Spec: #07080a.
  const STICKY_BG = '#07080a';

  return (
    <PageLayout>
      {/* Sticky header — wraps title row and tabs row in a single solid band so table rows can't bleed through.
          Negative marginTop + matching paddingTop cancels PageLayout's 32px top padding so the band sits flush against the topbar. */}
      <div style={{position:'sticky', top:STICKY_TOP, zIndex:20, backgroundColor:STICKY_BG, marginLeft:-40, marginRight:-40, marginTop:-32, paddingLeft:40, paddingRight:40, paddingTop:32}}>
        <div style={{backgroundColor:STICKY_BG}}>
          <PageHeader
            title="Offers"
            subtitle={`${offerCounts.active} ${offerCounts.active === 1 ? 'offer' : 'offers'} active · ${all.filter(r => r.sig === 'expiring').length} expiring this week · ${offerCounts.draft} ${offerCounts.draft === 1 ? 'draft' : 'drafts'} incomplete`}
            actions={
              <>
                <div className="row gap-4" style={{padding:'3px',background:'var(--bg-elevated)',borderRadius:8,border:'1px solid var(--border-default)'}}>
                  <button className={"btn sm ghost"} style={{background:view==='table'?'var(--accent-gold)':'transparent',color:view==='table'?'#0A0C10':'var(--text-secondary)'}} onClick={()=>setView('table')}><Icon name="Table" size={13}/> Table</button>
                  <button className={"btn sm ghost"} style={{background:view==='map'?'var(--accent-gold)':'transparent',color:view==='map'?'#0A0C10':'var(--text-secondary)'}} onClick={()=>setView('map')}><Icon name="Map" size={13}/> Map</button>
                </div>
                <button className="filter-icon-btn" onClick={()=>setFilterOpen(true)} title="Filter">
                  <Icon name="Filter" size={16}/>
                  {activeFilterCount > 0 && <span className="count-badge">{activeFilterCount}</span>}
                </button>
                <Btn kind="primary" lg icon={<Icon name="Plus" size={14}/>} onClick={()=>goTo('templates')}>Create Offer</Btn>
              </>
            }
          />
        </div>

        {/* Tab row — same backgroundColor as parent, no border-bottom, so the two rows read as one seamless band */}
        <div className="tab-bar" style={{backgroundColor:STICKY_BG, borderBottom:'none', backdropFilter:'none', boxShadow:'none'}}>
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

      {/* Active filter tags — only renders when at least one filter is applied */}
      {activeFilterCount > 0 && (
        <div style={{position:'sticky', top: STICKY_TOP + HEADER_H + TABS_H, zIndex:48,
                     background: STICKY_BG, marginLeft:-40, marginRight:-40, paddingLeft:40, paddingRight:40,
                     borderBottom: '1px solid var(--border-subtle)'}}>
          <div style={{display:'flex', flexWrap:'wrap', alignItems:'center', gap:8, padding:'10px 0'}}>
            {['sponsor','type','tier','region','status'].flatMap(key =>
              [...appliedFilters[key]].map(val => (
                <span key={`${key}:${val}`} className="filter-tag"
                      onClick={()=>{
                        setAppliedFilters(prev => {
                          const next = cloneFilters(prev);
                          next[key].delete(val);
                          return next;
                        });
                      }}>
                  {val} <Icon name="X" size={11}/>
                </span>
              ))
            )}
            <span className="filter-clear-all"
                  onClick={()=>setAppliedFilters(emptyFilters())}>
              Clear All
            </span>
          </div>
        </div>
      )}

      {/* Scrolling content */}
      <div style={{paddingTop:16, paddingBottom:48}}>
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
          <div className="tbl" style={{width:'100%', overflow:'visible'}}>
            {/* SPONSOR 90 | OFFER 1fr (truncates) | MECHANIC 90 | TIER 110 | REGION 100 | TIMELINE 110 | SIGNAL 130 | STATUS 90 | HEALTH 120 | ACTIONS 90 */}
            <div className="tbl-head" style={{gridTemplateColumns:'90px 1fr 90px 110px 100px 110px 130px 90px 120px 90px', columnGap:'24px', padding:'8px 24px', position:'sticky', top: STICKY_TOP + HEADER_H + TABS_H, zIndex:10}}>
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
              const tl = r.range || {kind:'plain', label:''};
              const tlEl = tl.kind === 'expiring' ? (
                             <span style={{display:'inline-flex', alignItems:'center', gap:4, color:'var(--accent-amber)', fontSize:11}}>
                               <Icon name="Clock" size={11}/>{tl.label}
                             </span>
                           )
                         : tl.kind === 'starts' ? <span style={{color:'var(--accent-blue)', fontSize:11}}>{tl.label}</span>
                         : tl.kind === 'ended'  ? <span style={{color:'var(--text-muted)', fontSize:11, opacity:0.6}}>{tl.label}</span>
                         : tl.kind === 'range-expiring' ? (
                             <span style={{display:'inline-flex', alignItems:'center', gap:4, fontSize:11, flexWrap:'wrap'}}>
                               <span style={{display:'inline-flex', alignItems:'center', gap:4, color:'var(--text-secondary)'}}>{tl.from} <Icon name="ArrowRight" size={10}/> {tl.to}</span>
                               <span style={{color:'var(--text-secondary)'}}>·</span>
                               <span style={{display:'inline-flex', alignItems:'center', gap:3, color:'var(--accent-amber)'}}><Icon name="Clock" size={11}/>{tl.expires}</span>
                             </span>
                           )
                         : tl.kind === 'range' ? (
                             <span style={{display:'inline-flex', alignItems:'center', gap:4, color:'var(--text-secondary)', fontSize:11}}>
                               {tl.from} <Icon name="ArrowRight" size={10}/> {tl.to}
                             </span>
                           )
                         : <span style={{color:'var(--text-secondary)', fontSize:11}}>{tl.label || ''}</span>;
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
                <div key={r.id} className="tbl-row" style={{gridTemplateColumns:'90px 1fr 90px 110px 100px 110px 130px 90px 120px 90px', columnGap:'24px', padding:'10px 24px'}} onClick={()=>openDrawer(r.id)}>
                  {/* Sponsor — 100px */}
                  <div style={{display:'flex', gap:8, alignItems:'center', overflow:'hidden'}}>
                    <Logo code={r.code} brand={r.sponsor} style={{flexShrink:0}}/>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:12, color:'var(--text-primary)', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{r.sponsor}</div>
                      <div className="mute" style={{fontSize:10}}>{r.cat}</div>
                    </div>
                  </div>
                  {/* Offer — 1fr, ellipsis truncation when too long */}
                  <div style={{display:'flex', gap:4, alignItems:'center', minWidth:0, overflow:'hidden'}}>
                    <span style={{fontSize:12, fontWeight:500, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', minWidth:0}} title={r.offer}>{r.offer}</span>
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
                  {/* Health — donut + inline delta on the right, vertically centred in the row */}
                  <div style={{display:'flex', justifyContent:'center', alignItems:'center', overflow:'visible'}}>
                    <HealthDonut score={r.health} delta={r.delta} size="sm"/>
                  </div>
                  {/* Actions — 90px, rightmost. Hover-only via shared TableRowActions. */}
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
    </PageLayout>
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
  const statuses  = ['Draft','Review','Scheduled','Live','Paused','Ended'];

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
            <div className="col">{sponsors.map(s => <FilterCheck key={s} label={s} active={pending.sponsor.has(s)} onClick={()=>toggleIn('sponsor', s)}/>)}</div>
          </div>
          <div className="filter-section">
            <h6>Offer Type</h6>
            <div className="col">{types.map(t => <FilterCheck key={t} label={t} active={pending.type.has(t)} onClick={()=>toggleIn('type', t)}/>)}</div>
          </div>
          <div className="filter-section">
            <h6>Tier</h6>
            <div className="row gap-6 wrap">{tiers.map(t => <FilterChip key={t} label={t} active={pending.tier.has(t)} onClick={()=>toggleIn('tier', t)}/>)}</div>
          </div>
          <div className="filter-section">
            <h6>Region</h6>
            <div className="col">{regions.map(r => <FilterCheck key={r} label={r} active={pending.region.has(r)} onClick={()=>toggleIn('region', r)}/>)}</div>
          </div>
          <div className="filter-section">
            <h6>Status</h6>
            <div className="row gap-6 wrap">{statuses.map(s => <FilterChip key={s} label={s} active={pending.status.has(s)} onClick={()=>toggleIn('status', s)}/>)}</div>
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

window.OfferList = OfferList;
