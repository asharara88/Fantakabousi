import React from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon,
  HeartIcon,
  BeakerIcon,
  CubeIcon,
  FireIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: 'metric' | 'supplement' | 'workout' | 'meal' | 'sleep';
  title: string;
  description: string;
  timestamp: Date;
  value?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const ActivityFeed: React.FC = () => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'metric',
      title: 'Heart Rate Recorded',
      description: 'Resting HR: 68 bpm',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      value: '68 bpm',
      icon: HeartIcon,
      color: 'bg-red-500'
    },
    {
      id: '2',
      type: 'supplement',
      title: 'Morning Stack Completed',
      description: 'Vitamin D3, Omega-3, Magnesium',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: CubeIcon,
      color: 'bg-green-500'
    },
    {
      id: '3',
      type: 'workout',
      title: 'Workout Session',
      description: 'Upper body strength training',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      value: '45 min',
      icon: FireIcon,
      color: 'bg-orange-500'
    },
    {
      id: '4',
      type: 'metric',
      title: 'Glucose Reading',
      description: 'Post-meal glucose level',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      value: '142 mg/dL',
      icon: BeakerIcon,
      color: 'bg-yellow-500'
    },
    {
      id: '5',
      type: 'sleep',
      title: 'Sleep Analysis',
      description: 'Last night sleep quality',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      value: '7h 23m',
      icon: MoonIcon,
      color: 'bg-indigo-500'
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
            <ClockIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-600">Your latest health updates</p>
          </div>
        </div>
        
        <button 
          onClick={() => window.location.href = '#health'}
          className="text-sm text-blue-500 hover:text-blue-600 font-medium cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className={`w-10 h-10 ${activity.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <activity.icon className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {activity.title}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {activity.description}
              </p>
            </div>
            
            <div className="text-right flex-shrink-0">
              {activity.value && (
                <div className="text-sm font-semibold text-gray-900">
                  {activity.value}
                </div>
              )}
              <div className="text-xs text-gray-500">
                {formatTimeAgo(activity.timestamp)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button 
          onClick={() => window.location.href = '#health'}
          className="w-full text-center text-sm text-blue-500 hover:text-blue-600 font-medium py-2 cursor-pointer"
        >
          Load More Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;