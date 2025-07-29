import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { AccessibilityProvider } from '../ui/AccessibilityProvider';
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
          <main id="main-content" className="space-y-12" role="main" aria-label="Health Dashboard">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
              role="banner"
            >
              <h1 className="text-heading-lg" id="page-title">
                Good morning, Ahmed
              </h1>
              <p className="text-caption text-muted-foreground max-w-xl mx-auto">
                Here's your health overview for today.
              </p>
            </motion.div>

            {/* Biowell Score */}
            <section aria-labelledby="biowell-score-heading">
              <ReadinessScore score={62} />
            </section>

            {/* Metrics Grid */}
            <section aria-labelledby="metrics-heading" className="space-y-4">
              <h2 id="metrics-heading" className="text-heading-lg text-foreground">Today's Metrics</h2>
              <MetricsGrid />
            </section>

            {/* Health Insights */}
            <section aria-labelledby="insights-heading">
              <HealthInsights />
            </section>

            {/* Quick Actions */}
            <section aria-labelledby="actions-heading">
              <QuickActions onActionClick={handleQuickAction} />
            </section>
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
    <div className="min-h-screen bg-background" data-testid="dashboard">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        aria-label="Main navigation"
      />
      
      {/* Main Content */}
      <div className="lg:ml-80 min-h-screen">
        <Container className="py-6 lg:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              role="main"
              aria-live="polite"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </Container>
      </div>

      {/* Mobile spacing for bottom navigation */}
      <div className="lg:hidden h-20" />
    </div>
    </AccessibilityProvider>
  );
};

export default Dashboard;