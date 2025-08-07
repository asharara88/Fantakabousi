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
    title: 'HRV Recovery Protocol',
    message: 'Your HRV dropped from 35ms to 28ms this week. Start the stress reduction protocol: Ashwagandha 600mg + 4-7-8 breathing 2x daily.',
    confidence: 94,
    priority: 'high',
    action: 'Start Recovery Protocol',
    color: 'from-amber-500 to-orange-600',
    supplementShortcut: {
      products: ['Ashwagandha 600mg', 'Magnesium Glycinate'],
      category: 'stress management'
    }
  },
  {
    type: 'optimization',
    icon: LightBulbIcon,
    title: 'Sleep Extension Protocol',
    message: 'You\'re averaging 6h 12m sleep. Set bedtime to 10:30 PM + take Magnesium 400mg + Melatonin 1mg to reach 7.5 hours.',
    confidence: 96,
    priority: 'medium',
    action: 'Start Sleep Protocol',
    color: 'from-blue-500 to-cyan-600',
    supplementShortcut: {
      products: ['Magnesium Glycinate', 'Melatonin 1mg'],
      category: 'sleep optimization'
    }
  },
  {
    type: 'warning',
    icon: ExclamationTriangleIcon,
    title: 'Glucose Control Protocol',
    message: 'Post-meal glucose peaks at 168mg/dL (target: <140). Take Berberine 500mg before meals + walk 10 minutes after eating.',
    confidence: 92,
    priority: 'high',
    action: 'Start Glucose Protocol',
    color: 'from-red-500 to-pink-600',
    supplementShortcut: {
      products: ['Berberine 500mg', 'Chromium Picolinate'],
      category: 'glucose management'
    }
  },
  {
    type: 'insight',
    icon: BeakerIcon,
    title: 'Cardio Improvement Protocol',
    message: 'You\'re averaging 5,800 steps (target: 8,000+). Add 20-minute Zone 2 walks at 2 PM and 6 PM daily to improve heart health.',
    confidence: 89,
    priority: 'medium',
    action: 'Start Walking Protocol',
    color: 'from-purple-500 to-indigo-600',
  },
];