// PROFILE SCREEN — Emirates Skywards
// Simple menu list. Tier/privileges live in Loyalty Hub.

function ProfileMenuRow({ icon, label, sub, badge, onClick, isLast }) {
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 14,
      width: '100%', minHeight: 60, padding: '12px 0',
      borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(201,148,42,0.06)',
        border: '1px solid rgba(201,148,42,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: FONT_UI, fontWeight: 500, fontSize: 13.5,
          color: 'var(--text-1)',
        }}>
          {label}
          {badge && (
            <span style={{
              padding: '2px 8px', borderRadius: 999,
              border: '1px solid rgba(201,148,42,0.4)',
              background: 'rgba(201,148,42,0.1)',
              color: '#C9942A',
              fontFamily: FONT_UI, fontSize: 9, fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>{badge}</span>
          )}
        </div>
        <div style={{
          marginTop: 2,
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 11.5,
          color: 'var(--text-2)',
        }}>{sub}</div>
      </div>
      <span style={{
        color: 'var(--text-3)', fontFamily: FONT_UI, fontSize: 16,
      }}>›</span>
    </button>
  );
}

function MenuIcon({ kind, color = '#C9942A' }) {
  const sw = 1.4;
  const p = { width: 20, height: 20, fill: 'none', stroke: color, strokeWidth: sw,
              strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'user':     return <svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="8" r="3.5"/><path d="M4 20 Q4 13.5 12 13.5 Q20 13.5 20 20"/></svg>;
    case 'trips':    return <svg viewBox="0 0 24 24" {...p}><rect x="5" y="8" width="14" height="12" rx="1.5"/><path d="M9 8 V5.5 H15 V8"/><path d="M12 11 V17"/></svg>;
    case 'bookmark': return <svg viewBox="0 0 24 24" {...p}><path d="M6 4 H18 V21 L12 16.5 L6 21 Z"/></svg>;
    case 'family':   return <svg viewBox="0 0 24 24" {...p}><circle cx="8" cy="8" r="2.8"/><circle cx="16" cy="8" r="2.8"/><path d="M2 19 Q2 14 8 14 Q14 14 14 19"/><path d="M10 19 Q10 14 16 14 Q22 14 22 19"/></svg>;
    case 'bell':     return <svg viewBox="0 0 24 24" {...p}><path d="M5 17 L5 11 Q5 5 12 5 Q19 5 19 11 L19 17 L20 19 L4 19 Z"/><path d="M10 21 Q10 22 12 22 Q14 22 14 21"/></svg>;
    case 'help':     return <svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9 Q9.5 6.5 12 6.5 Q14.5 6.5 14.5 9 Q14.5 11 12 12 L12 14"/><circle cx="12" cy="17" r="0.6" fill={color}/></svg>;
    default: return null;
  }
}

function ProfileScreen({ onToast }) {
  return (
    <div data-screen-label="06 Profile" className="screen-fade" style={{ paddingBottom: 110 }}>
      <PageHeader title="Profile" />

      {/* HEADER */}
      <div style={{
        padding: `${GAP - 8}px ${PAD}px 0`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', textAlign: 'left', gap: 12,
      }}>
        {/* initials avatar */}
        <div className="pulse-gold" style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(201,148,42,0.1)',
          border: '2px solid rgba(201,148,42,0.65)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 24,
            color: '#C9942A', letterSpacing: '0.02em',
          }}>AM</span>
        </div>

        <div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 20,
            color: 'var(--text-1)', letterSpacing: '-0.005em', lineHeight: 1.25,
          }}>Aisha Al Mansoori</div>

          <div style={{
            marginTop: 6,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: FONT_UI, fontWeight: 400, fontSize: 12,
            color: 'var(--text-2)',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              color: '#C9942A',
            }}>
              <svg width="8" height="8" viewBox="0 0 8 8">
                <path d="M4 0 L8 4 L4 8 L0 4 Z" fill="#C9942A"/>
              </svg>
              Gold
            </span>
            <span style={{ color: 'var(--text-3)' }}>·</span>
            <span>Member since 2021</span>
          </div>

          <div style={{
            marginTop: 4,
            fontFamily: FONT_UI, fontWeight: 400, fontSize: 10,
            color: 'var(--text-3)', letterSpacing: '0.1em',
          }}>#SKY-4829103</div>
        </div>
      </div>

      {/* MENU LIST */}
      <div style={{ padding: `${GAP}px ${PAD}px 0` }}>
        <ProfileMenuRow
          icon={<MenuIcon kind="user" />}
          label="My Membership"
          sub="Skywards ID and account details"
          onClick={() => onToast?.('My Membership')}
        />
        <ProfileMenuRow
          icon={<MenuIcon kind="trips" />}
          label="My Trips"
          sub="Past bookings and upcoming travel"
          onClick={() => onToast?.('My Trips')}
        />
        <ProfileMenuRow
          icon={<MenuIcon kind="bookmark" />}
          label="Saved Offers"
          sub="Your bookmarked offers"
          onClick={() => onToast?.('Saved Offers')}
        />
        <ProfileMenuRow
          icon={<MenuIcon kind="family" />}
          label="Family Account"
          sub="Pool miles with family"
          badge="Coming Soon"
          onClick={() => onToast?.('Family Account — Coming Soon')}
        />
        <ProfileMenuRow
          icon={<MenuIcon kind="bell" />}
          label="Notification Settings"
          sub="Manage your alerts"
          onClick={() => onToast?.('Notifications')}
        />
        <ProfileMenuRow
          icon={<MenuIcon kind="help" />}
          label="Help & Support"
          sub="FAQ and contact Emirates"
          onClick={() => onToast?.('Help & Support')}
          isLast
        />
      </div>

      {/* SIGN OUT */}
      <div style={{
        padding: `${GAP + 8}px ${PAD}px 0`,
        display: 'flex', justifyContent: 'center',
      }}>
        <button onClick={() => onToast?.('Signed out')} style={{
          all: 'unset', cursor: 'pointer',
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 13,
          color: 'rgba(255,255,255,0.25)',
        }}>Sign Out</button>
      </div>

      {/* FOOTER */}
      <div style={{
        paddingTop: 24, paddingBottom: 32,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <EmiratesMark size={20} />
        <div style={{
          fontFamily: FONT_UI, fontWeight: 400, fontSize: 10,
          color: 'var(--text-3)', letterSpacing: '0.08em',
        }}>emirates.com/skywards</div>
      </div>
    </div>
  );
}

Object.assign(window, { ProfileScreen, ProfileMenuRow, MenuIcon });
