// ============ SCREEN 5 · SEGMENTS ============
function Segments({ goTo, openDrawer }) {
  const [expanded, setExpanded] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [mapModal, setMapModal] = useState(null);

  const segs = [
    { id:1, name:'High-Value UAE Travelers', members:112000, used:8, updated:'2 days ago', overlap:'Lapsed Gold Members', overlapPct:12,
      english:'Gold and Platinum tier Skywards members in Dubai and Abu Dhabi who have spent at least AED 2,000 in the last 60 days and taken at least 2 flights in the last 6 months.',
      offers:[{c:'MA', n:'Flat 50% Off Weekend Stays', h:87},{c:'CF', n:'1 Month Free Cult.fit Access', h:81},{c:'EM', n:'Complimentary Business Upgrade', h:63},{c:'NO', n:'3× Miles on All Bookings', h:41}], more:4 },
    { id:2, name:'Lapsed Gold Members', members:45200, used:2, updated:'Today', overlap:'High-Value UAE Travelers', overlapPct:12,
      english:'Gold tier Skywards members across the UAE who have not redeemed any offer in the last 60 days.',
      offers:[{c:'NO', n:'3× Miles on All Bookings', h:41},{c:'CF', n:'1 Month Free Cult.fit Access', h:81}], more:0 },
    { id:3, name:'Ramadan Active Members', members:89400, used:3, updated:'5 days ago',
      english:'Members across all tiers who redeemed at least one offer between Ramadan and Eid windows in the last 2 years.',
      offers:[{c:'NO', n:'3× Miles on All Bookings', h:41},{c:'BM', n:'Buy 2 Tickets Get 1 Free', h:89}], more:1 },
    { id:4, name:'Platinum Frequent Flyers', members:12800, used:5, updated:'1 week ago',
      english:'Platinum tier members with 12+ flights in the past 12 months across Emirates routes.',
      offers:[{c:'EM', n:'Complimentary Business Upgrade', h:63},{c:'MA', n:'Flat 50% Off Weekend Stays', h:87}], more:3 },
    { id:5, name:'First-Time Members', members:34100, used:1, updated:'3 days ago',
      english:'Skywards members who joined the program within the last 60 days and have not yet redeemed an offer.',
      offers:[{c:'CA', n:'10% Cashback on Every Ride', h:74}], more:0 },
    { id:6, name:'Staff & Corporate', members:8400, used:2, updated:'2 weeks ago',
      english:'Emirates group staff members and corporate account holders eligible for internal preferential rates.',
      offers:[{c:'EM', n:'Complimentary Business Upgrade', h:63}], more:1 },
  ];

  // Close any open menu on outside click
  useEffect(() => {
    if (menuOpen == null) return;
    const onDown = () => setMenuOpen(null);
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [menuOpen]);

  return (
    <PageLayout>
      <div className="col gap-20 has-tbl-pagination">
        <PageHeader
          title="Segments"
          subtitle="Reusable audience definitions for your loyalty program"
          actions={<Btn kind="primary" lg icon={<Icon name="Plus" size={14}/>}>Create Segment</Btn>}
        />

      <div className="tbl">
        <div className="tbl-head" style={{gridTemplateColumns:'minmax(240px, 1.5fr) 110px 100px 130px 90px'}}>
          <span>Name</span>
          <span>Members</span>
          <span>Used In</span>
          <span>Last Updated</span>
          <span></span>
        </div>
        {segs.map(s => (
          <React.Fragment key={s.id}>
            <div className="tbl-row" style={{gridTemplateColumns:'minmax(240px, 1.5fr) 110px 100px 130px 90px', padding:'12px 20px'}}
                 onClick={()=>setExpanded(expanded===s.id ? null : s.id)}>
              <div className="row gap-10">
                <div className="logo-bubble sm" style={{background:'rgba(212,168,83,0.12)', color:'var(--accent-gold)', borderColor:'rgba(212,168,83,0.3)'}}>
                  <Icon name="Users" size={12}/>
                </div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:500}}>{s.name}</div>
                  {s.overlap && (
                    <div style={{marginTop:5, maxWidth:'100%', minWidth:0}}>
                      <span className="overlap-chip"
                            style={{display:'inline-flex', alignItems:'center', gap:4}}
                            title={`${s.overlapPct}% of these members also belong to "${s.overlap}". Members may receive duplicate communications.`}>
                        <Icon name="AlertTriangle" size={12}/> {s.overlapPct}% overlap with {s.overlap}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="sora" style={{fontSize:15, fontWeight:600}}>{s.members.toLocaleString()}</div>
              <div style={{fontSize:13}}>{s.used} offer{s.used!==1?'s':''}</div>
              <div className="mute" style={{fontSize:13}}>{s.updated}</div>
              <TableRowActions>
                <button className="btn icon-only sm ghost" onClick={(e)=>{
                  e.stopPropagation();
                  setMenuOpen(menuOpen === s.id ? null : s.id);
                }}>
                  <Icon name="MoreHorizontal" size={13}/>
                </button>
                {menuOpen === s.id && (
                  <div className="menu-pop" onClick={(e)=>e.stopPropagation()} onMouseDown={(e)=>e.stopPropagation()}>
                    <div className="menu-item"><span className="menu-item-icon"><Icon name="Edit" size={13}/></span>Edit Segment</div>
                    <div className="menu-item"><span className="menu-item-icon"><Icon name="Copy" size={13}/></span>Duplicate</div>
                    <div className="menu-item danger"><span className="menu-item-icon"><Icon name="Bookmark" size={13}/></span>Archive</div>
                  </div>
                )}
                <button className="btn icon-only sm ghost" onClick={(e)=>{e.stopPropagation(); setExpanded(expanded===s.id ? null : s.id);}}>
                  <Icon name={expanded===s.id?'ChevronUp':'ChevronDown'} size={13}/>
                </button>
              </TableRowActions>
            </div>

            {expanded === s.id && (
              <div className="expand-detail">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16}}>
                  <div style={{flex:1}}>
                    <div className="lbl-cap" style={{marginBottom:8}}>Plain English</div>
                    <div style={{fontSize:13, fontStyle:'italic', color:'var(--text-primary)', lineHeight:1.6, marginBottom:18}}>
                      "{s.english}"
                    </div>

                    <div className="lbl-cap" style={{marginBottom:10}}>Offers using this segment ({s.used})</div>
                    <OfferChipRow offers={s.offers} more={s.more} onClick={()=>goTo('offers')}/>

                    {s.used > 0 && (
                      <div className="ai-insight" style={{marginTop:14, fontSize:12}}>
                        <Icon name="AlertTriangle" size={13} color="var(--accent-amber)"/>
                        <span>Editing this segment will affect <b>{s.used} live offer{s.used!==1?'s':''}</b>. Changes apply immediately to all connected offers.</span>
                      </div>
                    )}
                  </div>
                  <div style={{flexShrink:0}}>
                    <Btn icon={<Icon name="Map" size={12}/>} onClick={(e)=>{e.stopPropagation(); setMapModal(s);}}>
                      View Relationship Map
                    </Btn>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Pagination — shared TablePagination */}
      <TablePagination total={segs.length} noun="segments"/>

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
            <RelationshipMap segment={mapModal} onClose={()=>setMapModal(null)} onOfferClick={()=>{setMapModal(null); goTo('offers');}}/>
          </div>
        </div>,
        document.body
      )}
      </div>
    </PageLayout>
  );
}

// ─── Segment to Offer relationship map ───
function RelationshipMap({ segment, onClose, onOfferClick }) {
  const nodes = segment.offers.map((o, i) => ({
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
        <span className="lbl-cap">Relationship Map · {segment.name}</span>
        <button className="back-btn" onClick={onClose}><Icon name="ArrowLeft" size={12}/> Back to summary</button>
      </div>
      <RelationshipGraph
        nodes={nodes}
        edges={[]}
        center={{
          kind: 'segment',
          label: 'members',
          count: segment.members > 99999 ? Math.round(segment.members/1000) + 'K' : segment.members.toLocaleString(),
        }}
        height={460}
        onNodeClick={(n) => onOfferClick && onOfferClick(n)}
        emptyMsg="Not enough offers to show connections"
      />
    </div>
  );
}

window.Segments = Segments;
