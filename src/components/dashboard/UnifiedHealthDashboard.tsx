import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../contexts/ThemeContext';
import Navigation from './Navigation';
import MobileNavigation from './MobileNavigation';
import DashboardContent from './DashboardContent';

const UnifiedHealthDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const handleQuickAction = (action: string) => {
    setActiveView(action);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeView={activeView} onNavigate={setActiveView} />
      <MobileNavigation activeView={activeView} onNavigate={setActiveView} />
      <DashboardContent activeView={activeView} onQuickAction={handleQuickAction} />
    </div>
  );
};

export default UnifiedHealthDashboard;