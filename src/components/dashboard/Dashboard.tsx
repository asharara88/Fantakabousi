import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { AccessibilityProvider } from '../ui/AccessibilityProvider';
import Navigation from '../layout/Navigation';
import { MobileNavigation } from '../layout/MobileNavigation';
import UnifiedHealthDashboard from './UnifiedHealthDashboard';
import AICoachEnhanced from './AICoachEnhanced';
import SupplementShopEnhanced from './SupplementShopEnhanced';
import ProfileSettingsEnhanced from './ProfileSettingsEnhanced';
import OfflineIndicator from '../ui/OfflineIndicator';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleQuickAction = (action: string) => {
    setActiveTab(action);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <UnifiedHealthDashboard />;
      case 'coach':
        return <AICoachEnhanced />;
      case 'health':
        return <UnifiedHealthDashboard />;
      case 'shop':
        return <SupplementShopEnhanced />;
      case 'profile':
        return <ProfileSettingsEnhanced />;
      default:
        return <UnifiedHealthDashboard />;
    }
  };

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <OfflineIndicator />
        
        {/* Desktop Navigation */}
        <Navigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />
        
        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <MobileNavigation
            currentView={activeTab}
            onViewChange={handleTabChange}
            isMenuOpen={isMobileMenuOpen}
            onMenuToggle={handleMobileMenuToggle}
          />
        </div>
        
        {/* Main Content */}
        <div className="lg:pl-72 pt-20 lg:pt-8 pb-24 lg:pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </AccessibilityProvider>
  );
};

export default Dashboard;