// Screen 5 — Post-submission confirmation
function Screen5({ goTo }) {
  return (
    <div className="content" style={{maxWidth:720, margin:'0 auto', paddingTop:24}}>
      <div className="text-c">
        <div className="ring-wrap">
          <div className="ring"/>
          <div className="ring2"/>
          <div className="check">✓</div>
        </div>
        <ScribbleHeading size={42}>Campaign Submitted for Approval</ScribbleHeading>
      </div>

      <div className="sk mt-20" style={{padding:18}}>
        <div className="mono text-md" style={{fontWeight:600}}>APAC_GOLD_SUMREC_2024</div>
        <div className="text-md mt-4">Tier Recovery Offer · Gold Tier · APAC · 4 Regions</div>
        <div className="text-sm text-mute mt-4">Submitted by <b>Priya Mehta</b> · Tuesday, 14 May 2024</div>
      </div>

      <div className="mt-20">
        <div className="h-hand text-md" style={{fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em'}}>Status Timeline</div>
        <div className="timeline mt-12">
          <div className="tl-node done">
            <div className="row between"><b className="h-hand">Draft Created</b><span className="text-mute text-sm">May 14</span></div>
          </div>
          <div className="tl-node now">
            <div className="row between"><b className="h-hand">Submitted for Approval</b><span className="text-mute text-sm">May 14 · Today</span></div>
          </div>
          <div className="tl-node pend">
            <div className="row between"><b className="h-hand">Finance Review</b><span className="text-mute text-sm">Est. by May 16</span></div>
          </div>
          <div className="tl-node">
            <div className="row between"><b className="h-hand">Campaign Live</b><span className="text-mute text-sm">Scheduled Jun 1</span></div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="h-hand text-md" style={{fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em'}}>Outstanding Actions</div>
        <div className="grid g-2 mt-12">
          <div className="insight-card amber" style={{borderLeftWidth:6}}>
            <h4>Complete Missing Translations</h4>
            <p>Hindi, Thai, Bahasa Indonesia pending</p>
            <Btn kind="ghost" sm>Fix Now →</Btn>
          </div>
          <div className="insight-card amber" style={{borderLeftWidth:6}}>
            <h4>Follow Up on Meridian Funding</h4>
            <p>Confirmation required before go-live</p>
            <Btn kind="ghost" sm>Open Request →</Btn>
          </div>
        </div>
      </div>

      <div className="row gap-8 mt-24" style={{justifyContent:'center'}}>
        <Btn kind="ghost">View Campaign Details</Btn>
        <Btn kind="primary" onClick={()=>goTo(2)}>Return to Offer List →</Btn>
      </div>
    </div>
  );
}
window.Screen5 = Screen5;
