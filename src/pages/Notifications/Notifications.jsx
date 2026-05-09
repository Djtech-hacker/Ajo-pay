// =============================================
// NOTIFICATIONS PAGE
// Shows all system notifications with filters.
// TODO: Fetch from GET /api/notifications
// TODO: Mark read via PATCH /api/notifications/:id/read
// =============================================

import { useState } from 'react';
import Panel from '../../components/ui/Panel';
import Button from '../../components/ui/Button';
import { notifications as initialNotifs } from '../../data/mockData';
import './Notifications.css';

const typeIcons = {
  reminder: '⏰',
  payout:   '💸',
  defaulter:'⚠️',
  meeting:  '📅',
  agenda:   '📋',
  success:  '✅',
  member:   '👤',
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(initialNotifs);
  const [filter, setFilter] = useState('all');

  const markRead = (id) => {
    // TODO: PATCH /api/notifications/:id { read: true }
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    // TODO: PATCH /api/notifications/read-all
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = filter === 'all'   ? notifs
                 : filter === 'unread' ? notifs.filter(n => !n.read)
                 : notifs.filter(n => n.type === filter);

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="page-content">
      {/* Header stats */}
      <div className="notif-header">
        <div className="notif-header__stats">
          <span className="notif-count">{unreadCount}</span>
          <span className="notif-count-label">unread notifications</span>
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="secondary" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Type filters */}
      <div className="notif-filters">
        {['all', 'unread', 'reminder', 'payout', 'defaulter', 'meeting', 'agenda'].map(f => (
          <button
            key={f}
            className={`notif-filter ${filter === f ? 'notif-filter--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <Panel title={`Notifications (${filtered.length})`}>
        {filtered.length === 0 ? (
          <div className="empty-state"><p>No notifications in this category.</p></div>
        ) : filtered.map(n => (
          <div
            key={n.id}
            className={`notif-item notif-item--${n.priority} ${!n.read ? 'notif-item--unread' : ''}`}
            onClick={() => markRead(n.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && markRead(n.id)}
          >
            <div className={`notif-item__icon notif-icon--${n.type}`}>
              {typeIcons[n.type] || '🔔'}
            </div>

            <div className="notif-item__body">
              <div className="notif-item__title">
                {n.title}
                {!n.read && <span className="notif-unread-dot" />}
              </div>
              <p className="notif-item__message">{n.message}</p>
              <div className="notif-item__time">
                {new Date(n.createdAt).toLocaleDateString('en-NG', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>

            <div className="notif-item__priority">
              <span className={`notif-priority-dot notif-priority-dot--${n.priority}`} />
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}
