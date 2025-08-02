import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { 
  BellIcon,
  CheckCircleIcon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported('Notification' in window && 'serviceWorker' in navigator);
    if (supported) {
      setPermission(Notification.permission);
    }
  }, [supported]);

  const requestPermission = async () => {
    if (!supported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported on this device.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive important health updates.",
        });
        return true;
      } else {
        toast({
          title: "Notifications Disabled",
          description: "You can enable them later in settings.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Biowell Health Alert', {
        body: 'Your wellness score has improved! Check your dashboard for details.',
        icon: '/logo-light.png',
        badge: '/logo-light.png',
        tag: 'health-update',
        requireInteraction: true,
      });
    }
  };

  const scheduleHealthReminder = (title: string, body: string, delay: number) => {
    if (permission === 'granted') {
      setTimeout(() => {
        new Notification(title, {
          body,
          icon: '/logo-light.png',
          tag: 'health-reminder',
        });
      }, delay);
    }
  };

  return {
    permission,
    supported,
    requestPermission,
    sendTestNotification,
    scheduleHealthReminder,
  };
};

interface PushNotificationSetupProps {
  onComplete?: () => void;
}

const PushNotificationSetup: React.FC<PushNotificationSetupProps> = ({ onComplete }) => {
  const { permission, supported, requestPermission, sendTestNotification } = usePushNotifications();
  const [step, setStep] = useState(1);

  const handleEnable = async () => {
    const granted = await requestPermission();
    if (granted) {
      setStep(2);
      setTimeout(() => {
        sendTestNotification();
        setStep(3);
      }, 1000);
    }
  };

  const handleComplete = () => {
    onComplete?.();
  };

  if (!supported) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
          <XMarkIcon className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Not Supported</h3>
          <p className="text-muted-foreground">
            Push notifications are not available on this device.
          </p>
        </div>
        <button onClick={handleComplete} className="btn-secondary">
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-light to-blue-medium rounded-2xl flex items-center justify-center mx-auto">
            <BellIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Stay Updated</h3>
            <p className="text-muted-foreground">
              Get notified about important health insights and reminders.
            </p>
          </div>
          <div className="space-y-3">
            <button onClick={handleEnable} className="btn-primary w-full">
              Enable Notifications
            </button>
            <button onClick={handleComplete} className="btn-ghost w-full">
              Maybe Later
            </button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircleIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Notifications Enabled</h3>
            <p className="text-muted-foreground">
              Sending you a test notification now...
            </p>
          </div>
          <LoadingSpinner size="md" />
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircleIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">All Set!</h3>
            <p className="text-muted-foreground">
              You'll receive health updates and reminders.
            </p>
          </div>
          <button onClick={handleComplete} className="btn-primary w-full">
            Continue to Dashboard
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PushNotificationSetup;