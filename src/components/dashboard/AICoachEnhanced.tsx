import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
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
  
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
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
    
    setSendingMessage(true);
    setShowOnboarding(false);
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        message: `I understand you're asking about "${inputMessage}". Based on your health data, I recommend focusing on consistent habits and monitoring your progress. Would you like specific guidance on any particular aspect?`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setSendingMessage(false);
    }, 2000);
    
    setInputMessage('');
  };

  const handleQuickPrompt = async (prompt: string) => {
    setInputMessage(prompt);
    await handleSendMessage();
  };

  const handlePlayAudio = async (text: string) => {
    try {
      if (isPlayingAudio && currentAudio) {
        currentAudio.pause();
        setIsPlayingAudio(false);
        setCurrentAudio(null);
        return;
      }

      toast({
        title: "Audio Feature",
        description: "Text-to-speech feature coming soon!",
      });
      
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


  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto" role="region" aria-labelledby="ai-coach-title">
      {/* Header */}
      <header role="banner" className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] rounded-xl flex items-center justify-center shadow-lg">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 id="ai-coach-title" className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Smart Coach</h1>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  role="status"
                  aria-label="Smart coach is online and ready"
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Ready to help</span>
              </div>
            </div>
          </div>
          
            <button
              aria-label="Clear chat history"
              onClick={() => {
                setMessages([]);
                setShowOnboarding(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
        </div>
      </header>

      {/* Content */}
      <main role="main" className="flex-1 overflow-hidden">
        {showOnboarding ? (
          /* Welcome Screen */
          <section role="region" aria-labelledby="welcome-title" className="h-full overflow-y-auto p-4 lg:p-6">
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
                  <h2 id="welcome-title" className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Hi! I'm your Smart Coach
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
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
                <h3 id="quick-prompts-title" className="text-lg font-semibold text-gray-900 text-center">What can I help you with?</h3>
                <ul 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  role="list"
                  aria-labelledby="quick-prompts-title"
                >
                  {quickPrompts.map((prompt, index) => (
                    <li key={index} role="listitem">
                      <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickPrompt(prompt.text)}
                      aria-label={`Ask about ${prompt.text}`}
                      className="p-4 bg-card rounded-xl border border-border hover:border-blue-light/30 hover:shadow-md transition-all duration-200 text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${prompt.color} rounded-lg flex items-center justify-center`}>
                          <prompt.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-foreground">{prompt.text}</span>
                      </div>
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Example Questions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h3 id="example-questions-title" className="text-lg font-semibold text-gray-900 text-center">Or ask me anything:</h3>
                <ul 
                  className="space-y-2"
                  role="list"
                  aria-labelledby="example-questions-title"
                >
                  {[
                    "What should I eat for breakfast?",
                    "How can I sleep better?",
                    "What supplements do I need?",
                    "Plan my workout routine"
                  ].map((question, index) => (
                    <li key={index} role="listitem">
                      <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleQuickPrompt(question)}
                      aria-label={`Ask: ${question}`}
                      className="w-full text-left p-3 bg-muted/50 hover:bg-blue-light/10 rounded-lg border border-border hover:border-blue-light/30 transition-all duration-200"
                    >
                      <span className="text-foreground hover:text-blue-light">{question}</span>
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </section>
        ) : (
          /* Chat Interface */
          <section role="region" aria-labelledby="chat-interface-title" className="h-full flex flex-col">
            <h2 id="chat-interface-title" className="sr-only">Chat Interface</h2>
            
            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto p-4 lg:p-6"
              role="log"
              aria-label="Chat conversation"
              aria-live="polite"
            >
              <ul className="space-y-4" role="list">
                {messages.map((message) => (
                  <li key={message.id} role="listitem">
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    role="article"
                    aria-labelledby={`message-${message.id}-author`}
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
                      
                      <div className={`bg-card rounded-2xl p-4 shadow-sm border border-border ${
                        message.role === 'user' 
                          ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
                          : ''
                      }`}>
                        <div className="space-y-3">
                          <div id={`message-${message.id}-author`} className="sr-only">
                            {message.role === 'user' ? 'You said' : 'AI Coach said'}
                          </div>
                          <p className="text-gray-900 dark:text-white leading-relaxed">
                            {message.message}
                          </p>
                          
                          {message.role === 'assistant' && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handlePlayAudio(message.message)}
                                disabled={isPlayingAudio}
                                aria-label={isPlayingAudio ? "Stop audio playback" : "Play message as audio"}
                                className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
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
                        <time className="text-xs text-gray-500 mt-2" dateTime={message.timestamp}>
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </time>
                      </div>
                    </div>
                    </motion.div>
                  </li>
                ))}
                
                {sendingMessage && (
                  <li role="listitem">
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                    role="status"
                    aria-label="AI is thinking"
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
                  </li>
                )}
                
                <div ref={messagesEndRef} />
              </ul>
            </div>

            <footer role="contentinfo" className="bg-card border-t border-border p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative" role="search">
                  <label htmlFor="chat-input" className="sr-only">
                    Type your message to the AI coach
                  </label>
                  <input
                    id="chat-input"
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about your health..."
                    className="w-full px-4 py-3 lg:py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-light focus:border-transparent text-base bg-background text-foreground"
                    disabled={sendingMessage}
                    aria-describedby="chat-input-help"
                  />
                  <div id="chat-input-help" className="sr-only">
                    Press Enter to send your message to the AI coach
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || sendingMessage}
                  aria-label={sendingMessage ? "Sending message" : "Send message to Smart Coach"}
                  className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  {sendingMessage ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <PaperAirplaneIcon className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </footer>
          </section>
        )}
      </main>
    </div>
  );
};

export default AICoachEnhanced;