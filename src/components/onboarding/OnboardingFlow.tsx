import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import PushNotificationSetup from '../notifications/PushNotifications';
import DeviceConnection from '../devices/DeviceConnection';
import { useToast } from '../../hooks/useToast';
import { 
  UserIcon,
  HeartIcon,
  DevicePhoneMobileIcon,
  BellIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    height: '',
    weight: '',
    activity_level: '',
    health_goals: [] as string[],
  });

  const steps = [
    { id: 1, title: 'Personal Info', icon: UserIcon, description: 'Tell us about yourself' },
    { id: 2, title: 'Health Goals', icon: HeartIcon, description: 'What do you want to achieve?' },
    { id: 3, title: 'Connect Devices', icon: DevicePhoneMobileIcon, description: 'Link your health devices' },
    { id: 4, title: 'Notifications', icon: BellIcon, description: 'Stay updated on your progress' },
  ];

  const healthGoals = [
    'Weight Loss', 'Muscle Building', 'Better Sleep', 'Stress Reduction',
    'Heart Health', 'Insulin Optimization', 'Fertility', 'Longevity'
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'lightly-active', label: 'Lightly Active', description: '1-3 days per week' },
    { value: 'moderately-active', label: 'Moderately Active', description: '3-5 days per week' },
    { value: 'very-active', label: 'Very Active', description: '6-7 days per week' },
  ];

  const handleNext = async () => {
    if (currentStep === 2) {
      // Save profile data
      try {
        await updateProfile({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      await updateProfile({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      });
      
      toast({
        title: "Welcome to Biowell! 🎉",
        description: "Your wellness journey starts now.",
      });
      
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const toggleHealthGoal = (goal: string) => {
    setProfileData(prev => ({
      ...prev,
      health_goals: prev.health_goals.includes(goal)
        ? prev.health_goals.filter(g => g !== goal)
        : [...prev.health_goals, goal]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Tell us about yourself</h2>
              <p className="text-muted-foreground">This helps us personalize your experience</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">First Name</label>
                  <input
                    type="text"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-light/20 bg-background text-foreground"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Last Name</label>
                  <input
                    type="text"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-light/20 bg-background text-foreground"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Age</label>
                  <input
                    type="number"
                    value={profileData.age}
                    onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-light/20 bg-background text-foreground"
                    placeholder="28"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Height (cm)</label>
                  <input
                    type="number"
                    value={profileData.height}
                    onChange={(e) => setProfileData(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-light/20 bg-background text-foreground"
                    placeholder="180"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Weight (kg)</label>
                  <input
                    type="number"
                    value={profileData.weight}
                    onChange={(e) => setProfileData(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-light/20 bg-background text-foreground"
                    placeholder="75"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Activity Level</label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {activityLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setProfileData(prev => ({ ...prev, activity_level: level.value }))}
                      className={`p-4 text-left border-2 rounded-lg transition-all ${
                        profileData.activity_level === level.value
                          ? 'border-blue-light bg-blue-light/10'
                          : 'border-border hover:border-blue-light/50'
                      }`}
                    >
                      <div className="font-medium text-foreground">{level.label}</div>
                      <div className="text-sm text-muted-foreground">{level.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">What are your health goals?</h2>
              <p className="text-muted-foreground">Select all that apply to personalize your experience</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {healthGoals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleHealthGoal(goal)}
                  className={`p-4 text-center border-2 rounded-lg transition-all ${
                    profileData.health_goals.includes(goal)
                      ? 'border-blue-light bg-blue-light/10 text-blue-light'
                      : 'border-border hover:border-blue-light/50 text-foreground'
                  }`}
                >
                  <div className="font-medium">{goal}</div>
                  {profileData.health_goals.includes(goal) && (
                    <CheckCircleIcon className="w-5 h-5 mx-auto mt-2 text-blue-light" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Connect Your Devices</h2>
              <p className="text-muted-foreground">Link your health devices for automatic tracking</p>
            </div>
            
            <DeviceConnection isOpen={true} onClose={() => {}} />
          </div>
        );

      case 4:
        return (
          <PushNotificationSetup onComplete={handleComplete} />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress Header */}
          <div className="p-6 bg-gradient-to-r from-blue-light to-blue-medium">
            <div className="flex items-center justify-between text-white mb-4">
              <h1 className="text-2xl font-bold">Welcome to Biowell</h1>
              <span className="text-sm">Step {currentStep} of 4</span>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="h-2 bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="p-6 border-t border-border">
              <div className="flex justify-between">
                <button
                  onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Back
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !profileData.first_name) ||
                    (currentStep === 2 && profileData.health_goals.length === 0)
                  }
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>{currentStep === 4 ? 'Complete' : 'Next'}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;