import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { AccessibilityProvider } from '../ui/AccessibilityProvider';
import Navigation from '../layout/Navigation';
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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleQuickAction = (action: string) => {
    setActiveTab(action);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <main className="space-y-6">
            {/* Welcome Header */}
            <WelcomeHeader />

            {/* Biowell Score */}
            <ReadinessScore score={62} />

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Metrics Grid */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Metrics</h2>
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
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <QuickActions onActionClick={handleQuickAction} />
            </div>
          </main>
        );

      case 'coach':
        return (
          <main className="h-full">
            <AICoach />
          </main>
        );

      case 'health':
        return (
          <main className="space-y-6">
            <HealthDashboard />
          </main>
        );

      case 'shop':
        return (
          <main className="space-y-6">
            <SupplementShop />
          </main>
        );

      case 'profile':
        return (
          <main className="space-y-6">
            <ProfileSettings />
          </main>
        );

      default:
        return (
          <main className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl">🚧</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Coming Soon</h2>
                <p className="text-gray-600">{activeTab} section is under development</p>
              </div>
            </div>
          </main>
        );
    }
  };

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />
        
        {/* Main Content */}
        <div className="lg:ml-72 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile spacing for bottom navigation */}
        <div className="lg:hidden h-20" />
      </div>
    </AccessibilityProvider>
  );
};

export default Dashboard;