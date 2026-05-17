// App shell — tab nav + screen routing
function App() {
  const [screen, setScreen] = useState(1);
  const [filterCtx, setFilterCtx] = useState(null);

  const goTo = (n, ctx) => {
    setScreen(n);
    if (ctx && ctx.tier) setFilterCtx('gold');
    if (n === 2 && !ctx) setFilterCtx(null);
    window.scrollTo({top:0, behavior:'smooth'});
  };

  const screens = [
    {n:1, label:'Dashboard',          crumbs:['Platform','Dashboard'],                                rail:'dash',   El:Screen1},
    {n:2, label:'Offer List',         crumbs:['Platform','Offers'],                                   rail:'offers', El:Screen2},
    {n:3, label:'Template Selector',  crumbs:['Platform','Offers','Create New Offer'],                rail:'offers', El:Screen3},
    {n:4, label:'Offer Editor',       crumbs:['Platform','Offers','Create','Tier Recovery Offer'],    rail:'offers', El:Screen4},
    {n:5, label:'Confirmation',       crumbs:['Platform','Offers','APAC_GOLD_SUMREC_2024'],           rail:'offers', El:Screen5},
  ];

  const current = screens.find(s => s.n === screen);
  const Active = current.El;

  return (
    <div>
      <div className="tabs">
        <span className="h-display" style={{fontSize:30, marginRight:8}}>Loyalty · Wireframes</span>
        {screens.map(s => (
          <button key={s.n} className={"tab-btn " + (screen===s.n?'active':'')} onClick={()=>goTo(s.n)}>
            <span className="tab-num">{s.n}</span>{s.label}
          </button>
        ))}
        <span style={{flex:1}}/>
        <span className="text-mute text-sm h-hand">marker-sketch fidelity · click tabs or in-screen CTAs to navigate</span>
      </div>

      <div className="screen">
        <div className="frame">
          <div className="layout-row">
            <Rail active={current.rail} onNav={(r)=>{
              if (r==='dash') goTo(1);
              else if (r==='offers') goTo(2);
            }}/>
            <div style={{flex:1, position:'relative'}}>
              <TopBar crumbs={current.crumbs}/>
              <Active goTo={goTo} initialFilter={filterCtx}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
