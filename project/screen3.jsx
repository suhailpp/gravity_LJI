// Screen 3 — Template selector
function Screen3({ goTo }) {
  const [filter, setFilter] = useState('all');
  const templates = [
    {i:1, cat:'Re-engagement', name:'Lapsed Member Booster', desc:'Bring back inactive members with a time-limited bonus reward',
      meta:['22–34% engagement lift','Travel, Hospitality, Retail','30–90 day lapsed']},
    {i:2, cat:'Re-engagement', rec:true, name:'Tier Recovery Offer', desc:'Prevent tier downgrade with a targeted reward for renewal-threshold members',
      meta:['18–29% engagement lift','Hotels, Airlines, Banking','Gold/Platinum retention']},
    {i:3, cat:'Re-engagement', name:'Comeback Cashback', desc:'Re-engage lapsed members with a cashback incentive on next transaction',
      meta:['15–24% engagement lift','Hospitality, F&B, Retail','Transaction-driven']},
    {i:4, cat:'Seasonal', name:'Points Booster Weekend', desc:'Drive weekend bookings with a short-window points multiplier event',
      meta:['28–40% engagement lift','Hotels, Airlines','Weekend traffic']},
    {i:5, cat:'Re-engagement', name:'Win-Back Flash Campaign', desc:'Short-window, high-value flash offer for members inactive 60+ days',
      meta:['20–32% engagement lift','All verticals','60d+ lapsed']},
  ];
  const filters = ['All','Re-engagement','Seasonal','Tier Exclusive','Referral','Flash','Cashback','Milestone'];

  const shown = filter === 'Re-engagement' ? templates.filter(t=>t.cat==='Re-engagement') :
                filter === 'All' ? templates : templates.filter(t=>t.cat===filter);

  return (
    <div className="content" style={{maxWidth:1040, margin:'0 auto', position:'relative'}}>
      <div className="text-c mt-12">
        <ScribbleHeading>Start Your Campaign</ScribbleHeading>
        <div className="text-mute text-md mt-4">Choose how you'd like to begin</div>
      </div>

      {/* Path cards */}
      <div className="grid g-2 mt-24" style={{gap:18}}>
        <div className="path-card gold-edge sk" style={{filter:'url(#rough)'}}>
          <div className="row gap-12">
            {/* abstract shape cluster */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="6" y="14" width="22" height="30" stroke="#1a1a1a" strokeWidth="2" rx="3" fill="#f6dc8a"/>
              <rect x="22" y="22" width="22" height="30" stroke="#1a1a1a" strokeWidth="2" rx="3" fill="#e8b53b"/>
              <circle cx="48" cy="18" r="9" stroke="#1a1a1a" strokeWidth="2" fill="#f3eddc"/>
            </svg>
            <div>
              <div className="h-display text-xl" style={{fontSize:28}}>Start from a Template</div>
              <div className="text-soft text-md">Pre-built campaign structures for common loyalty goals — fully customizable.</div>
            </div>
          </div>
          <div style={{flex:1}}/>
          <div className="mt-16">
            <Btn kind="primary" onClick={()=>{
              const el = document.getElementById('tpl-grid');
              if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
            }}>Browse Templates ↓</Btn>
          </div>
        </div>

        <div className="path-card sk" style={{filter:'url(#rough)'}}>
          <div className="row gap-12">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="8" width="48" height="48" stroke="#1a1a1a" strokeWidth="2" rx="4" fill="#f3eddc"/>
              <line x1="8" y1="22" x2="56" y2="22" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="3 3"/>
              <line x1="22" y1="8" x2="22" y2="56" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="3 3"/>
              <line x1="8" y1="40" x2="56" y2="40" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="3 3"/>
              <line x1="40" y1="8" x2="40" y2="56" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="3 3"/>
            </svg>
            <div>
              <div className="h-display text-xl" style={{fontSize:28}}>Build from Scratch</div>
              <div className="text-soft text-md">Full control from the ground up. Best for custom mechanics and unique sponsor deals.</div>
            </div>
          </div>
          <div style={{flex:1}}/>
          <div className="mt-16">
            <Btn onClick={()=>goTo(4, {blank:true})}>Start Blank →</Btn>
          </div>
        </div>
      </div>

      {/* AI banner */}
      <div className="ai-banner mt-24">
        <span className="h-display" style={{fontSize:28}}>✦</span>
        <span className="text-md">Based on your Gold tier redemption dip, we suggest starting with a <b>Re-engagement</b> template.</span>
        <span style={{flex:1}}/>
        <Btn sm onClick={()=>setFilter('Re-engagement')}>Apply Filter →</Btn>
      </div>

      {/* Filter pills */}
      <div className="row gap-8 mt-20" style={{flexWrap:'wrap'}}>
        {filters.map(f => (
          <span key={f}
            onClick={()=>setFilter(f)}
            className={"pill " + (filter===f ? 'dark' : 'ghost')}
            style={{cursor:'pointer', padding:'5px 14px'}}>{f}</span>
        ))}
      </div>

      {/* Template grid */}
      <div id="tpl-grid" className="grid g-3 mt-16">
        {shown.map(t => (
          <div key={t.i} className="tpl-card">
            {t.rec && <span className="tpl-rec-badge">✦ Recommended</span>}
            <span className="pill" style={{alignSelf:'flex-start', background: t.cat==='Re-engagement' ? '#f6dc8a' : 'var(--paper-2)'}}>{t.cat}</span>
            <div className="h-display" style={{fontSize:24, lineHeight:1.1}}>{t.name}</div>
            <div className="text-md text-soft">{t.desc}</div>
            <div className="row gap-6 wrap mt-4">
              {t.meta.map((m,mi)=>(
                <Pill key={mi} style={{fontSize:12, padding:'2px 8px'}}>{m}</Pill>
              ))}
            </div>
            <div style={{flex:1}}/>
            <div className="mt-8">
              <Btn kind={t.rec ? 'primary' : ''} onClick={()=> t.i===2 ? goTo(4, {template:'tier-recovery'}) : null}>Use This Template →</Btn>
            </div>
          </div>
        ))}
        {shown.length === 0 && <div className="text-mute text-c" style={{gridColumn:'1 / -1', padding:'30px'}}>No templates in this category.</div>}
      </div>

      <Annotation style={{top:60, left:-10, maxWidth:140}}>
        wireframe<br/>only ↓
      </Annotation>
    </div>
  );
}
window.Screen3 = Screen3;
