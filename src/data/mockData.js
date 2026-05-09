// =============================================
// MOCK DATA — Ajo Contribution Manager
// 
// TODO: Replace each section with real API calls.
// API service functions should live in /src/services/api.js
// Each comment block indicates the expected API endpoint.
// =============================================

// ---- CURRENT LOGGED-IN USER ----
// TODO: Fetch from GET /api/auth/me after JWT decode
export const currentUser = {
  id: 'u001',
  name: 'Adaeze Kalu',
  initials: 'AK',
  email: 'adaeze.kalu@email.com',
  phone: '+234 803 456 7890',
  role: 'admin', // 'admin' | 'member' | 'treasurer'
  groupId: 'g001',
};

// ---- AJO GROUPS ----
// TODO: Fetch from GET /api/groups
export const groups = [
  {
    id: 'g001',
    name: 'Victoria Island Women Ajo',
    description: 'Weekly savings circle for professional women',
    frequency: 'weekly',
    contributionAmount: 50000,
    currency: '₦',
    startDate: '2025-01-06',
    nextMeetingDate: '2025-05-12',
    cycleLength: 20, // number of members in rotation
    currentCycle: 3,
    totalCycles: 5,
    status: 'active',
    memberCount: 20,
    treasurerId: 'u001',
  },
  {
    id: 'g002',
    name: 'Lagos Tech Esusu',
    description: 'Monthly savings for tech professionals',
    frequency: 'monthly',
    contributionAmount: 100000,
    currency: '₦',
    startDate: '2025-02-01',
    nextMeetingDate: '2025-05-31',
    cycleLength: 12,
    currentCycle: 1,
    totalCycles: 3,
    status: 'active',
    memberCount: 12,
    treasurerId: 'u004',
  },
];

// ---- MEMBERS ----
// TODO: Fetch from GET /api/groups/:groupId/members
export const members = [
  { id: 'u001', name: 'Adaeze Kalu',       phone: '+234 803 456 7890', email: 'adaeze@email.com',   role: 'admin',     joinDate: '2025-01-06', status: 'active',    position: 1,  totalPaid: 200000, owing: 0,      avatar: 'AK' },
  { id: 'u002', name: 'Funmilayo Okonkwo', phone: '+234 806 234 5678', email: 'funmi@email.com',    role: 'member',    joinDate: '2025-01-06', status: 'active',    position: 2,  totalPaid: 200000, owing: 0,      avatar: 'FO' },
  { id: 'u003', name: 'Chinyere Eze',      phone: '+234 811 345 6789', email: 'chinyere@email.com', role: 'member',    joinDate: '2025-01-06', status: 'active',    position: 3,  totalPaid: 150000, owing: 50000,  avatar: 'CE' },
  { id: 'u004', name: 'Ngozi Dike',        phone: '+234 805 456 7890', email: 'ngozi@email.com',    role: 'treasurer', joinDate: '2025-01-06', status: 'active',    position: 4,  totalPaid: 200000, owing: 0,      avatar: 'ND' },
  { id: 'u005', name: 'Yetunde Bello',     phone: '+234 809 567 8901', email: 'yetunde@email.com',  role: 'member',    joinDate: '2025-01-06', status: 'defaulter', position: 5,  totalPaid: 100000, owing: 100000, avatar: 'YB' },
  { id: 'u006', name: 'Amaka Obi',         phone: '+234 802 678 9012', email: 'amaka@email.com',    role: 'member',    joinDate: '2025-01-06', status: 'active',    position: 6,  totalPaid: 200000, owing: 0,      avatar: 'AO' },
  { id: 'u007', name: 'Blessing Nwosu',    phone: '+234 814 789 0123', email: 'blessing@email.com', role: 'member',    joinDate: '2025-01-06', status: 'active',    position: 7,  totalPaid: 200000, owing: 0,      avatar: 'BN' },
  { id: 'u008', name: 'Ifeoma Okwu',       phone: '+234 807 890 1234', email: 'ifeoma@email.com',   role: 'member',    joinDate: '2025-01-06', status: 'inactive',  position: 8,  totalPaid: 50000,  owing: 150000, avatar: 'IO' },
  { id: 'u009', name: 'Chiamaka Nnaji',    phone: '+234 818 901 2345', email: 'chiamaka@email.com', role: 'member',    joinDate: '2025-01-06', status: 'active',    position: 9,  totalPaid: 200000, owing: 0,      avatar: 'CN' },
  { id: 'u010', name: 'Oluwaseun Adeyemi', phone: '+234 810 012 3456', email: 'seun@email.com',     role: 'member',    joinDate: '2025-01-06', status: 'active',    position: 10, totalPaid: 200000, owing: 0,      avatar: 'OA' },
  { id: 'u011', name: 'Tolulope Salami',   phone: '+234 803 123 4567', email: 'tolu@email.com',     role: 'member',    joinDate: '2025-01-06', status: 'defaulter', position: 11, totalPaid: 100000, owing: 100000, avatar: 'TS' },
  { id: 'u012', name: 'Adeola Fadipe',     phone: '+234 806 234 5670', email: 'adeola@email.com',   role: 'member',    joinDate: '2025-01-06', status: 'active',    position: 12, totalPaid: 200000, owing: 0,      avatar: 'AF' },
];

// ---- CONTRIBUTIONS ----
// TODO: Fetch from GET /api/groups/:groupId/contributions?cycle=:cycle
export const contributions = [
  // Week 1
  { id: 'c001', memberId: 'u001', memberName: 'Adaeze Kalu',       week: 1, cycle: 3, amount: 50000, datePaid: '2025-04-07', method: 'Bank Transfer', status: 'paid',    reference: 'AJO-W01-001' },
  { id: 'c002', memberId: 'u002', memberName: 'Funmilayo Okonkwo', week: 1, cycle: 3, amount: 50000, datePaid: '2025-04-07', method: 'Bank Transfer', status: 'paid',    reference: 'AJO-W01-002' },
  { id: 'c003', memberId: 'u003', memberName: 'Chinyere Eze',      week: 1, cycle: 3, amount: 50000, datePaid: '2025-04-08', method: 'Card',          status: 'paid',    reference: 'AJO-W01-003' },
  { id: 'c004', memberId: 'u004', memberName: 'Ngozi Dike',        week: 1, cycle: 3, amount: 50000, datePaid: '2025-04-07', method: 'Bank Transfer', status: 'paid',    reference: 'AJO-W01-004' },
  { id: 'c005', memberId: 'u005', memberName: 'Yetunde Bello',     week: 1, cycle: 3, amount: 50000, datePaid: null,         method: null,            status: 'missed',  reference: null },
  // Week 2
  { id: 'c006', memberId: 'u001', memberName: 'Adaeze Kalu',       week: 2, cycle: 3, amount: 50000, datePaid: '2025-04-14', method: 'Bank Transfer', status: 'paid',    reference: 'AJO-W02-001' },
  { id: 'c007', memberId: 'u002', memberName: 'Funmilayo Okonkwo', week: 2, cycle: 3, amount: 50000, datePaid: '2025-04-14', method: 'USSD',          status: 'paid',    reference: 'AJO-W02-002' },
  { id: 'c008', memberId: 'u003', memberName: 'Chinyere Eze',      week: 2, cycle: 3, amount: 50000, datePaid: null,         method: null,            status: 'pending', reference: null },
  { id: 'c009', memberId: 'u005', memberName: 'Yetunde Bello',     week: 2, cycle: 3, amount: 50000, datePaid: null,         method: null,            status: 'missed',  reference: null },
  // Week 3
  { id: 'c010', memberId: 'u001', memberName: 'Adaeze Kalu',       week: 3, cycle: 3, amount: 50000, datePaid: '2025-04-28', method: 'Bank Transfer', status: 'paid',    reference: 'AJO-W03-001' },
  { id: 'c011', memberId: 'u004', memberName: 'Ngozi Dike',        week: 3, cycle: 3, amount: 50000, datePaid: '2025-04-28', method: 'Bank Transfer', status: 'paid',    reference: 'AJO-W03-004' },
  { id: 'c012', memberId: 'u011', memberName: 'Tolulope Salami',   week: 3, cycle: 3, amount: 50000, datePaid: null,         method: null,            status: 'missed',  reference: null },
  // Week 4 — current
  { id: 'c013', memberId: 'u001', memberName: 'Adaeze Kalu',       week: 4, cycle: 3, amount: 50000, datePaid: '2025-05-05', method: 'Bank Transfer', status: 'paid',    reference: 'AJO-W04-001' },
  { id: 'c014', memberId: 'u002', memberName: 'Funmilayo Okonkwo', week: 4, cycle: 3, amount: 50000, datePaid: null,         method: null,            status: 'pending', reference: null },
  { id: 'c015', memberId: 'u003', memberName: 'Chinyere Eze',      week: 4, cycle: 3, amount: 50000, datePaid: null,         method: null,            status: 'pending', reference: null },
];

// ---- DEPOSITS / PAYOUT HISTORY ----
// TODO: Fetch from GET /api/groups/:groupId/payouts
export const payouts = [
  { id: 'p001', recipientId: 'u001', recipientName: 'Adaeze Kalu',       cycle: 1, week: 1,  amount: 1000000, datePaid: '2025-01-13', method: 'Bank Transfer', bank: 'GTBank',   accountNo: '****4521', status: 'completed', reference: 'PAYOUT-C1-001' },
  { id: 'p002', recipientId: 'u002', recipientName: 'Funmilayo Okonkwo', cycle: 1, week: 2,  amount: 1000000, datePaid: '2025-01-20', method: 'Bank Transfer', bank: 'Zenith',   accountNo: '****2201', status: 'completed', reference: 'PAYOUT-C1-002' },
  { id: 'p003', recipientId: 'u003', recipientName: 'Chinyere Eze',      cycle: 1, week: 3,  amount: 950000,  datePaid: '2025-01-27', method: 'Bank Transfer', bank: 'Access',   accountNo: '****9912', status: 'completed', reference: 'PAYOUT-C1-003', note: 'Partial — member owes ₦50K' },
  { id: 'p004', recipientId: 'u004', recipientName: 'Ngozi Dike',        cycle: 2, week: 1,  amount: 1000000, datePaid: '2025-02-24', method: 'Bank Transfer', bank: 'First',    accountNo: '****7789', status: 'completed', reference: 'PAYOUT-C2-004' },
  { id: 'p005', recipientId: 'u005', recipientName: 'Yetunde Bello',     cycle: 2, week: 2,  amount: 1000000, datePaid: '2025-03-03', method: 'Bank Transfer', bank: 'UBA',      accountNo: '****3341', status: 'completed', reference: 'PAYOUT-C2-005' },
  { id: 'p006', recipientId: 'u006', recipientName: 'Amaka Obi',         cycle: 3, week: 1,  amount: 1000000, datePaid: '2025-04-07', method: 'Bank Transfer', bank: 'Zenith',   accountNo: '****6612', status: 'completed', reference: 'PAYOUT-C3-006' },
  { id: 'p007', recipientId: 'u007', recipientName: 'Blessing Nwosu',    cycle: 3, week: 2,  amount: 1000000, datePaid: '2025-04-14', method: 'Bank Transfer', bank: 'GTBank',   accountNo: '****8823', status: 'completed', reference: 'PAYOUT-C3-007' },
  { id: 'p008', recipientId: 'u008', recipientName: 'Ifeoma Okwu',       cycle: 3, week: 3,  amount: 1000000, datePaid: '2025-04-28', method: 'Bank Transfer', bank: 'Access',   accountNo: '****1145', status: 'completed', reference: 'PAYOUT-C3-008' },
  { id: 'p009', recipientId: 'u009', recipientName: 'Chiamaka Nnaji',    cycle: 3, week: 4,  amount: 1000000, datePaid: null,          method: 'Bank Transfer', bank: 'Kuda',     accountNo: '****5532', status: 'pending',   reference: 'PAYOUT-C3-009' },
];

// ---- MEETINGS ----
// TODO: Fetch from GET /api/groups/:groupId/meetings
export const meetings = [
  {
    id: 'm001',
    title: 'Week 1 Contribution — Cycle 3',
    date: '2025-04-07',
    time: '10:00 AM',
    venue: 'Victoria Island Community Hall, Plot 14 Ahmadu Bello Way',
    type: 'weekly',
    status: 'completed',
    attendanceCount: 18,
    expectedAttendance: 20,
    chairperson: 'Adaeze Kalu',
    minutes: 'All members except Yetunde and Ifeoma were present. Contributions collected. Amaka received the payout.',
    agendaItems: ['Opening prayer', 'Roll call', 'Contribution collection', 'Payout to Amaka Obi', 'AOB'],
  },
  {
    id: 'm002',
    title: 'Week 2 Contribution — Cycle 3',
    date: '2025-04-14',
    time: '10:00 AM',
    venue: 'Victoria Island Community Hall, Plot 14 Ahmadu Bello Way',
    type: 'weekly',
    status: 'completed',
    attendanceCount: 19,
    expectedAttendance: 20,
    chairperson: 'Ngozi Dike',
    minutes: '19 members present. Contributions collected. Blessing received her payout.',
    agendaItems: ['Opening prayer', 'Roll call', 'Contribution collection', 'Payout to Blessing Nwosu', 'Welfare update', 'AOB'],
  },
  {
    id: 'm003',
    title: 'Week 3 Contribution — Cycle 3',
    date: '2025-04-28',
    time: '10:00 AM',
    venue: 'Virtual — Google Meet',
    type: 'weekly',
    status: 'completed',
    attendanceCount: 17,
    expectedAttendance: 20,
    chairperson: 'Adaeze Kalu',
    minutes: 'Virtual meeting. Ifeoma received payout. 3 defaulters warned.',
    agendaItems: ['Roll call', 'Contribution update', 'Payout to Ifeoma Okwu', 'Defaulter review', 'AOB'],
  },
  {
    id: 'm004',
    title: 'Week 4 Contribution — Cycle 3',
    date: '2025-05-12',
    time: '10:00 AM',
    venue: 'Victoria Island Community Hall, Plot 14 Ahmadu Bello Way',
    type: 'weekly',
    status: 'upcoming',
    attendanceCount: 0,
    expectedAttendance: 20,
    chairperson: 'Adaeze Kalu',
    minutes: null,
    agendaItems: ['Opening prayer', 'Roll call', 'Contribution collection', 'Payout to Chiamaka Nnaji', 'Mid-cycle review', 'AOB'],
  },
];

// ---- ATTENDANCE ----
// TODO: Fetch from GET /api/meetings/:meetingId/attendance
export const attendance = {
  m001: [
    { memberId: 'u001', status: 'present' }, { memberId: 'u002', status: 'present' },
    { memberId: 'u003', status: 'present' }, { memberId: 'u004', status: 'present' },
    { memberId: 'u005', status: 'absent'  }, { memberId: 'u006', status: 'present' },
    { memberId: 'u007', status: 'present' }, { memberId: 'u008', status: 'absent'  },
    { memberId: 'u009', status: 'present' }, { memberId: 'u010', status: 'present' },
    { memberId: 'u011', status: 'present' }, { memberId: 'u012', status: 'present' },
  ],
  m004: [], // upcoming — no attendance recorded yet
};

// ---- AGENDA SUBMISSIONS ----
// TODO: Fetch from GET /api/meetings/:meetingId/agenda
export const agendaSubmissions = [
  { id: 'a001', meetingId: 'm004', memberId: 'u003', memberName: 'Chinyere Eze',      item: 'Proposal to move Week 5 meeting to Saturday', submittedAt: '2025-05-06 09:12', status: 'approved' },
  { id: 'a002', meetingId: 'm004', memberId: 'u005', memberName: 'Yetunde Bello',     item: 'Request for payment plan for outstanding contributions', submittedAt: '2025-05-06 11:45', status: 'pending' },
  { id: 'a003', meetingId: 'm004', memberId: 'u009', memberName: 'Chiamaka Nnaji',    item: 'Bank account confirmation for upcoming payout', submittedAt: '2025-05-07 08:00', status: 'approved' },
  { id: 'a004', meetingId: 'm004', memberId: 'u010', memberName: 'Oluwaseun Adeyemi', item: 'Suggestion to introduce welfare fund', submittedAt: '2025-05-07 10:30', status: 'pending' },
];

// ---- NOTIFICATIONS ----
// TODO: Fetch from GET /api/notifications?userId=:userId
export const notifications = [
  { id: 'n001', type: 'reminder',   title: 'Contribution Due Tomorrow',          message: 'Your Week 4 contribution of ₦50,000 is due on 12 May 2025. Please ensure funds are ready.', createdAt: '2025-05-07 08:00', read: false, priority: 'high' },
  { id: 'n002', type: 'payout',     title: 'Payout Scheduled for Chiamaka Nnaji', message: 'Chiamaka Nnaji is scheduled to receive ₦1,000,000 on 12 May 2025 via Kuda Bank ****5532.', createdAt: '2025-05-06 16:00', read: false, priority: 'medium' },
  { id: 'n003', type: 'defaulter',  title: 'Defaulter Alert — Yetunde Bello',    message: 'Yetunde Bello has missed 2 consecutive contributions. A formal notice will be issued if Week 4 is missed.', createdAt: '2025-05-05 10:00', read: false, priority: 'high' },
  { id: 'n004', type: 'meeting',    title: 'Meeting Reminder — Week 4',           message: 'Next meeting is on 12 May 2025 at 10:00 AM at Victoria Island Community Hall.', createdAt: '2025-05-05 08:00', read: true,  priority: 'low' },
  { id: 'n005', type: 'agenda',     title: 'New Agenda Item Submitted',           message: 'Oluwaseun Adeyemi submitted a new agenda item: "Suggestion to introduce welfare fund".', createdAt: '2025-05-07 10:31', read: true,  priority: 'low' },
  { id: 'n006', type: 'success',    title: 'Week 3 Payout Complete',              message: 'Ifeoma Okwu received ₦1,000,000 on 28 April 2025. Payment reference: PAYOUT-C3-008.', createdAt: '2025-04-28 14:00', read: true,  priority: 'low' },
  { id: 'n007', type: 'member',     title: 'New Member Inquiry',                  message: 'A new member inquiry was submitted. Admin review required before admission.', createdAt: '2025-04-29 09:15', read: true,  priority: 'medium' },
];

// ---- DASHBOARD METRICS ----
// TODO: Calculate from GET /api/dashboard/summary
export const dashboardMetrics = {
  totalMembers: 20,
  activeMembers: 17,
  defaulters: 3,
  totalContributed: 2840000,
  totalContributedDelta: '+14.2%',
  currentWeekCollection: 950000,
  collectionTarget: 1000000,
  successRate: 96.8,
  upcomingPayout: { recipientName: 'Chiamaka Nnaji', amount: 1000000, date: '2025-05-12' },
  pendingContributions: 3,
  pendingAmount: 150000,
};

// ---- DEFAULTERS REPORT ----
// Derived from contributions data, but can come from GET /api/reports/defaulters
export const defaultersReport = [
  { memberId: 'u005', memberName: 'Yetunde Bello',   phone: '+234 809 567 8901', weeksOwed: 2, amountOwed: 100000, lastPaid: '2025-03-10', warningsSent: 1 },
  { memberId: 'u008', memberName: 'Ifeoma Okwu',     phone: '+234 807 890 1234', weeksOwed: 3, amountOwed: 150000, lastPaid: '2025-02-17', warningsSent: 2 },
  { memberId: 'u011', memberName: 'Tolulope Salami', phone: '+234 803 123 4567', weeksOwed: 2, amountOwed: 100000, lastPaid: '2025-03-24', warningsSent: 1 },
];

// ---- CONTRIBUTION CHART DATA ----
// TODO: Fetch from GET /api/reports/contributions/weekly
export const weeklyChartData = [
  { label: 'Wk1', collected: 1000000, target: 1000000 },
  { label: 'Wk2', collected: 950000,  target: 1000000 },
  { label: 'Wk3', collected: 900000,  target: 1000000 },
  { label: 'Wk4', collected: 500000,  target: 1000000 }, // in progress
];

// ---- BANKS (for dropdown) ----
export const nigerianBanks = [
  'Access Bank', 'First Bank', 'GTBank', 'Zenith Bank', 'UBA',
  'Kuda Bank', 'OPay', 'Moniepoint', 'Fidelity Bank', 'Polaris Bank',
  'Sterling Bank', 'Wema Bank', 'FCMB', 'Stanbic IBTC',
];

// ---- HELPER: format currency ----
export const formatCurrency = (amount, currency = '₦') =>
  `${currency}${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;

// ---- HELPER: format date ----
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });
};
