import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useChatSessions } from '../../hooks/useChatSessions';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  SparklesIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  BoltIcon,
  BeakerIcon,
  UserIcon,
  CpuChipIcon,
  PlusIcon,
  LightBulbIcon,
  FlagIcon,
  ClockIcon,
  FireIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const AICoachEnhanced: React.FC = () => {
  const { user } = useAuth();
  const {
    sessions,
    currentSession,
    messages,
    loading,
    sendingMessage,
    createNewSession,
    selectSession,
    sendMessage
  } = useChatSessions();
  
  const [inputMessage, setInputMessage] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(!currentSession || messages.length === 0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sendingMessage) return;
    
    setShowOnboarding(false);
    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickPrompt = async (prompt: string) => {
    setInputMessage(prompt);
    setShowOnboarding(false);
    await sendMessage(prompt);
    setInputMessage('');
  };

  const onboardingPrompts = [
    {
      category: 'Health Goals',
      icon: FlagIcon,
      color: 'from-blue-500 to-cyan-600',
      prompts: [
        'Help me optimize my sleep quality',
        'Create a muscle building plan',
        'Improve my insulin sensitivity',
        'Design a fertility support protocol'
      ]
    },
    {
      category: 'Quick Analysis',
      icon: BeakerIcon,
      color: 'from-green-500 to-emerald-600',
      prompts: [
        'Analyze my recent health trends',
        'Review my supplement stack',
        'Check my glucose patterns',
        'Evaluate my workout recovery'
      ]
    },
    {
      category: 'Lifestyle',
      icon: SparklesIcon,
      color: 'from-purple-500 to-indigo-600',
      prompts: [
        'Plan my daily routine',
        'Optimize my meal timing',
        'Suggest stress management techniques',
        'Create a morning routine'
      ]
    }
  ];

  const exampleGoals = [
    { icon: MoonIcon, title: 'Better Sleep', description: 'Improve your sleep quality and recovery' },
    { icon: FireIcon, title: 'Fitness Goals', description: 'Build muscle and improve performance' },
    { icon: HeartIcon, title: 'Nutrition Help', description: 'Eat better and feel more energized' },
    { icon: BeakerIcon, title: 'Health Tracking', description: 'Understand your health metrics' },
  ];

  if (loading && !currentSession) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CpuChipIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Wellness Coach</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Online and ready to help</span>
              </div>
            </div>
          </div>
          
          {sessions.length > 0 && (
            <button
              onClick={() => createNewSession()}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {showOnboarding ? (
          /* Onboarding Experience */
          <div className="h-full overflow-y-auto py-8">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Welcome */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                  <SparklesIcon className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your AI Health Coach</h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    I'm your personal health assistant. I can help you understand your health data, suggest improvements, and answer questions about nutrition, exercise, and wellness.
                  </p>
                </div>
              </motion.div>

              {/* Choose Your Focus */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 text-center">Choose Your Focus</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {exampleGoals.map((goal, index) => (
                    <motion.button
                      key={goal.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickPrompt(`Help me with ${goal.title.toLowerCase()}: ${goal.description}`)}
                      className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 text-center"
                    >
                      <goal.icon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                      <h4 className="font-bold text-gray-900 mb-2">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Example Prompts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 text-center">Or Try These Examples</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {onboardingPrompts.map((category, categoryIndex) => (
                    <div key={category.category} className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                          <category.icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{category.category}</h4>
                      </div>
                      <div className="space-y-2">
                        {category.prompts.map((prompt, promptIndex) => (
                          <motion.button
                            key={promptIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + categoryIndex * 0.1 + promptIndex * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleQuickPrompt(prompt)}
                            className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                          >
                            <span className="text-gray-700 hover:text-blue-700">{prompt}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-3xl ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-600' 
                          : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      }`}>
                        {message.role === 'user' ? (
                          <UserIcon className="w-6 h-6 text-white" />
                        ) : (
                          <CpuChipIcon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      
                      <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-blue-50 to-cyan-50' 
                          : ''
                      }`}>
                        <p className="text-gray-900 leading-relaxed">
                          {message.message}
                        </p>
                        <div className="text-xs text-gray-500 mt-3">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {sendingMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <CpuChipIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <LoadingSpinner size="sm" variant="dots" />
                          <span className="text-gray-600">AI is analyzing your data...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 py-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask your AI coach anything about your health..."
                      className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      disabled={sendingMessage}
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || sendingMessage}
                    className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                  >
                    {sendingMessage ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-5 h-5" />
                        <span>Send</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoachEnhanced;