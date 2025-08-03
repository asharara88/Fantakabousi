import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import AccessibilityProvider from '../ui/AccessibilityProvider';
import Navigation from '../layout/Navigation';
import { MobileNavigation } from '../layout/MobileNavigation';
import WelcomeHeader from './WelcomeHeader';
import HealthDashboard from './HealthDashboard';
import AICoachEnhanced from './AICoachEnhanced';
import SupplementShopEnhanced from '../supplements/SupplementShopEnhanced';
import ProfileSettingsEnhanced from './ProfileSettingsEnhanced';
import RecipeSearch from '../recipes/RecipeSearch';
import PlanYourDay from './PlanYourDay';
import OfflineIndicator from '../ui/OfflineIndicator';
import SafeArea from '../ui/SafeArea';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPlanYourDay, setShowPlanYourDay] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'plan':
        setShowPlanYourDay(true);
        break;
      case 'coach':
        setActiveTab('coach');
        break;
      case 'health':
        setActiveTab('health');
        break;
      case 'shop':
        setActiveTab('shop');
        break;
      case 'food':
        setActiveTab('health');
        break;
      case 'recipes':
        setActiveTab('health');
        break;
      case 'profile':
        setActiveTab('profile');
        break;
      default:
        setActiveTab('dashboard');
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
        return <SupplementShopEnhanced onQuickAction={handleQuickAction} />;
      case 'profile':
        return <ProfileSettingsEnhanced />;
      default:
        return <WelcomeHeader onQuickAction={handleQuickAction} />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Health Dashboard';
      case 'coach': return 'AI Wellness Coach';
      case 'health': return 'Health Analytics';
      case 'shop': return 'Supplement Shop';
      case 'profile': return 'Profile Settings';
      default: return 'Biowell Dashboard';
    }
  };
  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background" role="application" aria-label="Biowell Health Dashboard">
        {/* Skip Links */}
        <div className="sr-only focus:not-sr-only">
          <a
            href="#main-content"
            className="fixed top-4 left-4 z-50 px-4 py-2 bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            Skip to main content
          </a>
          <a
            href="#navigation"
            className="fixed top-4 left-32 z-50 px-4 py-2 bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            Skip to navigation
          </a>
        </div>

        {/* Page Title for Screen Readers */}
        <h1 className="sr-only">{getPageTitle()} - Biowell Health Platform</h1>

        <OfflineIndicator />
        
        {/* Primary Navigation */}
        <nav 
          id="navigation"
          role="navigation" 
          aria-label="Primary navigation"
          className="hidden lg:block"
        >
          <Navigation 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
          />
        </nav>
        
        {/* Mobile Navigation */}
        <nav 
          role="navigation" 
          aria-label="Mobile navigation"
          className="lg:hidden"
        >
          <MobileNavigation
            currentView={activeTab}
            onViewChange={handleTabChange}
            isMenuOpen={isMobileMenuOpen}
            onMenuToggle={handleMobileMenuToggle}
          />
        </nav>
        
        {/* Main Content Area */}
        <div className="mobile-layout lg:pl-72">
          <main 
            id="main-content"
            role="main"
            aria-label={`${getPageTitle()} content`}
            className="mobile-main"
          >
            <div className="mobile-content">
              <SafeArea top bottom left right>
                <div className="container">
                  {/* Page Header */}
                  <header role="banner" className="sr-only">
                    <h2>{getPageTitle()}</h2>
                    <p>Current section of the Biowell health platform</p>
                  </header>

                  {/* Dynamic Content */}
                  <section 
                    role="region" 
                    aria-labelledby="current-section-title"
                    aria-live="polite"
                  >
                    <h2 id="current-section-title" className="sr-only">
                      {getPageTitle()} Content
                    </h2>
                    
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
                  </section>
                </div>
              </SafeArea>
            </div>
          </main>
        </div>

        {/* Complementary Content - Modals and Overlays */}
        <aside 
          role="complementary" 
          aria-label="Additional tools and settings"
        >
          {/* Plan Your Day Modal */}
          <PlanYourDay 
            isOpen={showPlanYourDay}
            onClose={() => setShowPlanYourDay(false)}
          />
        </aside>

        {/* Footer/Status Information */}
        <footer 
          role="contentinfo" 
          aria-label="Application status and information"
          className="sr-only"
        >
          <p>Biowell Health Platform - {new Date().getFullYear()}</p>
          <p>Current user: {user?.email}</p>
          <p>Last updated: {new Date().toLocaleString()}</p>
        </footer>
      </div>
      
    </AccessibilityProvider>
  );
};

export default Dashboard;