// ============ SCREEN 3 · TEMPLATE SELECTOR ============
function TemplateSelector({ goTo }) {
  const [filter, setFilter] = useState('All');
  const templates = [
    {i:1, cat:'Re-engagement', name:'Lapsed Member Booster', desc:'Bring back inactive members with a time-limited bonus reward.',
      meta:['22–34% engagement lift','Travel · Hospitality · Retail','30–90 day lapsed members']},
    {i:2, cat:'Re-engagement', rec:true, name:'Tier Recovery Offer', desc:'Prevent tier downgrade with a targeted reward for renewal-threshold members.',
      meta:['18–29% engagement lift','Hotels · Airlines · Banking','Gold/Platinum pre-renewal']},
    {i:3, cat:'Re-engagement', name:'Comeback Cashback', desc:'Re-engage lapsed members with a cashback incentive on their next transaction.',
      meta:['15–24% engagement lift','Hospitality · F&B · Retail','Transaction-driven re-engagement']},
    {i:4, cat:'Seasonal',      name:'Dubai Shopping Festival Bonus', desc:'Drive peak-season bookings with a short-window points multiplier.',
      meta:['28–40% engagement lift','Hotels · Retail · Airlines','DSF · Ramadan · Eid windows']},
    {i:5, cat:'Re-engagement', name:'Win-Back Flash Offer', desc:'Short-window, high-value flash offer for members inactive 60+ days.',
      meta:['20–32% engagement lift','All verticals','60d+ lapsed · urgency-driven']},
  ];
  const filters = ['All','Re-engagement','Seasonal','BOGO','Cashback','Tier Exclusive','Referral','Cause-Based','Birthday','Flash'];
  const shown = filter === 'All' ? templates : templates.filter(t => t.cat === filter);

  return (
    <div className="content" style={{maxWidth:1040, margin:'0 auto'}}>
      <div className="row gap-10" style={{paddingTop:16}}>
        <button className="back-btn" onClick={()=>goTo('offers')}>
          <Icon name="ArrowLeft" size={12}/> Back to Offers
        </button>
      </div>
      <div className="text-c" style={{paddingTop:8, paddingBottom:24}}>
        <h1 className="h-page">Start Your Offer</h1>
        <div className="mute" style={{fontSize:14, marginTop:8}}>Choose how you'd like to begin</div>
      </div>

      {/* Two path cards */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:32}}>
        <PathCard
          highlighted
          title="Start from a Template"
          subtitle="Pre-built offer structures for common loyalty goals. Fully customizable."
          ctaLabel="Browse Templates ↓"
          onCTA={() => document.getElementById('tpl-grid')?.scrollIntoView({behavior:'smooth', block:'start'})}
          art={<TemplateArt/>}
        />
        <PathCard
          title="Build from Scratch"
          subtitle="Full control from the ground up. Best for custom mechanics and unique sponsor deals."
          ctaLabel="Start Blank →"
          onCTA={()=>goTo('editor', {blank:true})}
          art={<BlankArt/>}
        />
      </div>

      {/* AI banner */}
      <div className="ai-insight" style={{marginBottom:20}}>
        <span className="sigil">✦</span>
        <span style={{flex:1}}>Based on your Gold tier redemption gap, <b>Re-engagement templates</b> are recommended for your program right now.</span>
        <Btn sm onClick={()=>setFilter('Re-engagement')}>Apply Filter →</Btn>
      </div>

      {/* Filter pills */}
      <div className="row gap-8 wrap" style={{marginBottom:20}}>
        {filters.map(f => (
          <button key={f} className={"filter-pill " + (filter===f?'active':'')} onClick={()=>setFilter(f)}>{f}</button>
        ))}
      </div>

      {/* Template grid */}
      <div id="tpl-grid" style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16}}>
        {shown.map(t => (
          <div key={t.i} className="card hoverable" style={{position:'relative', display:'flex', flexDirection:'column', gap:10}}>
            {t.rec && (
              <div style={{position:'absolute', top:-9, right:14, background:'var(--accent-gold)', color:'#0A0C10', fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:999, display:'flex', alignItems:'center', gap:4}}>
                <span>✦</span> Recommended
              </div>
            )}
            <Pill style={{alignSelf:'flex-start'}}>{t.cat}</Pill>
            <div className="sora" style={{fontSize:16, fontWeight:600, lineHeight:1.2}}>{t.name}</div>
            <div className="mute" style={{fontSize:13, lineHeight:1.5}}>{t.desc}</div>
            <div className="col gap-4" style={{marginTop:6}}>
              {t.meta.map((m,mi)=>(
                <div key={mi} style={{fontSize:11, color:'var(--text-secondary)'}}>
                  <span style={{color: mi===0 ? 'var(--accent-green)' : 'var(--text-muted)'}}>{mi===0?'↑':'·'}</span> {m}
                </div>
              ))}
            </div>
            <div style={{flex:1}}/>
            <div style={{marginTop:10}}>
              <Btn kind={t.rec ? 'primary' : ''} sm onClick={()=> t.i===2 ? goTo('editor', {template:'tier-recovery'}) : null}>Use This Template →</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PathCard({ highlighted, title, subtitle, ctaLabel, onCTA, art }) {
  return (
    <div className="card hoverable" style={{
      borderWidth: highlighted ? 2 : 1,
      borderColor: highlighted ? 'var(--accent-gold)' : 'var(--border-default)',
      background: highlighted ? 'var(--bg-elevated)' : 'var(--bg-surface)',
      padding: '24px',
      display:'flex', flexDirection:'column', gap:14, minHeight: 250
    }}>
      <div style={{height:80, display:'flex', alignItems:'center'}}>{art}</div>
      <div className="sora" style={{fontSize:18, fontWeight:600}}>{title}</div>
      <div className="mute" style={{fontSize:13, lineHeight:1.5}}>{subtitle}</div>
      <div style={{flex:1}}/>
      <div>
        <Btn kind={highlighted ? 'primary' : ''} onClick={onCTA}>{ctaLabel}</Btn>
      </div>
    </div>
  );
}

function TemplateArt() {
  return (
    <svg width="92" height="68" viewBox="0 0 92 68" fill="none">
      <rect x="8" y="14" width="34" height="44" rx="4" fill="rgba(212,168,83,0.12)" stroke="var(--accent-gold)" strokeWidth="1.5"/>
      <rect x="30" y="22" width="34" height="44" rx="4" fill="rgba(212,168,83,0.2)" stroke="var(--accent-gold)" strokeWidth="1.5"/>
      <circle cx="74" cy="20" r="10" fill="rgba(245,158,11,0.18)" stroke="var(--accent-amber)" strokeWidth="1.5"/>
      <line x1="38" y1="32" x2="56" y2="32" stroke="var(--accent-gold)" strokeWidth="1"/>
      <line x1="38" y1="40" x2="50" y2="40" stroke="var(--accent-gold)" strokeWidth="1"/>
    </svg>
  );
}

function BlankArt() {
  return (
    <svg width="92" height="68" viewBox="0 0 92 68" fill="none">
      <rect x="8" y="6" width="76" height="56" rx="4" stroke="var(--text-muted)" strokeWidth="1.5"/>
      <line x1="8"  y1="22" x2="84" y2="22" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="8"  y1="42" x2="84" y2="42" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="32" y1="6"  x2="32" y2="62" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="60" y1="6"  x2="60" y2="62" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="3 3"/>
      <circle cx="46" cy="34" r="3" fill="var(--accent-gold)"/>
    </svg>
  );
}

window.TemplateSelector = TemplateSelector;
