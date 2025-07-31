import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { AccessibilityProvider } from '../ui/AccessibilityProvider';
import Navigation from '../layout/Navigation';
import { MobileNavigation } from '../layout/MobileNavigation';
import WelcomeHeader from './WelcomeHeader';
import TodaysGoals from './TodaysGoals';
import ActivityFeed from './ActivityFeed';
import HealthSummary from './HealthSummary';
import MetricsGrid from './MetricsGrid';
import HealthInsights from './HealthInsights';
import QuickActions from './QuickActions';
import ReadinessScore from './ReadinessScore';
import AICoach from './AICoach';
import HealthDashboard from './HealthDashboard';
import SupplementShop from './SupplementShop';
import ProfileSettings from './ProfileSettings';
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
        return (
          <main className="space-y-8">
            {/* Welcome Header */}
            <WelcomeHeader />

            {/* Hero Section with Biowell Score */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 border border-blue-100 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Your Wellness Score
                    </h2>
                    <p className="text-lg text-gray-600">
                      Based on your latest health data and AI analysis
                    </p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      62
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                        Needs Attention
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated 5 minutes ago
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ReadinessScore score={62} />
                </div>
              </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Metrics Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Today's Metrics</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View All Trends →
                    </button>
                  </div>
                  <MetricsGrid />
                </div>
                
                {/* Health Summary */}
                <HealthSummary />
                
                {/* Health Insights */}
                <HealthInsights />
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* Today's Goals */}
                <TodaysGoals />
                
                {/* Activity Feed */}
                <ActivityFeed />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <QuickActions onActionClick={handleQuickAction} />
            </div>
          </main>
        );

      case 'coach':
        return (
          <main className="h-screen">
            <AICoach />
          </main>
        );

      case 'health':
        return (
          <main className="space-y-8">
            <HealthDashboard />
          </main>
        );

      case 'shop':
        return (
          <main className="space-y-8">
            <SupplementShop />
          </main>
        );

      case 'profile':
        return (
          <main className="space-y-8">
            <ProfileSettings />
          </main>
        );

      default:
        return (
          <main className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto">
                <span className="text-2xl">🚧</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
                <p className="text-lg text-gray-600">{activeTab} section is under development</p>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </main>
        );
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
        <div className="lg:pl-72 pt-20 lg:pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
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
    </AccessibilityProvider>
  );
};

export default Dashboard;