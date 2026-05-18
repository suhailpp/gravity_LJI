// Main app: navigation state machine + frame

function App() {
  const RedemptionContext = window.RedemptionContext;
  const [tab, setTab] = React.useState('home');
  const [detailId, setDetailId] = React.useState(null);
  const [detailVariant, setDetailVariant] = React.useState(null);
  const [redeemOffer, setRedeemOffer] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [initialFilter, setInitialFilter] = React.useState(null);
  const [redeemedIds, setRedeemedIds] = React.useState(() => new Set());
  const [balance, setBalance] = React.useState(MEMBER.miles);
  const toastTimer = React.useRef(null);

  const showToast = (text) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };

  const isRedeemed = React.useCallback((id) => redeemedIds.has(id), [redeemedIds]);

  const markRedeemed = (offer, { cost = 0, bonus = 0 } = {}) => {
    setRedeemedIds(prev => {
      if (prev.has(offer.id)) return prev;
      const next = new Set(prev);
      next.add(offer.id);
      return next;
    });
    setBalance(b => Math.max(0, b - cost + bonus));
    // Keep MEMBER.miles in sync for components that read it directly
    try { MEMBER.miles = Math.max(0, MEMBER.miles - cost + bonus); } catch (_) {}
  };

  const openOffer = (id, variant = null) => { setDetailId(id); setDetailVariant(variant); };
  const closeDetail = () => { setDetailId(null); setDetailVariant(null); };
  const closeRedeem = () => {
    // Close both — user never returns to detail after redemption
    setRedeemOffer(null);
    setDetailId(null);
    setDetailVariant(null);
  };
  const backToOffers = () => {
    setRedeemOffer(null);
    setDetailId(null);
    setDetailVariant(null);
    setTab('offers');
  };

  // Triggered when CTA hits state 3 + 1s hold. Accepts a full offer object
  // (could be from OFFERS or a synthetic one for Birthday).
  const handleConfirm = (offer, txn) => {
    if (!offer) return;
    markRedeemed(offer, txn || {});
    setRedeemOffer(offer);
  };

  const ctx = React.useMemo(() => ({
    redeemedIds, balance, isRedeemed, markRedeemed,
    triggerRedeem: handleConfirm,
  }), [redeemedIds, balance, isRedeemed]);

  const gotoTab = (t) => {
    setDetailId(null);
    setTab(t);
    if (t === 'wallet') {
      showToast(`${t[0].toUpperCase() + t.slice(1)} — Coming soon`);
    }
  };

  const offer = detailId ? OFFERS.find(o => o.id === detailId) : null;

  const SCREEN_W = 390;
  const SCREEN_H = 844;
  // Body bezel adds 10px on left/right and 11px top/bottom
  const BODY_W = SCREEN_W + 20;
  const BODY_H = SCREEN_H + 22;

  return (
    <RedemptionContext.Provider value={ctx}>
    <div style={{
      width: BODY_W, height: BODY_H,
      position: 'relative',
      borderRadius: 58,
      // Space-black bezel with a soft inner highlight
      background: 'linear-gradient(135deg, #2a2a2c 0%, #1a1a1c 50%, #131315 100%)',
      boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.08)',
    }}>
      {/* Volume up — left side */}
      <div style={{
        position: 'absolute', left: -2, top: 165,
        width: 3, height: 38, borderRadius: '2px 0 0 2px',
        background: 'linear-gradient(90deg, #2a2a2c, #0a0a0a)',
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.04)',
      }} />
      {/* Volume down — left side */}
      <div style={{
        position: 'absolute', left: -2, top: 215,
        width: 3, height: 38, borderRadius: '2px 0 0 2px',
        background: 'linear-gradient(90deg, #2a2a2c, #0a0a0a)',
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.04)',
      }} />
      {/* Mute switch — left side, higher */}
      <div style={{
        position: 'absolute', left: -2, top: 115,
        width: 3, height: 28, borderRadius: '2px 0 0 2px',
        background: 'linear-gradient(90deg, #2a2a2c, #0a0a0a)',
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.04)',
      }} />
      {/* Power — right side */}
      <div style={{
        position: 'absolute', right: -2, top: 175,
        width: 3, height: 85, borderRadius: '0 2px 2px 0',
        background: 'linear-gradient(270deg, #2a2a2c, #0a0a0a)',
        boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.04)',
      }} />

      {/* Screen — actual app surface */}
      <div style={{
        position: 'absolute', top: 11, left: 10,
        width: SCREEN_W, height: SCREEN_H,
        borderRadius: 47, overflow: 'hidden',
        background: 'var(--bg)',
        boxShadow: 'inset 0 0 0 2px #000, inset 0 0 0 3px rgba(255,255,255,0.04)',
        fontFamily: 'Fredoka, system-ui, sans-serif',
        color: 'var(--text-1)',
        WebkitFontSmoothing: 'antialiased',
      }}>
      {/* Mashrabiya pattern layer */}
      <MashrabiyaBg />

      {/* Dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 122, height: 36, borderRadius: 22, background: '#000', zIndex: 50,
      }} />

      {/* Status bar (custom dark) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}>
        <IOSStatusBar dark />
      </div>

      {/* Content above pattern */}
      <div style={{
        position: 'absolute', inset: 0, paddingTop: 56,
        overflow: 'hidden', zIndex: 1,
      }}>
        <div style={{
          height: '100%', overflowY: 'auto', overflowX: 'hidden',
        }} key={tab /* reset scroll on tab change */}>
          {tab === 'home' && (
            <HomeScreen
              onOpenOffer={openOffer}
              onGotoTab={(t) => { setInitialFilter(null); gotoTab(t); }}
              onConfirmRedeem={(o) => handleConfirm(o)}
              onToast={showToast}
            />
          )}
          {tab === 'offers' && (
            <OffersScreen
              key={JSON.stringify(initialFilter)}
              initialFilter={initialFilter}
              onOpenOffer={openOffer}
              onToast={showToast}
            />
          )}
          {tab === 'loyalty' && <LoyaltyHubScreen onToast={showToast} />}
          {tab === 'wallet'  && <StubScreen name="Wallet"  label="05 Wallet" />}
          {tab === 'profile' && <ProfileScreen onToast={showToast} />}
        </div>
      </div>

      {/* Toast */}
      <Toast text={toast} />

      {/* Offer detail slides up */}
      {offer && (
        <OfferDetail
          offer={offer}
          variant={detailVariant}
          balance={balance}
          isRedeemed={redeemedIds.has(offer.id)}
          onBack={closeDetail}
          onOpenOffer={openOffer}
          onConfirm={handleConfirm}
          onBackToOffers={backToOffers}
          onToast={showToast}
        />
      )}

      {/* Tab bar (always on top) */}
      <TabBar active={tab} onSelect={gotoTab} />

      {/* Home indicator */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
        height: 24, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        paddingBottom: 7, pointerEvents: 'none',
      }}>
        <div style={{
          width: 134, height: 5, borderRadius: 100,
          background: 'rgba(255,255,255,0.55)',
        }} />
      </div>
      </div>
    </div>
    </RedemptionContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
