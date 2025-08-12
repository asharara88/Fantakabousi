import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';
import LazyWrapper from '../ui/LazyWrapper';

// Lazy load components
const WelcomeHeader = lazy(() => import('./WelcomeHeader'));
const HealthMetrics = lazy(() => import('./HealthMetrics'));
const OptimizeToday = lazy(() => import('./OptimizeToday'));
const TodaysGoals = lazy(() => import('./TodaysGoals'));
const ActivityFeed = lazy(() => import('./ActivityFeed'));
const ReadinessScore = lazy(() => import('./ReadinessScore'));
const AICoachEnhanced = lazy(() => import('./AICoachEnhanced'));
const NutritionDashboard = lazy(() => import('../nutrition/NutritionDashboard'));
const SupplementShopEnhanced = lazy(() => import('../supplements/SupplementShopEnhanced'));
const ProfileSettingsEnhanced = lazy(() => import('./ProfileSettingsEnhanced'));
const UbergeneIntegration = lazy(() => import('../fertility/UbergeneIntegration'));
const FitnessTracker = lazy(() => import('../fitness/FitnessTracker'));
const WorkoutPlan = lazy(() => import('../fitness/WorkoutPlan'));
const NEATTracker = lazy(() => import('../fitness/NEATTracker'));
const StepsDistance = lazy(() => import('../fitness/StepsDistance'));
const FitnessAwards = lazy(() => import('../fitness/FitnessAwards'));
const MuscleGroupVisualizer = lazy(() => import('../fitness/MuscleGroupVisualizer'));
const SleepAnalysis = lazy(() => import('../sleep/SleepAnalysis'));
const SleepCoaching = lazy(() => import('../sleep/SleepCoaching'));
const SleepEnvironment = lazy(() => import('../sleep/SleepEnvironment'));
const CircadianRhythm = lazy(() => import('../sleep/CircadianRhythm'));

interface DashboardContentProps {
  activeView: string;
  onQuickAction: (action: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeView, onQuickAction }) => {
  const renderContent = () => {
    switch (activeView) {
      case 'coach':
        return (
          <LazyWrapper name="AI Coach">
            <AICoachEnhanced />
          </LazyWrapper>
        );
      case 'health':
      case 'health-metrics':
      case 'health-analytics':
      case 'health-devices':
        return (
          <LazyWrapper name="Health Dashboard">
            <div className="space-y-8">
              <HealthMetrics />
              <OptimizeToday />
            </div>
          </LazyWrapper>
        );
      case 'nutrition':
      case 'nutrition-logger':
      case 'nutrition-recipes':
        return (
          <LazyWrapper name="Nutrition Dashboard">
            <NutritionDashboard onQuickAction={onQuickAction} />
          </LazyWrapper>
        );
      case 'supplements':
        return (
          <LazyWrapper name="Supplement Shop">
            <SupplementShopEnhanced onQuickAction={onQuickAction} />
          </LazyWrapper>
        );
      case 'fitness':
      case 'fitness-workout-plan':
        return (
          <LazyWrapper name="Workout Plan">
            <WorkoutPlan />
          </LazyWrapper>
        );
      case 'fitness-neat':
        return (
          <LazyWrapper name="NEAT Activity">
            <NEATTracker />
          </LazyWrapper>
        );
      case 'fitness-steps':
        return (
          <LazyWrapper name="Steps & Distance">
            <StepsDistance />
          </LazyWrapper>
        );
      case 'fitness-awards':
        return (
          <LazyWrapper name="Fitness Awards">
            <FitnessAwards />
          </LazyWrapper>
        );
      case 'fitness-muscle-groups':
        return (
          <LazyWrapper name="Muscle Group Visual">
            <MuscleGroupVisualizer />
          </LazyWrapper>
        );
      case 'sleep':
      case 'sleep-quality':
        return (
          <LazyWrapper name="Sleep Quality">
            <SleepQuality />
          </LazyWrapper>
        );
      case 'sleep-bioclock':
        return (
          <LazyWrapper name="Bioclock">
            <Bioclock />
          </LazyWrapper>
        );
      case 'sleep':
      case 'sleep-analysis':
        return (
          <LazyWrapper name="Sleep Analysis">
            <SleepAnalysis />
          </LazyWrapper>
        );
      case 'sleep-coaching':
        return (
          <LazyWrapper name="Sleep Coaching">
            <SleepCoaching />
          </LazyWrapper>
        );
      case 'sleep-environment':
        return (
          <LazyWrapper name="Sleep Environment">
            <SleepEnvironment />
          </LazyWrapper>
        );
      case 'sleep-circadian-rhythm':
        return (
          <LazyWrapper name="Circadian Rhythm">
            <CircadianRhythm />
          </LazyWrapper>
        );
      case 'profile':
        return (
          <LazyWrapper name="Profile Settings">
            <ProfileSettingsEnhanced />
          </LazyWrapper>
        );
      case 'fertility':
      case 'ubergene':
        return (
          <LazyWrapper name="UBERGENE Fertility">
            <UbergeneIntegration />
          </LazyWrapper>
        );
      default:
        return (
          <LazyWrapper name="Dashboard">
            <div className="space-y-8">
              <WelcomeHeader onQuickAction={onQuickAction} />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                  <HealthMetrics />
                  <OptimizeToday />
                </div>
                
                <div className="space-y-8">
                  <ReadinessScore score={87} />
                  <TodaysGoals onQuickAction={onQuickAction} />
                  <ActivityFeed />
                </div>
              </div>
            </div>
          </LazyWrapper>
        );
    }
  };

  return (
    <main 
      className="lg:pl-80 pt-24 lg:pt-8 pb-24 lg:pb-8"
      role="main"
      id="main-content"
    >
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </main>
  );
};

export default DashboardContent;