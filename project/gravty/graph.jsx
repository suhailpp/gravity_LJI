// ============ RELATIONSHIP GRAPH ============
// Shared graph used in Dashboard map view, Segment relationship map, Rule relationship map.
// Fixed positions (no force-direction). Curved bezier edges. Hover dim. Empty state for < 3 nodes.

function RelationshipGraph({
  nodes,                  // [{id, code, brand, label, signal, health, status}]
  edges,                  // [{a, b, group}]  ids reference node.id
  center,                 // null | {kind:'segment'|'rule', label, count, icon}
  height = 460,
  onNodeClick,
  emptyMsg = 'Not enough offers to show connections',
  showLegend = false
}) {
  const wrapRef = useRef(null);
  const [dims, setDims] = useState({ w: 1000, h: height });
  const [hoveredId, setHoveredId] = useState(null);
  const [edgeFadeKey, setEdgeFadeKey] = useState(0);
  const [tooltip, setTooltip] = useState(null);
  const [dragOffsets, setDragOffsets] = useState({});
  const draggingRef = useRef(null);
  const hasDraggedRef = useRef(false);
  const [labelsOn, setLabelsOn] = useState(true);
  const [legendOn, setLegendOn] = useState(true);

  // Measure container width
  useLayoutEffect(() => {
    if (!wrapRef.current) return;
    const measure = () => {
      const r = wrapRef.current.getBoundingClientRect();
      setDims({ w: r.width, h: height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [height]);

  // Compute positions (deterministic, no overlap)
  const positions = useMemo(() => {
    const pad = 70;
    const W = Math.max(dims.w, 600);
    const H = dims.h;
    const result = {};
    if (center) {
      const cx = W / 2, cy = H / 2;
      const n = nodes.length;
      const r = Math.min(W, H) / 2 - pad;
      const startAngle = n === 2 ? 0 : -Math.PI / 2;
      nodes.forEach((node, i) => {
        const angle = startAngle + (i / n) * Math.PI * 2;
        let x = cx + Math.cos(angle) * r;
        let y = cy + Math.sin(angle) * r;
        if (n === 2) { x = i === 0 ? cx - r : cx + r; y = cy; }
        x = Math.max(pad, Math.min(W - pad, x));
        y = Math.max(pad, Math.min(H - pad, y));
        result[node.id] = { x, y };
      });
    } else {
      const n = nodes.length;
      const cols = n <= 3 ? n : n <= 6 ? 3 : 4;
      const rows = Math.ceil(n / cols);
      const colW = (W - pad * 2) / Math.max(1, cols - 1);
      const rowH = rows === 1 ? 0 : (H - pad * 2) / (rows - 1);
      nodes.forEach((node, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const x = cols === 1 ? W / 2 : pad + c * colW;
        const y = rows === 1 ? H / 2 : pad + r * rowH;
        result[node.id] = { x, y };
      });
    }
    return result;
  }, [nodes, center, dims]);

  const epos = (id) => {
    const base = positions[id] || { x: 0, y: 0 };
    const off = dragOffsets[id] || { x: 0, y: 0 };
    return { x: base.x + off.x, y: base.y + off.y };
  };

  useEffect(() => { setDragOffsets({}); }, [nodes]);
  useEffect(() => { setEdgeFadeKey(k => k + 1); }, [edges]);

  const DRAG_THRESHOLD = 4;

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      const { id, sx, sy, ox, oy } = draggingRef.current;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) hasDraggedRef.current = true;
      setDragOffsets(prev => ({ ...prev, [id]: { x: ox + dx, y: oy + dy } }));
    };
    const onUp = () => { draggingRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const renderEdge = (e, i) => {
    const a = epos(e.a), b = epos(e.b);
    if (!a || !b) return null;
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (!len) return null;
    const offset = (15 + (i % 5) * 6) * (i % 2 === 0 ? 1 : -1);
    const mx = (a.x + b.x) / 2 + (-dy / len) * offset;
    const my = (a.y + b.y) / 2 + (dx / len) * offset;
    const d = `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
    const dim = hoveredId != null && hoveredId !== e.a && hoveredId !== e.b;
    const lit = hoveredId != null && (hoveredId === e.a || hoveredId === e.b);
    return (
      <g key={i} className="graph-edge-group">
        <path className={"graph-edge" + (dim ? ' dim' : '') + (lit ? ' lit' : '')}
              d={d} fill="none" stroke="var(--accent-gold)" strokeOpacity={0.4} strokeWidth={1.5} strokeLinecap="round"/>
        {lit && <circle className="travel-dot" r={3}><animateMotion dur="1.6s" repeatCount="indefinite" path={d}/></circle>}
      </g>
    );
  };

  const renderCenterEdge = (node, i) => {
    const pos = epos(node.id);
    if (!pos) return null;
    const cx = dims.w / 2, cy = dims.h / 2;
    const dx = pos.x - cx, dy = pos.y - cy;
    const len = Math.sqrt(dx * dx + dy * dy);
    const offset = 22;
    const mx = (cx + pos.x) / 2 + (-dy / len) * offset;
    const my = (cy + pos.y) / 2 + (dx / len) * offset;
    const d = `M ${cx} ${cy} Q ${mx} ${my} ${pos.x} ${pos.y}`;
    const dim = hoveredId != null && hoveredId !== node.id;
    const lit = hoveredId === node.id;
    return (
      <g key={`c-${i}`}>
        <path className={"graph-edge" + (dim ? ' dim' : '') + (lit ? ' lit' : '')}
              d={d} fill="none" stroke="var(--accent-gold)" strokeOpacity={0.4} strokeWidth={1.5} strokeLinecap="round"/>
        {lit && <circle className="travel-dot" r={3}><animateMotion dur="1.4s" repeatCount="indefinite" path={d}/></circle>}
      </g>
    );
  };

  // Empty state
  if (!nodes || nodes.length < 3) {
    return (
      <div ref={wrapRef} className="graph-canvas" style={{height}}>
        <div className="graph-empty">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
            <circle cx="16" cy="32" r="8"/><circle cx="48" cy="32" r="8"/>
            <line x1="24" y1="32" x2="40" y2="32" strokeDasharray="3 3"/>
          </svg>
          <div className="sora" style={{fontSize:14, color:'var(--text-primary)', fontWeight:500}}>{emptyMsg}</div>
          <div style={{fontSize:12}}>At least 3 nodes are needed to draw a meaningful network.</div>
        </div>
      </div>
    );
  }

  const truncate = (s, n = 14) => s == null ? '' : (s.length <= n ? s : s.slice(0, n - 1) + '…');

  // Mirrors getHealthColor in ui.jsx (75 / 50 splits).
  const healthColor = (v) => v == null ? 'var(--text-muted)'
    : v >= 75 ? '#52C08A' : v >= 50 ? '#E8A030' : '#E05252';

  const statusDotColors = {
    live: '#2DD4A0', scheduled: '#4A90D9', 'in-review': '#F59E0B',
    draft: '#4A5568', paused: '#F26B6B', ended: '#4A5568'
  };
  const statusLabels = {
    live: 'Live', scheduled: 'Scheduled', 'in-review': 'In Review',
    draft: 'Draft', paused: 'Paused', ended: 'Ended'
  };
  const signalMap = {
    trending: <><Icon name="TrendingUp" size={11}/> Trending</>,
    fast:     <><Icon name="Zap" size={11}/> Fast Growing</>,
    losing:   <><Icon name="TrendingDown" size={11}/> Losing Momentum</>,
    elite:    <><Icon name="Star" size={11}/> Elite Favorite</>,
    expiring: <><Icon name="Clock" size={11}/> Expiring Soon</>,
  };

  // Viewport-aware tooltip position
  const tooltipPos = tooltip ? (() => {
    const ttW = 230, ttH = 170;
    let tx = tooltip.clientX;
    let ty = tooltip.clientY;
    if (tx + ttW > window.innerWidth - 8) tx = tooltip.clientX - ttW - 24;
    if (ty + ttH > window.innerHeight - 8) ty = window.innerHeight - ttH - 8;
    if (ty < 8) ty = 8;
    return { position: 'fixed', left: tx, top: ty, zIndex: 9999, pointerEvents: 'none' };
  })() : null;

  return (
    <div ref={wrapRef} className="graph-canvas" style={{height}}>
      {/* SVG edges — below all nodes and labels */}
      <svg className="graph-svg" key={edgeFadeKey} style={{animation: 'edgeFade .3s ease-out'}}>
        {center && nodes.map((n, i) => renderCenterEdge(n, i))}
        {!center && edges.map((e, i) => renderEdge(e, i))}
      </svg>

      {/* Center node */}
      {center && center.kind === 'segment' && (
        <div className="graph-center-diamond">
          <div className="inner">
            <div className="sora" style={{fontSize:13, fontWeight:600}}>{center.count}</div>
            <div style={{fontSize:10, color:'var(--text-secondary)', marginTop:2}}>{center.label}</div>
          </div>
        </div>
      )}
      {center && center.kind === 'rule' && (
        <div className="graph-center-rect">
          <div className="row gap-6" style={{justifyContent:'center'}}>
            <Icon name="Sliders" size={13}/>
            <span style={{fontSize:11, fontFamily:'Sora, sans-serif', fontWeight:600}}>{center.label}</span>
          </div>
          <div style={{fontSize:10, color:'var(--text-secondary)', marginTop:4}}>{center.count}</div>
        </div>
      )}

      {/* Nodes — logo + status dot only, no label inside */}
      {nodes.map(n => {
        const pos = epos(n.id);
        if (!pos) return null;
        const isHovered = hoveredId === n.id;
        const connectedToHover = hoveredId != null && edges.some(e =>
          (e.a === hoveredId && e.b === n.id) || (e.b === hoveredId && e.a === n.id));
        const dim = hoveredId != null && hoveredId !== n.id && !connectedToHover && !center;
        const dotColor = statusDotColors[n.status];
        return (
          <div
            key={n.id}
            className={"graph-node" + (dim ? ' dim' : '') + (isHovered ? ' lit' : '')}
            style={{left: pos.x - 24, top: pos.y - 24, cursor: 'pointer', overflow: 'visible'}}
            onMouseEnter={(e) => {
              setHoveredId(n.id);
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltip({ clientX: rect.right + 12, clientY: rect.top, node: n });
            }}
            onMouseLeave={() => { setHoveredId(null); setTooltip(null); }}
            onMouseDown={(e) => {
              if (e.button !== 0) return;
              e.preventDefault();
              hasDraggedRef.current = false;
              const off = dragOffsets[n.id] || { x: 0, y: 0 };
              draggingRef.current = { id: n.id, sx: e.clientX, sy: e.clientY, ox: off.x, oy: off.y };
            }}
            onClick={() => {
              if (hasDraggedRef.current) { hasDraggedRef.current = false; return; }
              onNodeClick && onNodeClick(n);
            }}
          >
            {BRAND_LOGOS[n.brand]
              ? <img src={BRAND_LOGOS[n.brand]} alt={n.brand} onError={(e) => { e.target.style.display = 'none'; }}/>
              : null}
            <span style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-elevated)', borderRadius:'50%', opacity: BRAND_LOGOS[n.brand] ? 0 : 1}}>{n.code}</span>
            {dotColor && (
              <div style={{position:'absolute', bottom:-2, right:-2, width:10, height:10, borderRadius:'50%', background:dotColor, border:'2px solid var(--bg-surface)', zIndex:2}}/>
            )}
          </div>
        );
      })}

      {/* Label layer — separate from nodes, above SVG edges */}
      {labelsOn && (
        <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:6}}>
          {nodes.map(n => {
            const pos = epos(n.id);
            if (!pos) return null;
            const title = n.label || n.brand || '';
            return (
              <div key={n.id} style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y + 28,
                transform: 'translateX(-50%)',
                background: 'rgba(10,12,16,0.82)',
                padding: '2px 6px',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                maxWidth: 110,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: 11,
                color: 'var(--text-secondary)',
                fontFamily: 'DM Sans, sans-serif',
                textAlign: 'center',
              }}>
                {truncate(title, 14)}
              </div>
            );
          })}
        </div>
      )}

      {/* Toggle buttons — top-right */}
      <div style={{position:'absolute', top:8, right:8, display:'flex', gap:6, zIndex:10}}>
        <button
          style={{fontSize:12, padding:'4px 10px', background:'var(--bg-elevated)', border:'1px solid var(--border-default)', borderRadius:4, cursor:'pointer', fontFamily:'DM Sans, sans-serif', color: labelsOn ? 'var(--text-primary)' : 'var(--text-muted)', opacity: labelsOn ? 1 : 0.5, transition:'opacity .15s'}}
          onClick={() => setLabelsOn(v => !v)}
        >Labels</button>
        <button
          style={{fontSize:12, padding:'4px 10px', background:'var(--bg-elevated)', border:'1px solid var(--border-default)', borderRadius:4, cursor:'pointer', fontFamily:'DM Sans, sans-serif', color: legendOn ? 'var(--text-primary)' : 'var(--text-muted)', opacity: legendOn ? 1 : 0.5, transition:'opacity .15s'}}
          onClick={() => setLegendOn(v => !v)}
        >Legend</button>
      </div>

      {/* Reset Layout button */}
      {Object.keys(dragOffsets).length > 0 && (
        <button
          style={{position:'absolute', bottom:10, right:10, background:'var(--bg-elevated)', border:'1px solid var(--border-default)', borderRadius:6, padding:'4px 10px', fontSize:11, color:'var(--text-secondary)', cursor:'pointer', zIndex:10}}
          onClick={() => setDragOffsets({})}
        >⟳ Reset Layout</button>
      )}

      {/* Status legend — bottom-left corner */}
      {showLegend && legendOn && (
        <div style={{position:'absolute', bottom:10, left:12, display:'flex', flexWrap:'wrap', gap:'4px 12px', alignItems:'center', fontSize:11, color:'var(--text-secondary)', zIndex:5, background:'rgba(10,12,16,0.72)', padding:'5px 10px', borderRadius:6}}>
          {[{c:'#2DD4A0',l:'Live'},{c:'#4A90D9',l:'Scheduled'},{c:'#F59E0B',l:'In Review'},{c:'#4A5568',l:'Draft'},{c:'#F26B6B',l:'Paused'}].map(({c,l}) => (
            <span key={l} style={{display:'flex', alignItems:'center', gap:4}}>
              <span style={{width:8, height:8, borderRadius:'50%', background:c, flexShrink:0, display:'inline-block'}}/>
              {l}
            </span>
          ))}
        </div>
      )}

      {/* Tooltip — fixed, viewport-aware, never clipped */}
      {tooltip && tooltipPos && ReactDOM.createPortal(
        <div className="graph-tooltip" style={tooltipPos}>
          <div style={{fontSize:12, color:'var(--text-primary)', fontWeight:500, lineHeight:1.3}}>
            {tooltip.node.brand || tooltip.node.label}
          </div>
          {tooltip.node.label && tooltip.node.brand && tooltip.node.label !== tooltip.node.brand && (
            <div style={{fontSize:11, color:'var(--text-secondary)', marginTop:3, lineHeight:1.4}}>
              {tooltip.node.label}
            </div>
          )}
          <div style={{display:'flex', alignItems:'center', gap:8, marginTop:6, flexWrap:'wrap'}}>
            {tooltip.node.health != null && (
              <span style={{fontSize:11}}>
                Health <b style={{color: healthColor(tooltip.node.health)}}>{tooltip.node.health}</b>
              </span>
            )}
            {tooltip.node.status && (
              <span style={{display:'flex', alignItems:'center', gap:4, fontSize:11}}>
                {statusDotColors[tooltip.node.status] && (
                  <span style={{width:7, height:7, borderRadius:'50%', background:statusDotColors[tooltip.node.status], display:'inline-block', flexShrink:0}}/>
                )}
                <span style={{color:'var(--text-secondary)'}}>
                  {statusLabels[tooltip.node.status] || tooltip.node.status}
                </span>
              </span>
            )}
          </div>
          {tooltip.node.signal && (
            <div style={{marginTop:5, fontSize:11, color:'var(--text-secondary)', display:'inline-flex', alignItems:'center', gap:4}}>
              {signalMap[tooltip.node.signal] || ''}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

window.RelationshipGraph = RelationshipGraph;
