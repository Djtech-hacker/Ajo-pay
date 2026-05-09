// =============================================
// MEETINGS PAGE
// Shows all meetings, schedule new ones.
// TODO: Fetch from GET /api/groups/:groupId/meetings
// =============================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Panel from '../../components/ui/Panel';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import { meetings, formatDate } from '../../data/mockData';
import './Meetings.css';

export default function Meetings() {
  const [newOpen, setNewOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: '', date: '', time: '10:00', venue: '', type: 'weekly',
  });

  const upcoming  = meetings.filter(m => m.status === 'upcoming');
  const completed = meetings.filter(m => m.status === 'completed');

  const handleCreate = () => {
    // TODO: POST /api/meetings { ...form, groupId }
    setNewOpen(false);
    setToast({ message: 'Meeting scheduled successfully!', type: 'success' });
  };

  return (
    <div className="page-content">
      {/* Upcoming meetings */}
      <Panel
        title="Upcoming Meetings"
        action={<Button size="sm" onClick={() => setNewOpen(true)}>+ Schedule Meeting</Button>}
      >
        {upcoming.length === 0 ? (
          <div className="empty-state"><p>No upcoming meetings scheduled.</p></div>
        ) : upcoming.map(m => (
          <MeetingCard key={m.id} meeting={m} />
        ))}
      </Panel>

      {/* Past meetings */}
      <Panel title="Past Meetings">
        {completed.map(m => (
          <MeetingCard key={m.id} meeting={m} past />
        ))}
      </Panel>

      {/* Schedule Modal */}
      <Modal
        isOpen={newOpen}
        onClose={() => setNewOpen(false)}
        title="Schedule New Meeting"
        confirmLabel="Schedule"
        onConfirm={handleCreate}
        size="md"
      >
        <div className="form-field">
          <label>Meeting Title</label>
          <input placeholder="e.g. Week 5 Contribution — Cycle 3" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        </div>
        <div className="form-grid-2">
          <div className="form-field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>Time</label>
            <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
          </div>
        </div>
        <div className="form-field">
          <label>Venue / Link</label>
          <input placeholder="Physical address or virtual meeting link" value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} />
        </div>
        <div className="form-field">
          <label>Meeting Type</label>
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
            <option value="weekly">Weekly Contribution</option>
            <option value="extraordinary">Extraordinary</option>
            <option value="agm">Annual General Meeting</option>
          </select>
        </div>
      </Modal>

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}

function MeetingCard({ meeting: m, past }) {
  const dateObj  = new Date(m.date);
  const day      = dateObj.getDate();
  const monthStr = dateObj.toLocaleString('en', { month: 'short' });

  const attendancePct = m.expectedAttendance > 0
    ? Math.round((m.attendanceCount / m.expectedAttendance) * 100)
    : 0;

  return (
    <div className={`meeting-card ${past ? 'meeting-card--past' : 'meeting-card--upcoming'}`}>
      <div className="meeting-card__date">
        <div className="meeting-card__day">{day}</div>
        <div className="meeting-card__month">{monthStr}</div>
      </div>

      <div className="meeting-card__body">
        <div className="meeting-card__header">
          <div className="meeting-card__title">{m.title}</div>
          <Badge status={m.status} />
        </div>
        <div className="meeting-card__meta">🕙 {m.time}  ·  📍 {m.venue}</div>
        <div className="meeting-card__meta">👤 Chair: {m.chairperson}</div>

        {past && m.attendanceCount > 0 && (
          <div className="meeting-card__attendance">
            <div className="meeting-attendance-bar">
              <div className="meeting-attendance-fill" style={{ width: `${attendancePct}%` }} />
            </div>
            <span className="meeting-attendance-label">
              {m.attendanceCount}/{m.expectedAttendance} attended ({attendancePct}%)
            </span>
          </div>
        )}

        {!past && (
          <div className="meeting-card__agenda-preview">
            {m.agendaItems.slice(0, 3).map((item, i) => (
              <span key={i} className="agenda-chip">{item}</span>
            ))}
            {m.agendaItems.length > 3 && (
              <span className="agenda-chip agenda-chip--more">+{m.agendaItems.length - 3} more</span>
            )}
          </div>
        )}

        {past && m.minutes && (
          <p className="meeting-card__minutes">{m.minutes}</p>
        )}
      </div>

      <Link to={`/meetings/${m.id}`} className="meeting-card__link">View →</Link>
    </div>
  );
}
