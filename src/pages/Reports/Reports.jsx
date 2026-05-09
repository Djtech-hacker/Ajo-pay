// =============================================
// REPORTS PAGE
// Analytics, defaulter tracking, and exportable reports.
// TODO: Fetch from GET /api/reports
// TODO: Export via GET /api/reports/export?format=csv
// =============================================

import { useState } from 'react';
import Panel from '../../components/ui/Panel';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import {
  defaultersReport,
  members,
  contributions,
  payouts,
  weeklyChartData,
  formatCurrency,
  formatDate,
  dashboardMetrics as dm,
} from '../../data/mockData';
import './Reports.css';

export default function Reports() {
  const [toast, setToast] = useState(null);

  const handleExport = (type) => {
    // TODO: GET /api/reports/export?type=:type&format=csv
    setToast({ message: `${type} report exported as CSV.`, type: 'success' });
  };

  const sendWarning = (name) => {
    // TODO: POST /api/notifications/send { type: 'warning', memberId }
    setToast({ message: `Warning sent to ${name}.`, type: 'warn' });
  };

  // Computed summary stats
  const totalCollected = contributions
    .filter(c => c.status === 'paid')
    .reduce((s, c) => s + c.amount, 0);

  const totalMissed = contributions
    .filter(c => c.status === 'missed')
    .reduce((s, c) => s + c.amount, 0);

  const totalDisbursed = payouts
    .filter(p => p.status === 'completed')
    .reduce((s, p) => s + p.amount, 0);

  const paymentMethods = contributions
    .filter(c => c.status === 'paid')
    .reduce((acc, c) => {
      acc[c.method] = (acc[c.method] || 0) + 1;
      return acc;
    }, {});

  const methodTotal = Object.values(paymentMethods).reduce((a, b) => a + b, 0);

  return (
    <div className="page-content">
      {/* Summary metrics */}
      <div className="reports-metrics">
        <div className="reports-metric">
          <div className="reports-metric__label">Total Collected (All Cycles)</div>
          <div className="reports-metric__val success">{formatCurrency(totalCollected)}</div>
        </div>
        <div className="reports-metric">
          <div className="reports-metric__label">Total Disbursed</div>
          <div className="reports-metric__val">{formatCurrency(totalDisbursed)}</div>
        </div>
        <div className="reports-metric">
          <div className="reports-metric__label">Missed Payments</div>
          <div className="reports-metric__val danger">{formatCurrency(totalMissed)}</div>
        </div>
        <div className="reports-metric">
          <div className="reports-metric__label">Overall Success Rate</div>
          <div className="reports-metric__val">{dm.successRate}%</div>
        </div>
      </div>

      <div className="panels-grid">
        {/* Weekly collection chart */}
        <Panel
          title="Collection by Week — Cycle 3"
          action={
            <Button size="sm" variant="secondary" onClick={() => handleExport('Contributions')}>
              Export CSV
            </Button>
          }
        >
          {weeklyChartData.map(d => {
            const pct = Math.round((d.collected / d.target) * 100);
            return (
              <div key={d.label} className="report-bar-row">
                <div className="report-bar-label">{d.label}</div>
                <div className="report-bar-track">
                  <div
                    className={`report-bar-fill ${pct === 100 ? 'report-bar-fill--full' : pct >= 90 ? '' : 'report-bar-fill--warn'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="report-bar-stat">
                  <span className="report-bar-val">{formatCurrency(d.collected)}</span>
                  <span className="report-bar-pct">{pct}%</span>
                </div>
              </div>
            );
          })}
        </Panel>

        {/* Payment method breakdown */}
        <Panel title="Payment Methods Breakdown">
          {Object.entries(paymentMethods).map(([method, count]) => {
            const pct = Math.round((count / methodTotal) * 100);
            return (
              <div key={method} className="report-bar-row">
                <div className="report-bar-label">{method}</div>
                <div className="report-bar-track">
                  <div className="report-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="report-bar-stat">
                  <span className="report-bar-val">{count} payments</span>
                  <span className="report-bar-pct">{pct}%</span>
                </div>
              </div>
            );
          })}
        </Panel>
      </div>

      {/* Defaulter tracking */}
      <Panel
        title="Defaulter Tracking"
        action={
          <Button size="sm" variant="secondary" onClick={() => handleExport('Defaulters')}>
            Export CSV
          </Button>
        }
      >
        {defaultersReport.length === 0 ? (
          <div className="empty-state"><p>No defaulters — great news! 🎉</p></div>
        ) : (
          <div className="defaulters-table-wrap">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Phone</th>
                  <th>Weeks Owed</th>
                  <th>Amount Owed</th>
                  <th>Last Paid</th>
                  <th>Warnings Sent</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {defaultersReport.map(d => (
                  <tr key={d.memberId}>
                    <td className="cell-name">{d.memberName}</td>
                    <td className="cell-mono">{d.phone}</td>
                    <td className="cell-mono" style={{ color: 'var(--danger)' }}>{d.weeksOwed} wks</td>
                    <td className="cell-mono danger">{formatCurrency(d.amountOwed)}</td>
                    <td className="cell-mono">{formatDate(d.lastPaid)}</td>
                    <td>
                      <span className={`warnings-badge warnings-badge--${d.warningsSent >= 2 ? 'high' : 'low'}`}>
                        {d.warningsSent} warning{d.warningsSent !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => sendWarning(d.memberName)}>
                        Send Warning
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Member contribution leaderboard */}
      <Panel
        title="Member Contribution Leaderboard"
        action={
          <Button size="sm" variant="secondary" onClick={() => handleExport('Members')}>
            Export CSV
          </Button>
        }
      >
        <div className="leaderboard">
          {[...members]
            .sort((a, b) => b.totalPaid - a.totalPaid)
            .map((m, i) => (
              <div key={m.id} className="leaderboard-row">
                <div className={`leaderboard-rank leaderboard-rank--${i < 3 ? 'top' : 'normal'}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div className="leaderboard-avatar">{m.avatar}</div>
                <div className="leaderboard-name">{m.name}</div>
                <div className="leaderboard-bar-wrap">
                  <div className="leaderboard-bar">
                    <div
                      className="leaderboard-fill"
                      style={{ width: `${Math.round((m.totalPaid / 200000) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="leaderboard-amount success">{formatCurrency(m.totalPaid)}</div>
                <Badge status={m.status} />
              </div>
            ))}
        </div>
      </Panel>

      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
