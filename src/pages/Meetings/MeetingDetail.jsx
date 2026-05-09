// =============================================
// MEETING DETAIL PAGE
// TODO: Fetch from GET /api/meetings/:id
// =============================================

import { useParams, Link } from 'react-router-dom';
import Panel from '../../components/ui/Panel';
import Badge from '../../components/ui/Badge';
import { meetings, attendance, members, formatDate } from '../../data/mockData';
import './MeetingDetail.css';

export default function MeetingDetail() {
  const { id } = useParams();
  const meeting = meetings.find(m => m.id === id);

  if (!meeting) {
    return (
      <div className="page-content">
        <div className="empty-state"><p>Meeting not found.</p></div>
      </div>
    );
  }

  const meetingAttendance = attendance[id] || [];

  const getAttendanceStatus = (memberId) => {
    const record = meetingAttendance.find(a => a.memberId === memberId);
    return record?.status || (meeting.status === 'upcoming' ? 'not-recorded' : 'absent');
  };

  const presentCount = meetingAttendance.filter(a => a.status === 'present').length;
  const absentCount  = meetingAttendance.filter(a => a.status === 'absent').length;

  return (
    <div className="page-content">
      <Link to="/meetings" className="back-link">← Back to Meetings</Link>

      {/* Meeting header */}
      <div className="meeting-detail-header">
        <div className="meeting-detail-date">
          <div className="meeting-detail-day">{new Date(meeting.date).getDate()}</div>
          <div className="meeting-detail-month">
            {new Date(meeting.date).toLocaleString('en', { month: 'short', year: 'numeric' })}
          </div>
        </div>
        <div className="meeting-detail-info">
          <div className="meeting-detail-title">{meeting.title}</div>
          <div className="meeting-detail-meta">🕙 {meeting.time}  ·  📍 {meeting.venue}</div>
          <div className="meeting-detail-meta">👤 Chairperson: {meeting.chairperson}</div>
        </div>
        <Badge status={meeting.status} dot />
      </div>

      <div className="meeting-detail-grid">
        {/* Agenda */}
        <Panel title="Meeting Agenda">
          <ol className="agenda-list">
            {meeting.agendaItems.map((item, i) => (
              <li key={i} className="agenda-item">
                <span className="agenda-item__num">{i + 1}</span>
                <span className="agenda-item__text">{item}</span>
              </li>
            ))}
          </ol>
        </Panel>

        {/* Minutes / Notes */}
        <Panel title="Minutes & Notes">
          {meeting.minutes ? (
            <p className="meeting-minutes">{meeting.minutes}</p>
          ) : (
            <div className="empty-state"><p>Minutes will be recorded after the meeting.</p></div>
          )}
          {meeting.status === 'upcoming' && (
            <div style={{ marginTop: 14 }}>
              <textarea
                className="minutes-textarea"
                placeholder="Add meeting minutes / notes here…"
                rows={5}
              />
            </div>
          )}
        </Panel>
      </div>

      {/* Attendance */}
      <Panel
        title="Attendance"
        action={
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)' }}>
            <span className="success-text">✓ Present: {presentCount}</span>
            <span className="danger-text">✕ Absent: {absentCount}</span>
          </div>
        }
      >
        <div className="attendance-grid">
          {members.map(m => {
            const status = getAttendanceStatus(m.id);
            return (
              <div key={m.id} className={`attendance-member attendance-member--${status}`}>
                <div className="attendance-avatar">{m.avatar}</div>
                <div className="attendance-name">{m.name.split(' ')[0]}</div>
                <div className={`attendance-status attendance-status--${status}`}>
                  {status === 'present' ? '✓' : status === 'absent' ? '✕' : '?'}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
