// =============================================
// CONTRIBUTIONS PAGE
// Track and record weekly contributions per member.
// TODO: Fetch from GET /api/groups/:groupId/contributions
// TODO: Record payment via POST /api/contributions
// =============================================

import { useState } from 'react';
import Panel from '../../components/ui/Panel';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import { members, contributions, formatCurrency, formatDate } from '../../data/mockData';
import './Contributions.css';

const WEEKS = [1, 2, 3, 4];
const CYCLE  = 3;

export default function Contributions() {
  const [toast, setToast]       = useState(null);
  const [recordOpen, setRecordOpen] = useState(false);
  const [selectedMember, setSelected] = useState(null);
  const [form, setForm] = useState({ week: 4, amount: 50000, method: 'Bank Transfer', reference: '' });

  // Build a lookup: { memberId_week: contribution }
  const contribMap = {};
  contributions.filter(c => c.cycle === CYCLE).forEach(c => {
    contribMap[`${c.memberId}_${c.week}`] = c;
  });

  // Summary stats for current week
  const currentWeekContribs = contributions.filter(c => c.cycle === CYCLE && c.week === 4);
  const paidThisWeek   = currentWeekContribs.filter(c => c.status === 'paid').length;
  const pendingThisWeek = currentWeekContribs.filter(c => c.status === 'pending').length;
  const missedThisWeek  = members.length - currentWeekContribs.length + currentWeekContribs.filter(c => c.status === 'missed').length;

  const openRecord = (member) => {
    setSelected(member);
    setRecordOpen(true);
  };

  const handleRecord = () => {
    // TODO: POST /api/contributions { memberId, week, cycle, amount, method, reference }
    setRecordOpen(false);
    setToast({ message: `Contribution recorded for ${selectedMember.name}`, type: 'success' });
  };

  return (
    <div className="page-content">
      {/* Summary chips */}
      <div className="contrib-summary">
        <div className="contrib-chip contrib-chip--success">
          <div className="contrib-chip__val">{paidThisWeek}</div>
          <div className="contrib-chip__label">Paid — Week 4</div>
        </div>
        <div className="contrib-chip contrib-chip--warn">
          <div className="contrib-chip__val">{pendingThisWeek}</div>
          <div className="contrib-chip__label">Pending</div>
        </div>
        <div className="contrib-chip contrib-chip--danger">
          <div className="contrib-chip__val">{missedThisWeek}</div>
          <div className="contrib-chip__label">Missed / Not recorded</div>
        </div>
        <div className="contrib-chip">
          <div className="contrib-chip__val">{formatCurrency(paidThisWeek * 50000)}</div>
          <div className="contrib-chip__label">Collected this week</div>
        </div>
      </div>

      {/* Contribution Grid — all members × all weeks */}
      <Panel
        title={`Cycle ${CYCLE} Contribution Tracker`}
        action={
          <Button size="sm" onClick={() => openRecord(members[0])}>+ Record Payment</Button>
        }
      >
        <div className="contrib-grid-wrap">
          <table className="contrib-grid">
            <thead>
              <tr>
                <th className="contrib-grid__member-col">Member</th>
                {WEEKS.map(w => (
                  <th key={w} className="contrib-grid__week-col">Week {w}</th>
                ))}
                <th>Total Paid</th>
                <th>Owing</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => {
                const totalPaid = WEEKS.reduce((sum, w) => {
                  const c = contribMap[`${m.id}_${w}`];
                  return sum + (c?.status === 'paid' ? c.amount : 0);
                }, 0);

                return (
                  <tr key={m.id}>
                    <td>
                      <div className="contrib-member-cell">
                        <div className="contrib-avatar">{m.avatar}</div>
                        <div>
                          <div className="contrib-member-name">{m.name}</div>
                          <div className="contrib-member-pos">Position #{m.position}</div>
                        </div>
                      </div>
                    </td>

                    {WEEKS.map(w => {
                      const c = contribMap[`${m.id}_${w}`];
                      return (
                        <td key={w} className="contrib-grid__week-cell">
                          {c ? (
                            <div className="contrib-week-badge">
                              <Badge status={c.status} />
                              {c.status === 'paid' && (
                                <div className="contrib-week-date">{formatDate(c.datePaid)}</div>
                              )}
                            </div>
                          ) : (
                            <span className="contrib-grid__empty">—</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="cell-mono success">{formatCurrency(totalPaid)}</td>
                    <td className={`cell-mono ${m.owing > 0 ? 'danger' : 'muted'}`}>
                      {m.owing > 0 ? formatCurrency(m.owing) : '—'}
                    </td>
                    <td>
                      <button className="contrib-record-btn" onClick={() => openRecord(m)}>
                        Record
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* All contributions log */}
      <Panel title="All Contributions — Detailed Log">
        <div className="contrib-log-wrap">
          <table className="detail-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Cycle/Week</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date Paid</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map(c => (
                <tr key={c.id}>
                  <td className="cell-name">{c.memberName}</td>
                  <td className="cell-mono">C{c.cycle}/W{c.week}</td>
                  <td className="cell-mono">{formatCurrency(c.amount)}</td>
                  <td>{c.method || '—'}</td>
                  <td className="cell-mono">{formatDate(c.datePaid)}</td>
                  <td className="cell-mono muted">{c.reference || '—'}</td>
                  <td><Badge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Record Modal */}
      <Modal
        isOpen={recordOpen}
        onClose={() => setRecordOpen(false)}
        title={`Record Contribution${selectedMember ? ` — ${selectedMember.name}` : ''}`}
        confirmLabel="Save Contribution"
        onConfirm={handleRecord}
      >
        <div className="form-field">
          <label>Member</label>
          <select value={selectedMember?.id} onChange={e => setSelected(members.find(m => m.id === e.target.value))}>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="form-grid-2">
          <div className="form-field">
            <label>Cycle</label>
            <input type="number" value={CYCLE} readOnly />
          </div>
          <div className="form-field">
            <label>Week</label>
            <select value={form.week} onChange={e => setForm(p => ({ ...p, week: +e.target.value }))}>
              {WEEKS.map(w => <option key={w} value={w}>Week {w}</option>)}
            </select>
          </div>
        </div>
        <div className="form-field">
          <label>Amount (₦)</label>
          <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: +e.target.value }))} />
        </div>
        <div className="form-field">
          <label>Payment Method</label>
          <select value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))}>
            <option>Bank Transfer</option>
            <option>Card</option>
            <option>USSD</option>
            <option>Cash</option>
          </select>
        </div>
        <div className="form-field">
          <label>Reference / Notes</label>
          <input type="text" placeholder="Transaction reference or note" value={form.reference} onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} />
        </div>
      </Modal>

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
