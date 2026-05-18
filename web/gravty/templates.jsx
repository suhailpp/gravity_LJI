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
    <PageLayout>
      <PageHeader
        title="Start Your Offer"
        subtitle="Choose how you'd like to begin"
        backLabel="Back to Offers"
        onBack={()=>goTo('offers')}
      />

      {/* Two path cards */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:32}}>
        <PathCard
          highlighted
          title="Start from a Template"
          subtitle="Pre-built offer structures for common loyalty goals. Fully customizable."
          ctaLabel={<>Browse Templates <Icon name="ArrowDown" size={12}/></>}
          onCTA={() => document.getElementById('tpl-grid')?.scrollIntoView({behavior:'smooth', block:'start'})}
          art={<TemplateArt/>}
        />
        <PathCard
          title="Build from Scratch"
          subtitle="Full control from the ground up. Best for custom mechanics and unique sponsor deals."
          ctaLabel={<>Start Blank <Icon name="ArrowRight" size={12}/></>}
          onCTA={()=>goTo('editor', {blank:true})}
          art={<BlankArt/>}
        />
      </div>

      {/* AI banner — canonical purple, "Get AI Recommendations" CTA */}
      <div className="ai-insight" style={{marginBottom:20}}>
        <span className="sigil">✦</span>
        <div style={{flex:1, display:'flex', flexDirection:'column', gap:2}}>
          <div style={{fontWeight:600}}>Need help getting started?</div>
          <div style={{color:'var(--text-muted)', fontSize:12}}>Let AI recommend the best templates based on your goals and past performance.</div>
        </div>
        <button className="ai-cta" onClick={()=>setFilter('Re-engagement')}>
          <span className="sigil">✦</span> Get AI Recommendations <Icon name="ArrowRight" size={12}/>
        </button>
      </div>

      {/* Filter pills */}
      <div className="row gap-8 wrap" style={{marginBottom:20}}>
        {filters.map(f => (
          <FilterChip key={f} label={f} active={filter===f} onClick={()=>setFilter(f)}/>
        ))}
      </div>

      {/* Template grid — 4 columns, with empty-state card when filter has no matches */}
      <div id="tpl-grid" className="tpl-grid">
        {shown.length === 0 ? (
          <div className="tpl-empty">
            <svg className="tpl-empty-art" width="56" height="44" viewBox="0 0 56 44" fill="none">
              <path d="M4 14 L28 4 L52 14 L52 38 L28 40 L4 38 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M4 14 L28 22 L52 14" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M28 22 L28 40" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="28" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <h4>No templates found</h4>
            <p>Try adjusting your filters or search terms to discover more templates.</p>
            <Btn sm onClick={()=>setFilter('All')}>Clear Filters</Btn>
          </div>
        ) : shown.map(t => (
          <TemplateCard key={t.i}
                        template={t}
                        onSelect={(tpl) => tpl.i === 2 ? goTo('editor', {template:'tier-recovery'}) : null}/>
        ))}
      </div>
    </PageLayout>
  );
}

function TemplateArt() {
  return (
    <dotlottie-wc
      src="Sources/Template.lottie"
      autoplay
      loop
      style={{width:92, height:92, display:'block'}}
    />
  );
}

function BlankArt() {
  return (
    <dotlottie-wc
      src="Sources/scratch.lottie"
      autoplay
      loop
      style={{width:92, height:92, display:'block'}}
    />
  );
}

window.TemplateSelector = TemplateSelector;
