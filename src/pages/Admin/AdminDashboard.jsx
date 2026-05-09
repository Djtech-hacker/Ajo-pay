// =============================================
// ADMIN DASHBOARD PAGE
// Full system controls for admins/treasurers.
// TODO: All actions backed by admin-only API routes.
// =============================================

import { useState } from 'react';
import Panel from '../../components/ui/Panel';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import Toggle from '../../components/ui/Toggle';
import {
  members, groups, contributions, payouts,
  defaultersReport, formatCurrency, formatDate,
} from '../../data/mockData';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [toast, setToast]             = useState(null);
  const [activeTab, setActiveTab]     = useState('overview');
  const [editGroupOpen, setEditGroup] = useState(false);
  const [removeOpen, setRemoveOpen]   = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Group settings form
  const [groupForm, setGroupForm] = useState({
    name:               groups[0].name,
    contributionAmount: groups[0].contributionAmount,
    frequency:          groups[0].frequency,
    nextMeetingDate:    groups[0].nextMeetingDate,
    cycleLength:        groups[0].cycleLength,
  });

  // System toggles
  const [systemSettings, setSystemSettings] = useState({
    autoReminders:    true,
    defaulterAlerts:  true,
    payoutOtp:        true,
    maintenanceMode:  false,
    emailNotifications: true,
    smsNotifications:   true,
  });

  const handleSaveGroup = () => {
    // TODO: PATCH /api/groups/:groupId { ...groupForm }
    setEditGroup(false);
    setToast({ message: 'Group settings updated.', type: 'success' });
  };

  const handleRemoveMember = () => {
    // TODO: DELETE /api/groups/:groupId/members/:memberId
    setRemoveOpen(false);
    setToast({ message: `${selectedMember?.name} has been removed.`, type: 'warn' });
  };

  const handleChangeRole = (member, newRole) => {
    // TODO: PATCH /api/members/:id { role: newRole }
    setToast({ message: `${member.name} role changed to ${newRole}.`, type: 'success' });
  };

  const handleToggle = (key, val) => {
    // TODO: PATCH /api/admin/settings { [key]: val }
    setSystemSettings(prev => ({ ...prev, [key]: val }));
  };

  // Computed stats
  const totalContributions  = contributions.filter(c => c.status === 'paid').length;
  const totalPayouts        = payouts.filter(p => p.status === 'completed').length;
  const collectionRate      = contributions.length > 0
    ? Math.round((totalContributions / contributions.length) * 100) : 0;

  const tabs = ['overview', 'members', 'group', 'system'];

  return (
    <div className="page-content">
      {/* Admin tab nav */}
      <div className="admin-tabs">
        {tabs.map(t => (
          <button
            key={t}
            className={`admin-tab ${activeTab === t ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ====== OVERVIEW TAB ====== */}
      {activeTab === 'overview' && (
        <>
          <div className="admin-metrics">
            {[
              { label: 'Total Members',       val: members.length,                         sub: `${members.filter(m => m.status === 'active').length} active` },
              { label: 'Payments Recorded',   val: totalContributions,                     sub: `${collectionRate}% collection rate` },
              { label: 'Payouts Completed',   val: totalPayouts,                           sub: formatCurrency(payouts.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0)) },
              { label: 'Active Defaulters',   val: defaultersReport.length,                sub: `${formatCurrency(defaultersReport.reduce((s, d) => s + d.amountOwed, 0))} owed`, accent: defaultersReport.length > 0 },
              { label: 'Current Cycle',       val: `Cycle ${groups[0].currentCycle}`,      sub: `of ${groups[0].totalCycles} total cycles` },
              { label: 'Next Meeting',        val: formatDate(groups[0].nextMeetingDate),   sub: groups[0].name },
            ].map(m => (
              <div key={m.label} className={`admin-metric ${m.accent ? 'admin-metric--danger' : ''}`}>
                <div className="admin-metric__label">{m.label}</div>
                <div className="admin-metric__val">{m.val}</div>
                <div className="admin-metric__sub">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <Panel title="Quick Actions">
            <div className="admin-quick-actions">
              {[
                { label: 'Edit Group Settings',    icon: '⚙️',  action: () => setEditGroup(true) },
                { label: 'Send Mass Reminder',     icon: '📨',  action: () => setToast({ message: 'Mass reminder sent to all members.', type: 'success' }) },
                { label: 'Export Full Report',     icon: '📊',  action: () => setToast({ message: 'Full report downloaded as CSV.', type: 'success' }) },
                { label: 'Advance Cycle',          icon: '🔄',  action: () => setToast({ message: 'New cycle advancement requires all payouts to be completed first.', type: 'warn' }) },
                { label: 'Backup Data',            icon: '💾',  action: () => setToast({ message: 'Data backup initiated.', type: 'success' }) },
                { label: 'Send Defaulter Notices', icon: '⚠️',  action: () => setToast({ message: `Notices sent to ${defaultersReport.length} defaulters.`, type: 'warn' }) },
              ].map(a => (
                <button key={a.label} className="admin-action-card" onClick={a.action}>
                  <span className="admin-action-icon">{a.icon}</span>
                  <span className="admin-action-label">{a.label}</span>
                </button>
              ))}
            </div>
          </Panel>

          {/* Payout queue */}
          <Panel title="Payout Queue — Remaining Cycle 3">
            <div className="admin-payout-queue">
              {members
                .filter(m => !payouts.some(p => p.recipientId === m.id && p.cycle === 3 && p.status === 'completed'))
                .slice(0, 6)
                .map((m, i) => (
                  <div key={m.id} className="payout-queue-row">
                    <div className="payout-queue-pos">#{i + 1}</div>
                    <div className="payout-queue-avatar">{m.avatar}</div>
                    <div className="payout-queue-name">{m.name}</div>
                    <div className="payout-queue-amount">{formatCurrency(1000000)}</div>
                    <Badge status={i === 0 ? 'upcoming' : 'pending'} />
                  </div>
                ))}
            </div>
          </Panel>
        </>
      )}

      {/* ====== MEMBERS TAB ====== */}
      {activeTab === 'members' && (
        <Panel title="Member Management">
          <div className="admin-members-table-wrap">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Position</th>
                  <th>Owing</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className="admin-member-cell">
                        <div className="admin-member-avatar">{m.avatar}</div>
                        <div>
                          <div className="admin-member-name">{m.name}</div>
                          <div className="admin-member-email">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="cell-mono">{m.phone}</td>
                    <td>
                      <select
                        className="admin-role-select"
                        defaultValue={m.role}
                        onChange={e => handleChangeRole(m, e.target.value)}
                      >
                        <option value="member">Member</option>
                        <option value="treasurer">Treasurer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td><Badge status={m.status} dot /></td>
                    <td className="cell-mono">{formatDate(m.joinDate)}</td>
                    <td className="cell-mono">#{m.position}</td>
                    <td className={`cell-mono ${m.owing > 0 ? 'danger' : 'muted'}`}>
                      {m.owing > 0 ? formatCurrency(m.owing) : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setToast({ message: `Profile updated for ${m.name}.`, type: 'success' })}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => { setSelectedMember(m); setRemoveOpen(true); }}
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* ====== GROUP SETTINGS TAB ====== */}
      {activeTab === 'group' && (
        <Panel
          title="Group Settings"
          action={<Button size="sm" onClick={handleSaveGroup}>Save Changes</Button>}
        >
          <div className="admin-group-form">
            <div className="admin-form-grid">
              <div className="form-field admin-form-full">
                <label>Group Name</label>
                <input
                  value={groupForm.name}
                  onChange={e => setGroupForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Contribution Amount (₦)</label>
                <input
                  type="number"
                  value={groupForm.contributionAmount}
                  onChange={e => setGroupForm(p => ({ ...p, contributionAmount: +e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Frequency</label>
                <select
                  value={groupForm.frequency}
                  onChange={e => setGroupForm(p => ({ ...p, frequency: e.target.value }))}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="form-field">
                <label>Cycle Length (members)</label>
                <input
                  type="number"
                  value={groupForm.cycleLength}
                  onChange={e => setGroupForm(p => ({ ...p, cycleLength: +e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Next Meeting Date</label>
                <input
                  type="date"
                  value={groupForm.nextMeetingDate}
                  onChange={e => setGroupForm(p => ({ ...p, nextMeetingDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="divider" />

            <div className="section-title">Cycle Progress</div>
            <div className="admin-cycle-info">
              <div className="admin-cycle-stat">
                <div className="admin-cycle-val">{groups[0].currentCycle}</div>
                <div className="admin-cycle-label">Current Cycle</div>
              </div>
              <div className="admin-cycle-stat">
                <div className="admin-cycle-val">{groups[0].totalCycles}</div>
                <div className="admin-cycle-label">Total Cycles</div>
              </div>
              <div className="admin-cycle-stat">
                <div className="admin-cycle-val">{groups[0].memberCount}</div>
                <div className="admin-cycle-label">Members</div>
              </div>
              <div className="admin-cycle-stat">
                <div className="admin-cycle-val">{formatCurrency(groups[0].contributionAmount)}</div>
                <div className="admin-cycle-label">Per Contribution</div>
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* ====== SYSTEM TAB ====== */}
      {activeTab === 'system' && (
        <>
          <Panel title="Notification Settings">
            <Toggle id="auto-remind"   checked={systemSettings.autoReminders}     onChange={v => handleToggle('autoReminders', v)}     label="Automatic Contribution Reminders"  description="Send SMS/email 48h before each meeting" />
            <Toggle id="def-alerts"    checked={systemSettings.defaulterAlerts}   onChange={v => handleToggle('defaulterAlerts', v)}   label="Defaulter Alerts to Admin"          description="Notify admin when a member misses 2+ payments" />
            <Toggle id="email-notif"   checked={systemSettings.emailNotifications} onChange={v => handleToggle('emailNotifications', v)} label="Email Notifications"               description="Send all alerts via email" />
            <Toggle id="sms-notif"     checked={systemSettings.smsNotifications}  onChange={v => handleToggle('smsNotifications', v)}  label="SMS Notifications"                  description="Send alerts via SMS (additional charges apply)" />
          </Panel>

          <Panel title="Security & Payments">
            <Toggle id="payout-otp"   checked={systemSettings.payoutOtp}        onChange={v => handleToggle('payoutOtp', v)}         label="OTP Required for Payouts"           description="Two-factor confirmation before every disbursement" />
          </Panel>

          <Panel title="Danger Zone">
            <div className="admin-danger-zone">
              <div className="admin-danger-item">
                <div>
                  <div className="admin-danger-title">Maintenance Mode</div>
                  <div className="admin-danger-desc">Lock app access for all members (admin only). Use during migrations.</div>
                </div>
                <Toggle
                  id="maintenance"
                  checked={systemSettings.maintenanceMode}
                  onChange={v => {
                    handleToggle('maintenanceMode', v);
                    setToast({ message: v ? 'Maintenance mode enabled.' : 'Maintenance mode disabled.', type: v ? 'warn' : 'success' });
                  }}
                />
              </div>
              <div className="divider" />
              <div className="admin-danger-item">
                <div>
                  <div className="admin-danger-title">Reset All Contributions for New Cycle</div>
                  <div className="admin-danger-desc">Starts a fresh cycle. This action cannot be undone. Requires confirmation.</div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setToast({ message: 'Cycle reset requires secondary admin approval first.', type: 'warn' })}
                >
                  Reset Cycle
                </Button>
              </div>
              <div className="divider" />
              <div className="admin-danger-item">
                <div>
                  <div className="admin-danger-title">Export Full Database Backup</div>
                  <div className="admin-danger-desc">Download all group data as a JSON backup file.</div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setToast({ message: 'Database backup initiated.', type: 'success' })}
                >
                  Download Backup
                </Button>
              </div>
            </div>
          </Panel>
        </>
      )}

      {/* Edit Group Modal */}
      <Modal
        isOpen={editGroupOpen}
        onClose={() => setEditGroup(false)}
        title="Edit Group Settings"
        confirmLabel="Save Settings"
        onConfirm={handleSaveGroup}
        size="md"
      >
        <div className="form-field">
          <label>Group Name</label>
          <input value={groupForm.name} onChange={e => setGroupForm(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="form-field">
          <label>Weekly Contribution Amount (₦)</label>
          <input type="number" value={groupForm.contributionAmount} onChange={e => setGroupForm(p => ({ ...p, contributionAmount: +e.target.value }))} />
        </div>
      </Modal>

      {/* Remove Member Confirm */}
      <Modal
        isOpen={removeOpen}
        onClose={() => setRemoveOpen(false)}
        title="Remove Member"
        confirmLabel="Yes, Remove"
        onConfirm={handleRemoveMember}
        size="sm"
      >
        <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6 }}>
          Are you sure you want to remove <strong>{selectedMember?.name}</strong> from the group?
          This action will be logged and cannot be reversed without admin re-invitation.
        </p>
        {selectedMember?.owing > 0 && (
          <div style={{ marginTop: 12, background: 'var(--danger-bg)', border: '0.5px solid var(--danger-border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: 12, color: 'var(--danger)' }}>
            ⚠️ This member has an outstanding balance of <strong>{formatCurrency(selectedMember.owing)}</strong>. Ensure this is settled before removal.
          </div>
        )}
      </Modal>

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
