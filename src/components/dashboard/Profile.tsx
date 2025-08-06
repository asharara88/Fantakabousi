import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  Camera,
  Shield,
  Bell,
  Palette,
  Globe,
  Lock,
  Trash2,
  LogOut,
  Settings,
  Heart,
  Activity,
  Target,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    location: '',
    bio: '',
    healthGoals: [] as string[],
    activityLevel: '',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      marketing: false
    }
  });

  useEffect(() => {
    // Load user profile data
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    try {
      // In a real app, this would fetch from Supabase
      // For now, using mock data
      setProfileData(prev => ({
        ...prev,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+971 50 123 4567',
        location: 'Dubai, UAE',
        bio: 'Health enthusiast focused on optimizing wellness through data-driven insights.',
        healthGoals: ['Weight Management', 'Better Sleep', 'Stress Reduction'],
        activityLevel: 'moderately-active'
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, this would save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfileData(); // Reset to original data
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'health', label: 'Health Profile', icon: Heart },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield }
  ];

  const healthGoalOptions = [
    'Weight Management',
    'Muscle Building',
    'Better Sleep',
    'Stress Reduction',
    'Heart Health',
    'Improved Energy',
    'Mental Clarity',
    'Longevity'
  ];

  const toggleHealthGoal = (goal: string) => {
    setProfileData(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goal)
        ? prev.healthGoals.filter(g => g !== goal)
        : [...prev.healthGoals, goal]
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-8">
            {/* Profile Photo */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-2xl">
                    {profileData.firstName.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200">
                  <Camera className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{profileData.email}</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    Active Member
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Information Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60"
                    placeholder="Enter your first name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl opacity-60"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60"
                    placeholder="+971 50 123 4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 resize-none"
                placeholder="Tell us about yourself and your health journey..."
              />
            </div>
          </div>
        );

      case 'health':
        return (
          <div className="space-y-8">
            {/* Health Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Health Goals</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {healthGoalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => isEditing && toggleHealthGoal(goal)}
                    disabled={!isEditing}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                      profileData.healthGoals.includes(goal)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    } ${!isEditing ? 'opacity-60' : ''}`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Activity Level</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
                  { value: 'lightly-active', label: 'Lightly Active', description: '1-3 days per week' },
                  { value: 'moderately-active', label: 'Moderately Active', description: '3-5 days per week' },
                  { value: 'very-active', label: 'Very Active', description: '6-7 days per week' }
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => isEditing && setProfileData(prev => ({ ...prev, activityLevel: level.value }))}
                    disabled={!isEditing}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      profileData.activityLevel === level.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600'
                    } ${!isEditing ? 'opacity-60' : ''}`}
                  >
                    <div className="font-semibold text-slate-900 dark:text-white">{level.label}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Health Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Health Score', value: '94', unit: '/100', icon: Target, color: 'from-emerald-500 to-teal-600' },
                { label: 'Streak', value: '12', unit: 'days', icon: Award, color: 'from-amber-500 to-orange-600' },
                { label: 'Goals Achieved', value: '8', unit: '/10', icon: Activity, color: 'from-blue-500 to-cyan-600' }
              ].map((stat, index) => (
                <div key={index} className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {stat.value}
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-normal ml-1">
                          {stat.unit}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-8">
            {/* Theme Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'light', label: 'Light', icon: '☀️' },
                  { value: 'dark', label: 'Dark', icon: '🌙' },
                  { value: 'system', label: 'System', icon: '💻' }
                ].map((themeOption) => (
                  <button
                    key={themeOption.value}
                    onClick={() => setTheme(themeOption.value as any)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      theme === themeOption.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{themeOption.icon}</div>
                    <div className="font-semibold text-slate-900 dark:text-white">{themeOption.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h3>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', description: 'Receive health insights via email' },
                  { key: 'push', label: 'Push Notifications', description: 'Get real-time alerts on your device' },
                  { key: 'sms', label: 'SMS Notifications', description: 'Important health alerts via SMS' }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{setting.label}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{setting.description}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.notifications[setting.key as keyof typeof profileData.notifications]}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            [setting.key]: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-8">
            {/* Privacy Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Privacy Controls</h3>
              <div className="space-y-4">
                {[
                  { key: 'dataSharing', label: 'Anonymous Data Sharing', description: 'Help improve our AI by sharing anonymized health data' },
                  { key: 'analytics', label: 'Usage Analytics', description: 'Allow us to collect usage data to improve the app' },
                  { key: 'marketing', label: 'Marketing Communications', description: 'Receive updates about new features and health tips' }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{setting.label}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{setting.description}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.privacy[setting.key as keyof typeof profileData.privacy]}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          privacy: {
                            ...prev.privacy,
                            [setting.key]: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Security</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <div className="text-left">
                      <div className="font-semibold text-slate-900 dark:text-white">Change Password</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Update your account password</div>
                    </div>
                  </div>
                  <Edit3 className="w-4 h-4 text-slate-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/30 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <div className="text-left">
                      <div className="font-semibold text-red-700 dark:text-red-400">Delete Account</div>
                      <div className="text-sm text-red-600 dark:text-red-500">Permanently delete your account and data</div>
                    </div>
                  </div>
                  <Edit3 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your account and preferences</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Sign Out */}
            <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={signOut}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;