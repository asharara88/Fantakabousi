import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { 
  ClockIcon,
  XMarkIcon,
  CheckCircleIcon,
  SunIcon,
  MoonIcon,
  FireIcon,
  BeakerIcon,
  CubeIcon,
  SparklesIcon,
  CalendarDaysIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface PlanYourDayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DayPlan {
  workStart: string;
  workEnd: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  workout: string;
  bedtime: string;
  supplements: {
    morning: string;
    evening: string;
  };
}

const PlanYourDay: React.FC<PlanYourDayProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<DayPlan>({
    workStart: '09:00',
    workEnd: '17:00',
    breakfast: '07:30',
    lunch: '12:30',
    dinner: '19:00',
    workout: '18:00',
    bedtime: '22:30',
    supplements: {
      morning: '07:00',
      evening: '21:30'
    }
  });

  const steps = [
    {
      id: 1,
      title: 'Work Schedule',
      icon: ClockIcon,
      color: 'from-blue-500 to-cyan-600',
      fields: ['workStart', 'workEnd']
    },
    {
      id: 2,
      title: 'Meal Times',
      icon: BeakerIcon,
      color: 'from-green-500 to-emerald-600',
      fields: ['breakfast', 'lunch', 'dinner']
    },
    {
      id: 3,
      title: 'Exercise & Wind Down',
      icon: FireIcon,
      color: 'from-orange-500 to-red-600',
      fields: ['workout', 'bedtime']
    }
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSavePlan();
    }
  };

  const handleSavePlan = async () => {
    try {
      // Calculate wind down time (3 hours before bedtime)
      const bedtimeHour = parseInt(plan.bedtime.split(':')[0]);
      const windDownHour = bedtimeHour - 3;
      const windDownTime = `${windDownHour.toString().padStart(2, '0')}:30`;

      // Auto-adjust supplement timing
      const updatedPlan = {
        ...plan,
        supplements: {
          morning: plan.breakfast,
          evening: windDownTime
        }
      };

      // Save to user preferences (mock for now)
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: "🎯 Day Planned Successfully!",
        description: `Your optimized schedule is ready. Wind down starts at ${windDownTime}.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your day plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updatePlan = (field: keyof DayPlan | string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPlan(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof DayPlan] as any),
          [child]: value
        }
      }));
    } else {
      setPlan(prev => ({ ...prev, [field]: value }));
    }
  };

  const renderStepContent = () => {
    const currentStep = steps[step - 1];
    
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Work Start</label>
                <input
                  type="time"
                  value={plan.workStart}
                  onChange={(e) => updatePlan('workStart', e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Work End</label>
                <input
                  type="time"
                  value={plan.workEnd}
                  onChange={(e) => updatePlan('workEnd', e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light bg-background text-foreground"
                />
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ⏰ We'll optimize your meal and exercise timing around your work schedule
              </p>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Breakfast</label>
                <input
                  type="time"
                  value={plan.breakfast}
                  onChange={(e) => updatePlan('breakfast', e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Lunch</label>
                <input
                  type="time"
                  value={plan.lunch}
                  onChange={(e) => updatePlan('lunch', e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Dinner</label>
                <input
                  type="time"
                  value={plan.dinner}
                  onChange={(e) => updatePlan('dinner', e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background text-foreground"
                />
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">
                🍽️ Optimal meal timing supports your metabolism and energy levels
              </p>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Workout Time</label>
                <input
                  type="time"
                  value={plan.workout}
                  onChange={(e) => updatePlan('workout', e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Bedtime</label>
                <input
                  type="time"
                  value={plan.bedtime}
                  onChange={(e) => updatePlan('bedtime', e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-background text-foreground"
                />
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                🌙 Wind down will start 3 hours before bedtime for optimal sleep quality
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="absolute inset-4 lg:inset-8 bg-background rounded-2xl shadow-2xl overflow-hidden border border-border max-w-2xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-to-r from-blue-light to-blue-medium">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                  <CalendarDaysIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Plan Your Day</h1>
                  <p className="text-white/80">Optimize your schedule in 30 seconds</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground">Step {step} of 3</span>
              <span className="text-sm text-muted-foreground">{Math.round((step / 3) * 100)}% complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-blue-light to-blue-medium rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Step Header */}
                <div className="text-center space-y-3">
                  <div className={`w-16 h-16 bg-gradient-to-br ${steps[step - 1].color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                    {React.createElement(steps[step - 1].icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      {steps[step - 1].title}
                    </h2>
                    <p className="text-muted-foreground">
                      {step === 1 && "Set your work hours for optimal scheduling"}
                      {step === 2 && "Plan your meals for sustained energy"}
                      {step === 3 && "Schedule exercise and wind down time"}
                    </p>
                  </div>
                </div>

                {/* Step Content */}
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between">
              <button
                onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                className="px-6 py-3 border border-border text-muted-foreground font-medium rounded-xl hover:bg-muted transition-colors"
              >
                {step > 1 ? 'Back' : 'Cancel'}
              </button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-blue-light to-blue-medium text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
              >
                <span>{step === 3 ? 'Create Plan' : 'Next'}</span>
                {step < 3 ? (
                  <ArrowRightIcon className="w-5 h-5" />
                ) : (
                  <CheckCircleIcon className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlanYourDay;