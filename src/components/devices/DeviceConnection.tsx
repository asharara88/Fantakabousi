import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { 
  WifiIcon,
  CheckCircleIcon,
  XMarkIcon,
  HeartIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface DeviceConnectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeviceConnection: React.FC<DeviceConnectionProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);

  const devices = [
    {
      id: 'apple-watch',
      name: 'Apple Watch',
      brand: 'Apple',
      logo: '⌚',
      description: 'Heart rate, activity, and sleep tracking',
      metrics: ['Heart Rate', 'Steps', 'Sleep', 'Workouts'],
      color: 'from-gray-700 to-black',
      popular: true
    },
    {
      id: 'freestyle-libre',
      name: 'FreeStyle Libre',
      brand: 'Abbott',
      logo: '🩸',
      description: 'Continuous glucose monitoring',
      metrics: ['Blood Glucose', 'Trends', 'Alerts'],
      color: 'from-blue-500 to-cyan-600',
      popular: true
    }
  ];

  const handleQuickConnect = async (deviceId: string) => {
    if (connectedDevices.includes(deviceId)) return;

    // Check if user is properly authenticated
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect your devices.",
        variant: "destructive",
      });
      return;
    }

    setConnecting(true);
    try {
      // Simulate quick connection
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save device connection
      const device = devices.find(d => d.id === deviceId)!;
      const { error } = await supabase
        .from('device_connections')
        .insert({
          user_id: user!.id,
          device_type: deviceId === 'apple-watch' ? 'wearable' : 'cgm',
          provider: device.brand.toLowerCase(),
          device_id: `${deviceId}-${Date.now()}`,
          device_name: device.name,
          access_token: 'connected_' + Date.now(),
          metadata: { features: device.metrics }
        });

      if (error) throw error;

      // Generate dummy data for the connected device
      await generateRealisticHealthData(user.id, deviceId as 'apple-watch' | 'freestyle-libre');

      setConnectedDevices(prev => [...prev, deviceId]);
      
      toast({
        title: "Device Connected!",
        description: `${device.name} is now syncing your health data.`,
      });

    } catch (error) {
      console.error('Error connecting device:', error);
      toast({
        title: "Connection Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
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
                  <WifiIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Connect Your Devices</h1>
                  <p className="text-white/80">One-tap setup for instant health tracking</p>
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Quick Setup Message */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Instant Health Sync
                  </h2>
                  <p className="text-muted-foreground">
                    Connect your devices with one tap. We'll handle the rest automatically.
                  </p>
                </div>
              </div>

              {/* Device Cards */}
              <div className="space-y-4">
                {devices.map((device, index) => {
                  const isConnected = connectedDevices.includes(device.id);
                  const isConnecting = connecting;
                  
                  return (
                    <motion.div
                      key={device.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                        isConnected 
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                          : 'border-border bg-card hover:border-blue-light/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-4xl">{device.logo}</div>
                          <div className="space-y-2">
                            <div>
                              <h3 className="text-lg font-bold text-foreground">{device.name}</h3>
                              <p className="text-sm text-muted-foreground">{device.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {device.metrics.map((metric, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                                >
                                  {metric}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          {isConnected ? (
                            <div className="flex items-center space-x-2 text-green-600">
                              <CheckCircleIcon className="w-5 h-5" />
                              <span className="font-semibold">Connected</span>
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleQuickConnect(device.id)}
                              disabled={isConnecting}
                              className="px-6 py-3 bg-gradient-to-r from-blue-light to-blue-medium text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2"
                            >
                              {isConnecting ? (
                                <>
                                  <LoadingSpinner size="sm" />
                                  <span>Connecting...</span>
                                </>
                              ) : (
                                <>
                                  <WifiIcon className="w-5 h-5" />
                                  <span>Quick Connect</span>
                                </>
                              )}
                            </motion.button>
                          )}
                          
                          {device.popular && (
                            <div className="px-2 py-1 bg-neon-green/20 text-neon-green text-xs font-bold rounded-full">
                              Most Popular
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Security Notice */}
              <div className="bg-muted/50 rounded-xl p-4 border border-border">
                <div className="flex items-start space-x-3">
                  <ShieldCheckIcon className="w-5 h-5 text-neon-green mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Your Data is Secure</h4>
                    <p className="text-sm text-muted-foreground">
                      Bank-level encryption • HIPAA compliant • Never shared with third parties
                    </p>
                  </div>
                </div>
              </div>

              {/* What Happens Next */}
              {connectedDevices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-200 dark:border-green-800"
                >
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-700 dark:text-green-400">What's Next?</h4>
                    <div className="space-y-2 text-sm text-green-600 dark:text-green-500">
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>Data will appear in your dashboard within 30 seconds</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <HeartIcon className="w-4 h-4" />
                        <span>Your AI coach will analyze the new data automatically</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Personalized insights will be generated based on your patterns</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-light to-blue-medium text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200"
            >
              {connectedDevices.length > 0 ? 'View My Dashboard' : 'Maybe Later'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeviceConnection;