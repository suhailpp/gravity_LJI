// Shared wireframe UI components
const { useState, useEffect, useRef } = React;

function Rail({ active, onNav }) {
  const items = [
    { id: 'dash', glyph: '▦', label: 'Dashboard' },
    { id: 'offers', glyph: '◷', label: 'Offers' },
    { id: 'members', glyph: '☺', label: 'Members' },
    { id: 'analytics', glyph: '◫', label: 'Analytics' },
    { id: 'settings', glyph: '⚙', label: 'Settings' }
  ];
  return (
    <div className="rail">
      <div className="rail-icon" style={{background:'var(--ink)', color:'var(--paper)', fontSize:18}}>L</div>
      <div style={{height:6}}/>
      {items.map(it => (
        <div key={it.id}
          title={it.label}
          className={"rail-icon " + (active===it.id ? "active" : "")}
          onClick={() => onNav && onNav(it.id)}>
          <span style={{fontSize:18}}>{it.glyph}</span>
        </div>
      ))}
      <div style={{flex:1}}/>
      <div className="rail-icon" title="Help" style={{borderStyle:'dashed'}}>?</div>
    </div>
  );
}

function TopBar({ crumbs }) {
  return (
    <div className="topbar">
      <div className="crumb">
        {crumbs.map((c, i) => (
          <span key={i}>
            {i>0 && <span style={{margin:'0 8px'}}>/</span>}
            {i === crumbs.length-1 ? <b>{c}</b> : <span>{c}</span>}
          </span>
        ))}
      </div>
      <div className="row gap-12">
        <div className="row gap-8 text-mute text-sm" style={{paddingRight:8, borderRight:'1.5px dashed var(--ink)'}}>
          <span>APAC ▾</span>
          <span>·</span>
          <span>EN ▾</span>
        </div>
        <span className="bell">~<span className="b-badge">3</span></span>
        <span className="avatar">PM</span>
      </div>
    </div>
  );
}

function Pill({ children, kind='ghost', style }) {
  return <span className={"pill " + kind} style={style}>{children}</span>;
}

function Btn({ children, kind='', sm=false, onClick, style }) {
  return <button className={"btn " + kind + (sm ? " sm" : "")} onClick={onClick} style={style}>{children}</button>;
}

function Toggle({ on, label, onToggle }) {
  return (
    <span className={"toggle " + (on ? "on" : "")} onClick={onToggle}>
      <span className="knob"/>
      {label && <span style={{fontWeight:700}}>{label}</span>}
    </span>
  );
}

function Annotation({ children, style }) {
  return <div className="wf-note" style={style}>{children}</div>;
}

function ScribbleHeading({ children, size=46 }) {
  return <h1 className="h-display" style={{fontSize:size, lineHeight:1, margin:0}}>{children}</h1>;
}

// Sparkline (declining trend) — drawn in SVG, sketchy stroke
function Sparkline({ width=200, height=50, declining=true }) {
  const pts = declining
    ? [[0,8],[28,12],[56,18],[84,22],[112,30],[140,34],[168,40],[200,44]]
    : [[0,40],[28,34],[56,28],[84,24],[112,18],[140,14],[168,10],[200,6]];
  const d = pts.map((p,i)=> (i===0? 'M':'L') + p[0] + ' ' + p[1]).join(' ');
  return (
    <svg width={width} height={height} style={{display:'block'}}>
      <line x1="0" y1={height-2} x2={width} y2={height-2} stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d={d} fill="none" stroke={declining ? 'var(--red)' : 'var(--green)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>(<circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#1a1a1a"/>))}
    </svg>
  );
}

// Expose globals
Object.assign(window, { Rail, TopBar, Pill, Btn, Toggle, Annotation, ScribbleHeading, Sparkline });
