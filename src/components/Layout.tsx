import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import type { UserRole } from '../types';

interface LayoutProps {
  role: UserRole;
}

const Layout: React.FC<LayoutProps> = ({ role }) => {
  return (
    <div className="app-container">
      <Sidebar role={role} />
      <div className="flex-col w-full">
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
