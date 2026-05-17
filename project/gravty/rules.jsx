// ============ SCREEN 6 · RULES ============
function Rules() {
  const [expanded, setExpanded] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [mapModal, setMapModal] = useState(null);

  const rules = [
    { id:1, name:'Standard Redemption',  offers:12, cats:['Timing','Limits'],     updated:'3 days ago' },
    { id:2, name:'Premium Member Rules', offers:6,  cats:['Spend','Approval'],    updated:'Today',
      detail: {
        redemption: 'Max/member 1 · Quota 25,000 · Stackable No',
        timing:     'Claim window 7 days · Redemption window 30 days',
        spend:      'Minimum AED 500 · Min transaction AED 200',
        approval:   'Finance sign-off required · SLA 2 business days',
        escalation: '80% quota → Notify Marketing Lead · 100% quota → Auto-pause offer'
      },
      offerList:[
        {c:'MA', n:'Flat 50% Off Weekend Stays', h:87},
        {c:'CF', n:'1 Month Free Cult.fit Access', h:81},
        {c:'NO', n:'3× Miles on All Bookings', h:41},
        {c:'BM', n:'Buy 2 Tickets Get 1 Free', h:89},
      ], more:2
    },
    { id:3, name:'Flash Sale Rules',     offers:4,  cats:['Timing','Limits'],     updated:'1 week ago' },
    { id:4, name:'Referral Programme',   offers:3,  cats:['Referral','Rewards'],  updated:'5 days ago' },
    { id:5, name:'Ramadan Offer',     offers:5,  cats:['Timing','Blackout'],   updated:'2 weeks ago' },
    { id:6, name:'Staff Offer Rules',    offers:2,  cats:['Eligibility'],         updated:'1 month ago' },
  ];

  useEffect(() => {
    if (menuOpen == null) return;
    const onDown = () => setMenuOpen(null);
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [menuOpen]);

  return (
    <div className="content col gap-20 has-tbl-pagination">
      <div className="row between" style={{alignItems:'flex-end'}}>
        <div>
          <h1 className="h-page" style={{fontSize:24}}>Rules</h1>
          <div className="mute" style={{fontSize:13, marginTop:6}}>Saved business logic for how your offers behave</div>
        </div>
        <Btn kind="primary" lg icon={<Icon name="Plus" size={14}/>}>Create Rule Set</Btn>
      </div>

      <div className="tbl">
        <div className="tbl-head" style={{gridTemplateColumns:'200px 80px 160px 130px 90px'}}>
          <span>Name</span>
          <span>Offers</span>
          <span>Categories</span>
          <span>Last Updated</span>
          <span></span>
        </div>
        {rules.map(r => (
          <React.Fragment key={r.id}>
            <div className="tbl-row" style={{gridTemplateColumns:'200px 80px 160px 130px 90px', padding:'12px 20px'}}
                 onClick={()=>setExpanded(expanded===r.id ? null : r.id)}>
              <div className="row gap-10">
                <div className="logo-bubble sm" style={{background:'rgba(212,168,83,0.12)', color:'var(--accent-gold)', borderColor:'rgba(212,168,83,0.3)'}}>
                  <Icon name="Sliders" size={12}/>
                </div>
                <div style={{fontSize:13, fontWeight:500}}>{r.name}</div>
              </div>
              <div className="sora" style={{fontSize:15, fontWeight:600}}>{r.offers}</div>
              <div className="row gap-4 wrap">
                {r.cats.map(c => <Pill key={c}>{c}</Pill>)}
              </div>
              <div className="mute" style={{fontSize:13}}>{r.updated}</div>
              <TableRowActions>
                <button className="btn icon-only sm ghost" onClick={(e)=>{
                  e.stopPropagation();
                  setMenuOpen(menuOpen === r.id ? null : r.id);
                }}>
                  <Icon name="MoreHorizontal" size={13}/>
                </button>
                {menuOpen === r.id && (
                  <div className="menu-pop" onClick={(e)=>e.stopPropagation()} onMouseDown={(e)=>e.stopPropagation()}>
                    <div className="menu-item"><span className="menu-item-icon"><Icon name="Edit" size={13}/></span>Edit Rule Set</div>
                    <div className="menu-item"><span className="menu-item-icon"><Icon name="Copy" size={13}/></span>Duplicate</div>
                  </div>
                )}
                <button className="btn icon-only sm ghost" onClick={(e)=>{e.stopPropagation(); setExpanded(expanded===r.id ? null : r.id);}}>
                  <Icon name={expanded===r.id?'ChevronUp':'ChevronDown'} size={13}/>
                </button>
              </TableRowActions>
            </div>

            {expanded === r.id && (
              <div className="expand-detail">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16}}>
                  <div style={{flex:1}}>
                    {r.detail ? (
                      <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginBottom:18}}>
                        {Object.entries({
                          'Redemption Limits': r.detail.redemption,
                          'Timing':            r.detail.timing,
                          'Spend Gates':       r.detail.spend,
                          'Approval':          r.detail.approval,
                          'Escalation':        r.detail.escalation,
                        }).map(([k,v]) => (
                          <div key={k} className="card" style={{padding:'12px 14px'}}>
                            <div className="lbl-cap" style={{marginBottom:6}}>{k}</div>
                            <div style={{fontSize:13, color:'var(--text-primary)', lineHeight:1.5}}>{v}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mute" style={{fontSize:13, marginBottom:18}}>
                        Detail view not configured for this rule set. Click <span className="lnk">Edit Rule Set</span> to define logic.
                      </div>
                    )}

                    {r.offerList && (
                      <>
                        <div className="lbl-cap" style={{marginBottom:10}}>Offers using this rule set ({r.offers})</div>
                        <OfferChipRow offers={r.offerList} more={r.more}/>
                      </>
                    )}

                    {r.offers > 0 && (
                      <div className="ai-insight" style={{marginTop:14, fontSize:12}}>
                        <Icon name="AlertTriangle" size={13} color="var(--accent-amber)"/>
                        <span>This change affects <b>{r.offers} live offer{r.offers!==1?'s':''}</b> currently reaching ~89,000 members across UAE.</span>
                      </div>
                    )}
                  </div>
                  <div style={{flexShrink:0}}>
                    {r.offerList && (
                      <Btn icon={<Icon name="Map" size={12}/>} onClick={(e)=>{e.stopPropagation(); setMapModal(r);}}>
                        View Relationship Map
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Pagination — shared TablePagination */}
      <TablePagination total={rules.length} noun="rule sets"/>

      {/* Relationship map modal */}
      {mapModal && ReactDOM.createPortal(
        <div style={{position:'fixed', left:56, top:84, width:'calc(100vw - 56px)', height:'calc(100vh - 84px)', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)', zIndex:800, display:'flex', alignItems:'center', justifyContent:'center'}}
             onClick={()=>setMapModal(null)}>
          <div style={{background:'var(--bg-elevated)', borderRadius:12, padding:28, width:'min(820px,90%)', maxHeight:'80vh', overflowY:'auto', position:'relative'}}
               onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
              <span className="lbl-cap">Relationship Map · {mapModal.name}</span>
              <button className="icon-btn" onClick={()=>setMapModal(null)}><Icon name="X" size={14}/></button>
            </div>
            <RuleMap rule={mapModal} onClose={()=>setMapModal(null)}/>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Rule spoke-hub map ───
function RuleMap({ rule, onClose }) {
  const offers = rule.offerList || [];
  const nodes = offers.map((o, i) => ({
    id: i + 1,
    code: o.c,
    brand: CODE_TO_BRAND[o.c],
    label: o.n,
    signal: CODE_TO_SIGNAL[o.c] || 'stable',
    health: o.h
  }));

  return (
    <div>
      <div className="row between" style={{marginBottom:12}}>
        <span className="lbl-cap">Relationship Map · {rule.name}</span>
        <button className="back-btn" onClick={onClose}><Icon name="ArrowLeft" size={12}/> Back to summary</button>
      </div>
      <RelationshipGraph
        nodes={nodes}
        edges={[]}
        center={{
          kind: 'rule',
          label: `${rule.offers} offer${rule.offers!==1?'s':''}`,
          count: rule.name,
        }}
        height={460}
        emptyMsg="Not enough offers using this rule set to show a map"
      />
    </div>
  );
}

window.Rules = Rules;
