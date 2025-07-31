import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { 
  WifiIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DevicePhoneMobileIcon,
  HeartIcon,
  ScaleIcon,
  BeakerIcon,
  XMarkIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Device {
  id: string;
  name: string;
  brand: string;
  category: 'wearable' | 'scale' | 'cgm';
  logo: string;
  description: string;
  features: string[];
  connectionType: 'bluetooth' | 'wifi' | 'app';
  popular: boolean;
}

interface DeviceConnectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeviceConnection: React.FC<DeviceConnectionProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'wearable' | 'scale' | 'cgm'>('all');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [connectionStep, setConnectionStep] = useState<'select' | 'connect' | 'success'>('select');
  const [connecting, setConnecting] = useState(false);

  const devices: Device[] = [
    // Wearables
    {
      id: 'apple-watch',
      name: 'Apple Watch',
      brand: 'Apple',
      category: 'wearable',
      logo: '⌚', // Apple Watch emoji
      description: 'Track heart rate, activity, sleep, and more',
      features: ['Heart Rate', 'Steps', 'Sleep', 'Workouts', 'ECG'],
      connectionType: 'app',
      popular: true
    },
    {
      id: 'fitbit-versa',
      name: 'Fitbit Versa 4',
      brand: 'Fitbit',
      category: 'wearable',
      logo: '🏃', // Fitness emoji
      description: 'Comprehensive fitness and health tracking',
      features: ['Heart Rate', 'Steps', 'Sleep', 'Stress', 'GPS'],
      connectionType: 'app',
      popular: true
    },
    {
      id: 'garmin-forerunner',
      name: 'Garmin Forerunner',
      brand: 'Garmin',
      category: 'wearable',
      logo: '🏃‍♂️', // Running emoji
      description: 'Advanced running and fitness metrics',
      features: ['GPS', 'Heart Rate', 'VO2 Max', 'Training Load'],
      connectionType: 'app',
      popular: true
    },
    {
      id: 'samsung-galaxy-watch',
      name: 'Galaxy Watch',
      brand: 'Samsung',
      category: 'wearable',
      logo: '⌚', // Watch emoji
      description: 'Smart health and fitness tracking',
      features: ['Heart Rate', 'Sleep', 'Body Composition', 'ECG'],
      connectionType: 'app',
      popular: true
    },
    {
      id: 'whoop-strap',
      name: 'WHOOP Strap 4.0',
      brand: 'WHOOP',
      category: 'wearable',
      logo: '💪', // Muscle emoji
      description: 'Recovery and strain optimization',
      features: ['HRV', 'Recovery', 'Strain', 'Sleep Coaching'],
      connectionType: 'app',
      popular: true
    },
    {
      id: 'oura-ring',
      name: 'Oura Ring',
      brand: 'Oura',
      category: 'wearable',
      logo: '💍', // Ring emoji
      description: 'Sleep and recovery insights',
      features: ['Sleep', 'HRV', 'Temperature', 'Activity'],
      connectionType: 'app',
      popular: true
    },
    // Smart Scales
    {
      id: 'withings-body',
      name: 'Body+ Scale',
      brand: 'Withings',
      category: 'scale',
      logo: '⚖️', // Scale emoji
      description: 'Body composition and weight tracking',
      features: ['Weight', 'Body Fat', 'Muscle Mass', 'BMI'],
      connectionType: 'wifi',
      popular: true
    },
    {
      id: 'fitbit-aria',
      name: 'Aria Air Scale',
      brand: 'Fitbit',
      category: 'scale',
      logo: '⚖️', // Scale emoji
      description: 'Smart scale with app integration',
      features: ['Weight', 'BMI', 'Trends', 'Multi-User'],
      connectionType: 'bluetooth',
      popular: true
    },
    {
      id: 'tanita-bc',
      name: 'BC-1000 Plus',
      brand: 'Tanita',
      category: 'scale',
      logo: '⚖️', // Scale emoji
      description: 'Professional body composition analysis',
      features: ['Weight', 'Body Fat', 'Muscle Mass', 'Visceral Fat'],
      connectionType: 'bluetooth',
      popular: false
    },
    // CGM Devices
    {
      id: 'freestyle-libre-2',
      name: 'FreeStyle Libre 2',
      brand: 'Abbott',
      category: 'cgm',
      logo: '🩸', // Blood drop emoji
      description: 'Continuous glucose monitoring with alarms',
      features: ['Real-time Glucose', 'Trends', 'Alarms', '14-day Sensor'],
      connectionType: 'app',
      popular: true
    },
    {
      id: 'dexcom-g7',
      name: 'Dexcom G7',
      brand: 'Dexcom',
      category: 'cgm',
      logo: '📊', // Chart emoji
      description: 'Advanced CGM with smartphone integration',
      features: ['Real-time Glucose', 'Share Data', 'Predictive Alerts'],
      connectionType: 'app',
      popular: true
    },
    {
      id: 'medtronic-guardian',
      name: 'Guardian Connect',
      brand: 'Medtronic',
      category: 'cgm',
      logo: '🩸', // Blood drop emoji
      description: 'Professional-grade glucose monitoring',
      features: ['Continuous Monitoring', 'Predictive Alerts', 'Data Sharing'],
      connectionType: 'app',
      popular: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Devices', icon: DevicePhoneMobileIcon, count: devices.length },
    { id: 'wearable', name: 'Wearables', icon: HeartIcon, count: devices.filter(d => d.category === 'wearable').length },
    { id: 'scale', name: 'Smart Scales', icon: ScaleIcon, count: devices.filter(d => d.category === 'scale').length },
    { id: 'cgm', name: 'CGM Devices', icon: BeakerIcon, count: devices.filter(d => d.category === 'cgm').length },
  ];

  const filteredDevices = selectedCategory === 'all' 
    ? devices 
    : devices.filter(d => d.category === selectedCategory);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setConnectionStep('connect');
  };

  const handleConnect = async () => {
    if (!selectedDevice || !user) return;

    setConnecting(true);
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Save device connection to database
      const { error } = await supabase
        .from('device_connections')
        .insert({
          user_id: user.id,
          device_type: selectedDevice.category,
          provider: selectedDevice.brand.toLowerCase(),
          device_id: `${selectedDevice.id}-${Date.now()}`,
          device_name: selectedDevice.name,
          access_token: 'mock_token_' + Date.now(),
          metadata: {
            features: selectedDevice.features,
            connectionType: selectedDevice.connectionType
          }
        });

      if (error) throw error;

      setConnectionStep('success');
      
      toast({
        title: "Device Connected!",
        description: `${selectedDevice.name} is now syncing your health data.`,
      });

    } catch (error) {
      console.error('Error connecting device:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect device. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleClose = () => {
    setSelectedDevice(null);
    setConnectionStep('select');
    setConnecting(false);
    onClose();
  };

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'bluetooth': return '📶';
      case 'wifi': return '📡';
      case 'app': return '📱';
      default: return '🔗';
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
        onClick={handleClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="absolute inset-4 lg:inset-8 bg-background rounded-2xl shadow-2xl overflow-hidden border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-biowell">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-neon-green rounded-xl flex items-center justify-center shadow-lg">
                  <WifiIcon className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Connect Your Devices</h1>
                  <p className="text-white/80">Sync your health data automatically</p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {connectionStep === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full flex flex-col"
                >
                  {/* Categories */}
                  <div className="p-6 border-b border-border">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {categories.map((category) => (
                        <motion.button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id as any)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedCategory === category.id
                              ? 'border-blue-light bg-blue-light/10 text-blue-light'
                              : 'border-border bg-card text-foreground hover:border-blue-light/50'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <category.icon className={`w-8 h-8 ${
                              selectedCategory === category.id ? 'text-blue-light' : 'text-muted-foreground'
                            }`} />
                            <div className="text-center">
                              <div className="font-semibold text-sm">{category.name}</div>
                              <div className="text-xs text-muted-foreground">{category.count} devices</div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Device List */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredDevices.map((device, index) => (
                        <motion.div
                          key={device.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-card rounded-xl p-6 border border-border hover:border-blue-light/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                          onClick={() => handleDeviceSelect(device)}
                        >
                          <div className="space-y-4">
                            {/* Device Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="text-4xl">{device.logo}</div>
                                <div>
                                  <h3 className="font-bold text-foreground">{device.name}</h3>
                                  <p className="text-sm text-muted-foreground">{device.brand}</p>
                                </div>
                              </div>
                              {device.popular && (
                                <div className="px-2 py-1 bg-neon-green/20 text-neon-green text-xs font-bold rounded-full">
                                  Popular
                                </div>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground">{device.description}</p>

                            {/* Features */}
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-foreground">Features:</div>
                              <div className="flex flex-wrap gap-1">
                                {device.features.slice(0, 3).map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                                  >
                                    {feature}
                                  </span>
                                ))}
                                {device.features.length > 3 && (
                                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                    +{device.features.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Connection Type */}
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>{getConnectionIcon(device.connectionType)}</span>
                                <span className="capitalize">{device.connectionType}</span>
                              </div>
                              <ArrowRightIcon className="w-4 h-4 text-blue-light" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {connectionStep === 'connect' && selectedDevice && (
                <motion.div
                  key="connect"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex items-center justify-center p-6"
                >
                  <div className="max-w-md w-full space-y-8 text-center">
                    <div className="space-y-4">
                      <div className="text-6xl">{selectedDevice.logo}</div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                          Connect {selectedDevice.name}
                        </h2>
                        <p className="text-muted-foreground">
                          Follow these steps to connect your {selectedDevice.brand} device
                        </p>
                      </div>
                    </div>

                    {/* Connection Steps */}
                    <div className="space-y-4 text-left">
                      {[
                        `Open the ${selectedDevice.brand} app on your phone`,
                        'Enable data sharing in privacy settings',
                        'Authorize Biowell to access your health data',
                        'Your data will sync automatically'
                      ].map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-light text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-foreground">{step}</p>
                        </div>
                      ))}
                    </div>

                    {/* Security Notice */}
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <div className="flex items-start space-x-3">
                        <ShieldCheckIcon className="w-5 h-5 text-neon-green mt-0.5" />
                        <div className="text-left">
                          <h4 className="font-semibold text-foreground mb-1">Your Data is Secure</h4>
                          <p className="text-sm text-muted-foreground">
                            We use bank-level encryption and never share your personal health data.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setConnectionStep('select')}
                        className="flex-1 px-6 py-3 border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-colors"
                      >
                        Back
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConnect}
                        disabled={connecting}
                        className="flex-1 px-6 py-3 bg-gradient-biowell text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        {connecting ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <WifiIcon className="w-5 h-5" />
                            <span>Connect Device</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {connectionStep === 'success' && selectedDevice && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full flex items-center justify-center p-6"
                >
                  <div className="max-w-md w-full space-y-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-24 h-24 bg-neon-green rounded-full flex items-center justify-center mx-auto shadow-lg"
                    >
                      <CheckCircleIcon className="w-12 h-12 text-black" />
                    </motion.div>

                    <div className="space-y-4">
                      <div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                          Successfully Connected!
                        </h2>
                        <p className="text-lg text-muted-foreground">
                          Your {selectedDevice.name} is now syncing data
                        </p>
                      </div>

                      <div className="bg-muted/50 rounded-xl p-4 border border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{selectedDevice.logo}</div>
                            <div className="text-left">
                              <div className="font-semibold text-foreground">{selectedDevice.name}</div>
                              <div className="text-sm text-muted-foreground">{selectedDevice.brand}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-neon-green">
                            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Syncing</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">What's Next?</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="w-4 h-4 text-blue-light" />
                            <span>Data will appear in your dashboard within 5-10 minutes</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <HeartIcon className="w-4 h-4 text-blue-light" />
                            <span>Your AI coach will analyze the new data automatically</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="w-full px-6 py-3 bg-gradient-biowell text-white font-medium rounded-xl hover:opacity-90 transition-all duration-200"
                    >
                      Done
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeviceConnection;