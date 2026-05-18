// ============ SCREEN 4 · OFFER EDITOR ============
function Editor({ goTo, initial }) {
  // ── Step + submit ──
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitState, setSubmitState] = useState('idle');

  // ── Banner (only when arrived from template) ──
  const [templateBannerDismissed, setTemplateBannerDismissed] = useState(false);
  const fromTemplate = initial && initial.template === 'tier-recovery';

  // ── Step 1: Offer Details ──
  const [title, setTitle] = useState("Your Gold Status Deserves More — Summer Bonus Inside");
  const [showAlts, setShowAlts] = useState(false);
  const [campaignId, setCampaignId] = useState("EMSK_GOLD_RECOV_JUN24");
  const [locOn, setLocOn] = useState(true);
  const [arabicReady, setArabicReady] = useState(false);
  const [multiSp, setMultiSp] = useState(false);
  const [priority, setPriority] = useState(85);
  const [mechanic, setMechanic] = useState('BOGO');

  // ── Step 2: Audience & Rules ──
  const [segments, setSegments] = useState([
    {id:'hv',          name:'High-Value UAE Travelers', count:112000},
    {id:'lapsed-gold', name:'Lapsed Gold Members',      count:45200},
    {id:'plat-ff',     name:'Platinum Frequent Flyers', count:12800},
    {id:'lifestyle',   name:'Active Lifestyle Members', count:67400},
  ]);
  const [ruleSets, setRuleSets] = useState([
    {id:'standard', name:'Standard Redemption'},
    {id:'premium',  name:'Premium Member Rules'},
    {id:'flash',    name:'Flash Sale Rules'},
    {id:'ramadan',  name:'Ramadan Offer Rules'},
  ]);
  const [segment, setSegment] = useState('lapsed-gold');
  const [ruleSet, setRuleSet] = useState('premium');
  const [tiers, setTiers] = useState(new Set(['Gold']));
  const [regions, setRegions] = useState(['Dubai','Abu Dhabi','Sharjah']);
  const [behaviours, setBehaviours] = useState(['Lapsed 30–90 days']);
  const [minSpend, setMinSpend] = useState('AED 500');
  // Sample conflict: when Lapsed 90+ days AND high spend to zero-state
  const conflict = behaviours.includes('Lapsed 90+ days') && minSpend.includes('5,000');

  // ── Step 3: Reward Config (editable monospace fields) ──
  const [rewardCfg, setRewardCfg] = useState({
    rewardType: 'BOGO — 1 free night with 1 paid',
    minStay:    '2 nights',
    minSpend:   'AED 800 per night',
    milesCap:   '10,000 bonus miles / member',
    maxPer:     '1 redemption',
    quota:      '25,000 redemptions',
  });
  const [achiOn, setAchiOn] = useState(false);
  const [liabilityPulse, setLiabilityPulse] = useState(false);
  const quotaNum = parseInt((rewardCfg.quota || '').replace(/[^0-9]/g, '')) || 25000;
  const liability = Math.round(quotaNum * 72 / 1000); // simple K-AED projection

  // ── Step 4: Schedule & Ops ──
  const [startDate, setStartDate] = useState('Jun 1, 2024');
  const [endDate, setEndDate] = useState('Jul 31, 2024');
  const [blackouts, setBlackouts] = useState([{ id:1, label:'Jun 15–17', note:'System migration', valid:true }]);
  const [escalations, setEscalations] = useState([
    {id:'esc-80',  trigger:'At 80% quota', action:'Notify Marketing Lead'},
    {id:'esc-100', trigger:'At 100%',      action:'Auto-pause offer'},
  ]);
  const [redemptionLogic, setRedemptionLogic] = useState('claim');
  const [approvalChoice, setApprovalChoice] = useState('finance'); // finance | marketing | none
  const [fundingConfirmed, setFundingConfirmed] = useState(false);

  // ── Step 5 derived states ──
  const arabicComplete = arabicReady;
  const fundingComplete = fundingConfirmed;

  // ── Preview panel ──
  const [previewKind, setPreviewKind] = useState('mobile');
  const [previewMode, setPreviewMode] = useState('card');
  const [collapsed, setCollapsed] = useState(false);
  const [fullModal, setFullModal] = useState(false);

  // ── Estimate (reactive) ──
  const [estimate, setEstimate] = useState(45200);
  const [estUpdating, setEstUpdating] = useState(false);
  const recalcEstimate = (newSeg) => {
    setEstUpdating(true);
    const target = {'hv':112000,'lapsed-gold':45200,'plat-ff':12800,'lifestyle':67400}[newSeg];
    setTimeout(()=>{ setEstimate(target || 45200); setEstUpdating(false); }, 600);
  };

  // ── Unsaved-change dots (sample: incomplete steps highlight) ──
  const unsavedSteps = {
    1: title.length < 1 || title.length > 60,
    2: regions.length === 0 || tiers.size === 0 || behaviours.length === 0 || conflict,
    3: !rewardCfg.quota || !rewardCfg.minStay,
    4: blackouts.some(b => !b.valid),
    5: false,
  };

  const stepDefs = [
    {n:1, name:'Offer Details',     frac:'7/9'},
    {n:2, name:'Audience & Rules',  frac: tiers.size && regions.length ? '5/6' : '3/6'},
    {n:3, name:'Reward Config',     frac:'4/4'},
    {n:4, name:'Schedule & Ops',    frac:'2/5'},
    {n:5, name:'Review',            frac:'—'},
  ];

  const noApproval = approvalChoice === 'none';

  const handleSubmit = () => {
    setSubmitState('submitting');
    setTimeout(()=>{
      setSubmitState('done');
      // Notify global approval bus (handled by app.jsx)
      if (window.__onOfferSubmitted) window.__onOfferSubmitted({
        title, campaignId,
        published: noApproval,
      });
      setSubmitted(true);
    }, 900);
  };

  const validateAll = () => unsavedSteps[1] || unsavedSteps[2] || unsavedSteps[3] || unsavedSteps[4];

  if (submitted) return <SubmissionConfirm goTo={goTo} published={noApproval} title={title} campaignId={campaignId}/>;

  return (
    <PageLayout>
      <div className="col gap-20">
        <PageHeader
          title={fromTemplate ? 'Tier Recovery Offer' : 'New Offer'}
          subtitle={fromTemplate ? 'Template pre-filled · Marriott Bonvoy · Gold tier re-engagement' : 'Build a new offer from scratch'}
          backLabel="Back to Offers"
          onBack={()=>goTo('offers')}
          actions={<span className="mute" style={{fontSize:12}}><Icon name="Check" size={12} color="var(--accent-green)"/> Saved just now</span>}
        />

      {/* Step indicator */}
      <div>
        <div className="steps">
          {stepDefs.map(s => (
            <div key={s.n} className={"step " + (step===s.n?'active':'')} onClick={()=>setStep(s.n)}>
              <div className="sn">
                {!unsavedSteps[s.n] && s.n < step
                  ? <span style={{color:'var(--accent-green)', marginRight:4, display:'inline-flex'}}><Icon name="Check" size={12}/></span>
                  : <span>Step {s.n}</span>
                }
                {unsavedSteps[s.n] && <span className="unsaved-dot" title="Unsaved or incomplete"/>}
              </div>
              <div className="snme">{s.name}</div>
              <div className="sfrac">{s.frac} complete</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-panel grid — when collapsed, right column shrinks to fit just the Estimate (step 2) or disappears */}
      <div className="editor-grid" style={{gridTemplateColumns: collapsed ? (step === 2 ? '1fr 320px' : '1fr') : undefined}}>
        <div className="card" style={{padding:24, position:'relative'}}>
          {/* Floating collapse/expand toggle — sits on the boundary between config and preview (or right edge when collapsed) */}
          <button
            onClick={()=>setCollapsed(!collapsed)}
            title={collapsed ? 'Show preview' : 'Hide preview'}
            style={{
              position:'absolute', right:-16, top:'50%', transform:'translateY(-50%)',
              zIndex:10, width:32, height:32, borderRadius:'50%',
              background:'var(--bg-elevated)', border:'1px solid var(--border-default)',
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              color:'var(--text-secondary)', fontSize:14, fontFamily:'Sora, sans-serif',
              padding:0
            }}>
            <Icon name={collapsed ? 'ChevronLeft' : 'ChevronRight'} size={14}/>
          </button>
          {fromTemplate && !templateBannerDismissed && (
            <div className="tpl-banner">
              <span className="sigil">✦</span>
              <span>Tier Recovery template applied — <b>8 fields pre-filled</b>. Review and adjust below.</span>
              <span className="tpl-banner-close" onClick={()=>setTemplateBannerDismissed(true)}>
                <Icon name="X" size={12}/>
              </span>
            </div>
          )}

          {step === 1 && (
            <Step1
              title={title} setTitle={setTitle}
              showAlts={showAlts} setShowAlts={setShowAlts}
              campaignId={campaignId} setCampaignId={setCampaignId}
              mechanic={mechanic} setMechanic={setMechanic}
              locOn={locOn} setLocOn={setLocOn}
              arabicReady={arabicReady} setArabicReady={setArabicReady}
              multiSp={multiSp} setMultiSp={setMultiSp}
              priority={priority} setPriority={setPriority}/>
          )}
          {step === 2 && (
            <Step2
              segments={segments} setSegments={setSegments}
              ruleSets={ruleSets} setRuleSets={setRuleSets}
              segment={segment} setSegment={(s)=>{setSegment(s); recalcEstimate(s);}}
              ruleSet={ruleSet} setRuleSet={setRuleSet}
              tiers={tiers} setTiers={setTiers}
              regions={regions} setRegions={setRegions}
              behaviours={behaviours} setBehaviours={setBehaviours}
              minSpend={minSpend} setMinSpend={setMinSpend}/>
          )}
          {step === 3 && (
            <Step3
              rewardCfg={rewardCfg}
              setRewardCfg={(k, v)=>{
                setRewardCfg(prev => ({...prev, [k]: v}));
                if (k === 'quota') {
                  setLiabilityPulse(true);
                  setTimeout(()=>setLiabilityPulse(false), 1200);
                }
              }}
              achiOn={achiOn} setAchiOn={setAchiOn}/>
          )}
          {step === 4 && (
            <Step4
              startDate={startDate} setStartDate={setStartDate}
              endDate={endDate} setEndDate={setEndDate}
              blackouts={blackouts} setBlackouts={setBlackouts}
              escalations={escalations} setEscalations={setEscalations}
              redemptionLogic={redemptionLogic} setRedemptionLogic={setRedemptionLogic}
              approvalChoice={approvalChoice} setApprovalChoice={setApprovalChoice}
              fundingConfirmed={fundingConfirmed} setFundingConfirmed={setFundingConfirmed}/>
          )}
          {step === 5 && (
            <Step5
              arabicComplete={arabicComplete}
              setArabicComplete={setArabicReady}
              fundingComplete={fundingComplete}
              setFundingComplete={setFundingConfirmed}
              approvalChoice={approvalChoice}
              hasBlackoutConflict={blackouts.some(b => !b.valid)}
              regionsCount={regions.length}/>
          )}
        </div>

        {(!collapsed || step === 2) && (
          <div className="preview-wrap" style={collapsed ? {opacity:1, pointerEvents:'auto', width:'auto'} : undefined}>
            {/* EstimateBlock — always visible on step 2, even when preview is collapsed */}
            {step === 2 && (
              <EstimateBlock
                estimate={estimate}
                estUpdating={estUpdating}
                regions={regions}
                liability={liability}
                liabilityPulse={liabilityPulse}
                conflict={conflict}
                behaviours={behaviours}
                minSpend={minSpend}/>
            )}

            {step === 2 && !collapsed && <div style={{height:16}}/>}

            {/* LivePreview — only this hides when collapsed */}
            {!collapsed && (
              <LivePreview
                step={step}
                previewKind={previewKind} setPreviewKind={setPreviewKind}
                previewMode={previewMode} setPreviewMode={setPreviewMode}
                mechanic={mechanic}
                tiers={tiers}
                liability={liability}
                liabilityPulse={liabilityPulse}
                onFullPreview={()=>setFullModal(true)}/>
            )}
          </div>
        )}
      </div>

      <EditorBottomBar
        step={step}
        setStep={setStep}
        onSubmit={handleSubmit}
        submitState={submitState}
        noApproval={noApproval}
        canSubmit={!validateAll()}/>

      <FullPreviewModal
        open={fullModal}
        onClose={()=>setFullModal(false)}
        mechanic={mechanic}
        tiers={tiers}/>
      </div>
    </PageLayout>
  );
}

// ─── ESTIMATE BLOCK (Step 2 right panel, above preview) ───
function EstimateBlock({ estimate, estUpdating, regions, liability, liabilityPulse, conflict, behaviours, minSpend }) {
  if (conflict) {
    return (
      <div className="card" style={{padding:14, border:'1px solid rgba(242,107,107,0.4)', borderLeft:'3px solid var(--accent-red)'}}>
        <div className="lbl-cap" style={{color:'var(--accent-red)', marginBottom:6}}>Audience Estimate</div>
        <div className="sora" style={{fontSize:24, fontWeight:600, color:'var(--accent-red)', lineHeight:1}}>0 members</div>
        <div style={{fontSize:12, marginTop:10, color:'var(--text-primary)', lineHeight:1.5}}>
          <b style={{display:'inline-flex', alignItems:'center', gap:6}}><Icon name="AlertTriangle" size={13}/> No members match these combined rules.</b><br/>
          <span style={{color:'var(--text-secondary)'}}>
            "Lapsed 90+ days" conflicts with "Min spend AED 5,000 in last 30 days" — members who lapsed are unlikely to have recent spend.
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="card" style={{padding:14, background:'var(--bg-elevated)', borderLeft:'3px solid var(--accent-green)'}}>
      <div className="lbl-cap" style={{color:'var(--text-secondary)', marginBottom:6}}>Estimated Eligible Members</div>
      <div className="sora" style={{fontSize:26, fontWeight:600, lineHeight:1, color:'var(--text-primary)'}}>
        ~{estimate.toLocaleString()}
        {estUpdating && <span className="mute" style={{fontSize:12, marginLeft:8, fontWeight:400}}>↻ updating…</span>}
      </div>
      <div className="mute" style={{fontSize:11, marginTop:6}}>across {regions.slice(0,3).join(', ')}</div>
      <div className="mute" style={{fontSize:10, marginTop:3, color:'var(--accent-gold)'}}>↻ updates as rules change</div>
      <div className="divider" style={{margin:'12px 0'}}/>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        <div className={liabilityPulse ? 'link-pulse' : ''}>
          <div className="lbl-cap" style={{marginBottom:4}}>Reward Liability</div>
          <div className="sora" style={{fontSize:15, fontWeight:600, transition:'color .3s', color: liabilityPulse ? 'var(--accent-gold)' : 'var(--text-primary)'}}>
            AED {liability >= 1000 ? (liability/1000).toFixed(1) + 'M' : liability + 'K'}
            <span className="mute" style={{fontWeight:400, fontSize:11}}> est.</span>
          </div>
        </div>
        <div>
          <div className="lbl-cap" style={{marginBottom:4}}>Avg Redemption</div>
          <div className="sora" style={{fontSize:15, fontWeight:600}}>~14–22% <span className="mute" style={{fontWeight:400, fontSize:11}}>expected</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── EDITOR · STICKY BOTTOM BAR ───────
function EditorBottomBar({ step, setStep, onSubmit, submitState, noApproval, canSubmit }) {
  return (
    <div className="editor-bottom-bar">
      <Btn kind="ghost" onClick={()=>setStep(Math.max(1, step-1))}
           style={{opacity: step===1 ? 0.4 : 1, pointerEvents: step===1 ? 'none' : 'auto'}}>
        <Icon name="ArrowLeft" size={13}/> Previous
      </Btn>
      <div className="editor-dots" style={{margin:'0 auto'}}>
        {[1,2,3,4,5].map(n => (
          <div key={n}
               className={"editor-dot " + (n===step?'active':(n<step?'past':''))}
               onClick={()=>setStep(n)}
               title={`Step ${n}`}/>
        ))}
      </div>
      <div className="row gap-8" style={{marginLeft:'auto'}}>
        <Btn kind="ghost">Save as Draft</Btn>
        {step === 5 ? (
          <Btn kind="primary" onClick={onSubmit}
               style={{opacity: canSubmit ? 1 : 0.5, pointerEvents: canSubmit ? 'auto' : 'none'}}>
            {submitState==='submitting' ? '↻ Submitting…'
              : submitState==='done' ? <><Icon name="Check" size={13}/> Submitted</>
              : noApproval ? 'Publish Now' : <>Submit for Approval <Icon name="ArrowRight" size={13}/></>}
          </Btn>
        ) : (
          <Btn kind="primary" onClick={()=>setStep(Math.min(5, step+1))}>Continue <Icon name="ArrowRight" size={13}/></Btn>
        )}
      </div>
    </div>
  );
}

// ─── STEP 1 ────────────────────────────────
function Step1({ title, setTitle, showAlts, setShowAlts, campaignId, setCampaignId,
                 mechanic, setMechanic, locOn, setLocOn, arabicReady, setArabicReady,
                 multiSp, setMultiSp, priority, setPriority }) {
  const priorityLabel = priority < 33 ? 'Low' : priority < 67 ? 'Medium' : 'High';
  const len = title.length;
  const counterClass = len >= 60 ? 'danger' : len >= 50 ? 'warn' : '';

  const triggerUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) {
        const url = URL.createObjectURL(f);
        const zone = document.getElementById('upload-banner-zone');
        if (zone) {
          zone.style.backgroundImage = `url(${url})`;
          zone.style.backgroundSize = 'cover';
          zone.style.backgroundPosition = 'center';
          zone.style.borderStyle = 'solid';
          zone.style.minHeight = '120px';
          zone.innerHTML = '<div style="position:absolute; bottom:8px; left:8px; background:rgba(0,0,0,0.6); color:#fff; padding:4px 8px; border-radius:4px; font-size:11px;">' + f.name + '</div>';
        }
      }
    };
    input.click();
  };

  return (
    <div className="col gap-2">
      <div className="lbl-cap" style={{marginBottom:14}}>Step 1 · Offer Details</div>

      <div className="field">
        <div className="field-label">
          <span className="lbl">Offer Title (Public-facing)</span>
          <span className="lnk row gap-4" onClick={()=>setShowAlts(!showAlts)} style={{color:'#8B5CF6'}}><Sigil size={11} color="#8B5CF6"/> Suggest Alternatives</span>
        </div>
        <input className="input" value={title} onChange={(e)=>setTitle(e.target.value)} style={{outline:'none'}} maxLength={120}/>
        <div className={"char-counter " + counterClass}>
          {len} / 60
          {len >= 60 && <span style={{marginLeft:8, color:'var(--accent-red)'}}>· Title may be truncated on mobile</span>}
        </div>
        {showAlts && (
          <div className="card" style={{padding:12, background:'var(--bg-overlay)', marginTop:8}}>
            <div className="lbl-cap" style={{marginBottom:8}}>Alternative titles</div>
            {[
              'Gold Members: Earn 3× Miles This Summer',
              'Your Loyalty Pays Off — Summer Miles Inside',
              'Exclusive Summer Offer for Skywards Gold Members'
            ].map((s,i)=>(
              <div key={i} className="row between" style={{padding:'8px 0', borderTop: i>0 ? '1px solid var(--border-subtle)' : 'none'}}>
                <span style={{fontSize:13}}>{s}</span>
                <Btn sm kind="ghost" onClick={()=>{ setTitle(s); setShowAlts(false); }}>Use</Btn>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="field">
        <div className="field-label"><span className="lbl">Internal Offer Name</span></div>
        <input className="input mono" value={campaignId} onChange={(e)=>setCampaignId(e.target.value)} style={{outline:'none'}}/>
      </div>

      <div className="field-row">
        <div className="field">
          <div className="field-label"><span className="lbl">Offer Objective</span></div>
          <div className="input select">Re-engagement</div>
        </div>
        <div className="field">
          <div className="field-label"><span className="lbl">Sponsor</span></div>
          <div className="input">
            <Logo code="MA" brand="Marriott Bonvoy" sm/>
            <span>Marriott Bonvoy</span>
            <div style={{marginLeft:'auto'}}><Toggle on={multiSp} onToggle={()=>setMultiSp(!multiSp)} label="Multi-sponsor"/></div>
          </div>
        </div>
      </div>

      <div className="field">
        <div className="field-label"><span className="lbl">Description</span></div>
        <textarea className="input textarea"
                  defaultValue="You've earned Gold — now make the most of it. Book any 2-night stay this summer and earn 3× Skywards Miles, plus an exclusive late checkout upgrade."
                  style={{outline:'none', resize:'vertical', width:'100%', fontFamily:'inherit'}}/>
      </div>

      <div className="field">
        <div className="field-label"><span className="lbl">Offer Imagery</span></div>
        <div id="upload-banner-zone" className="input dashed" onClick={triggerUpload}
             style={{cursor:'pointer', position:'relative', overflow:'hidden'}}>
          <Icon name="Upload" size={20} color="var(--text-muted)"/>
          <div style={{fontSize:13, marginTop:6}}>Upload Banner Image</div>
          <div className="mute" style={{fontSize:11, marginTop:3}}>
            PNG · JPG · up to 2MB · or <span className="lnk" style={{color:'var(--accent-gold)'}}>Use Asset Library</span>
          </div>
        </div>
      </div>

      <div className="field">
        <div className="field-label"><span className="lbl">Offer Mechanic</span></div>
        <div className="row gap-8 wrap">
          {['BOGO','Cashback','Points ×N','Flat Off','Voucher','Cause'].map(m => (
            <FilterChip key={m} label={m} active={mechanic===m} onClick={()=>setMechanic(m)}/>
          ))}
        </div>
        {mechanic==='BOGO' && (
          <div className="card" style={{padding:14, background:'var(--bg-overlay)', marginTop:10}}>
            <div className="lbl-cap" style={{marginBottom:10}}>BOGO Configuration</div>
            <div className="field-row" style={{margin:0}}>
              <div className="field" style={{margin:0}}><div className="field-label"><span className="lbl">Buy</span></div><input className="input" defaultValue="1 night" style={{outline:'none'}}/></div>
              <div className="field" style={{margin:0}}><div className="field-label"><span className="lbl">Get</span></div><input className="input" defaultValue="1 night free" style={{outline:'none'}}/></div>
            </div>
          </div>
        )}
        {mechanic==='Cashback' && (
          <div className="card" style={{padding:14, background:'var(--bg-overlay)', marginTop:10}}>
            <div className="lbl-cap" style={{marginBottom:10}}>Cashback Configuration</div>
            <div className="field-row" style={{margin:0}}>
              <div className="field" style={{margin:0}}><div className="field-label"><span className="lbl">Rate</span></div><input className="input" defaultValue="5%" style={{outline:'none'}}/></div>
              <div className="field" style={{margin:0}}><div className="field-label"><span className="lbl">Cap</span></div><input className="input" defaultValue="AED 250 / booking" style={{outline:'none'}}/></div>
            </div>
          </div>
        )}
        {mechanic==='Points ×N' && (
          <div className="card" style={{padding:14, background:'var(--bg-overlay)', marginTop:10}}>
            <div className="lbl-cap" style={{marginBottom:10}}>Points Multiplier</div>
            <input className="input" defaultValue="3× Skywards Miles" style={{outline:'none'}}/>
          </div>
        )}
      </div>

      <div className="field-row">
        <div className="field">
          <div className="field-label"><span className="lbl">CTA Label</span></div>
          <div className="input select">Unlock Offer</div>
        </div>
        <div className="field">
          <div className="field-label">
            <span className="lbl">Priority Level</span>
            <span style={{fontSize:12, color:'var(--accent-gold)', fontWeight:600}}>{priorityLabel}</span>
          </div>
          <PrioritySlider value={priority} onChange={setPriority}/>
        </div>
      </div>

      <div className="field">
        <div className="field-label">
          <span className="lbl">Localization</span>
          <Toggle on={locOn} onToggle={()=>setLocOn(!locOn)}/>
        </div>
        {locOn && (
          <div className="card" style={{padding:10, background:'var(--bg-overlay)'}}>
            <div className="row between" style={{padding:'10px 6px'}}>
              <span className="row gap-8" style={{fontSize:13}}><span>🇬🇧</span>English (Default)</span>
              <Pill kind="green"><Icon name="Check" size={11}/> Complete</Pill>
            </div>
            <div className="row between" style={{padding:'10px 6px', borderTop:'1px solid var(--border-subtle)', cursor:'pointer'}}
                 onClick={()=>setArabicReady(!arabicReady)}>
              <span className="row gap-8" style={{fontSize:13}}><span>🇦🇪</span>Arabic (RTL)</span>
              <Pill kind={arabicReady?'green':'amber'}>{arabicReady ? <><Icon name="Check" size={11}/> Complete</> : <><Icon name="AlertTriangle" size={11}/> Translation pending</>}</Pill>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Priority slider (draggable) ───
function PrioritySlider({ value, onChange }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const updateFromEvent = (e) => {
    if (!trackRef.current) return;
    const r = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    onChange(Math.round(pct * 100));
  };
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => updateFromEvent(e);
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);
  return (
    <div className={"slider " + (dragging?'dragging':'')} ref={trackRef}
         onMouseDown={(e)=>{ setDragging(true); updateFromEvent(e); }}
         style={{marginTop:8}}>
      <div className="slider-fill" style={{width: value + '%'}}/>
      <div className="slider-thumb" style={{left: value + '%'}}/>
    </div>
  );
}

// ─── STEP 2 ───────────────────────────────
function Step2({ segments, setSegments, ruleSets, setRuleSets,
                 segment, setSegment, ruleSet, setRuleSet,
                 tiers, setTiers, regions, setRegions, behaviours, setBehaviours,
                 minSpend, setMinSpend }) {
  const allRegions = ['Dubai','Abu Dhabi','Sharjah','Ajman','RAK','Fujairah'];
  const allBehaviours = ['Lapsed 30–90 days','Lapsed 90+ days','Recent purchaser','First-time visitor','High engagement','Cart abandoner'];
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [showBehavMenu, setShowBehavMenu] = useState(false);
  const [savingSegment, setSavingSegment] = useState(false);
  const [savingRule, setSavingRule] = useState(false);
  const [newSegName, setNewSegName] = useState('');
  const [newRuleName, setNewRuleName] = useState('');
  const [segConfirm, setSegConfirm] = useState(null);
  const [ruleConfirm, setRuleConfirm] = useState(null);

  const toggleTier = (t) => {
    const s = new Set(tiers);
    s.has(t) ? s.delete(t) : s.add(t);
    setTiers(s);
  };

  const saveSegment = () => {
    if (!newSegName.trim()) return;
    const id = 'cust-' + Date.now();
    setSegments([...segments, { id, name: newSegName, count: Math.floor(Math.random()*30000)+10000 }]);
    setSegConfirm(newSegName);
    setNewSegName('');
    setSavingSegment(false);
    setTimeout(()=>setSegConfirm(null), 3500);
  };
  const saveRule = () => {
    if (!newRuleName.trim()) return;
    const id = 'cust-' + Date.now();
    setRuleSets([...ruleSets, { id, name: newRuleName }]);
    setRuleConfirm(newRuleName);
    setNewRuleName('');
    setSavingRule(false);
    setTimeout(()=>setRuleConfirm(null), 3500);
  };

  return (
    <div className="col gap-2">
      <div className="lbl-cap" style={{marginBottom:14}}>Step 2 · Audience & Rules</div>

      <div className="field">
        <div className="field-label">
          <span className="lbl">Who should see this offer?</span>
          <span className="lnk" style={{display:'inline-flex', alignItems:'center', gap:4}}>Edit rules for this offer only <Icon name="ArrowRight" size={11}/></span>
        </div>
        <div className="card" style={{padding:8, background:'var(--bg-overlay)'}}>
          {segments.map(s => (
            <RadioRow key={s.id}
                      label={s.name}
                      sublabel={`${s.count.toLocaleString()} members`}
                      active={segment===s.id}
                      onClick={()=>setSegment(s.id)}/>
          ))}
          <RadioRow icon="Plus" muted label="Build a new segment"/>
        </div>
      </div>

      <div className="field">
        <div className="field-label">
          <span className="lbl">How should this offer behave?</span>
          <span className="lnk" style={{display:'inline-flex', alignItems:'center', gap:4}}>Edit rules for this offer only <Icon name="ArrowRight" size={11}/></span>
        </div>
        <div className="card" style={{padding:8, background:'var(--bg-overlay)'}}>
          {ruleSets.map(r => (
            <RadioRow key={r.id}
                      label={r.name}
                      active={ruleSet===r.id}
                      onClick={()=>setRuleSet(r.id)}/>
          ))}
          <RadioRow icon="Plus" muted label="Build a new rule set"/>
        </div>
      </div>

      <div className="card" style={{padding:14, background:'var(--bg-overlay)', marginTop:14, fontSize:13, lineHeight:1.6, color:'var(--text-primary)', fontStyle:'italic'}}>
        "This offer will be shown to <b style={{fontStyle:'normal'}}>{Array.from(tiers).join(' + ') || '—'} tier</b> Skywards members in <b style={{fontStyle:'normal'}}>{regions.join(', ') || '—'}</b> who match <b style={{fontStyle:'normal'}}>{behaviours.join(', ') || '—'}</b>."
      </div>

      <div className="lbl-cap" style={{marginTop:20, marginBottom:10}}>Rule Overrides</div>
      <div className="field">
        <div className="field-label"><span className="lbl">Tier</span></div>
        <div className="row gap-8">
          {['Blue','Silver','Gold','Platinum'].map(t => (
            <FilterChip key={t} label={t} active={tiers.has(t)} onClick={()=>toggleTier(t)}/>
          ))}
        </div>
      </div>
      <div className="field" style={{position:'relative'}}>
        <div className="field-label"><span className="lbl">Geography</span></div>
        <div className="row gap-6 wrap">
          {regions.map(g => (
            <Pill key={g} kind="solid-dark">
              {g} <span style={{cursor:'pointer'}} onClick={()=>setRegions(regions.filter(r=>r!==g))}>×</span>
            </Pill>
          ))}
          <Btn sm kind="ghost" icon={<Icon name="Plus" size={11}/>} onClick={()=>setShowRegionMenu(!showRegionMenu)}>Add Region</Btn>
        </div>
        {showRegionMenu && (
          <div className="card" style={{padding:6, background:'var(--bg-overlay)', position:'absolute', top:'100%', left:0, zIndex:10, marginTop:6, minWidth:200, boxShadow:'var(--shadow-pop)'}}>
            {allRegions.filter(r => !regions.includes(r)).map(r => (
              <RadioRow key={r} icon="Plus" label={r}
                        onClick={()=>{setRegions([...regions, r]); setShowRegionMenu(false);}}/>
            ))}
            {allRegions.filter(r => !regions.includes(r)).length === 0 && (
              <div className="mute" style={{fontSize:12, padding:8}}>All regions selected.</div>
            )}
          </div>
        )}
      </div>
      <div className="field" style={{position:'relative'}}>
        <div className="field-label"><span className="lbl">Behaviour</span></div>
        <div className="row gap-6 wrap">
          {behaviours.map(b => (
            <Pill key={b} kind="gold">{b} <span style={{cursor:'pointer'}} onClick={()=>setBehaviours(behaviours.filter(x=>x!==b))}>×</span></Pill>
          ))}
          <Btn sm kind="ghost" icon={<Icon name="Plus" size={11}/>} onClick={()=>setShowBehavMenu(!showBehavMenu)}>Add condition</Btn>
        </div>
        {showBehavMenu && (
          <div className="card" style={{padding:6, background:'var(--bg-overlay)', position:'absolute', top:'100%', left:0, zIndex:10, marginTop:6, minWidth:240, boxShadow:'var(--shadow-pop)'}}>
            {allBehaviours.filter(b => !behaviours.includes(b)).map(b => (
              <RadioRow key={b} icon="Plus" label={b}
                        onClick={()=>{setBehaviours([...behaviours, b]); setShowBehavMenu(false);}}/>
            ))}
          </div>
        )}
      </div>
      <div className="field-row">
        <div className="field" style={{margin:0}}>
          <div className="field-label"><span className="lbl">Min Spend</span></div>
          <input className="input" value={minSpend} onChange={(e)=>setMinSpend(e.target.value)} style={{outline:'none'}}/>
        </div>
        <div className="field" style={{margin:0}}>
          <div className="field-label"><span className="lbl">Frequency</span></div>
          <div className="input">Max 1 redemption / member · Non-stackable</div>
        </div>
      </div>

      {/* Save as new segment */}
      <div style={{marginTop:14}}>
        {!savingSegment ? (
          <Btn sm kind="ghost" icon={<Icon name="Plus" size={11}/>} onClick={()=>setSavingSegment(true)}>
            Save these rules as a new segment
          </Btn>
        ) : (
          <div className="save-prompt">
            <span style={{fontSize:12, color:'var(--text-secondary)'}}>Segment name:</span>
            <input value={newSegName} onChange={(e)=>setNewSegName(e.target.value)} autoFocus placeholder="e.g. Lapsed Premium Travelers"
                   onKeyDown={(e)=>{ if (e.key==='Enter') saveSegment(); if (e.key==='Escape') setSavingSegment(false); }}/>
            <Btn sm kind="ghost" onClick={()=>setSavingSegment(false)}>Cancel</Btn>
            <Btn sm kind="primary" onClick={saveSegment}>Save Segment</Btn>
          </div>
        )}
        {segConfirm && (
          <div className="save-confirmation">
            <Icon name="Check" size={14} color="var(--accent-green)"/>
            Saved as <b style={{margin:'0 4px'}}>"{segConfirm}"</b> — available in Segments library
          </div>
        )}
      </div>

      {/* Save as new rule set */}
      <div style={{marginTop:10}}>
        {!savingRule ? (
          <Btn sm kind="ghost" icon={<Icon name="Plus" size={11}/>} onClick={()=>setSavingRule(true)}>
            Save these as a new rule set
          </Btn>
        ) : (
          <div className="save-prompt">
            <span style={{fontSize:12, color:'var(--text-secondary)'}}>Rule set name:</span>
            <input value={newRuleName} onChange={(e)=>setNewRuleName(e.target.value)} autoFocus placeholder="e.g. Tier Recovery Rules"
                   onKeyDown={(e)=>{ if (e.key==='Enter') saveRule(); if (e.key==='Escape') setSavingRule(false); }}/>
            <Btn sm kind="ghost" onClick={()=>setSavingRule(false)}>Cancel</Btn>
            <Btn sm kind="primary" onClick={saveRule}>Save Rule Set</Btn>
          </div>
        )}
        {ruleConfirm && (
          <div className="save-confirmation">
            <Icon name="Check" size={14} color="var(--accent-green)"/>
            Saved as <b style={{margin:'0 4px'}}>"{ruleConfirm}"</b> — available in Rules library
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STEP 3 — Reward Config with inline-editable fields ───
function Step3({ rewardCfg, setRewardCfg, achiOn, setAchiOn }) {
  const [subtab, setSubtab] = useState('offer');

  const Editable = ({ k }) => {
    const [editing, setEditing] = useState(false);
    const [v, setV] = useState(rewardCfg[k]);
    useEffect(()=>{ setV(rewardCfg[k]); }, [rewardCfg[k]]);
    if (editing) {
      return (
        <input className="inline-edit-input mono" autoFocus
               value={v}
               onChange={(e)=>setV(e.target.value)}
               onBlur={()=>{ setRewardCfg(k, v); setEditing(false); }}
               onKeyDown={(e)=>{
                 if (e.key === 'Enter') { setRewardCfg(k, v); setEditing(false); }
                 if (e.key === 'Escape') { setV(rewardCfg[k]); setEditing(false); }
               }}/>
      );
    }
    return (
      <span className="inline-edit mono" onClick={()=>setEditing(true)} style={{fontSize:13}}>{rewardCfg[k]}</span>
    );
  };

  return (
    <div className="col gap-2">
      <div className="lbl-cap" style={{marginBottom:14}}>Step 3 · Reward Configuration</div>

      <div className="tab-bar" style={{marginBottom:18}}>
        <div className={"tab " + (subtab==='offer'?'active':'')} onClick={()=>setSubtab('offer')}>Offer Reward</div>
        <div className={"tab " + (subtab==='achievement'?'active':'')} onClick={()=>setSubtab('achievement')}>Achievement Reward</div>
      </div>

      {subtab === 'offer' && (
        <>
          <div className="field-row">
            <div className="field"><div className="field-label"><span className="lbl">Reward Type</span></div><div className="input"><Editable k="rewardType"/></div></div>
            <div className="field"><div className="field-label"><span className="lbl">Minimum Stay</span></div><div className="input"><Editable k="minStay"/></div></div>
          </div>
          <div className="field-row">
            <div className="field"><div className="field-label"><span className="lbl">Minimum Spend</span></div><div className="input"><Editable k="minSpend"/></div></div>
            <div className="field"><div className="field-label"><span className="lbl">Miles Cap</span></div><div className="input"><Editable k="milesCap"/></div></div>
          </div>
          <div className="field-row">
            <div className="field"><div className="field-label"><span className="lbl">Max per member</span></div><div className="input"><Editable k="maxPer"/></div></div>
            <div className="field">
              <div className="field-label"><span className="lbl">Quota (total)</span></div>
              <div className="input"><Editable k="quota"/></div>
              <div className="mute" style={{fontSize:11, marginTop:4, color:'var(--accent-gold)'}}>↗ Liability updates in right panel as you change this</div>
            </div>
          </div>
        </>
      )}

      {subtab === 'achievement' && (
        <>
          <div className="row between" style={{padding:'14px 16px', background:'var(--bg-overlay)', borderRadius:10, marginBottom:14}}>
            <div>
              <div style={{fontSize:13, fontWeight:500}}>Link this offer to a Reward milestone</div>
              <div className="mute" style={{fontSize:12, marginTop:3}}>Members who redeem progress toward a larger achievement.</div>
            </div>
            <Toggle on={achiOn} onToggle={()=>setAchiOn(!achiOn)}/>
          </div>

          {achiOn && (
            <>
              <div className="field">
                <div className="field-label"><span className="lbl">Earns progress toward</span></div>
                <div className="input select">Summer Skywards Challenge</div>
              </div>
              <div className="field-row">
                <div className="field"><div className="field-label"><span className="lbl">Contribution</span></div><div className="input">+1 milestone step</div></div>
                <div className="field"><div className="field-label"><span className="lbl">Reward on completion</span></div><div className="input select">Gold Badge + Lounge Access</div></div>
              </div>
            </>
          )}
          {!achiOn && (
            <div className="card text-c" style={{padding:'28px 20px', background:'var(--bg-overlay)', fontSize:13}}>
              <div className="mute">Toggle on to link this offer to a Reward milestone.</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── STEP 4 ──────────────────────────────
function Step4({ startDate, setStartDate, endDate, setEndDate,
                 blackouts, setBlackouts, escalations, setEscalations,
                 redemptionLogic, setRedemptionLogic,
                 approvalChoice, setApprovalChoice,
                 fundingConfirmed, setFundingConfirmed }) {
  // Blackout validation: parse blackout dates against campaign window
  // Simple heuristic: dates outside Jun 1 – Jul 31 are flagged
  const inWindow = (s) => {
    if (!s) return true;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthMatch = s.match(/([A-Z][a-z]{2})/);
    if (!monthMatch) return true;
    const monthIdx = months.indexOf(monthMatch[1]);
    return monthIdx >= 5 && monthIdx <= 6; // Jun=5, Jul=6
  };

  const addBlackout = () => {
    const id = Math.max(0, ...blackouts.map(b=>b.id)) + 1;
    setBlackouts([...blackouts, { id, label:'Aug 1', note:'New blackout', valid:false }]);
  };
  const removeBlackout = (id) => setBlackouts(blackouts.filter(b => b.id !== id));
  const updateBlackoutLabel = (id, label) => {
    setBlackouts(blackouts.map(b => b.id === id ? {...b, label, valid: inWindow(label)} : b));
  };

  return (
    <div className="col gap-2">
      <div className="lbl-cap" style={{marginBottom:14}}>Step 4 · Schedule & Operations</div>

      <div className="field-row">
        <div className="field"><div className="field-label"><span className="lbl">Start Date</span></div>
          <input className="input" value={startDate} onChange={(e)=>setStartDate(e.target.value)} style={{outline:'none'}}/>
        </div>
        <div className="field"><div className="field-label"><span className="lbl">End Date</span></div>
          <input className="input" value={endDate} onChange={(e)=>setEndDate(e.target.value)} style={{outline:'none'}}/>
        </div>
      </div>

      <div className="ai-insight">
        <span className="sigil">✦</span>
        <span>Peak UAE travel booking window is <b>June 10 – July 15</b> based on Skywards historical data. Consider prioritizing member notifications in this window.</span>
      </div>

      <div className="field" style={{marginTop:20}}>
        <div className="field-label"><span className="lbl">Blackout Windows</span></div>
        <div className="row gap-6 wrap">
          {blackouts.map(b => (
            <div key={b.id} style={{display:'inline-flex', flexDirection:'column', gap:4}}>
              <Pill kind={b.valid ? 'solid-dark' : 'red'}>
                {b.label} · {b.note}
                <span style={{cursor:'pointer', marginLeft:4}} onClick={()=>removeBlackout(b.id)}>×</span>
              </Pill>
              {!b.valid && (
                <span style={{fontSize:11, color:'var(--accent-red)', marginLeft:2}}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:4}}><Icon name="AlertTriangle" size={11}/> {b.label} is outside your offer window (Jun 1–Jul 31)</span>
                </span>
              )}
            </div>
          ))}
          <Btn sm kind="ghost" icon={<Icon name="Plus" size={11}/>} onClick={addBlackout}>Add Blackout</Btn>
        </div>
      </div>

      <div className="field">
        <div className="field-label"><span className="lbl">Redemption Logic</span></div>
        <div className="card" style={{padding:6, background:'var(--bg-overlay)'}}>
          <RadioRow label="Auto-applied at checkout"
                    active={redemptionLogic==='auto'}
                    onClick={()=>setRedemptionLogic('auto')}/>
          <RadioRow label="Member must claim in-app first"
                    sublabel={<>Claim window: <b style={{color:'var(--text-primary)'}}>7 days</b> after notification</>}
                    active={redemptionLogic==='claim'}
                    onClick={()=>setRedemptionLogic('claim')}/>
        </div>
      </div>

      <div className="field">
        <div className="field-label"><span className="lbl">Approval Required</span></div>
        <div className="card" style={{padding:6, background:'var(--bg-overlay)'}}>
          <RadioRow label="Finance sign-off required"
                    active={approvalChoice==='finance'}
                    onClick={()=>setApprovalChoice('finance')}/>
          <RadioRow label="Marketing Head approval"
                    active={approvalChoice==='marketing'}
                    onClick={()=>setApprovalChoice('marketing')}/>
          <RadioRow label="No approval required — publish directly"
                    sublabel="Offer publishes immediately to Scheduled or Live state."
                    active={approvalChoice==='none'}
                    onClick={()=>setApprovalChoice('none')}/>
        </div>
        {approvalChoice !== 'none' && (
          <div className="field-row" style={{marginTop:10}}>
            <div className="field" style={{margin:0}}>
              <div className="field-label"><span className="lbl">Approver</span></div>
              <div className="input">{approvalChoice === 'finance' ? 'Finance Lead' : 'Marketing Head'}</div>
            </div>
            <div className="field" style={{margin:0}}>
              <div className="field-label"><span className="lbl">SLA</span></div>
              <div className="input">2 business days</div>
            </div>
          </div>
        )}
      </div>

      <div className="field">
        <div className="field-label"><span className="lbl">Sponsor Funding</span></div>
        <div className="ai-insight" style={{padding:'10px 12px', borderLeftColor: fundingConfirmed ? 'var(--accent-green)' : 'var(--accent-amber)', background: fundingConfirmed ? 'rgba(45,212,160,0.06)' : 'rgba(245,158,11,0.06)'}}>
          {fundingConfirmed ? (
            <>
              <Icon name="Check" size={14} color="var(--accent-green)"/>
              <div style={{flex:1, fontSize:12}}>
                <div style={{color:'var(--text-primary)', marginBottom:4}}>Confirmed — Marriott Bonvoy</div>
                <span className="lnk" style={{color:'var(--accent-amber)', cursor:'pointer'}} onClick={()=>setFundingConfirmed(false)}>Mark as pending</span>
              </div>
            </>
          ) : (
            <>
              <Icon name="AlertTriangle" size={14} color="var(--accent-amber)"/>
              <div style={{flex:1, fontSize:12}}>
                <div style={{color:'var(--text-primary)', marginBottom:6}}>Pending — Confirmation required from Marriott Bonvoy</div>
                <div className="row gap-12">
                  <span className="lnk" style={{display:'inline-flex', alignItems:'center', gap:4, color:'var(--accent-amber)', cursor:'pointer'}} onClick={()=>setFundingConfirmed(true)}>Mark as confirmed <Icon name="ArrowRight" size={11}/></span>
                  <span className="lnk" style={{display:'inline-flex', alignItems:'center', gap:4, color:'var(--accent-amber)', cursor:'pointer'}}>Send Funding Request <Icon name="ArrowRight" size={11}/></span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="field">
        <div className="field-label"><span className="lbl">Escalation Rules</span></div>
        <div className="row gap-6 wrap">
          {escalations.map(e => (
            <Pill key={e.id} kind="solid-dark">
              <span style={{display:'inline-flex', alignItems:'center', gap:4}}>{e.trigger} <Icon name="ArrowRight" size={11}/> {e.action}</span>
              <span style={{cursor:'pointer', marginLeft:6}} onClick={()=>setEscalations(escalations.filter(x=>x.id!==e.id))}>×</span>
            </Pill>
          ))}
          <Btn sm kind="ghost" icon={<Icon name="Plus" size={11}/>}
               onClick={()=>setEscalations([...escalations, {id:'esc-'+Date.now(), trigger:'At 50% quota', action:'Send mid-offer report'}])}>Add Rule</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 5 ───────────────────────────────
function Step5({ arabicComplete, setArabicComplete, fundingComplete, setFundingComplete,
                 approvalChoice, hasBlackoutConflict, regionsCount }) {
  return (
    <div className="col gap-2">
      <div className="lbl-cap" style={{marginBottom:14}}>Step 5 · Review</div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
        {[
          {ok:true, t:'Offer Details', s:'Marriott Bonvoy · BOGO · CTA: Unlock Offer · Priority High'},
          {ok: !hasBlackoutConflict, t:'Audience & Rules', s:`Lapsed Gold Members · Premium Member Rules · ${regionsCount} regions · Est. reach: 45,200`},
          {ok: fundingComplete && !hasBlackoutConflict, t:'Schedule & Operations', s:`${approvalChoice === 'none' ? 'Publish directly' : approvalChoice === 'finance' ? 'Finance sign-off' : 'Marketing Head approval'} · ${fundingComplete ? 'Funding confirmed' : 'Funding pending'}`},
          {ok:true, t:'Reward Configuration', s:'BOGO 1 free night · Min 2 nights · Quota 25,000 · Max 1/member'},
        ].map((c,i)=>(
          <div key={i} className="card" style={{padding:14, borderLeft: `3px solid ${c.ok?'var(--accent-green)':'var(--accent-amber)'}`}}>
            <div className="row between" style={{marginBottom:6}}>
              <div className="row gap-6" style={{fontSize:13, fontWeight:500}}>
                {c.ok ? <Icon name="Check" size={14} color="var(--accent-green)"/> : <Icon name="AlertTriangle" size={14} color="var(--accent-amber)"/>}
                {c.t}
              </div>
              <span className="btn-link" style={{display:'inline-flex', alignItems:'center', gap:4}}>Edit <Icon name="ArrowRight" size={11}/></span>
            </div>
            <div className="mute" style={{fontSize:12, lineHeight:1.5}}>{c.s}</div>
          </div>
        ))}
      </div>

      <div className="ai-insight" style={{marginTop:18, flexDirection:'column', gap:14, padding:'16px 18px', alignItems:'stretch'}}>
        <div className="row gap-8"><span className="sigil" style={{fontSize:18}}>✦</span>
          <span className="lbl-cap" style={{color:'#8B5CF6'}}>AI Confidence Indicator</span>
        </div>
        <div style={{fontSize:13, color:'var(--text-secondary)'}}>Based on 14 similar offers targeting Gold tier members during peak UAE summer travel:</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
          {[
            {l:'Expected redemptions', v:'2,800 – 4,200'},
            {l:'Expected rate',        v:'14 – 22%'},
            {l:'Reward liability',     v:'AED 900K – 1.4M'}
          ].map((m,i)=>(
            <div key={i}>
              <div className="lbl-cap">{m.l}</div>
              <div className="sora" style={{fontSize:18, fontWeight:600, color:'var(--text-primary)', marginTop:4}}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{padding:16, marginTop:16}}>
        <div className="row gap-6" style={{marginBottom:12}}>
          <Sigil size={14}/>
          <span className="lbl-cap" style={{color:'var(--accent-gold)'}}>Pre-Launch Checklist</span>
        </div>
        {[
          {ok:true, t:'Audience size sufficient for meaningful data'},
          {ok:true, t:'Reward liability within acceptable range'},
          {ok: arabicComplete, t: arabicComplete ? 'Arabic translation complete' : 'Arabic translation incomplete — English shown for Arabic speakers',
            cta: arabicComplete ? null : <>Fix Now <Icon name="ArrowRight" size={11}/></>, ctaFn: ()=>setArabicComplete(true)},
          {ok: fundingComplete, t: fundingComplete ? 'Sponsor funding from Marriott Bonvoy confirmed' : 'Sponsor funding from Marriott Bonvoy pending',
            cta: fundingComplete ? null : <>Confirm <Icon name="ArrowRight" size={11}/></>, ctaFn: ()=>setFundingComplete(true)},
          {ok: !hasBlackoutConflict, t: hasBlackoutConflict ? 'Blackout dates have conflicts — review Step 4' : 'Blackout dates configured and conflict-free'},
          {ok:true, t:'Offer aligns with peak UAE summer window'},
          {ok:true, t:'Non-stackable rule confirmed — exclusive offer'},
        ].map((c,i)=>(
          <div key={i} className="row between" style={{padding:'7px 0', borderTop: i>0?'1px solid var(--border-subtle)':'none', fontSize:13}}>
            <span className="row gap-8">
              {c.ok ? <Icon name="Check" size={13} color="var(--accent-green)"/> : <Icon name="AlertTriangle" size={13} color="var(--accent-amber)"/>}
              <span style={{color: c.ok ? 'var(--text-primary)' : 'var(--text-secondary)'}}>{c.t}</span>
            </span>
            {c.cta && <span className="btn-link" onClick={c.ctaFn}>{c.cta}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LIVE PREVIEW ─────────────────────────
function LivePreview({ step, previewKind, setPreviewKind, previewMode, setPreviewMode,
                       mechanic, tiers, liability, liabilityPulse, onFullPreview }) {
  return (
    <div className="card" style={{padding:18, position:'relative'}}>
      <div className="row between" style={{marginBottom:12}}>
        <span className="lbl-cap">Live Preview</span>
        <div className="row gap-6">
          <div className="row gap-2" style={{padding:2, background:'var(--bg-overlay)', borderRadius:6}}>
            <button className="btn icon-only sm ghost" onClick={()=>setPreviewKind('mobile')}
                    style={{background:previewKind==='mobile'?'var(--bg-elevated)':'transparent', color:previewKind==='mobile'?'var(--accent-gold)':'var(--text-secondary)', width:28, height:28}}>
              <Icon name="Smartphone" size={13}/>
            </button>
            <button className="btn icon-only sm ghost" onClick={()=>setPreviewKind('web')}
                    style={{background:previewKind==='web'?'var(--bg-elevated)':'transparent', color:previewKind==='web'?'var(--accent-gold)':'var(--text-secondary)', width:28, height:28}}>
              <Icon name="Monitor" size={13}/>
            </button>
          </div>
          {onFullPreview && (
            <button className="btn sm ghost" style={{fontSize:12}} onClick={onFullPreview}>⤢ Full Preview</button>
          )}
        </div>
      </div>

      {previewKind === 'mobile' ? (
        <OfferMobileCard step={step} previewMode={previewMode} setPreviewMode={setPreviewMode} mechanic={mechanic} tiers={tiers}/>
      ) : (
        <OfferWebCard mechanic={mechanic} tiers={tiers} previewMode={previewMode} setPreviewMode={setPreviewMode}/>
      )}

      <div className="divider" style={{margin:'14px 0'}}/>
      <div className="mute" style={{fontSize:11, lineHeight:1.5}}>
        <span style={{color:'var(--accent-gold)'}}>↻</span> Preview updates as you fill in fields. Currently showing data from Step{step>1?'s 1–':' '}{step}.
      </div>
    </div>
  );
}

// ─── Reusable Mobile Offer Card ───
function OfferMobileCard({ step, previewMode, setPreviewMode, mechanic, tiers, fullSize }) {
  const tierList = tiers ? Array.from(tiers) : ['Gold'];
  return (
    <div className="col gap-12">
      {setPreviewMode && (
        <div className="row gap-4">
          <FilterChip label="Card View"     active={previewMode==='card'}     onClick={()=>setPreviewMode('card')}/>
          <FilterChip label="Expanded View" active={previewMode==='expanded'} onClick={()=>setPreviewMode('expanded')}/>
        </div>
      )}
      <div className="phone-frame" style={fullSize ? {width: 375} : {}}>
        <div className="phone-screen">
          <div className="row between" style={{padding:'8px 14px', fontSize:10, color:'var(--text-secondary)'}}>
            <span className="mono">9:41</span><span>● ● ●</span>
          </div>
          <div className="row between" style={{padding:'4px 14px 8px'}}>
            <span className="sora" style={{fontSize:14, fontWeight:600}}>Offers</span>
            <span className="mute" style={{fontSize:14}}>⌕  ⋯</span>
          </div>
          <div className="banner-ph">
            <span style={{fontSize:11, color:'#0A0C10', fontWeight:600, opacity:.7}}>Marriott Bonvoy · Summer Bonus</span>
          </div>

          {(previewMode === 'card' || !previewMode) ? (
            <div style={{padding:'14px'}}>
              <div className="row gap-6" style={{marginBottom:6, flexWrap:'wrap'}}>
                {step >= 4 && <Pill kind="gold" style={{fontSize:9, padding:'2px 6px'}}><Icon name="Star" size={10}/> Elite Favorite</Pill>}
                {step >= 4 && <Pill kind="orange" style={{fontSize:9, padding:'2px 6px'}}><Icon name="Clock" size={10}/> Expiring 60 days</Pill>}
              </div>
              <div className="sora" style={{fontSize:13, fontWeight:600, marginBottom:2}}>Marriott Bonvoy</div>
              <div style={{fontSize:11, color:'var(--text-secondary)', marginBottom:10}}>Flat 50% Off Weekend Stays</div>

              <MechanicHeadline mechanic={mechanic}/>

              {step >= 2 && (
                <div className="row gap-4 wrap" style={{marginTop:10}}>
                  {tierList.map(t => (
                    <Pill key={t} kind={t === 'Gold' ? 'gold' : t === 'Platinum' ? 'plat' : t === 'Blue' ? 'blue' : 'solid-dark'} style={{fontSize:9, padding:'2px 6px'}}>{t}</Pill>
                  ))}
                  <span style={{fontSize:10, color:'var(--text-muted)'}}>· Min 2 nights</span>
                </div>
              )}

              <button className="btn primary" style={{width:'100%', justifyContent:'center', marginTop:14, fontSize:12, height:34}}>Unlock Offer</button>
              <div className="row gap-6" style={{marginTop:8}}>
                <button className="btn sm ghost" style={{flex:1, justifyContent:'center'}}><Icon name="Bookmark" size={11}/> Save</button>
                <button className="btn sm ghost" style={{flex:1, justifyContent:'center'}}><Icon name="Share" size={11}/> Share</button>
              </div>
            </div>
          ) : (
            <div style={{padding:'14px'}}>
              <div className="row gap-6" style={{marginBottom:6, flexWrap:'wrap'}}>
                <Pill kind="gold" style={{fontSize:9, padding:'2px 6px'}}><Icon name="Star" size={10}/> Elite Favorite</Pill>
                <Pill kind="orange" style={{fontSize:9, padding:'2px 6px'}}><Icon name="Clock" size={10}/> Expiring 60 days</Pill>
              </div>
              <div className="sora" style={{fontSize:13, fontWeight:600}}>Marriott Bonvoy</div>
              <div style={{fontSize:11, color:'var(--text-secondary)', marginBottom:10}}>Flat 50% Off Weekend Stays</div>
              <MechanicHeadline mechanic={mechanic}/>
              <div className="divider" style={{margin:'10px 0'}}/>
              <div className="sora" style={{fontSize:11, fontWeight:600, marginBottom:6}}>How to Redeem</div>
              <ol style={{paddingLeft:16, color:'var(--text-secondary)', fontSize:11, lineHeight:1.5, margin:'0 0 10px'}}>
                <li>Tap Unlock Offer to claim</li>
                <li>Book any Marriott UAE property</li>
                <li>Get 1 night free with 2-night stay</li>
              </ol>
              <div className="sora" style={{fontSize:11, fontWeight:600, marginBottom:4}}>Terms & Conditions <span style={{color:'var(--accent-gold)'}}>▾</span></div>
              <div className="mute" style={{fontSize:10, lineHeight:1.5, marginBottom:10}}>
                Valid Jun 1 – Jul 31, 2024 · Gold and Platinum tier members only · Excludes peak holiday dates · Subject to availability · 7-day claim window after notification.
              </div>
              <button className="btn primary" style={{width:'100%', justifyContent:'center', fontSize:12, height:34}}>Unlock Offer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MechanicHeadline({ mechanic }) {
  if (mechanic === 'BOGO') return <>
    <div className="sora" style={{fontSize:24, fontWeight:700, lineHeight:1.1, color:'var(--accent-gold)'}}>Buy 1 Night</div>
    <div className="sora" style={{fontSize:20, fontWeight:600, lineHeight:1.2, color:'var(--text-primary)'}}>Get 1 Night Free</div>
  </>;
  if (mechanic === 'Cashback') return <>
    <div className="sora" style={{fontSize:28, fontWeight:700, lineHeight:1.1, color:'var(--accent-gold)'}}>5% Cashback</div>
    <div style={{fontSize:12, marginTop:4, color:'var(--text-secondary)'}}>on every booking</div>
  </>;
  if (mechanic === 'Points ×N') return <>
    <div className="sora" style={{fontSize:30, fontWeight:700, lineHeight:1, color:'var(--accent-gold)'}}>3×</div>
    <div className="sora" style={{fontSize:18, fontWeight:600, marginTop:2}}>Skywards Miles</div>
  </>;
  if (mechanic === 'Flat Off') return <>
    <div className="sora" style={{fontSize:30, fontWeight:700, lineHeight:1, color:'var(--accent-gold)'}}>50% Off</div>
    <div className="sora" style={{fontSize:14, fontWeight:600, marginTop:2}}>Weekend Stays</div>
  </>;
  if (mechanic === 'Voucher') return <>
    <div className="sora" style={{fontSize:22, fontWeight:700, lineHeight:1.1, color:'var(--accent-gold)'}}>AED 500</div>
    <div className="sora" style={{fontSize:14, fontWeight:600, marginTop:2}}>Gift Voucher</div>
  </>;
  if (mechanic === 'Cause') return <>
    <div className="sora" style={{fontSize:18, fontWeight:700, color:'var(--accent-gold)'}}>10% to charity</div>
  </>;
  return null;
}

// ─── Reusable Web Offer Card ───
function OfferWebCard({ mechanic, tiers, fullSize, previewMode, setPreviewMode }) {
  const W = fullSize ? 600 : 'auto';
  const isExpanded = previewMode === 'expanded';
  return (
    <div className="col gap-12">
      {setPreviewMode && fullSize && (
        <div className="row gap-4" style={{justifyContent:'center'}}>
          <FilterChip label="Card View"     active={previewMode==='card'}     onClick={()=>setPreviewMode('card')}/>
          <FilterChip label="Expanded View" active={previewMode==='expanded'} onClick={()=>setPreviewMode('expanded')}/>
        </div>
      )}
      <div className="card" style={{padding:0, overflow:'hidden', borderRadius:10, width:W, margin:fullSize?'0 auto':0}}>
        <div className="banner-ph" style={{height:fullSize?160:80}}>
          <span style={{fontSize:fullSize?14:11, color:'#0A0C10', fontWeight:600, opacity:.7}}>Marriott Bonvoy</span>
        </div>
        <div style={{padding:fullSize?28:16}}>
          <div className="row gap-6 wrap" style={{marginBottom:8}}>
            <Pill kind="gold" style={{fontSize:10}}><Icon name="Star" size={10}/> Elite Favorite</Pill>
            <Pill kind="orange" style={{fontSize:10}}><Icon name="Clock" size={10}/> 60 days</Pill>
          </div>
          <div className="row between">
            <div>
              <div className="sora" style={{fontSize:fullSize?22:16, fontWeight:600}}>Flat 50% Off Weekend Stays</div>
              <div className="mute" style={{fontSize:11, marginTop:2}}>Marriott Bonvoy · {tiers ? Array.from(tiers).join(' · ') : 'Gold · Platinum'}</div>
            </div>
            <div className="text-c">
              <div className="sora" style={{fontSize:fullSize?28:22, fontWeight:700, color:'var(--accent-gold)', lineHeight:1}}>
                {mechanic === 'BOGO' ? 'BOGO' : mechanic === 'Cashback' ? '5%' : mechanic === 'Points ×N' ? '3×' : mechanic === 'Voucher' ? 'AED 500' : '50% Off'}
              </div>
              <div className="mute" style={{fontSize:10, marginTop:4}}>Min 2 nights</div>
            </div>
          </div>
          {isExpanded && fullSize && (
            <>
              <div className="divider" style={{margin:'16px 0'}}/>
              <div className="sora" style={{fontSize:14, fontWeight:600, marginBottom:8}}>How to Redeem</div>
              <ol style={{paddingLeft:18, color:'var(--text-secondary)', fontSize:13, lineHeight:1.6, margin:0}}>
                <li>Tap Unlock Offer to claim</li>
                <li>Book any Marriott UAE property</li>
                <li>Get 1 night free with 2-night stay</li>
              </ol>
              <div className="divider" style={{margin:'16px 0'}}/>
              <div className="sora" style={{fontSize:14, fontWeight:600, marginBottom:6}}>Terms & Conditions <span style={{color:'var(--accent-gold)'}}>▾</span></div>
              <div className="mute" style={{fontSize:12, lineHeight:1.5}}>
                Valid Jun 1 – Jul 31, 2024 · Gold and Platinum tier members only · Excludes peak holiday dates · Subject to availability · 7-day claim window after notification.
              </div>
            </>
          )}
          <button className="btn primary" style={{width:'100%', justifyContent:'center', marginTop:14}}>Unlock Offer</button>
        </div>
      </div>
    </div>
  );
}

// ─── FULL PREVIEW MODAL ───
function FullPreviewModal({ open, onClose, mechanic, tiers }) {
  const [mode, setMode] = useState('card');
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={"modal-scrim " + (open?'open':'')} onClick={(e)=>{ if (e.target === e.currentTarget) onClose(); }}
         style={{left:56, top:84, width:'calc(100vw - 56px)', height:'calc(100vh - 84px)', position:'fixed', zIndex:800, background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)', display: open ? 'flex' : 'none', alignItems:'center', justifyContent:'center'}}>
      <div className="modal-frame" style={{position:'relative', width:'calc(100% - 48px)', height:'calc(100% - 48px)', maxWidth:'none', maxHeight:'none', borderRadius:12, transform:'none', margin:0}}>
        <div className="modal-head">
          <div className="row gap-8">
            <span className="sora" style={{fontSize:16, fontWeight:600}}>Full Preview</span>
            <Pill kind="gold">Tier Recovery Offer</Pill>
          </div>
          <div className="row gap-10">
            <div className="row gap-4" style={{padding:2, background:'var(--bg-overlay)', borderRadius:6}}>
              <FilterChip label="Card View"     active={mode==='card'}     onClick={()=>setMode('card')}/>
              <FilterChip label="Expanded View" active={mode==='expanded'} onClick={()=>setMode('expanded')}/>
            </div>
            <button className="icon-btn" onClick={onClose}><Icon name="X" size={16}/></button>
          </div>
        </div>
        <div className="modal-body" style={{padding:40}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:14, flex:'0 0 auto'}}>
            <div className="row gap-6">
              <Icon name="Smartphone" size={14} color="var(--accent-gold)"/>
              <span className="lbl-cap" style={{color:'var(--accent-gold)'}}>Mobile · 375px</span>
            </div>
            <OfferMobileCard step={5} previewMode={mode} mechanic={mechanic} tiers={tiers} fullSize/>
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:14, maxWidth:680, flex:1, minWidth:0}}>
            <div className="row gap-6">
              <Icon name="Monitor" size={14} color="var(--accent-gold)"/>
              <span className="lbl-cap" style={{color:'var(--accent-gold)'}}>Web · 600px</span>
            </div>
            <OfferWebCard mechanic={mechanic} tiers={tiers} previewMode={mode} fullSize/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SUBMISSION CONFIRMATION ─────────────
function SubmissionConfirm({ goTo, published, title, campaignId }) {
  return (
    <PageLayout>
     <div style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 84px - 64px)'}}>
      <div className="card" style={{maxWidth:640, width:'100%', margin:0, padding:'20px 28px', display:'flex', flexDirection:'column', alignItems:'center'}}>
        <div className="success-stage" style={{padding:0, gap:6, width:'100%'}}>
          <dotlottie-wc
            src="Sources/Approve.lottie"
            autoplay
            loop
            style={{width:120, height:120, display:'block'}}
          />
          <h1 className="h-page" style={{textAlign:'center', fontSize:22, margin:0}}>{published ? 'Offer Published' : 'Offer Submitted for Approval'}</h1>
          <div className="mono mute" style={{fontSize:11, letterSpacing:'.05em'}}>{campaignId || 'EMSK_GOLD_RECOV_JUN24'}</div>
          <div className="row gap-6" style={{justifyContent:'center', marginTop:2}}>
            <Pill kind="solid-dark">BOGO</Pill>
            <Pill kind="gold">Gold Tier</Pill>
            <Pill>UAE · 4 Regions</Pill>
          </div>
          <div className="mute" style={{fontSize:12, marginTop:2, textAlign:'center'}}>
            {published
              ? <>Live on the platform now. Members will see it shortly.</>
              : <>Awaiting Finance review — estimated by <b style={{color:'var(--text-primary)'}}>May 16</b></>}
          </div>
        </div>

        <div className="divider" style={{margin:'14px 0', width:'100%'}}/>

        <div style={{width:'100%'}}>
          <div className="lbl-cap" style={{marginBottom:8}}>Status Timeline</div>
          <div className="timeline">
            <div className="tnode past"><div className="tdate">MAY 14</div><div className="ttitle">Draft Created</div></div>
            <div className="tnode now"><div className="tdate">MAY 14 · TODAY</div><div className="ttitle">{published ? 'Published' : 'Submitted for Approval'}</div><div className="tsub">By Priya Mehta</div></div>
            {!published && <div className="tnode future"><div className="tdate">EST. MAY 16</div><div className="ttitle">Finance Review</div></div>}
            <div className="tnode future"><div className="tdate">SCHEDULED JUN 1</div><div className="ttitle">Offer Live</div></div>
          </div>
        </div>

        <div className="row gap-8" style={{justifyContent:'center', marginTop:16}}>
          <Btn kind="ghost">View Offer Details</Btn>
          <Btn kind="primary" onClick={()=>goTo('offers')}>Return to Offer List <Icon name="ArrowRight" size={13}/></Btn>
        </div>
      </div>
     </div>
    </PageLayout>
  );
}

window.Editor = Editor;
