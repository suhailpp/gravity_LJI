// ============ APP SHELL ============
function App() {
  const [screen, setScreen] = useState('dashboard');
  const [screenCtx, setScreenCtx] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [drawerId, setDrawerId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [aiQuery, setAiQuery] = useState(null);
  const [notifCount, setNotifCount] = useState(3);
  const [submittedOffers, setSubmittedOffers] = useState([]);
  const [notifications, setNotifications] = useState([
    { dot:'var(--accent-red)',   t:'Gold Tier Redemption Down 18%',       s:'Detected by program intelligence · 4 min ago', action:'offers' },
    { dot:'var(--accent-amber)', t:'Sponsor funding pending · Marriott',  s:'Tier Recovery Offer · 2 hr ago',               action:'drawer' },
    { dot:'var(--accent-green)', t:'Weekend BOGO 340% above forecast',    s:'Marriott Bonvoy · Dubai · 6 hr ago',           action:'drawer' },
  ]);

  // Editor to app approval bus
  useEffect(() => {
    window.__onOfferSubmitted = (payload) => {
      const newNotif = {
        dot: payload.published ? 'var(--accent-green)' : 'var(--accent-amber)',
        t: payload.published ? `"${payload.title}" published — live now` : `"${payload.title}" submitted for Finance review`,
        s: `${payload.campaignId} · just now`,
        action: 'offers'
      };
      setNotifications(n => [newNotif, ...n]);
      setNotifCount(c => c + 1);
      setSubmittedOffers(arr => [{
        id: Date.now(), code: 'NW', sponsor: 'New Offer', offer: payload.title,
        cid: payload.campaignId || '', mech: 'Custom', tiers: [], region: [],
        range: {kind:'plain', label:'—'}, sig: null, kind: 'in-review', health: null, delta: 0, trophy: false
      }, ...arr]);
      setToast(payload.published ? <><Icon name="Check" size={13}/> Offer published</> : <><Icon name="Check" size={13}/> Offer submitted for approval</>);
      setTimeout(()=>setToast(null), 2700);
    };
    return () => { delete window.__onOfferSubmitted; };
  }, []);

  // Apply theme to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // (No auto-drawer-open: drawer only opens when user clicks a row.)

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(()=> setToast(null), 2700);
  };
  window.__toast = showToast;

  const goTo = (s, ctx) => {
    setScreen(s);
    setScreenCtx(ctx || null);
    setDrawerOpen(false);
    window.scrollTo({top:0, behavior:'instant'});
  };
  const openDrawer = (id) => {
    setDrawerId(id);
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  const screenLabels = {
    dashboard:'Dashboard',
    offers:'Offer List',
    templates:'Template Selector',
    editor:'Offer Editor',
    segments:'Segments',
    rules:'Rules'
  };
  const breadcrumbs = {
    dashboard: ['GRAVTY', 'Dashboard'],
    offers:    ['GRAVTY', 'Offers'],
    templates: ['GRAVTY', 'Offers', 'Create New Offer'],
    editor:    ['GRAVTY', 'Offers', 'Create', 'Tier Recovery Offer'],
    segments:  ['GRAVTY', 'Segments'],
    rules:     ['GRAVTY', 'Rules'],
  };

  return (
    <>
      {/* Plane backdrop — dashboard only, direct child of page root */}
      {screen === 'dashboard' && (
        <div className="plane-bg" aria-hidden="true">
          <img src="Sources/Plane.jpg" alt=""/>
        </div>
      )}

      {/* Dev nav bar */}
      <div className="dev-bar">
        <div className="lbl">[ Prototype Navigator ]</div>
        <div className="pills">
          {[
            ['dashboard','Dashboard'],
            ['offers','Offer List'],
            ['templates','Template Selector'],
            ['editor','Offer Editor'],
            ['segments','Segments'],
            ['rules','Rules'],
          ].map(([k,l]) => (
            <span key={k} className={"dev-pill " + (screen===k?'active':'')} onClick={()=>goTo(k)}>{l}</span>
          ))}
        </div>
        <div className="indicator">Viewing: {screenLabels[screen]}</div>
      </div>

      {/* Top bar */}
      <div className="top-bar">
        <div className="brand-mark" onClick={()=>goTo('dashboard')} style={{cursor:'pointer'}} title="Back to Dashboard">GRAVTY<sup>®</sup></div>
        <div className="brand-sep"/>
        <div className="client-switcher">
          <div className="client-flag"/>
          <span>Emirates Skywards</span>
          <Icon name="ChevronDown" size={12} color="var(--text-secondary)"/>
        </div>
        <div className="brand-sep"/>
        <div className="crumb">
          {breadcrumbs[screen].map((c,i)=>(
            <span key={i}>
              {i>0 && <span className="sep">/</span>}
              {i === breadcrumbs[screen].length-1 ? <b>{c}</b> : c}
            </span>
          ))}
        </div>

        <div className="top-actions" style={{marginLeft:'auto'}}>
          <button className="icon-btn" onClick={()=>{setNotifOpen(!notifOpen); setAiOpen(false);}} title="Notifications">
            <Icon name="Bell" size={16}/>
            {notifCount > 0 && <span className="bell-badge">{notifCount}</span>}
          </button>
          <AvatarPM/>
        </div>
      </div>

      {/* Nav rail */}
      <div className="rail">
        {[
          {id:'dashboard', icon:'LayoutDashboard', label:'Dashboard',  go:()=>goTo('dashboard')},
          {id:'offers',    icon:'Tag',             label:'Offers',     go:()=>goTo('offers')},
          {id:'segments',  icon:'Users',           label:'Segments',   go:()=>goTo('segments')},
          {id:'rules',     icon:'FileText',        label:'Rules',      go:()=>goTo('rules')},
          {id:'_rewards',  icon:'Gift',            label:'Rewards · Coming in the next release', ghost:true},
          {id:'_anly',     icon:'BarChart2',       label:'Analytics · Coming in the next release', ghost:true},
          {id:'_settings', icon:'Settings',        label:'Settings · Coming in the next release', ghost:true},
        ].map(it => (
          <div key={it.id}
            className={"rail-btn " + (it.ghost?'ghost ':'') + (screen===it.id || (it.id==='offers' && ['offers','templates','editor'].includes(screen)) ? 'active' : '')}
            onClick={() => it.ghost ? showToast('Coming in the next release.') : it.go()}>
            <Icon name={it.icon} size={18}/>
            <div className="tip">{it.label}</div>
          </div>
        ))}
      </div>

      {/* Content shell */}
      <div className="shell">
        {screen === 'dashboard' && <Dashboard goTo={goTo} openAi={()=>setAiOpen(true)} openDrawer={openDrawer}/>}
        {screen === 'offers'    && <OfferList goTo={goTo} openDrawer={openDrawer} initial={screenCtx} pendingOffers={submittedOffers}/>}
        {screen === 'templates' && <TemplateSelector goTo={goTo}/>}
        {screen === 'editor'    && <Editor goTo={goTo} initial={screenCtx}/>}
        {screen === 'segments'  && <Segments goTo={goTo} openDrawer={openDrawer}/>}
        {screen === 'rules'     && <Rules/>}
      </div>

      {/* Drawer + scrim */}
      <div className={"drawer-scrim " + (drawerOpen?'open':'')} onClick={closeDrawer}/>
      <div className={"drawer " + (drawerOpen?'open':'')}>
        {drawerOpen && <DrawerContent id={drawerId} onClose={closeDrawer}/>}
      </div>

      {/* Floating AI widget */}
      <FloatingAIWidget onOpen={()=>{ setAiOpen(true); setNotifOpen(false); }}/>

      {/* AI panel */}
      {aiOpen && <AIPanel onClose={()=>setAiOpen(false)} query={aiQuery} setQuery={setAiQuery} onCTA={()=>{ setAiOpen(false); goTo('templates'); }}/>}

      {/* Notification dropdown */}
      {notifOpen && <NotifDropdown items={notifications} onClose={()=>{setNotifOpen(false); setNotifCount(0);}} onItem={(action)=>{
        setNotifOpen(false);
        setNotifCount(0);
        if (action==='offers') goTo('offers');
        else if (action==='drawer') openDrawer(3);
      }}/>}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

// ─── DRAWER CONTENT ────────────────────────
function DrawerContent({ id, onClose }) {
  // Default detail = Ramadan Miles Bonus (id 3) — fall through if id unknown
  const __raw = offerById(id) || offerById(3);
  const d = {
    code: __raw.code, sponsor: __raw.sponsor, brand: __raw.brand,
    name: __raw.name, desc: __raw.desc,
    status: __raw.status,
    signal: __raw.signal,
    health: __raw.health, delta: __raw.delta, target: __raw.target,
    region: Array.isArray(__raw.region) ? __raw.region.join(' · ') : __raw.region,
    tiers:  Array.isArray(__raw.tiers)  ? __raw.tiers.join(' · ')  : __raw.tiers,
  };

  return (
    <>
      <div className="drawer-head">
        <Logo code={d.code} brand={d.brand}/>
        <div style={{flex:1}}>
          <div style={{fontSize:11, color:'var(--text-secondary)'}}>{d.brand}</div>
          <div className="sora" style={{fontSize:16, fontWeight:600, lineHeight:1.2, marginTop:2}}>{d.name}</div>
          {d.desc && (
            <div style={{fontSize:13, color:'rgba(245,240,232,0.55)', lineHeight:1.45, marginTop:6}}>
              {d.desc}
            </div>
          )}
          <div className="row gap-6" style={{marginTop:10}}>
            <Status kind={d.status} label={d.status[0].toUpperCase()+d.status.slice(1)}/>
            <SignalBadge signal={d.signal}/>
          </div>
        </div>
        <button className="drawer-close" onClick={onClose}><Icon name="X" size={14}/></button>
      </div>

      <div className="drawer-body">
        {d.health != null ? (
          <>
            <div className="drawer-section">
              <h5>Offer Health</h5>
              <div className="row between" style={{alignItems:'center'}}>
                <HealthDonut score={d.health} delta={d.delta} size="lg"/>
                <div style={{flex:1, paddingLeft:18}}>
                  <div className="lbl-cap" style={{marginBottom:4}}>vs. target</div>
                  <div style={{fontSize:14, color:'var(--text-primary)', fontWeight:500}}>Target {d.target}</div>
                  <div className="mute" style={{fontSize:11, marginTop:4}}>{d.health < d.target ? `Tracking ${d.target - d.health} pts below` : `Tracking ${d.health - d.target} pts above`}</div>
                </div>
              </div>
              <div className="divider" style={{margin:'14px 0'}}/>
              <ScoreBars/>
            </div>

            <div className="drawer-section">
              <h5>Momentum Timeline</h5>
              <MomentumCurve signal={d.signal}/>
              <StatusTimeline style={{marginTop:14}} nodes={[
                { kind:'past',   date:'MAY 1',           title:'Created' },
                { kind:'past',   date:'MAY 3',           title:'Approved by Finance' },
                { kind:'past',   date:'MAY 5',           title:'Live' },
                { kind:'peak',   date:'MAY 12',          title:'Peak · Ramadan start',
                                 sub:'+280% velocity', subStyle:{color:'var(--accent-gold)'} },
                { kind:'now',    date:'MAY 18 · TODAY',
                                 title: d.health < 50 ? 'Declining sharply' : d.signal === 'trending' ? 'Tracking ahead' : 'Steady performance' },
                { kind:'future', date:'MAY 25',          title:'Projected plateau' },
                { kind:'future', date:'JUN 15',          title:'End Date',
                                 sub:'Est. 2,100 redemptions' },
              ]}/>
            </div>

            <div className="ai-insight">
              <span className="sigil">✦</span>
              <span>{d.health < 50 ? `Gold tier redemption is 34% below target in Dubai. Consider extending offer or increasing reward value.` :
                 d.signal==='trending' ? `This offer is outperforming targets by 12%. Consider extending the offer window.` :
                 d.signal==='expiring' ? `Only 4 days left. Audience is engaged — consider extending to capture momentum.` :
                 `Performance is stable. Continue monitoring redemption velocity over the next 7 days.`}</span>
            </div>
          </>
        ) : (
          <div className="col gap-8" style={{padding:'24px 12px', textAlign:'center', alignItems:'center'}}>
            <EmptyArt kind="stage"/>
            <div className="sora" style={{fontSize:15, fontWeight:600}}>No redemptions yet</div>
            <div className="mute" style={{fontSize:12}}>{d.status==='scheduled' ? 'Offer starts soon — check back when it goes live.' : 'This offer has ended. Duplicate it to launch a new run.'}</div>
          </div>
        )}

        <div className="drawer-cta-bar">
          {d.status === 'live' ? <>
            <Btn kind="primary" sm icon={<Icon name="Edit" size={12}/>}>Edit Offer</Btn>
            <Btn sm icon={<Icon name="Copy" size={12}/>}>Duplicate</Btn>
            <Btn sm icon={<Icon name="Clock" size={12}/>}>Extend Dates</Btn>
            <Btn sm kind="ghost" icon={<Icon name="Pause" size={12}/>}>Pause</Btn>
          </> : d.status === 'scheduled' ? <>
            <Btn kind="primary" sm icon={<Icon name="Edit" size={12}/>}>Edit Offer</Btn>
            <Btn sm icon={<Icon name="Copy" size={12}/>}>Duplicate</Btn>
            <Btn sm kind="ghost" icon={<Icon name="X" size={12}/>}>Cancel</Btn>
            <Btn sm kind="ghost" icon={<Icon name="Clock" size={12}/>}>Reschedule</Btn>
          </> : <>
            <Btn kind="primary" sm icon={<Icon name="Copy" size={12}/>}>Duplicate</Btn>
            <Btn sm kind="ghost" icon={<Icon name="Bookmark" size={12}/>}>Archive</Btn>
          </>}
        </div>
      </div>
    </>
  );
}

// ─── Momentum projection curve (L3) ───
function MomentumCurve({ signal }) {
  // Past part = solid; future part = dashed cubic bezier that bends per signal
  const W = 360, H = 80, midX = W * 0.5;
  const baselineY = H / 2;
  const pastPath = `M 10 ${H-20} C 60 ${H-35}, 130 ${H-50}, ${midX} ${baselineY}`;
  let endY, c1, c2;
  if (signal === 'trending' || signal === 'fast' || signal === 'elite') {
    endY = 12; c1 = `${midX+60} ${baselineY-10}`; c2 = `${W-80} 30`;
  } else if (signal === 'losing') {
    endY = H-10; c1 = `${midX+60} ${baselineY+10}`; c2 = `${W-80} ${H-18}`;
  } else {
    endY = baselineY+2; c1 = `${midX+60} ${baselineY}`; c2 = `${W-80} ${baselineY}`;
  }
  const futurePath = `M ${midX} ${baselineY} C ${c1}, ${c2}, ${W-10} ${endY}`;
  const curveColor = signal === 'trending' || signal === 'fast' || signal === 'elite' ? '#2DD4A0'
                   : signal === 'losing' ? '#F26B6B' : 'var(--accent-gold)';
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{background:'var(--bg-overlay)', borderRadius:8, border:'1px solid var(--border-default)'}}>
      <line x1={midX} y1="5" x2={midX} y2={H-5} stroke="var(--border-default)" strokeDasharray="2 3"/>
      <path d={pastPath} fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round"/>
      <path d={futurePath} fill="none" stroke={curveColor} strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round"/>
      <circle cx={midX} cy={baselineY} r="4" fill="var(--accent-gold)"/>
      <text x={midX+8} y={baselineY-6} fontFamily="DM Sans, sans-serif" fontSize="10" fill="var(--text-secondary)">Today</text>
      <text x={W-10} y={endY-6} textAnchor="end" fontFamily="DM Sans, sans-serif" fontSize="10" fill={curveColor}>Projected</text>
    </svg>
  );
}

function ScoreBars() {
  const bars = [
    {l:'Redemption velocity', v:0.3, k:'red',    note:<>Low <Icon name="ArrowDown" size={10}/></>},
    {l:'Audience reach',      v:0.7, k:'',       note:<>Good <Icon name="ArrowRight" size={10}/></>},
    {l:'Time remaining',      v:0.55,k:'amber',  note:'Moderate'},
    {l:'Funding confirmed',   v:1.0, k:'green',  note:<Icon name="Check" size={12}/>},
    {l:'Member sentiment',    v:0.4, k:'red',    note:<>Low <Icon name="ArrowDown" size={10}/></>},
  ];
  return (
    <div>
      {bars.map((b,i)=>(
        <div key={i} className="smeter">
          <div className="ml">{b.l}</div>
          <div className={"mbar " + b.k}><div style={{width:(b.v*100)+'%'}}/></div>
          <div className="mlabel">{b.note}</div>
        </div>
      ))}
    </div>
  );
}

// ─── AVATAR ────────────────────────────
function AvatarPM() {
  const [err, setErr] = useState(false);
  return (
    <div className={"avatar-pm " + (!err ? 'with-img' : '')} title="Priya Mehta">
      {!err
        ? <img src="https://i.pravatar.cc/150?img=47" alt="PM" onError={()=>setErr(true)}/>
        : <span>PM</span>}
    </div>
  );
}

// ─── FLOATING AI WIDGET (draggable) ────
function FloatingAIWidget({ onOpen }) {
  const initial = (() => {
    if (typeof window === 'undefined') return { x: 100, y: 200 };
    const isMobile = window.innerWidth < 720;
    return {
      x: isMobile ? (window.innerWidth - 48) / 2 : window.innerWidth - 24 - 48,
      y: window.innerHeight - 88 - 48
    };
  })();
  const [pos, setPos] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const downRef = useRef({ x:0, y:0, startX:0, startY:0, moved:false });

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    downRef.current = { x: e.clientX, y: e.clientY, startX: pos.x, startY: pos.y, moved: false };
    setDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const dx = e.clientX - downRef.current.x;
      const dy = e.clientY - downRef.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) downRef.current.moved = true;
      const W = window.innerWidth - 48;
      const H = window.innerHeight - 48;
      const nx = Math.max(0, Math.min(W, downRef.current.startX + dx));
      const ny = Math.max(84, Math.min(H, downRef.current.startY + dy));
      setPos({ x: nx, y: ny });
    };
    const onUp = () => {
      setDragging(false);
      // Mobile snap-to-center
      if (window.innerWidth < 720) {
        setPos(p => ({ x: (window.innerWidth - 48) / 2, y: p.y }));
      }
      // If didn't drag, treat as click
      if (!downRef.current.moved) {
        onOpen();
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, onOpen]);

  return (
    <div
      className={"ai-widget " + (dragging ? 'dragging' : '')}
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={onMouseDown}
      title="GRAVTY Intelligence — drag to move">
      <dotlottie-wc
        src="Sources/AI.lottie"
        autoplay
        loop
        style={{width:56, height:56, pointerEvents:'none'}}
      />
    </div>
  );
}

// ─── AI PANEL ─────────────────────────
function AIPanel({ onClose, query, setQuery, onCTA }) {
  const suggestions = [
    'Why is Gold tier down 18%?',
    'Which offers are losing momentum today?',
    'Best window for Ramadan offer relaunch?'
  ];
  return (
    <div className="ai-panel">
      <div className="head">
        <div className="row gap-8">
          <span className="sigil">✦</span>
          <span style={{fontSize:13, fontWeight:500, fontFamily:'Sora, sans-serif'}}>{query ? query : 'GRAVTY Intelligence'}</span>
        </div>
        <button className="icon-btn" onClick={onClose} style={{width:24, height:24}}><Icon name="X" size={14}/></button>
      </div>

      {!query ? (
        <>
          <div className="ask-input">
            <span className="mute">Ask anything...</span>
            <span style={{marginLeft:'auto', color:'var(--accent-gold)'}}><Icon name="Send" size={12}/></span>
          </div>
          <div className="lbl-cap" style={{marginBottom:8}}>Right now I'm seeing</div>
          <div className="col gap-4">
            {suggestions.map((s,i)=>(
              <div key={i} className="ai-suggestion" onClick={()=>setQuery(s)}>
                <span className="arrow" style={{display:'inline-flex'}}><Icon name="ArrowRight" size={12}/></span><span>{s}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="col gap-12">
          <div style={{fontSize:13, lineHeight:1.6, color:'var(--text-primary)'}}>
            Three offers targeting Gold tier in Dubai expired in the last 10 days with no replacement. The gap in active offers for this segment is the primary driver of the decline.
          </div>
          <Btn kind="primary" sm icon={<Icon name="Plus" size={12}/>} onClick={onCTA}>Create Re-engagement Offer</Btn>
          <span className="btn-link" style={{display:'inline-flex', alignItems:'center', gap:4, fontSize:12}} onClick={()=>setQuery(null)}><Icon name="ArrowLeft" size={12}/> Ask something else</span>
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS ─────────────────────
function NotifDropdown({ items, onClose, onItem }) {
  return (
    <>
      <div style={{position:'fixed', inset:0, zIndex:150}} onClick={onClose}/>
      <div className="notif-pop">
        <div className="row between" style={{padding:'12px 14px', borderBottom:'1px solid var(--border-default)'}}>
          <span className="lbl-cap">Notifications</span>
          <span className="btn-link" style={{fontSize:11}} onClick={onClose}>Mark all read</span>
        </div>
        {items.map((n,i)=>(
          <div key={i} className="notif-row" onClick={()=>onItem(n.action)}>
            <span className="notif-dot" style={{background:n.dot}}/>
            <div style={{flex:1}}>
              <div style={{color:'var(--text-primary)', fontSize:13, fontWeight:500}}>{n.t}</div>
              <div className="mute" style={{fontSize:11, marginTop:2}}>{n.s}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ============ MOUNT ============
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
