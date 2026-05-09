// =============================================
// LAYOUT COMPONENT
// Wraps all protected pages with sidebar + topbar.
// Uses React Router's <Outlet /> for nested pages.
// =============================================

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { notifications } from '../../data/mockData';
import './Layout.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Count unread notifications
  // TODO: Replace with real-time notification count from API / websocket
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="layout">
      <Sidebar
        unreadCount={unreadCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="layout__main">
        <TopBar
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
          unreadCount={unreadCount}
        />
        <main className="layout__content">
          {/* Each page component renders here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
