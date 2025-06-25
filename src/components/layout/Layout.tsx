
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { mockUsers } from '@/data/mockData';

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Mock current user - in real app this would come from auth context
  const currentUser = {
    ...mockUsers[0],
    name: mockUsers[0].fullName,
    avatar: mockUsers[0].profile
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    // In real app, this would handle logout logic
    console.log('Logging out...');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={currentUser.role} isCollapsed={sidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onToggleSidebar={handleToggleSidebar}
          user={currentUser}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
