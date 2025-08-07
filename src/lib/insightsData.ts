import { 
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

export const insightsData = [
  {
    type: 'warning',
    icon: ExclamationTriangleIcon,
    title: 'Recovery Needs Attention',
    message: 'Your HRV is 15% below baseline. Consider lighter activity and focus on stress management today.',
    confidence: 92,
    priority: 'high',
    action: 'Manage Stress',
    color: 'from-amber-500 to-orange-600',
  },
  {
    type: 'optimization',
    icon: LightBulbIcon,
    title: 'Sleep Optimization',
    message: 'Your sleep duration is 1.5 hours below optimal. Try going to bed 30 minutes earlier tonight.',
    confidence: 94,
    priority: 'medium',
    action: 'Improve Sleep',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    type: 'warning',
    icon: ExclamationTriangleIcon,
    title: 'Glucose Spikes',
    message: 'Your post-meal glucose is spiking above 140mg/dL. Consider reducing refined carbs.',
    confidence: 88,
    priority: 'high',
    action: 'Adjust Diet',
    color: 'from-red-500 to-pink-600',
  },
  {
    type: 'insight',
    icon: BeakerIcon,
    title: 'Activity Goal',
    message: 'You\'re averaging 5,800 steps daily. Aim for 8,000+ steps to improve cardiovascular health.',
    confidence: 91,
    priority: 'medium',
    action: 'Increase Activity',
    color: 'from-purple-500 to-indigo-600',
  },
];