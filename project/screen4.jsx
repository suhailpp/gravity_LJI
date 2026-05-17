// Screen 4 — Offer Editor (5 steps + mobile preview)
function Screen4({ goTo }) {
  const [step, setStep] = useState(1);
  const [showAlts, setShowAlts] = useState(false);
  const [localOn, setLocalOn] = useState(true);
  const [multiSponsor, setMultiSponsor] = useState(false);
  const [hero, setHero] = useState(true);
  const [urgency, setUrgency] = useState(true);
  const [share, setShare] = useState(true);
  const [gam, setGam] = useState(true);
  const [phoneCtx, setPhoneCtx] = useState('feed');

  const steps = [
    {n:1, name:'Basic Details', frac:'7/9'},
    {n:2, name:'Eligibility', frac:'5/5'},
    {n:3, name:'Operational Rules', frac:'4/6'},
    {n:4, name:'Mobile Experience', frac:'6/6'},
    {n:5, name:'Review', frac:'—'},
  ];

  return (
    <div className="content" style={{padding:'14px 22px 30px'}}>
      <div className="row between" style={{alignItems:'end'}}>
        <div>
          <ScribbleHeading size={36}>Create Offer</ScribbleHeading>
          <div className="text-mute text-md">Tier Recovery Offer · template pre-filled</div>
        </div>
        <div className="row gap-8">
          <Btn kind="ghost" sm>Save as Draft</Btn>
          <Btn kind="ghost" sm>Preview</Btn>
        </div>
      </div>

      {/* Step indicator */}
      <div className="steps mt-12">
        {steps.map(s => (
          <div key={s.n} className={"step " + (step===s.n?'active':'')} onClick={()=>setStep(s.n)}>
            <div className="row gap-8">
              <span className="s-num">{['①','②','③','④','⑤'][s.n-1]}</span>
              <span className="s-name">{s.name}</span>
            </div>
            <div className="s-frac">{s.frac}</div>
          </div>
        ))}
      </div>

      <div className="row gap-16 mt-16" style={{alignItems:'flex-start'}}>
        {/* LEFT PANEL */}
        <div style={{flex:'0 0 60%'}}>
          {step === 1 && (
            <div>
              <div className="field">
                <div className="field-label">
                  <span>Offer Title (Public-facing)</span>
                  <span className="h-hand" style={{color:'var(--amber)', cursor:'pointer'}} onClick={()=>setShowAlts(!showAlts)}>✨ Suggest Alternatives</span>
                </div>
                <div className="input">Your Gold Status Deserves More — Summer Bonus Inside</div>
                {showAlts && (
                  <div className="sk-soft mt-8" style={{padding:10}}>
                    <div className="text-mute text-sm h-hand" style={{fontWeight:700, marginBottom:6}}>Alternative titles:</div>
                    {[
                      'Gold Members: Earn 3x This Summer',
                      'Your Loyalty Pays Off — Summer Points Inside',
                      'Exclusive Summer Offer for Gold Members'
                    ].map((s,i)=>(
                      <div key={i} className="row between" style={{padding:'4px 0', borderBottom:'1px dashed var(--ink)'}}>
                        <span>{s}</span><Btn sm kind="ghost">Use</Btn>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="field">
                <div className="field-label">Internal Campaign Name</div>
                <div className="input mono">APAC_GOLD_SUMREC_2024</div>
              </div>
              <div className="grid g-2" style={{gap:14}}>
                <div className="field">
                  <div className="field-label">Campaign Objective</div>
                  <div className="input">Re-engagement <span style={{float:'right'}}>▾</span></div>
                </div>
                <div className="field">
                  <div className="field-label">Sponsor</div>
                  <div className="input row between">
                    <span><span className="logo-sq" style={{width:22, height:22, fontSize:10, marginRight:6, display:'inline-flex'}}>MH</span> Meridian</span>
                    <span>⌕</span>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="field-label">Description</div>
                <div className="input textarea">You've earned Gold — now make the most of it. Book any 2-night stay this summer and earn 3x points, plus an exclusive late checkout upgrade.</div>
              </div>
              <div className="grid g-2" style={{gap:14}}>
                <div className="field">
                  <div className="field-label">Multi-sponsor</div>
                  <Toggle on={multiSponsor} label={multiSponsor?'On':'Off'} onToggle={()=>setMultiSponsor(!multiSponsor)}/>
                </div>
                <div className="field">
                  <div className="field-label">Offer Imagery</div>
                  <div className="sk-dash" style={{padding:'18px', textAlign:'center'}}>
                    <div>⬆ Upload Banner Image</div>
                    <div className="text-sm text-mute mt-4"><a style={{borderBottom:'1.5px solid var(--ink)'}}>Use Asset Library</a></div>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="field-label">Offer Type / Reward Mechanic</div>
                <div className="row gap-8 wrap">
                  <Pill kind="gold">Tier Exclusive ×</Pill>
                  <Pill kind="gold">Cashback ×</Pill>
                  <Btn kind="ghost" sm>+ Add Type</Btn>
                </div>
              </div>
              <div className="grid g-2" style={{gap:14}}>
                <div className="field">
                  <div className="field-label">Reward Value</div>
                  <div className="input">Points Multiplier: <b>3x Points</b></div>
                  <div className="input mt-4">Cashback: <b>5%</b> on room rate · Min. ₹8,000</div>
                </div>
                <div className="field">
                  <div className="field-label">CTA Label</div>
                  <div className="input">Unlock Offer <span style={{float:'right'}}>▾</span></div>
                  <div className="field-label mt-12">Priority Level</div>
                  <div className="sk-soft" style={{padding:'8px 10px'}}>
                    <div className="row between text-sm text-mute"><span>Low</span><span>Med</span><span style={{fontWeight:700, color:'var(--ink)'}}>High ◉</span></div>
                    <div style={{height:8, background:'var(--paper-2)', border:'1.5px solid var(--ink)', borderRadius:6, marginTop:6, position:'relative'}}>
                      <div style={{width:'88%', height:'100%', background:'var(--gold)', borderRadius:6}}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="field-label">
                  <span>Localization</span>
                  <Toggle on={localOn} label={localOn?'On':'Off'} onToggle={()=>setLocalOn(!localOn)}/>
                </div>
                {localOn && (
                  <div className="sk-soft" style={{padding:10}}>
                    {[
                      {f:'🇬🇧', l:'English (Default)', s:'✅ Complete', sk:'green'},
                      {f:'🇮🇳', l:'Hindi', s:'⚠ Translation pending', sk:'amber'},
                      {f:'🇹🇭', l:'Thai', s:'⚠ Translation pending', sk:'amber'},
                      {f:'🇮🇩', l:'Bahasa Indonesia', s:'⚠ Translation pending', sk:'amber'},
                    ].map((r,i)=>(
                      <div key={i} className="row between" style={{padding:'4px 0', borderBottom:'1px dashed var(--ink)'}}>
                        <span><span style={{marginRight:8}}>{r.f}</span>{r.l}</span>
                        <Pill kind={r.sk}>{r.s}</Pill>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="field">
                <div className="field-label">Target Segments</div>
                <div className="row gap-8 wrap">
                  <Pill kind="gold">Lapsed 30–90 days ×</Pill>
                  <Pill kind="gold">Loyalty Tier = Gold ×</Pill>
                  <Btn kind="ghost" sm>+ Add Condition</Btn>
                </div>
              </div>
              <div className="insight-card green mt-12" style={{borderLeftWidth:6}}>
                <p style={{margin:0}}>✓ Estimated eligible members: <b>~112,000</b> across selected regions</p>
              </div>
              <div className="field mt-16">
                <div className="field-label">Tier Selector</div>
                <div className="row gap-8">
                  <Pill>⬜ Silver</Pill>
                  <Pill kind="gold">✅ Gold</Pill>
                  <Pill>⬜ Platinum</Pill>
                </div>
              </div>
              <div className="field">
                <div className="field-label">Geography</div>
                <div className="row gap-8 wrap">
                  <Pill>🇮🇳 India — All States ×</Pill>
                  <Pill>🇹🇭 Thailand — Bangkok · Phuket · Chiang Mai ×</Pill>
                  <Pill>🇸🇬 Singapore — All ×</Pill>
                  <Pill>🇮🇩 Indonesia — Bali · Jakarta ×</Pill>
                  <Btn kind="ghost" sm>+ Add Region</Btn>
                </div>
              </div>
              <div className="grid g-2" style={{gap:14}}>
                <div className="field">
                  <div className="field-label">Spend Threshold</div>
                  <div className="input">Min booking: ₹8,000</div>
                  <div className="input mt-4">Min stay: 2 nights</div>
                </div>
                <div className="field">
                  <div className="field-label">Frequency Rules</div>
                  <div className="input">Max per member: 1 redemption</div>
                  <div className="input mt-4">Stackable: No (Exclusive)</div>
                </div>
              </div>
              <div className="field">
                <div className="field-label">Redemption Quota</div>
                <div className="input">Global cap: 25,000 redemptions</div>
                <div className="insight-card amber mt-8" style={{borderLeftWidth:6}}>
                  <p style={{margin:0}}>💡 Estimated reward liability at full redemption: <b>₹4.2M</b> equivalent</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="field">
                <div className="field-label">Campaign Schedule</div>
                <div className="row gap-8">
                  <div className="input" style={{flex:1}}>Jun 1, 2024</div>
                  <span>→</span>
                  <div className="input" style={{flex:1}}>Jul 31, 2024</div>
                </div>
              </div>
              <div className="insight-card" style={{borderLeftColor:'var(--gold)', borderLeftWidth:6, background:'#faecc4'}}>
                <div className="row gap-6"><span className="h-display text-xl">✦</span><b className="h-hand">Timing insight</b></div>
                <p>Peak APAC summer booking window is <b>June 10–July 15</b> based on historical data. Consider prioritizing member notifications in this window.</p>
              </div>
              <div className="field mt-16">
                <div className="field-label">Blackout Windows</div>
                <div className="row gap-8 wrap">
                  <Pill>Jun 15–Jun 17 · System migration ×</Pill>
                  <Btn kind="ghost" sm>+ Add Blackout</Btn>
                </div>
              </div>
              <div className="field">
                <div className="field-label">Redemption Logic</div>
                <div className="sk-soft" style={{padding:10}}>
                  <div className="row gap-8" style={{padding:'4px 0'}}>
                    <span>⚪</span><span>Auto-applied at checkout</span>
                  </div>
                  <div className="row gap-8" style={{padding:'4px 0'}}>
                    <span style={{color:'var(--gold)', fontSize:18}}>●</span>
                    <span style={{fontWeight:700}}>Member must claim in-app first</span>
                    <span className="text-mute text-sm">(selected)</span>
                  </div>
                  <div className="text-sm mt-4 text-mute">Claim window: <b style={{color:'var(--ink)'}}>7 days after notification</b></div>
                </div>
              </div>
              <div className="grid g-2" style={{gap:14}}>
                <div className="field">
                  <div className="field-label">Approval Requirements</div>
                  <div className="input">Finance sign-off required</div>
                  <div className="input mt-4">Approver: <b>Finance Lead</b></div>
                  <div className="input mt-4">SLA: 2 business days</div>
                </div>
                <div className="field">
                  <div className="field-label">Sponsor Funding</div>
                  <div className="insight-card amber" style={{borderLeftWidth:6}}>
                    <p style={{margin:0}}>⚠ Pending — Confirmation required from Meridian</p>
                    <div className="mt-8"><Btn kind="ghost" sm style={{color:'var(--amber)', borderColor:'var(--amber)'}}>Send Funding Request →</Btn></div>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="field-label">Escalation States</div>
                <div className="sk-soft" style={{padding:10}}>
                  <div style={{padding:'4px 0', borderBottom:'1px dashed var(--ink)'}}>At <b>80%</b> quota consumed → Notify Marketing Lead</div>
                  <div style={{padding:'4px 0'}}>At <b>100%</b> → Auto-pause offer</div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="field">
                <div className="field-label">
                  <span>Hero Treatment</span>
                  <Toggle on={hero} onToggle={()=>setHero(!hero)} label={hero?'On':'Off'}/>
                </div>
                <div className="text-sm text-mute">Feature as Hero Card on member home screen</div>
              </div>
              <div className="field">
                <div className="field-label">Banner Format</div>
                <div className="grid g-3" style={{gap:10}}>
                  {[
                    {n:'Full-width immersive', sel:true, h:60, sty:{background:'repeating-linear-gradient(45deg, #f6dc8a, #f6dc8a 6px, var(--gold) 6px, var(--gold) 12px)'}},
                    {n:'Compact card', sel:false, h:46, sty:{}},
                    {n:'Minimal strip', sel:false, h:18, sty:{}},
                  ].map((b,i)=>(
                    <div key={i} className={"sk-soft"} style={{padding:8, border: b.sel ? '2.5px solid var(--gold)' : '1.5px solid var(--ink)', cursor:'pointer'}}>
                      <div style={{height:b.h, border:'1.5px dashed var(--ink)', borderRadius:6, ...b.sty}}/>
                      <div className="text-sm mt-4 text-c" style={{fontWeight: b.sel ? 700 : 400}}>{b.n}{b.sel && ' ◉'}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="field">
                <div className="field-label">Reward Emphasis (drag to reorder)</div>
                <div className="sk-soft" style={{padding:8}}>
                  <div className="row between" style={{padding:'6px 4px', borderBottom:'1px dashed var(--ink)'}}>
                    <span>⋮⋮ <b style={{fontSize:18}}>3x Points</b> <span className="text-mute text-sm">— primary (large)</span></span>
                    <Pill kind="gold">primary</Pill>
                  </div>
                  <div className="row between" style={{padding:'6px 4px'}}>
                    <span>⋮⋮ <b>5% Cashback</b> <span className="text-mute text-sm">— secondary (supporting)</span></span>
                    <Pill>secondary</Pill>
                  </div>
                </div>
              </div>
              <div className="grid g-2" style={{gap:14}}>
                <div className="field">
                  <div className="field-label"><span>Urgency Indicator</span><Toggle on={urgency} onToggle={()=>setUrgency(!urgency)} label={urgency?'On':'Off'}/></div>
                  <div className="text-sm text-mute">Expiring in X days (auto-calculated)</div>
                </div>
                <div className="field">
                  <div className="field-label">Behavioral Signal</div>
                  <div className="input">Elite Favorite <span style={{float:'right'}}>▾</span></div>
                </div>
              </div>
              <div className="grid g-2" style={{gap:14}}>
                <div className="field">
                  <div className="field-label"><span>Share Behavior</span><Toggle on={share} onToggle={()=>setShare(!share)} label={share?'On':'Off'}/></div>
                  <div className="text-sm text-mute">Referral reward: 500 bonus points for referrer</div>
                </div>
                <div className="field">
                  <div className="field-label"><span>Gamification Hook</span><Toggle on={gam} onToggle={()=>setGam(!gam)} label={gam?'On':'Off'}/></div>
                  <div className="row gap-8 mt-4"><span className="text-sm text-mute">Linked to:</span> <Pill kind="gold">Summer Explorer Challenge ↗</Pill></div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div className="grid g-2" style={{gap:10}}>
                {[
                  {ok:true, t:'Basic Details', s:'Complete'},
                  {ok:true, t:'Eligibility & Audience', s:'Complete · Reach: 112,000 members'},
                  {ok:false, t:'Operational Rules', s:'Sponsor funding pending'},
                  {ok:true, t:'Mobile Experience', s:'Complete'},
                ].map((c,i)=>(
                  <div key={i} className={"insight-card " + (c.ok?'green':'amber')} style={{borderLeftWidth:6}}>
                    <div className="row between">
                      <b className="h-hand text-md">{c.ok?'✅':'⚠'} {c.t}</b>
                    </div>
                    <p style={{margin:'4px 0 0'}}>{c.s}</p>
                  </div>
                ))}
              </div>

              <div className="sk mt-16" style={{padding:14}}>
                <div className="row gap-6"><span className="h-display text-xl">✦</span><b className="h-hand">Pre-Launch Checklist</b></div>
                <ul style={{paddingLeft:18, margin:'8px 0 0', lineHeight:1.6}}>
                  <li>✅ Audience size is sufficient for meaningful redemption data</li>
                  <li>✅ Reward liability within acceptable range (₹4.2M at full quota)</li>
                  <li>⚠ Hindi, Thai, and Bahasa Indonesia translations incomplete — offer displays in English for those regions</li>
                  <li>⚠ Sponsor funding confirmation from Meridian is pending</li>
                  <li>✅ Blackout dates configured and conflict-free</li>
                  <li>✅ Campaign schedule aligns with peak APAC travel window</li>
                  <li>✅ Gamification link to Summer Explorer challenge confirmed active</li>
                </ul>
              </div>

              <div className="row gap-8 mt-16" style={{justifyContent:'flex-end'}}>
                <Btn kind="ghost">Save as Draft</Btn>
                <Btn>Schedule for Jun 1</Btn>
                <Btn kind="primary" onClick={()=>goTo(5)}>Submit for Approval →</Btn>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — Mobile preview */}
        <div style={{flex:'0 0 38%', position:'sticky', top:60}}>
          <div className="sk" style={{padding:14}}>
            <div className="row between">
              <div className="h-hand text-md" style={{fontWeight:700}}>Live Mobile Preview</div>
              <div className="row gap-4 text-sm">
                <span onClick={()=>setPhoneCtx('feed')} style={{cursor:'pointer', padding:'2px 8px', border:'1.5px solid var(--ink)', borderRadius:6, background: phoneCtx==='feed'?'var(--gold)':'transparent'}}>Home Feed</span>
                <span onClick={()=>setPhoneCtx('hero')} style={{cursor:'pointer', padding:'2px 8px', border:'1.5px solid var(--ink)', borderRadius:6, background: phoneCtx==='hero'?'var(--gold)':'transparent'}}>Hero View</span>
              </div>
            </div>
            <div className="phone">
              <div className="phone-screen">
                {(step===4 && phoneCtx==='hero') || phoneCtx==='hero' ? (
                  <>
                    <div className="row between" style={{padding:'2px 4px'}}>
                      <span className="h-hand" style={{fontWeight:700}}>Good morning, Aarav</span>
                      <span className="avatar" style={{width:22, height:22, fontSize:11}}>A</span>
                    </div>
                    <div className="text-sm text-mute" style={{padding:'0 4px'}}>Featured for you</div>
                  </>
                ) : (
                  <div className="row between" style={{padding:'2px 4px'}}>
                    <span className="h-hand" style={{fontWeight:700}}>Offers</span>
                    <span style={{fontSize:14}}>⌕  ⋯</span>
                  </div>
                )}
                <div className="banner-ph">Meridian · Summer Bonus</div>
                <div className="sk" style={{padding:10, filter:'none'}}>
                  <div className="row between">
                    <Pill kind="gold" style={{fontSize:10, padding:'1px 8px'}}>⭐ Elite Favorite</Pill>
                    {urgency && <Pill style={{fontSize:10, padding:'1px 8px'}}>⏳ Expiring in 60d</Pill>}
                  </div>
                  <div className="h-display" style={{fontSize:32, lineHeight:1, marginTop:6}}>3x Points</div>
                  <div className="text-sm text-mute">+ 5% Cashback on room rate</div>
                  <div className="text-sm mt-4">Book any 2-night stay this summer</div>
                  <button className="btn primary" style={{width:'100%', justifyContent:'center', marginTop:8}}>Unlock Offer</button>
                  <div className="row between mt-8 text-sm">
                    <span style={{padding:'4px 10px', border:'1.5px dashed var(--ink)', borderRadius:6}}>Share</span>
                    <span style={{padding:'4px 10px', border:'1.5px dashed var(--ink)', borderRadius:6}}>Save</span>
                  </div>
                </div>
                {step === 5 && (
                  <div className="sk-soft" style={{padding:8, fontSize:11}}>
                    <b>Summary:</b> Gold tier · 4 regions · Jun 1 – Jul 31<br/>
                    Quota: 25,000 · Liability: ₹4.2M
                  </div>
                )}
              </div>
            </div>
            <div className="text-c text-mute text-sm mt-8">device frame · 320px</div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.Screen4 = Screen4;
