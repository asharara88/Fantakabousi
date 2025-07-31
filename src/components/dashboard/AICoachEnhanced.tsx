import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useChatSessions } from '../../hooks/useChatSessions';
import { generateSpeech } from '../../lib/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { 
  SparklesIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  StopIcon,
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
  const { toast } = useToast();
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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
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

  const handlePlayAudio = async (text: string) => {
    try {
      if (isPlayingAudio && currentAudio) {
        currentAudio.pause();
        setIsPlayingAudio(false);
        setCurrentAudio(null);
        return;
      }

      setIsPlayingAudio(true);
      
      const audioData = await generateSpeech(text);
      const audioBlob = new Blob([
        Uint8Array.from(atob(audioData.audioData), c => c.charCodeAt(0))
      ], { type: 'audio/mpeg' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlayingAudio(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsPlayingAudio(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Audio Error",
          description: "Failed to play audio response.",
          variant: "destructive",
        });
      };
      
      setCurrentAudio(audio);
      await audio.play();
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlayingAudio(false);
      toast({
        title: "Audio Error",
        description: "Failed to generate audio response.",
        variant: "destructive",
      });
    }
  };

  const quickPrompts = [
    { text: "Help me sleep better", icon: MoonIcon, color: "bg-indigo-500" },
    { text: "Build muscle faster", icon: FireIcon, color: "bg-orange-500" },
    { text: "Improve my energy", icon: BoltIcon, color: "bg-blue-500" },
    { text: "Eat healthier", icon: HeartIcon, color: "bg-green-500" },
  ];

  if (loading && !currentSession) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">AI Health Coach</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Ready to help</span>
              </div>
            </div>
          </div>
          
          {sessions.length > 0 && (
            <button
              onClick={() => createNewSession()}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {showOnboarding ? (
          /* Welcome Screen */
          <div className="h-full overflow-y-auto p-4 lg:p-6">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Welcome */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                  <SparklesIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    Hi! I'm your health coach
                  </h2>
                  <p className="text-lg text-gray-600">
                    I can help you with nutrition, exercise, sleep, and wellness questions.
                  </p>
                </div>
              </motion.div>

              {/* Quick Start Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 text-center">What can I help you with?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quickPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickPrompt(prompt.text)}
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${prompt.color} rounded-lg flex items-center justify-center`}>
                          <prompt.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{prompt.text}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Example Questions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 text-center">Or ask me anything:</h3>
                <div className="space-y-2">
                  {[
                    "What should I eat for breakfast?",
                    "How can I sleep better?",
                    "What supplements do I need?",
                    "Plan my workout routine"
                  ].map((question, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleQuickPrompt(question)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200"
                    >
                      <span className="text-gray-700 hover:text-blue-700">{question}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[85%] ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-600' 
                          : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      }`}>
                        {message.role === 'user' ? (
                          <UserIcon className="w-5 h-5 text-white" />
                        ) : (
                          <CpuChipIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                      
                      <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-blue-50 to-cyan-50' 
                          : ''
                      }`}>
                        <div className="space-y-3">
                          <p className="text-gray-900 leading-relaxed">
                            {message.message}
                          </p>
                          
                          {message.role === 'assistant' && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handlePlayAudio(message.message)}
                                disabled={isPlayingAudio}
                                className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
                                title="Play audio response"
                              >
                                {isPlayingAudio ? (
                                  <StopIcon className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <SpeakerWaveIcon className="w-4 h-4 text-blue-600" />
                                )}
                              </button>
                              <span className="text-xs text-gray-500">
                                {isPlayingAudio ? 'Playing...' : 'Play audio'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
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
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <CpuChipIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <LoadingSpinner size="sm" variant="dots" />
                          <span className="text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 lg:p-6 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about your health..."
                    className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    disabled={sendingMessage}
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || sendingMessage}
                  className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  {sendingMessage ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <PaperAirplaneIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoachEnhanced;