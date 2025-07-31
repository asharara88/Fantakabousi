import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BellIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  HeartIcon,
  BeakerIcon,
  CubeIcon,
  FireIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  CpuChipIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';

interface Notification {
  id: string;
  type: 'health' | 'supplement' | 'workout' | 'achievement' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // Mock notifications for demo
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'health',
        title: 'Glucose Alert',
        message: 'Your glucose might spike after lunch. Consider a lighter meal or take a walk.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        priority: 'high',
        icon: BeakerIcon,
        color: 'from-red-500 to-pink-600'
      },
      {
        id: '2',
        type: 'supplement',
        title: 'Supplement Reminder',
        message: 'Time to take your evening supplements for better sleep tonight.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        priority: 'medium',
        icon: CubeIcon,
        color: 'from-green-500 to-emerald-600'
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Great Progress! 🎉',
        message: 'You hit your step goal 5 days in a row this week. Keep it up!',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        read: true,
        priority: 'low',
        icon: CheckCircleIcon,
        color: 'from-blue-500 to-cyan-600'
      },
      {
        id: '4',
        type: 'workout',
        title: 'Perfect Time to Exercise',
        message: 'Your energy levels are high right now. Great time for a workout!',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        read: true,
        priority: 'medium',
        icon: FireIcon,
        color: 'from-orange-500 to-red-600'
      },
      {
        id: '5',
        type: 'health',
        title: 'Sleep Quality Improved',
        message: 'Your sleep score increased by 15% this week. Your new bedtime routine is working!',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
        read: true,
        priority: 'low',
        icon: HeartIcon,
        color: 'from-blue-500 to-purple-600'
      },
      {
        id: '6',
        type: 'system',
        title: 'Weekly Health Report Ready',
        message: 'Your weekly health summary is ready. Check out your progress and insights.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        priority: 'low',
        icon: InformationCircleIcon,
        color: 'from-indigo-500 to-purple-600'
      },
      {
        id: '7',
        type: 'health',
        title: 'Device Sync Complete',
        message: 'Your Apple Watch data has been synced. All metrics are up to date.',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
        read: false,
        priority: 'high',
        icon: CpuChipIcon,
        color: 'from-purple-500 to-indigo-600'
      },
      {
        id: '8',
        type: 'achievement',
        title: 'Health Goal Achieved',
        message: 'Congratulations! You reached your monthly fitness goal 3 days early.',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        read: true,
        priority: 'medium',
        icon: SparklesIcon,
        color: 'from-cyan-500 to-blue-600'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

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

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
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
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border shadow-2xl overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-light to-blue-medium rounded-xl flex items-center justify-center">
                <BellSolidIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-muted rounded-xl p-1">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-light to-blue-medium text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-gradient-to-r from-blue-light to-blue-medium text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="w-full py-2 text-sm font-medium text-blue-light hover:text-blue-medium transition-colors"
            >
              Mark all as read
            </button>
          )}

          {/* Notifications List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-card rounded-xl p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'border border-blue-light/30 shadow-lg' : 'border border-border'
                  } transition-all duration-200`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${notification.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <notification.icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className={`font-semibold text-foreground ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2 ml-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                      
                      <p className={`text-sm mt-1 ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {notification.priority}
                          </span>
                          
                          {notification.actionUrl && (
                            <button className="text-xs font-medium text-blue-light hover:text-blue-medium transition-colors">
                              View Details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BellIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {filter === 'unread' ? 'All caught up!' : 'No notifications'}
              </h3>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? 'You have no unread notifications.' 
                  : 'We\'ll notify you when something important happens.'
                }
              </p>
            </div>
          )}

          {/* Settings */}
          <div className="pt-6 border-t border-border">
            <button className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors">
              <span className="text-sm font-medium text-foreground">Notification Settings</span>
              <EllipsisVerticalIcon className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationCenter;