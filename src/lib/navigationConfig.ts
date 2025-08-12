import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  BeakerIcon,
  BoltIcon,
  UserGroupIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolidIcon,
  ChatBubbleLeftRightIcon as ChatSolidIcon,
  ChartBarIcon as ChartSolidIcon,
  ShoppingBagIcon as ShoppingSolidIcon,
  UserGroupIcon as UserGroupSolidIcon,
  MoonIcon as MoonSolidIcon
} from '@heroicons/react/24/solid';

export const navigationItems = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: HomeIcon,
    activeIcon: HomeSolidIcon,
    description: 'Your wellness overview',
    gradient: 'from-blue-500 via-purple-500 to-pink-500'
  },
  {
    id: 'coach',
    label: 'SmartCoach™',
    icon: ChatBubbleLeftRightIcon,
    activeIcon: ChatSolidIcon,
    description: 'Personalized guidance',
    badge: 'AI',
    gradient: 'from-purple-500 via-indigo-500 to-blue-500'
  },
  {
    id: 'health',
    label: 'Health',
    icon: ChartBarIcon,
    activeIcon: ChartSolidIcon,
    description: 'Analytics & insights',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    children: [
      { id: 'metrics', label: 'Live Metrics', description: 'Real-time biometric data' },
      { id: 'analytics', label: 'Advanced Analytics', description: 'Deep health insights' },
      { id: 'devices', label: 'Connected Devices', description: 'Wearables & monitors' }
    ]
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    icon: BeakerIcon,
    activeIcon: BeakerIcon,
    description: 'Food & recipes',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    children: [
      { id: 'logger', label: 'Food Logger', description: 'Track your meals' },
      { id: 'recipes', label: 'Recipe Search', description: 'Healthy meal ideas' }
    ]
  },
  {
    id: 'supplements',
    label: 'Supplements',
    icon: ShoppingBagIcon,
    activeIcon: ShoppingSolidIcon,
    description: 'Premium supplements',
    gradient: 'from-orange-500 via-red-500 to-pink-500'
  },
  {
    id: 'fitness',
    label: 'Fitness',
    icon: BoltIcon,
    activeIcon: BoltIcon,
    description: 'Training & workouts',
    gradient: 'from-red-500 via-orange-500 to-yellow-500',
    children: [
      { id: 'workout-plan', label: 'Workout Plan', description: 'Personalized training programs' },
      { id: 'neat', label: 'NEAT Activity', description: 'Non-exercise activity tracking' },
      { id: 'steps', label: 'Steps & Distance', description: 'Daily movement tracking' },
      { id: 'awards', label: 'Awards', description: 'Fitness achievements & badges' },
      { id: 'muscle-groups', label: 'Muscle Group Visual', description: 'Interactive muscle readiness' }
    ]
  },
  {
    id: 'sleep',
    label: 'Sleep',
    icon: MoonIcon,
    activeIcon: MoonIcon,
    description: 'Sleep optimization & recovery',
    gradient: 'from-indigo-500 via-purple-500 to-blue-500',
    children: [
      { id: 'sleep-analysis', label: 'Sleep Analysis', description: 'Detailed sleep metrics' },
      { id: 'sleep-coaching', label: 'Sleep Coaching', description: 'Personalized sleep guidance' },
      { id: 'sleep-environment', label: 'Sleep Environment', description: 'Optimize your bedroom' },
      { id: 'circadian-rhythm', label: 'Circadian Rhythm', description: 'Light exposure & timing' }
    ]
  },
  {
    id: 'fertility',
    label: 'UBERGENE',
    icon: UserGroupIcon,
    activeIcon: UserGroupSolidIcon,
    description: 'Couples fertility optimization',
    badge: 'TTC',
    gradient: 'from-pink-500 via-rose-500 to-red-500'
  }
];