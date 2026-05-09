// =============================================
// ATTENDANCE PAGE
// Mark and view attendance per meeting.
// TODO: Fetch from GET /api/meetings/:id/attendance
// TODO: Save via POST /api/attendance
// =============================================

import { useState } from 'react';
import Panel from '../../components/ui/Panel';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import Badge from '../../components/ui/Badge';
import { meetings, members, attendance as attendanceData, formatDate } from '../../data/mockData';
import './Attendance.css';

export default function Attendance() {
  const [selectedMeeting, setSelectedMeeting] = useState('m004'); // default to upcoming
  const [localAttendance, setLocalAttendance] = useState(
    // pre-fill from existing data
    Object.fromEntries(
      (attendanceData[selectedMeeting] || []).map(a => [a.memberId, a.status])
    )
  );
  const [toast, setToast] = useState(null);

  const meeting = meetings.find(m => m.id === selectedMeeting);

  const toggle = (memberId) => {
    setLocalAttendance(prev => ({
      ...prev,
      [memberId]: prev[memberId] === 'present' ? 'absent' : 'present',
    }));
  };

  const markAll = (status) => {
    const all = {};
    members.forEach(m => { all[m.id] = status; });
    setLocalAttendance(all);
  };

  const handleSave = () => {
    // TODO: POST /api/meetings/:id/attendance { records: [...] }
    setToast({ message: 'Attendance saved successfully!', type: 'success' });
  };

  const presentCount = Object.values(localAttendance).filter(s => s === 'present').length;
  const absentCount  = Object.values(localAttendance).filter(s => s === 'absent').length;
  const unmarked     = members.length - presentCount - absentCount;

  // Summary across all meetings
  const allMeetingsSummary = meetings.filter(m => m.status === 'completed').map(m => {
    const records = attendanceData[m.id] || [];
    const present = records.filter(a => a.status === 'present').length;
    return {
      ...m,
      presentCount: present,
      pct: m.expectedAttendance > 0 ? Math.round((present / m.expectedAttendance) * 100) : 0,
    };
  });

  return (
    <div className="page-content">
      {/* Meeting selector */}
      <div className="attendance-selector">
        <div className="attendance-selector__label">Select Meeting</div>
        <select
          value={selectedMeeting}
          onChange={e => {
            setSelectedMeeting(e.target.value);
            setLocalAttendance(
              Object.fromEntries(
                (attendanceData[e.target.value] || []).map(a => [a.memberId, a.status])
              )
            );
          }}
          className="attendance-select"
        >
          {meetings.map(m => (
            <option key={m.id} value={m.id}>
              {m.title} — {formatDate(m.date)}
            </option>
          ))}
        </select>
      </div>

      {/* Stats row */}
      <div className="attendance-stats">
        <div className="attendance-stat attendance-stat--success">
          <div className="attendance-stat__val">{presentCount}</div>
          <div className="attendance-stat__label">Present</div>
        </div>
        <div className="attendance-stat attendance-stat--danger">
          <div className="attendance-stat__val">{absentCount}</div>
          <div className="attendance-stat__label">Absent</div>
        </div>
        <div className="attendance-stat">
          <div className="attendance-stat__val">{unmarked}</div>
          <div className="attendance-stat__label">Not Marked</div>
        </div>
        <div className="attendance-stat attendance-stat--info">
          <div className="attendance-stat__val">
            {members.length > 0 ? Math.round((presentCount / members.length) * 100) : 0}%
          </div>
          <div className="attendance-stat__label">Attendance Rate</div>
        </div>
      </div>

      {/* Mark attendance panel */}
      <Panel
        title={`Mark Attendance — ${meeting?.title || ''}`}
        action={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="attendance-action-btn" onClick={() => markAll('present')}>Mark All Present</button>
            <button className="attendance-action-btn attendance-action-btn--danger" onClick={() => markAll('absent')}>Mark All Absent</button>
          </div>
        }
      >
        <div className="attendance-mark-grid">
          {members.map(m => {
            const status = localAttendance[m.id] || 'unmarked';
            return (
              <div
                key={m.id}
                className={`attendance-mark-card attendance-mark-card--${status}`}
                onClick={() => toggle(m.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && toggle(m.id)}
                aria-pressed={status === 'present'}
                aria-label={`${m.name} — ${status}`}
              >
                <div className="attendance-mark-avatar">{m.avatar}</div>
                <div className="attendance-mark-name">{m.name.split(' ')[0]}</div>
                <div className="attendance-mark-pos">#{m.position}</div>
                <div className="attendance-mark-check">
                  {status === 'present' ? '✓' : status === 'absent' ? '✕' : '○'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="attendance-save-row">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)' }}>
            {presentCount} present · {absentCount} absent · {unmarked} unmarked
          </span>
          <Button onClick={handleSave}>Save Attendance</Button>
        </div>
      </Panel>

      {/* Historical summary */}
      <Panel title="Attendance History">
        <div className="attendance-history">
          {allMeetingsSummary.map(m => (
            <div key={m.id} className="attendance-history-row">
              <div className="attendance-history-title">{m.title}</div>
              <div className="attendance-history-date">{formatDate(m.date)}</div>
              <div className="attendance-history-bar-wrap">
                <div className="attendance-history-bar">
                  <div className="attendance-history-fill" style={{ width: `${m.pct}%` }} />
                </div>
                <span className="attendance-history-pct">{m.pct}%</span>
              </div>
              <div className="attendance-history-count">{m.presentCount}/{m.expectedAttendance}</div>
            </div>
          ))}
        </div>
      </Panel>

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
