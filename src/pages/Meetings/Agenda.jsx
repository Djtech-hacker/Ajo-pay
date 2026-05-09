// =============================================
// AGENDA PAGE
// Members submit agenda items for upcoming meetings.
// Admins approve or reject items.
// TODO: Fetch from GET /api/meetings/:id/agenda
// TODO: Submit via POST /api/agenda
// =============================================

import { useState } from 'react';
import Panel from '../../components/ui/Panel';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import { agendaSubmissions, meetings, members, formatDate } from '../../data/mockData';
import './Agenda.css';

export default function Agenda() {
  const [items, setItems]     = useState(agendaSubmissions);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [toast, setToast]     = useState(null);
  const [form, setForm]       = useState({ meetingId: 'm004', item: '', description: '' });

  const nextMeeting = meetings.find(m => m.status === 'upcoming');

  const handleApprove = (id) => {
    // TODO: PATCH /api/agenda/:id { status: 'approved' }
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'approved' } : i));
    setToast({ message: 'Agenda item approved.', type: 'success' });
  };

  const handleReject = (id) => {
    // TODO: PATCH /api/agenda/:id { status: 'rejected' }
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'rejected' } : i));
    setToast({ message: 'Agenda item declined.', type: 'warn' });
  };

  const handleSubmit = () => {
    if (!form.item.trim()) return;
    // TODO: POST /api/agenda { meetingId, item, memberId, description }
    const newItem = {
      id: `a${Date.now()}`,
      meetingId: form.meetingId,
      memberId: 'u001',
      memberName: 'Adaeze Kalu',
      item: form.item,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setItems(prev => [newItem, ...prev]);
    setSubmitOpen(false);
    setForm(p => ({ ...p, item: '', description: '' }));
    setToast({ message: 'Agenda item submitted for review.', type: 'success' });
  };

  const byStatus = {
    approved: items.filter(i => i.status === 'approved'),
    pending:  items.filter(i => i.status === 'pending'),
    rejected: items.filter(i => i.status === 'rejected'),
  };

  return (
    <div className="page-content">
      {/* Next meeting banner */}
      {nextMeeting && (
        <div className="agenda-meeting-banner">
          <div>
            <div className="agenda-banner-title">Accepting agenda for: {nextMeeting.title}</div>
            <div className="agenda-banner-sub">{formatDate(nextMeeting.date)} · {nextMeeting.time}</div>
          </div>
          <Button size="sm" onClick={() => setSubmitOpen(true)}>+ Submit Item</Button>
        </div>
      )}

      {/* Approved items */}
      <Panel title={`Approved Items (${byStatus.approved.length})`}>
        {byStatus.approved.length === 0 ? (
          <div className="empty-state"><p>No approved items yet.</p></div>
        ) : byStatus.approved.map(item => (
          <AgendaItem key={item.id} item={item} />
        ))}
      </Panel>

      {/* Pending review */}
      <Panel
        title={`Pending Review (${byStatus.pending.length})`}
        action={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--warn)' }}>Admin action required</span>}
      >
        {byStatus.pending.length === 0 ? (
          <div className="empty-state"><p>No items pending review.</p></div>
        ) : byStatus.pending.map(item => (
          <AgendaItem
            key={item.id}
            item={item}
            showActions
            onApprove={() => handleApprove(item.id)}
            onReject={() => handleReject(item.id)}
          />
        ))}
      </Panel>

      {/* Rejected */}
      {byStatus.rejected.length > 0 && (
        <Panel title={`Declined (${byStatus.rejected.length})`}>
          {byStatus.rejected.map(item => (
            <AgendaItem key={item.id} item={item} />
          ))}
        </Panel>
      )}

      {/* Submit modal */}
      <Modal
        isOpen={submitOpen}
        onClose={() => setSubmitOpen(false)}
        title="Submit Agenda Item"
        confirmLabel="Submit for Review"
        onConfirm={handleSubmit}
        size="md"
      >
        <div className="form-field">
          <label>Meeting</label>
          <select value={form.meetingId} onChange={e => setForm(p => ({ ...p, meetingId: e.target.value }))}>
            {meetings.filter(m => m.status === 'upcoming').map(m => (
              <option key={m.id} value={m.id}>{m.title} — {formatDate(m.date)}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Agenda Item</label>
          <input
            placeholder="Brief title for your agenda item"
            value={form.item}
            onChange={e => setForm(p => ({ ...p, item: e.target.value }))}
          />
        </div>
        <div className="form-field">
          <label>Additional Details (optional)</label>
          <textarea
            placeholder="Provide context or supporting information…"
            rows={4}
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            style={{ height: 'auto', padding: '10px 12px' }}
          />
        </div>
        <p style={{ fontSize: 11, color: 'var(--ink3)', lineHeight: 1.5 }}>
          Submitted items are reviewed by the admin/treasurer before being added to the official agenda.
        </p>
      </Modal>

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}

function AgendaItem({ item, showActions, onApprove, onReject }) {
  return (
    <div className="agenda-submission-card">
      <div className="agenda-submission-icon">
        {item.status === 'approved' ? '✓' : item.status === 'rejected' ? '✕' : '⋯'}
      </div>
      <div className="agenda-submission-body">
        <div className="agenda-submission-text">{item.item}</div>
        <div className="agenda-submission-meta">
          {item.memberName} · {new Date(item.submittedAt).toLocaleDateString('en-NG')}
        </div>
      </div>
      <Badge status={item.status} />
      {showActions && (
        <div className="agenda-actions">
          <Button size="sm" onClick={onApprove}>Approve</Button>
          <Button size="sm" variant="danger" onClick={onReject}>Decline</Button>
        </div>
      )}
    </div>
  );
}
