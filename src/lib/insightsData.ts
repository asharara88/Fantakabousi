import { 
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

export const insightsData = [
  {
    type: 'success',
    icon: CheckCircleIcon,
    title: 'Perfect Recovery Window',
    message: 'Your HRV is 12% above baseline. Ideal conditions for high-intensity training today.',
    confidence: 96,
    priority: 'high',
    action: 'Start Workout',
    color: 'from-green-500 to-emerald-600',
  },
  {
    type: 'optimization',
    icon: LightBulbIcon,
    title: 'Supplement Timing',
    message: 'Take creatine 30 minutes before your workout for optimal absorption and performance.',
    confidence: 89,
    priority: 'medium',
    action: 'Set Reminder',
    color: 'from-blue-500 to-cyan-600',
    supplementShortcut: {
      products: ['Creatine Monohydrate', 'Creatine HCL'],
      category: 'performance'
    }
  },
  {
    type: 'warning',
    icon: ExclamationTriangleIcon,
    title: 'Hydration Alert',
    message: 'Morning weight suggests mild dehydration. Aim for 750ml water in the next hour.',
    confidence: 92,
    priority: 'high',
    action: 'Track Water',
    color: 'from-amber-500 to-orange-600',
  },
  {
    type: 'insight',
    icon: BeakerIcon,
    title: 'Sleep Pattern Analysis',
    message: 'Your deep sleep increased 15% this week. Consider maintaining current bedtime routine.',
    confidence: 94,
    priority: 'low',
    action: 'View Trends',
    color: 'from-purple-500 to-indigo-600',
  },
];