import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  BeakerIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolidIcon,
  ChatBubbleLeftRightIcon as ChatSolidIcon,
  ChartBarIcon as ChartSolidIcon,
  ShoppingBagIcon as ShoppingSolidIcon
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
    label: 'AI Coach',
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
    label: 'Shop',
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
    gradient: 'from-red-500 via-orange-500 to-yellow-500'
  }
];