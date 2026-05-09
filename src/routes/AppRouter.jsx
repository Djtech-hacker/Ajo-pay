// =============================================
// APP ROUTER
// Defines all routes for the application.
// Uses React Router v6 with nested layout routes.
// =============================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout
import Layout from '../components/layout/Layout';

// Auth pages
import Login    from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// App pages
import Dashboard    from '../pages/Dashboard/Dashboard';
import Members      from '../pages/Members/Members';
import MemberDetail from '../pages/Members/MemberDetail';
import Contributions from '../pages/Contributions/Contributions';
import Deposits     from '../pages/Deposits/Deposits';
import Meetings     from '../pages/Meetings/Meetings';
import MeetingDetail from '../pages/Meetings/MeetingDetail';
import Attendance   from '../pages/Attendance/Attendance';
import Agenda       from '../pages/Meetings/Agenda';
import Notifications from '../pages/Notifications/Notifications';
import Reports      from '../pages/Reports/Reports';
import AdminDashboard from '../pages/Admin/AdminDashboard';

// Guard: redirect to login if not authenticated
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Guard: redirect to dashboard if already logged in
function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected routes — wrapped in persistent Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"         element={<Dashboard />} />
        <Route path="members"           element={<Members />} />
        <Route path="members/:id"       element={<MemberDetail />} />
        <Route path="contributions"     element={<Contributions />} />
        <Route path="deposits"          element={<Deposits />} />
        <Route path="meetings"          element={<Meetings />} />
        <Route path="meetings/:id"      element={<MeetingDetail />} />
        <Route path="agenda"            element={<Agenda />} />
        <Route path="attendance"        element={<Attendance />} />
        <Route path="notifications"     element={<Notifications />} />
        <Route path="reports"           element={<Reports />} />
        <Route path="admin"             element={<AdminDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
