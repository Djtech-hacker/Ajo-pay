// =============================================
// DEPOSITS & PAYOUTS PAGE
// Manage payout disbursements to members.
// TODO: Fetch from GET /api/groups/:groupId/payouts
// TODO: Process payout via POST /api/payouts
// =============================================

import { useState } from 'react';
import Panel from '../../components/ui/Panel';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import Toggle from '../../components/ui/Toggle';
import { payouts, members, formatCurrency, formatDate, nigerianBanks } from '../../data/mockData';
import './Deposits.css';

export default function Deposits() {
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [secure3ds, setSecure3ds] = useState(true);
  const [saveMethod, setSaveMethod] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const [form, setForm] = useState({
    memberId: members[8].id, // Chiamaka — next in queue
    amount: 1000000,
    bank: 'Kuda Bank',
    accountNo: '',
    accountName: '',
    narration: 'Ajo payout — Cycle 3, Week 4',
    method: 'Bank Transfer',
  });

  const filtered = activeTab === 'all'
    ? payouts
    : payouts.filter(p => p.status === activeTab);

  const totalDisbursed = payouts
    .filter(p => p.status === 'completed')
    .reduce((s, p) => s + p.amount, 0);

  const pendingAmount = payouts
    .filter(p => p.status === 'pending')
    .reduce((s, p) => s + p.amount, 0);

  const handleProcessPayout = () => {
    // TODO: POST /api/payouts { ...form }
    setPayoutOpen(false);
    setSuccessOpen(true);
  };

  const handleConfirm = () => {
    setSuccessOpen(false);
    setToast({ message: 'Payout processed successfully!', type: 'success' });
  };

  // Next recipient (first member with no completed payout in current cycle 3)
  const paidIds = payouts.filter(p => p.cycle === 3 && p.status === 'completed').map(p => p.recipientId);
  const nextRecipient = members.find(m => !paidIds.includes(m.id) && m.status === 'active');

  return (
    <div className="page-content">
      {/* Metric row */}
      <div className="deposits-metrics">
        <div className="deposits-metric">
          <div className="deposits-metric__label">Total Disbursed</div>
          <div className="deposits-metric__val success">{formatCurrency(totalDisbursed)}</div>
          <div className="deposits-metric__sub">{payouts.filter(p => p.status === 'completed').length} payouts completed</div>
        </div>
        <div className="deposits-metric">
          <div className="deposits-metric__label">Pending Payouts</div>
          <div className="deposits-metric__val warn">{formatCurrency(pendingAmount)}</div>
          <div className="deposits-metric__sub">{payouts.filter(p => p.status === 'pending').length} awaiting processing</div>
        </div>
        <div className="deposits-metric deposits-metric--accent">
          <div className="deposits-metric__label">Next Payout</div>
          <div className="deposits-metric__val">{nextRecipient?.name || '—'}</div>
          <div className="deposits-metric__sub">Position #{nextRecipient?.position} · {formatCurrency(1000000)}</div>
        </div>
        <div className="deposits-metric">
          <div className="deposits-metric__label">Payout Progress</div>
          <div className="deposits-metric__val">{payouts.filter(p => p.cycle === 3).length} / {members.length}</div>
          <div className="deposits-metric__sub">Members paid in Cycle 3</div>
        </div>
      </div>

      {/* Rotation schedule */}
      <Panel title="Payout Rotation — Cycle 3">
        <div className="rotation-grid">
          {members.slice(0, 12).map(m => {
            const payout = payouts.find(p => p.recipientId === m.id && p.cycle === 3);
            const status = payout?.status || (m.id === nextRecipient?.id ? 'upcoming' : 'pending');
            return (
              <div key={m.id} className={`rotation-card rotation-card--${status}`}>
                <div className="rotation-card__pos">#{m.position}</div>
                <div className="rotation-card__avatar">{m.avatar}</div>
                <div className="rotation-card__name">{m.name.split(' ')[0]}</div>
                <Badge status={status} />
                {payout?.datePaid && (
                  <div className="rotation-card__date">{formatDate(payout.datePaid)}</div>
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Payout history */}
      <Panel
        title="Payout History"
        action={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="deps-tabs">
              {['all', 'completed', 'pending'].map(t => (
                <button
                  key={t}
                  className={`deps-tab ${activeTab === t ? 'deps-tab--active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button size="sm" onClick={() => setPayoutOpen(true)}>+ Process Payout</Button>
          </div>
        }
      >
        <div className="deposits-table-wrap">
          <table className="detail-table">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Cycle/Week</th>
                <th>Amount</th>
                <th>Bank</th>
                <th>Account</th>
                <th>Date</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24, color: 'var(--ink3)' }}>No payouts found.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td className="cell-name">{p.recipientName}</td>
                  <td className="cell-mono">C{p.cycle}/W{p.week}</td>
                  <td className="cell-mono success">{formatCurrency(p.amount)}</td>
                  <td>{p.bank}</td>
                  <td className="cell-mono muted">{p.accountNo}</td>
                  <td className="cell-mono">{formatDate(p.datePaid)}</td>
                  <td className="cell-mono muted" style={{ fontSize: 10 }}>{p.reference}</td>
                  <td><Badge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Process Payout Modal */}
      <Modal
        isOpen={payoutOpen}
        onClose={() => setPayoutOpen(false)}
        title="Process New Payout"
        confirmLabel="Review & Send →"
        onConfirm={handleProcessPayout}
        size="md"
      >
        <div className="form-field">
          <label>Recipient</label>
          <select value={form.memberId} onChange={e => setForm(p => ({ ...p, memberId: e.target.value }))}>
            {members.map(m => <option key={m.id} value={m.id}>{m.name} — Position #{m.position}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label>Amount (₦)</label>
          <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: +e.target.value }))} />
        </div>
        <div className="form-grid-2">
          <div className="form-field">
            <label>Bank</label>
            <select value={form.bank} onChange={e => setForm(p => ({ ...p, bank: e.target.value }))}>
              {nigerianBanks.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Account Number</label>
            <input maxLength={10} placeholder="10-digit NUBAN" value={form.accountNo} onChange={e => setForm(p => ({ ...p, accountNo: e.target.value }))} />
          </div>
        </div>
        <div className="form-field">
          <label>Account Name</label>
          <input placeholder="Confirm account name" value={form.accountName} onChange={e => setForm(p => ({ ...p, accountName: e.target.value }))} />
        </div>
        <div className="form-field">
          <label>Narration</label>
          <input value={form.narration} onChange={e => setForm(p => ({ ...p, narration: e.target.value }))} />
        </div>
        <div className="divider" />
        <Toggle id="3ds" checked={secure3ds} onChange={setSecure3ds} label="Require OTP Confirmation" description="Dual verification for this transaction" />
        <Toggle id="save" checked={saveMethod} onChange={setSaveMethod} label="Save bank details" description="Store for future payouts to this member" />
      </Modal>

      {/* Success confirmation modal */}
      <Modal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Confirm Transfer"
        confirmLabel="Confirm & Send"
        onConfirm={handleConfirm}
        cancelLabel="Go Back"
        size="sm"
      >
        <div style={{ textAlign: 'center', padding: '10px 0 16px' }}>
          <div className="modal__success-icon">
            <svg viewBox="0 0 20 20" fill="none" width="22" height="22">
              <path d="M5 10l4 4L15 6" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 500, color: 'var(--ink)' }}>
            {formatCurrency(form.amount)}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', marginTop: 6 }}>
            REF: PAYOUT-C3-{String(payouts.length + 1).padStart(3, '0')}
          </div>
        </div>
        <div style={{ background: 'var(--success-bg)', border: '0.5px solid var(--success-border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: 11, color: 'var(--success)', lineHeight: 1.5 }}>
          <strong>Ready to send</strong> — Transfer will be processed immediately. OTP confirmation will be sent via SMS.
        </div>
      </Modal>

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
