// =============================================
// SIDEBAR COMPONENT
// Persistent left navigation for all pages.
// =============================================

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

// --- Nav item data — add/remove items here ---
const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard',     label: 'Dashboard',       icon: <IconDashboard /> },
    ],
  },
  {
    label: 'Members',
    items: [
      { to: '/members',       label: 'All Members',     icon: <IconMembers /> },
      { to: '/contributions', label: 'Contributions',   icon: <IconContrib /> },
      { to: '/deposits',      label: 'Deposits & Pay',  icon: <IconDeposit /> },
    ],
  },
  {
    label: 'Meetings',
    items: [
      { to: '/meetings',      label: 'Meetings',        icon: <IconMeetings /> },
      { to: '/agenda',        label: 'Agenda',          icon: <IconAgenda /> },
      { to: '/attendance',    label: 'Attendance',      icon: <IconAttendance /> },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/notifications', label: 'Notifications',   icon: <IconBell />, badge: true },
      { to: '/reports',       label: 'Reports',         icon: <IconReports /> },
      { to: '/admin',         label: 'Admin Panel',     icon: <IconAdmin />, adminOnly: true },
    ],
  },
];

export default function Sidebar({ unreadCount = 0, isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter admin-only items based on user role
  const filteredSections = navSections.map(section => ({
    ...section,
    items: section.items.filter(item => !item.adminOnly || user?.role === 'admin'),
  }));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} aria-label="Main navigation">
        {/* Logo */}
        <div className="sidebar__logo">
          <div className="sidebar__logo-mark">
            <div className="sidebar__logo-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#c8f54a" strokeWidth="1.5"/>
                <path d="M6 10c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4" stroke="#c8f54a" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="10" cy="10" r="1.5" fill="#c8f54a"/>
              </svg>
            </div>
            <div>
              <div className="sidebar__logo-text">Ajo Manager</div>
              <div className="sidebar__logo-sub">Savings Circle OS</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {filteredSections.map(section => (
            <div key={section.label} className="sidebar__section">
              <span className="sidebar__section-label">{section.label}</span>
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar__item${isActive ? ' sidebar__item--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <span className="sidebar__item-icon" aria-hidden="true">{item.icon}</span>
                  <span className="sidebar__item-label">{item.label}</span>
                  {item.badge && unreadCount > 0 && (
                    <span className="sidebar__badge">{unreadCount}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar" aria-label={`User: ${user?.name}`}>
              {user?.initials || 'U'}
            </div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user?.name || 'User'}</div>
              <div className="sidebar__user-role">{user?.role}</div>
            </div>
            <button
              className="sidebar__logout"
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
            >
              <IconLogout />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ---- Inline SVG Icons ----
function IconDashboard() {
  return <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/></svg>;
}
function IconMembers() {
  return <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>;
}
function IconContrib() {
  return <svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/></svg>;
}
function IconDeposit() {
  return <svg viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/></svg>;
}
function IconMeetings() {
  return <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg>;
}
function IconAgenda() {
  return <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>;
}
function IconAttendance() {
  return <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>;
}
function IconBell() {
  return <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>;
}
function IconReports() {
  return <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd"/></svg>;
}
function IconAdmin() {
  return <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>;
}
function IconLogout() {
  return <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/></svg>;
}
