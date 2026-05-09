// =============================================
// MEMBER DETAIL PAGE
// Shows individual member profile, contributions, and payout position.
// TODO: Fetch from GET /api/members/:id
// =============================================

import { useParams, Link } from 'react-router-dom';
import Panel from '../../components/ui/Panel';
import Badge from '../../components/ui/Badge';
import { members, contributions, payouts, formatCurrency, formatDate } from '../../data/mockData';
import './MemberDetail.css';

export default function MemberDetail() {
  const { id } = useParams();

  // TODO: Replace with API call → GET /api/members/:id
  const member = members.find(m => m.id === id);

  if (!member) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <p>Member not found.</p>
          <Link to="/members">← Back to Members</Link>
        </div>
      </div>
    );
  }

  // Filter this member's contributions and payouts
  const memberContribs = contributions.filter(c => c.memberId === id);
  const memberPayouts  = payouts.filter(p => p.recipientId === id);

  const paidCount  = memberContribs.filter(c => c.status === 'paid').length;
  const missedCount = memberContribs.filter(c => c.status === 'missed').length;
  const attendanceRate = memberContribs.length > 0
    ? Math.round((paidCount / memberContribs.length) * 100)
    : 0;

  return (
    <div className="page-content">
      {/* Back link */}
      <Link to="/members" className="back-link">← Back to Members</Link>

      <div className="member-detail-grid">
        {/* Profile card */}
        <div className="member-profile-card">
          <div className="member-profile-header">
            <div className="member-profile-avatar">{member.avatar}</div>
            <div>
              <h2 className="member-profile-name">{member.name}</h2>
              <div className="member-profile-role">{member.role}</div>
              <Badge status={member.status} dot />
            </div>
          </div>

          <div className="member-profile-stats">
            <div className="member-profile-stat">
              <div className="member-profile-stat-val">{formatCurrency(member.totalPaid)}</div>
              <div className="member-profile-stat-label">Total Paid</div>
            </div>
            <div className="member-profile-stat">
              <div className={`member-profile-stat-val ${member.owing > 0 ? 'danger' : ''}`}>
                {member.owing > 0 ? formatCurrency(member.owing) : '—'}
              </div>
              <div className="member-profile-stat-label">Owing</div>
            </div>
            <div className="member-profile-stat">
              <div className="member-profile-stat-val">#{member.position}</div>
              <div className="member-profile-stat-label">Position</div>
            </div>
            <div className="member-profile-stat">
              <div className="member-profile-stat-val">{attendanceRate}%</div>
              <div className="member-profile-stat-label">On-time Rate</div>
            </div>
          </div>

          <div className="divider" />

          <div className="member-profile-info">
            <div className="member-info-row">
              <span className="member-info-label">Email</span>
              <span className="member-info-val">{member.email}</span>
            </div>
            <div className="member-info-row">
              <span className="member-info-label">Phone</span>
              <span className="member-info-val">{member.phone}</span>
            </div>
            <div className="member-info-row">
              <span className="member-info-label">Joined</span>
              <span className="member-info-val">{formatDate(member.joinDate)}</span>
            </div>
          </div>

          {/* Contribution gauge */}
          <div className="divider" />
          <div className="section-title">Payment Performance</div>
          <div className="member-gauge">
            <div className="member-gauge-row">
              <span>Paid</span>
              <span className="member-gauge-count success">{paidCount}</span>
            </div>
            <div className="member-gauge-row">
              <span>Missed</span>
              <span className="member-gauge-count danger">{missedCount}</span>
            </div>
            <div className="member-gauge-row">
              <span>Pending</span>
              <span className="member-gauge-count warn">{memberContribs.filter(c => c.status === 'pending').length}</span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="member-detail-right">
          {/* Contribution History */}
          <Panel title="Contribution History">
            <div className="detail-table-wrap">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Cycle/Week</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Date Paid</th>
                    <th>Reference</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {memberContribs.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--ink3)' }}>No contributions recorded.</td></tr>
                  ) : memberContribs.map(c => (
                    <tr key={c.id}>
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

          {/* Payout History */}
          <Panel title="Payout History" className="mt-panel">
            {memberPayouts.length === 0 ? (
              <p style={{ color: 'var(--ink3)', fontSize: 12 }}>
                This member hasn't received a payout yet. Position: #{member.position}
              </p>
            ) : (
              <div className="detail-table-wrap">
                <table className="detail-table">
                  <thead>
                    <tr>
                      <th>Cycle/Week</th>
                      <th>Amount</th>
                      <th>Bank</th>
                      <th>Account</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberPayouts.map(p => (
                      <tr key={p.id}>
                        <td className="cell-mono">C{p.cycle}/W{p.week}</td>
                        <td className="cell-mono success">{formatCurrency(p.amount)}</td>
                        <td>{p.bank}</td>
                        <td className="cell-mono muted">{p.accountNo}</td>
                        <td className="cell-mono">{formatDate(p.datePaid)}</td>
                        <td><Badge status={p.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
