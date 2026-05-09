// =============================================
// DASHBOARD PAGE
// Main overview for members and admins.
// TODO: Fetch all data from GET /api/dashboard/summary
// =============================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../../components/ui/MetricCard';
import Panel from '../../components/ui/Panel';
import Badge from '../../components/ui/Badge';
import {
  dashboardMetrics as dm,
  contributions,
  members,
  payouts,
  meetings,
  formatCurrency,
  formatDate,
  weeklyChartData,
} from '../../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('contributions');

  // Recent contributions (last 5)
  const recentContribs = [...contributions]
    .sort((a, b) => (b.week - a.week))
    .slice(0, 5);

  // Upcoming meeting
  const nextMeeting = meetings.find(m => m.status === 'upcoming');

  // Chart max for scaling bars
  const chartMax = Math.max(...weeklyChartData.map(d => d.target));

  return (
    <div className="page-content dashboard">
      {/* ---- Metrics Row ---- */}
      <div className="metrics-grid">
        <MetricCard
          label="Total Contributed"
          value={formatCurrency(dm.totalContributed)}
          delta={`${dm.totalContributedDelta} this month`}
          deltaType="up"
        />
        <MetricCard
          label="Active Members"
          value={`${dm.activeMembers} / ${dm.totalMembers}`}
          delta={`${dm.defaulters} defaulters`}
          deltaType="down"
        />
        <MetricCard
          label="This Week Collected"
          value={formatCurrency(dm.currentWeekCollection)}
          delta={`${Math.round((dm.currentWeekCollection / dm.collectionTarget) * 100)}% of target`}
          deltaType="neutral"
        />
        <MetricCard
          label="Success Rate"
          value={`${dm.successRate}%`}
          delta="↑ contributions on time"
          deltaType="up"
        />
      </div>

      {/* ---- Payout Alert ---- */}
      <div className="dashboard__payout-alert">
        <div className="dashboard__payout-alert-icon">📅</div>
        <div>
          <div className="dashboard__payout-alert-title">
            Next Payout: {dm.upcomingPayout.recipientName}
          </div>
          <div className="dashboard__payout-alert-sub">
            {formatCurrency(dm.upcomingPayout.amount)} scheduled for{' '}
            {formatDate(dm.upcomingPayout.date)}
          </div>
        </div>
        <Link to="/deposits" className="dashboard__payout-alert-btn">View →</Link>
      </div>

      {/* ---- Main panels ---- */}
      <div className="panels-grid">
        {/* Collection Chart */}
        <Panel
          title="Weekly Collection — Cycle 3"
          action={<Link to="/contributions" className="panel-link">All →</Link>}
        >
          <div className="dashboard__chart">
            {weeklyChartData.map((d) => {
              const pct = Math.round((d.collected / chartMax) * 100);
              const targetPct = Math.round((d.target / chartMax) * 100);
              return (
                <div key={d.label} className="dashboard__chart-col">
                  <div className="dashboard__chart-bars">
                    {/* Target line */}
                    <div className="dashboard__chart-target" style={{ bottom: `${targetPct}%` }} />
                    {/* Bar */}
                    <div
                      className="dashboard__chart-bar"
                      style={{ height: `${pct}%` }}
                      title={`Collected: ${formatCurrency(d.collected)}`}
                    />
                  </div>
                  <div className="dashboard__chart-label">{d.label}</div>
                  <div className="dashboard__chart-val">{formatCurrency(d.collected / 1000)}K</div>
                </div>
              );
            })}
          </div>

          {/* Progress bars */}
          <div className="dashboard__progress-list">
            {weeklyChartData.map((d) => {
              const pct = Math.round((d.collected / d.target) * 100);
              return (
                <div key={d.label} className="dashboard__progress-row">
                  <span className="dashboard__progress-label">{d.label}</span>
                  <div className="dashboard__progress-bar">
                    <div className="dashboard__progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="dashboard__progress-pct">{pct}%</span>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Upcoming Meeting */}
        <Panel title="Upcoming Meeting">
          {nextMeeting ? (
            <div className="dashboard__meeting-card">
              <div className="dashboard__meeting-date">
                <div className="dashboard__meeting-day">
                  {new Date(nextMeeting.date).getDate()}
                </div>
                <div className="dashboard__meeting-month">
                  {new Date(nextMeeting.date).toLocaleString('en', { month: 'short' })}
                </div>
              </div>
              <div className="dashboard__meeting-info">
                <div className="dashboard__meeting-title">{nextMeeting.title}</div>
                <div className="dashboard__meeting-meta">
                  🕙 {nextMeeting.time}
                </div>
                <div className="dashboard__meeting-meta">
                  📍 {nextMeeting.venue}
                </div>
                <div className="dashboard__meeting-agenda">
                  <div className="section-title" style={{ marginTop: 12 }}>Agenda</div>
                  {nextMeeting.agendaItems.map((item, i) => (
                    <div key={i} className="dashboard__agenda-item">
                      <span className="dashboard__agenda-num">{i + 1}</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--ink3)', fontSize: 12 }}>No upcoming meetings scheduled.</p>
          )}
          <Link to="/meetings" className="dashboard__link-btn">View all meetings →</Link>
        </Panel>
      </div>

      {/* ---- Tabs: Recent Activity ---- */}
      <Panel
        title="Recent Activity"
        action={
          <div className="dashboard__tabs">
            {['contributions', 'payouts', 'defaulters'].map(tab => (
              <button
                key={tab}
                className={`dashboard__tab ${activeTab === tab ? 'dashboard__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        }
      >
        {activeTab === 'contributions' && (
          <div className="dashboard__table">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Week</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentContribs.map(c => (
                  <tr key={c.id}>
                    <td className="cell-name">{c.memberName}</td>
                    <td className="cell-mono">Wk {c.week}</td>
                    <td className="cell-mono">{formatCurrency(c.amount)}</td>
                    <td className="cell-mono">{formatDate(c.datePaid)}</td>
                    <td><Badge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="dashboard__table">
            <table>
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Cycle/Week</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payouts.slice(-5).reverse().map(p => (
                  <tr key={p.id}>
                    <td className="cell-name">{p.recipientName}</td>
                    <td className="cell-mono">C{p.cycle}/W{p.week}</td>
                    <td className="cell-mono">{formatCurrency(p.amount)}</td>
                    <td className="cell-mono">{formatDate(p.datePaid)}</td>
                    <td><Badge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'defaulters' && (
          <div className="dashboard__table">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Weeks Owed</th>
                  <th>Amount Owed</th>
                  <th>Last Paid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {members.filter(m => m.status === 'defaulter').map(m => (
                  <tr key={m.id}>
                    <td className="cell-name">{m.name}</td>
                    <td className="cell-mono">{m.owing / 50000} wks</td>
                    <td className="cell-mono danger">{formatCurrency(m.owing)}</td>
                    <td className="cell-mono">—</td>
                    <td><Badge status="defaulter" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
