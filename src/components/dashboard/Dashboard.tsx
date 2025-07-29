import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { AccessibilityProvider } from '../ui/AccessibilityProvider';
import Navigation from '../layout/Navigation';
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
          <main className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-2">
              <h1 className="text-display">Good Morning, Ahmed</h1>
              <p className="text-caption max-w-xl mx-auto">
                Your daily health insights and wellness metrics.
              </p>
            </div>

            {/* Biowell Score */}
            <ReadinessScore score={62} />

            {/* Metrics Grid */}
            <div className="space-y-4">
              <h2 className="text-title">Today's Metrics</h2>
              <MetricsGrid />
            </div>

            {/* Health Insights */}
            <HealthInsights />

            {/* Quick Actions */}
            <QuickActions onActionClick={handleQuickAction} />
          </main>
        );

      case 'coach':
        return <AICoach />;

      case 'health':
        return <HealthDashboard />;

      case 'shop':
        return <SupplementShop />;

      case 'profile':
        return <ProfileSettings />;

      default:
        return (
          <div className="text-center py-12">
            <div className="text-body text-muted-foreground">
              {activeTab} content coming soon
            </div>
          </div>
        );
    }
  };

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />
        
        {/* Main Content */}
        <div className="lg:ml-72 min-h-screen">
          <div className="container py-8">
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