import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import LoadingSpinner from '../ui/LoadingSpinner';
import ThemeSelector from '../settings/ThemeSelector';
import { useToast } from '../../hooks/useToast';
import { 
  UserCircleIcon,
  CameraIcon,
  ShieldCheckIcon,
  BellIcon,
  DevicePhoneMobileIcon,
  HeartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const ProfileSettings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile: '',
    age: '',
    height: '',
    weight: '',
    activity_level: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        mobile: profile.mobile || '',
        age: '',
        height: '',
        weight: '',
        activity_level: '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const success = await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        mobile: formData.mobile,
      });
      
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const sections = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'health', name: 'Health Info', icon: HeartIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'appearance', name: 'Appearance', icon: DevicePhoneMobileIcon },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserCircleIcon className="w-12 h-12 text-white" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <CameraIcon className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Profile Photo</h3>
                <p className="text-gray-600">Upload a photo to personalize your account</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your first name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your last name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Mobile</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your mobile number"
                />
              </div>
            </div>
          </div>
        );
        
      case 'health':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Age"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Height"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Weight"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Activity Level</label>
              <select
                value={formData.activity_level}
                onChange={(e) => setFormData(prev => ({ ...prev, activity_level: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary</option>
                <option value="lightly-active">Lightly Active</option>
                <option value="moderately-active">Moderately Active</option>
                <option value="very-active">Very Active</option>
                <option value="extremely-active">Extremely Active</option>
              </select>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                { id: 'health_alerts', label: 'Health Alerts', description: 'Get notified about important health metrics' },
                { id: 'supplement_reminders', label: 'Supplement Reminders', description: 'Daily reminders for your supplement stack' },
                { id: 'workout_notifications', label: 'Workout Notifications', description: 'Reminders for scheduled workouts' },
                { id: 'coach_messages', label: 'Coach Messages', description: 'Notifications from your AI coach' },
              ].map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">{setting.label}</div>
                    <div className="text-sm text-gray-600">{setting.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                { id: 'data_sharing', label: 'Data Sharing', description: 'Allow anonymous data sharing for research' },
                { id: 'analytics', label: 'Analytics', description: 'Help improve the app with usage analytics' },
                { id: 'marketing', label: 'Marketing Communications', description: 'Receive updates about new features' },
              ].map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">{setting.label}</div>
                    <div className="text-sm text-gray-600">{setting.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'appearance':
        return (
          <div className="space-y-6">
            <ThemeSelector />
          </div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-600">
              {activeSection} settings coming soon
            </div>
          </div>
        );
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Update your account and health preferences</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircleIcon className="w-4 h-4" />
            <span>Verified</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-2">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
              
              {(activeSection === 'profile' || activeSection === 'health') && (
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-8 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-bold text-gray-900">Danger Zone</h3>
          </div>
          <p className="text-gray-600">
            These actions are permanent and cannot be undone.
          </p>
          <div className="flex space-x-4">
            <button className="px-6 py-3 border-2 border-red-500 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors">
              Delete Account
            </button>
            <button 
              onClick={handleSignOut}
              className="px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;