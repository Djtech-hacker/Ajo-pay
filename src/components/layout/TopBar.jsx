// =============================================
// TOPBAR COMPONENT
// =============================================

import { useLocation } from 'react-router-dom';
import './TopBar.css';

// Page title and subtitle map
const pageMeta = {
  '/dashboard':      { title: 'Dashboard',         sub: 'Overview & Metrics' },
  '/members':        { title: 'Members',            sub: 'Member Directory' },
  '/contributions':  { title: 'Contributions',      sub: 'Track Weekly Payments' },
  '/deposits':       { title: 'Deposits & Payouts', sub: 'Disbursement Management' },
  '/meetings':       { title: 'Meetings',           sub: 'Schedule & History' },
  '/agenda':         { title: 'Agenda',             sub: 'Submissions & Approvals' },
  '/attendance':     { title: 'Attendance',         sub: 'Tracking per Meeting' },
  '/notifications':  { title: 'Notifications',      sub: 'Alerts & Reminders' },
  '/reports':        { title: 'Reports',            sub: 'Analytics & Defaulters' },
  '/admin':          { title: 'Admin Panel',        sub: 'System Configuration' },
};

export default function TopBar({ onMenuToggle, unreadCount = 0 }) {
  const { pathname } = useLocation();

  // Match current path (strip trailing parts for nested routes)
  const base = '/' + pathname.split('/')[1];
  const meta = pageMeta[base] || { title: 'Ajo Manager', sub: '' };

  return (
    <header className="topbar">
      <div className="topbar__left">
        {/* Hamburger — visible on tablet/mobile */}
        <button
          className="topbar__menu-btn"
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
        >
          <span /><span /><span />
        </button>

        <div>
          <h1 className="topbar__title">{meta.title}</h1>
          {meta.sub && <p className="topbar__sub">{meta.sub}</p>}
        </div>
      </div>

      <div className="topbar__right">
        <span className="topbar__live-badge">● LIVE</span>

        {/* Notification bell shortcut */}
        <a href="/notifications" className="topbar__bell" aria-label={`${unreadCount} unread notifications`}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
          </svg>
          {unreadCount > 0 && (
            <span className="topbar__bell-badge">{unreadCount}</span>
          )}
        </a>
      </div>
    </header>
  );
}
