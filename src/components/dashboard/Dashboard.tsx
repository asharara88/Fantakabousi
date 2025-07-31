import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { AccessibilityProvider } from '../ui/AccessibilityProvider';
import Navigation from '../layout/Navigation';
import { MobileNavigation } from '../layout/MobileNavigation';
import WelcomeHeader from './WelcomeHeader';
import HealthDashboard from './HealthDashboard';
import AICoachEnhanced from './AICoachEnhanced';
import SupplementShopEnhanced from '../supplements/SupplementShopEnhanced';
import ProfileSettingsEnhanced from './ProfileSettingsEnhanced';
import RecipeSearch from '../recipes/RecipeSearch';
import OfflineIndicator from '../ui/OfflineIndicator';
import SafeArea from '../ui/SafeArea';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'start-day':
        // Navigate to today's goals and habits
        setActiveTab('dashboard');
        // Scroll to goals section
        setTimeout(() => {
          const goalsElement = document.getElementById('todays-goals');
          goalsElement?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      case 'health':
        setActiveTab('health');
        break;
      case 'coach':
        setActiveTab('coach');
        break;
      case 'shop':
        setActiveTab('shop');
        break;
      case 'recipes':
        setActiveTab('health');
        // Switch to recipes tab in health section
        setTimeout(() => {
          const recipesTab = document.querySelector('[data-tab="recipes"]') as HTMLButtonElement;
          recipesTab?.click();
        }, 100);
        break;
      case 'profile':
        setActiveTab('profile');
        break;
      default:
        console.log(`Quick action: ${action}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <WelcomeHeader onQuickAction={handleQuickAction} />;
      case 'coach':
        return <AICoachEnhanced />;
      case 'health':
        return <HealthDashboard />;
      case 'shop':
        return <SupplementShopEnhanced />;
      case 'profile':
        return <ProfileSettingsEnhanced />;
      default:
        return <WelcomeHeader onQuickAction={handleQuickAction} />;
    }
  };

  return (
    <AccessibilityProvider>
      <SafeArea top bottom left right className="min-h-screen bg-background">
        <OfflineIndicator />
        
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <Navigation 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
          />
        </div>
        
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
        <main 
          id="main-content"
          className="mobile-layout lg:pl-72"
        >
          <div className="mobile-main">
            <div className="mobile-content">
              <div className="container">
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
          </div>
        </main>
      </SafeArea>
    </AccessibilityProvider>
  );
};

export default Dashboard;