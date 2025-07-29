import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import ThemeSelector from '../settings/ThemeSelector';
import { 
  UserCircleIcon,
  CameraIcon,
  PencilIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  HeartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ProfileSettings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
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
    health_goals: [] as string[],
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
        health_goals: [],
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
        // Show success message
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
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
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <CameraIcon className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="text-heading-lg text-foreground">Profile Photo</h3>
                <p className="text-caption">Upload a photo to personalize your account</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-body font-semibold text-foreground">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="input-premium w-full"
                  placeholder="Enter your first name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-body font-semibold text-foreground">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="input-premium w-full"
                  placeholder="Enter your last name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-body font-semibold text-foreground">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-premium w-full opacity-50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-body font-semibold text-foreground">Mobile</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  className="input-premium w-full"
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
                <label className="text-body font-semibold text-foreground">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="input-premium w-full"
                  placeholder="Age"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-body font-semibold text-foreground">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  className="input-premium w-full"
                  placeholder="Height"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-body font-semibold text-foreground">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="input-premium w-full"
                  placeholder="Weight"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-body font-semibold text-foreground">Activity Level</label>
              <select
                value={formData.activity_level}
                onChange={(e) => setFormData(prev => ({ ...prev, activity_level: e.target.value }))}
                className="input-premium w-full"
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
        
      case 'appearance':
        return (
          <div className="space-y-6">
            <ThemeSelector />
          </div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <div className="text-body text-muted-foreground">
              {activeSection} settings coming soon
            </div>
          </div>
        );
    }
  };

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
              <h1 className="text-heading-xl text-foreground">Profile Settings</h1>
              <p className="text-caption">Manage your account and preferences</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="status-indicator status-success">
            <CheckCircleIcon className="w-4 h-4" />
            Verified
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-premium p-6 space-y-2">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
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
          <div className="card-premium p-8">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
              
              {(activeSection === 'profile' || activeSection === 'health') && (
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-border">
                  <button className="btn-secondary">
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
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
      <div className="card-premium p-8 border-red-500/20 bg-red-500/5">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            <h3 className="text-body font-bold text-foreground">Danger Zone</h3>
          </div>
          <p className="text-caption">
            These actions are permanent and cannot be undone.
          </p>
          <div className="flex space-x-4">
            <button className="px-6 py-3 border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-500/10 transition-colors">
              Delete Account
            </button>
            <button 
              onClick={signOut}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
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