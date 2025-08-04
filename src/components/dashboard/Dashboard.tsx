import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import AccessibilityProvider from '../ui/AccessibilityProvider';
import ImprovedNavigation from '../layout/ImprovedNavigation';
import Breadcrumbs from '../ui/Breadcrumbs';
import FloatingActionButton from '../ui/FloatingActionButton';
import SearchBar from '../ui/SearchBar';
import WelcomeHeader from './WelcomeHeader';
import HealthDashboard from './HealthDashboard';
import AICoachEnhanced from './AICoachEnhanced';
import NutritionDashboard from '../nutrition/NutritionDashboard';
import SupplementShopEnhanced from '../supplements/SupplementShopEnhanced';
import FitnessDashboard from '../fitness/FitnessDashboard';
import SleepOptimization from '../sleep/SleepOptimization';
import ProfileSettingsEnhanced from './ProfileSettingsEnhanced';
import PlanYourDay from './PlanYourDay';
import OfflineIndicator from '../ui/OfflineIndicator';
import SafeArea from '../ui/SafeArea';
import { HomeIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPlanYourDay, setShowPlanYourDay] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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
      case 'nutrition':
        setActiveTab('nutrition');
        break;
      case 'supplements':
        setActiveTab('supplements');
        break;
      case 'food':
        setActiveTab('nutrition');
        break;
      case 'recipes':
        setActiveTab('nutrition');
        break;
      case 'fitness':
        setActiveTab('fitness');
        break;
      case 'sleep':
        setActiveTab('sleep');
        break;
      case 'profile':
        setActiveTab('profile');
        break;
      case 'search':
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
      case 'nutrition':
        return <NutritionDashboard onQuickAction={handleQuickAction} />;
      case 'supplements':
        return <SupplementShopEnhanced onQuickAction={handleQuickAction} />;
      case 'fitness':
        return <FitnessDashboard onQuickAction={handleQuickAction} />;
      case 'sleep':
        return <SleepOptimization onQuickAction={handleQuickAction} />;
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
      case 'nutrition': return 'Nutrition & Recipes';
      case 'supplements': return 'Supplement Shop';
      case 'fitness': return 'Fitness & Training';
      case 'sleep': return 'Sleep Optimization';
      case 'profile': return 'Profile Settings';
      default: return 'Biowell Dashboard';
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Home', href: 'dashboard', icon: HomeIcon }
    ];

    switch (activeTab) {
      case 'coach':
        breadcrumbs.push({ label: 'AI Coach', href: 'coach', current: true });
        break;
      case 'health':
        breadcrumbs.push({ label: 'Health Analytics', href: 'health', current: true });
        break;
      case 'nutrition':
        breadcrumbs.push({ label: 'Nutrition & Recipes', href: 'nutrition', current: true });
        break;
      case 'supplements':
        breadcrumbs.push({ label: 'Supplement Shop', href: 'supplements', current: true });
        break;
      case 'fitness':
        breadcrumbs.push({ label: 'Fitness & Training', href: 'fitness', current: true });
        break;
      case 'sleep':
        breadcrumbs.push({ label: 'Sleep Optimization', href: 'sleep', current: true });
        break;
      case 'profile':
        breadcrumbs.push({ label: 'Profile Settings', href: 'profile', current: true });
        break;
      default:
        breadcrumbs[0].current = true;
    return breadcrumbs;
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
        <ImprovedNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />
        
        {/* Mobile Navigation */}
        <ImprovedNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          isMobile={true}
        />
        
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
                  {/* Search Bar - Desktop Only */}
                  <div className="hidden lg:block mb-6">
                    <SearchBar 
                      onNavigate={handleTabChange}
                      onSearch={(query) => console.log('Search:', query)}
                    />
                  </div>

                  {/* Breadcrumbs */}
                  <div className="mb-6">
                    <Breadcrumbs 
                      items={getBreadcrumbs()}
                      onNavigate={handleTabChange}
                    />
                  </div>

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

        {/* Floating Action Button */}
        <FloatingActionButton onQuickAction={handleQuickAction} />

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