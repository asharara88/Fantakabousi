import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../layout/Navigation';
import MetricsGrid from './MetricsGrid';
import HealthInsights from './HealthInsights';
import QuickActions from './QuickActions';
import ReadinessScore from './ReadinessScore';
import WellnessScore from './WellnessScore';
import AICoach from './AICoach';
import HealthDashboard from './HealthDashboard';
import SupplementShop from './SupplementShop';
import ProfileSettings from './ProfileSettings';
import Container from '../ui/Container';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Listen for navigation events from other components
  React.useEffect(() => {
    const handleNavigateToCoach = () => {
      setActiveTab('coach');
    };

    window.addEventListener('navigateToCoach', handleNavigateToCoach);
    return () => window.removeEventListener('navigateToCoach', handleNavigateToCoach);
  }, []);

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
          <div className="space-y-12">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h1 className="text-heading-xl">
                Good morning, Ahmed
              </h1>
              <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                Here's your health overview for today.
              </p>
            </motion.div>

            {/* Biowell Score */}
            <ReadinessScore score={62} />

            {/* Metrics Grid */}
            <div className="space-y-6">
              <h2 className="text-heading-xl text-foreground">Today's Metrics</h2>
              <MetricsGrid />
            </div>

            {/* Health Insights */}
            <HealthInsights />

            {/* Quick Actions */}
            <QuickActions onActionClick={handleQuickAction} />
          </div>
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
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen">
        <Container className="py-8 lg:py-12">
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
        </Container>
      </main>

      {/* Mobile spacing for bottom navigation */}
      <div className="lg:hidden h-24" />
    </div>
  );
};

export default Dashboard;