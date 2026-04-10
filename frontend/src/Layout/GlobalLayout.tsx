import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Shared/Sidebar';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import { useAuth } from '../context/AuthContext';

const GlobalLayout: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-10 w-10 rounded-full border-2 border-violet-300/20 border-t-violet-300"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`relative min-h-screen overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'
        }`}
      >
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-3 pb-4 pt-3 lg:px-5 lg:pb-5 lg:pt-5">
          <div className="glass-panel flex min-h-[calc(100vh-1.5rem)] flex-1 flex-col overflow-hidden rounded-[26px] border-white/10 lg:min-h-[calc(100vh-2.5rem)]">
            <DashboardHeader
              onMenuClick={() => setSidebarOpen(true)}
            />

            <main className="relative flex-1 overflow-x-hidden bg-transparent p-4 lg:p-6 xl:p-7">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLayout;
