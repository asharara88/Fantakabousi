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
  CogIcon,
  KeyIcon,
  GlobeAltIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ProfileSettingsEnhanced: React.FC = () => {
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

  const sections = [
    { 
      id: 'profile', 
      name: 'Personal Info', 
      icon: UserCircleIcon,
      description: 'Basic information'
    },
    { 
      id: 'health', 
      name: 'Health Info', 
      icon: HeartIcon,
      description: 'Health details'
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: BellIcon,
      description: 'Alert preferences'
    },
    { 
      id: 'privacy', 
      name: 'Privacy', 
      icon: ShieldCheckIcon,
      description: 'Data settings'
    },
    { 
      id: 'appearance', 
      name: 'Appearance', 
      icon: DevicePhoneMobileIcon,
      description: 'Theme and display'
    },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <UserCircleIcon className="w-8 h-8 text-white" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors">
                  <CameraIcon className="w-3 h-3 text-white" />
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900">Profile Photo</h3>
                <p className="text-sm text-gray-600">Add a photo to personalize your account</p>
              </div>
            </div>
            
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Mobile</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your mobile number"
                />
              </div>
            </div>
          </div>
        );
        
      case 'health':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Age"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Height"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Weight"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Activity Level</label>
              <select
                value={formData.activity_level}
                onChange={(e) => setFormData(prev => ({ ...prev, activity_level: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="space-y-3">
            {[
              { id: 'health_alerts', label: 'Health Alerts', description: 'Important health notifications', enabled: true },
              { id: 'supplement_reminders', label: 'Supplement Reminders', description: 'Daily supplement notifications', enabled: true },
              { id: 'workout_notifications', label: 'Workout Reminders', description: 'Exercise and activity reminders', enabled: false },
              { id: 'coach_messages', label: 'Coach Messages', description: 'Messages from your AI coach', enabled: true },
            ].map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">{setting.label}</div>
                  <div className="text-sm text-gray-600">{setting.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-3">
            {[
              { id: 'data_sharing', label: 'Data Sharing', description: 'Share anonymous data for research', icon: GlobeAltIcon },
              { id: 'analytics', label: 'App Analytics', description: 'Help improve the app', icon: EyeIcon },
              { id: 'marketing', label: 'Updates', description: 'Receive feature updates', icon: BellIcon },
            ].map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <setting.icon className="w-5 h-5 text-gray-500" />
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">{setting.label}</div>
                    <div className="text-sm text-gray-600">{setting.description}</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mt-1">
                  <DevicePhoneMobileIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Quick Theme Access</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    You can also change themes quickly from the sidebar or mobile menu
                  </p>
                </div>
              </div>
            </div>
            <ThemeSelector />
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <div className="text-gray-600">
              {activeSection} settings coming soon
            </div>
          </div>
        );
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-4 space-y-2">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <section.icon className={`w-5 h-5 ${
                  activeSection === section.id ? 'text-white' : 'text-gray-500'
                }`} />
                <div>
                  <div className="font-medium text-sm">{section.name}</div>
                  <div className={`text-xs ${
                    activeSection === section.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {section.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {sections.find(s => s.id === activeSection)?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {sections.find(s => s.id === activeSection)?.description}
                </p>
              </div>
              
              {renderSection()}
              
              {(activeSection === 'profile' || activeSection === 'health') && (
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button className="btn-secondary">
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
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

      {/* Account Actions */}
      <div className="card p-6 border-red-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-bold text-gray-900">Account Actions</h3>
          </div>
          <p className="text-gray-600">
            Manage your account settings and data.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-secondary border-red-500 text-red-500 hover:bg-red-50">
              Delete Account
            </button>
            <button 
              onClick={signOut}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsEnhanced;