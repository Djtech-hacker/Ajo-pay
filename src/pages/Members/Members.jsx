// =============================================
// MEMBERS PAGE
// Full member directory with search + filter.
// TODO: Fetch from GET /api/groups/:groupId/members
// =============================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Panel from '../../components/ui/Panel';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import { members, formatCurrency } from '../../data/mockData';
import './Members.css';

export default function Members() {
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilter] = useState('all');
  const [toast, setToast]         = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Filter + search
  const filtered = members.filter(m => {
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.email.toLowerCase().includes(search.toLowerCase()) ||
                        m.phone.includes(search);
    return matchStatus && matchSearch;
  });

  const stats = {
    total:    members.length,
    active:   members.filter(m => m.status === 'active').length,
    defaulter: members.filter(m => m.status === 'defaulter').length,
    inactive: members.filter(m => m.status === 'inactive').length,
  };

  const handleInvite = () => {
    // TODO: POST /api/members/invite { email: inviteEmail }
    setInviteOpen(false);
    setInviteEmail('');
    setToast({ message: `Invite sent to ${inviteEmail}`, type: 'success' });
  };

  return (
    <div className="page-content">
      {/* Stat chips */}
      <div className="members-stats">
        {[
          { label: 'Total',     val: stats.total,     status: '' },
          { label: 'Active',    val: stats.active,    status: 'success' },
          { label: 'Defaulters',val: stats.defaulter, status: 'danger' },
          { label: 'Inactive',  val: stats.inactive,  status: 'warn' },
        ].map(s => (
          <div key={s.label} className={`members-stat members-stat--${s.status}`}>
            <div className="members-stat__val">{s.val}</div>
            <div className="members-stat__label">{s.label}</div>
          </div>
        ))}
      </div>

      <Panel
        title="Member Directory"
        action={
          <Button size="sm" onClick={() => setInviteOpen(true)}>+ Invite Member</Button>
        }
      >
        {/* Toolbar */}
        <div className="members-toolbar">
          <div className="members-search">
            <svg className="members-search__icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
            <input
              type="search"
              placeholder="Search by name, email or phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="members-filters">
            {['all', 'active', 'defaulter', 'inactive'].map(f => (
              <button
                key={f}
                className={`members-filter-btn ${filterStatus === f ? 'members-filter-btn--active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Members table */}
        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Member</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Total Paid</th>
                <th>Owing</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: 32, color: 'var(--ink3)' }}>
                    No members match your search.
                  </td>
                </tr>
              ) : filtered.map((m, i) => (
                <tr key={m.id}>
                  <td className="cell-mono">{i + 1}</td>
                  <td>
                    <div className="member-cell">
                      <div className="member-avatar">{m.avatar}</div>
                      <div>
                        <div className="member-name">{m.name}</div>
                        <div className="member-email">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="cell-mono">{m.phone}</td>
                  <td className="cell-mono">#{m.position}</td>
                  <td className="cell-mono success">{formatCurrency(m.totalPaid)}</td>
                  <td className={`cell-mono ${m.owing > 0 ? 'danger' : 'muted'}`}>
                    {m.owing > 0 ? formatCurrency(m.owing) : '—'}
                  </td>
                  <td>
                    <span className="member-role">{m.role}</span>
                  </td>
                  <td><Badge status={m.status} dot /></td>
                  <td>
                    <Link to={`/members/${m.id}`} className="members-view-btn">View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="members-footer">
          Showing {filtered.length} of {members.length} members
        </div>
      </Panel>

      {/* Invite Modal */}
      <Modal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite New Member"
        confirmLabel="Send Invite"
        onConfirm={handleInvite}
        size="sm"
      >
        <p style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 14 }}>
          An invitation email with a registration link will be sent. The member will require admin approval before joining.
        </p>
        <div className="form-field">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="member@email.com"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
          />
        </div>
      </Modal>

      {/* Toast */}
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
