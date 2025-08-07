import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { sendChatMessage } from '../../lib/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { 
  MessageCircle,
  Send,
  User,
  Bot,
  Heart,
  Utensils,
  Activity,
  Moon,
  Plus,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';

const AICoachEnhanced: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sendingMessage || !user?.id) return;
    
    setSendingMessage(true);
    setShowOnboarding(false);
    
    // Add user message immediately
    const userMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Send to AI coach
      const response = await sendChatMessage(inputMessage, user.id);
      
      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        message: response.response,
        role: 'assistant',
        timestamp: response.timestamp
      };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error: any) {
      // Remove the user message if API call failed
      setMessages(prev => prev.slice(0, -1));
      
      toast({
        title: "Oops! Something went wrong",
        description: "I couldn't send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
    
    setInputMessage('');
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    setTimeout(() => handleSendMessage(), 100);
  };

  // Friendly, simple prompts
  const quickPrompts = [
    { 
      text: "How can I sleep better?", 
      icon: Moon, 
      color: "from-indigo-500 to-purple-600",
      category: "Sleep"
    },
    { 
      text: "What should I eat today?", 
      icon: Utensils, 
      color: "from-green-500 to-emerald-600",
      category: "Nutrition"
    },
    { 
      text: "Should I exercise today?", 
      icon: Activity, 
      color: "from-orange-500 to-red-600",
      category: "Fitness"
    },
    { 
      text: "How is my health doing?", 
      icon: Heart, 
      color: "from-red-500 to-pink-600",
      category: "Health"
    }
  ];

  const firstName = user?.email?.split('@')[0] || 'there';

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto pb-24 lg:pb-6">
      {/* Friendly Header */}
      <div className="p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
            Your Health Coach
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Ask me anything about your health and wellness
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {showOnboarding ? (
          /* Welcome Screen - Friendly and Simple */
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="text-6xl mb-4">👋</div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    Hi {firstName}! I'm here to help
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    I can answer questions about your health, suggest meals, or help you feel better.
                  </p>
                </div>
              </motion.div>

              {/* Quick Questions - Big, Friendly Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white text-center">
                  What can I help you with?
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {quickPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickPrompt(prompt.text)}
                      className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300 text-left group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${prompt.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <prompt.icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {prompt.text}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {prompt.category} advice
                          </div>
                        </div>
                        <div className="text-2xl">💬</div>
                      </div>
                   </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Or Type Your Own */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center space-y-4"
              >
                <div className="text-slate-600 dark:text-slate-400">
                  Or ask me anything else...
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-left">
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div>💡 "Why am I tired in the afternoon?"</div>
                    <div>🍎 "What's a healthy breakfast?"</div>
                    <div>💪 "How often should I exercise?"</div>
                    <div>😴 "Help me sleep better"</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Chat Interface - Clean and Simple */
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6 max-w-3xl mx-auto">
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
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-600' 
                          : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>
                      
                      <div className={`rounded-2xl p-4 shadow-lg max-w-full ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white' 
                          : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/20'
                      }`}>
                        <p className={`leading-relaxed ${
                          message.role === 'user' ? 'text-white' : 'text-slate-900 dark:text-white'
                        }`}>
                          {message.message}
                        </p>
                        
                        <div className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {sendingMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 dark:border-slate-700/20">
                        <div className="flex items-center space-x-3">
                          <LoadingSpinner size="sm" variant="dots" />
                          <span className="text-slate-600 dark:text-slate-400">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input - Large and Friendly */}
            <div className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/20">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me anything about your health..."
                      className="w-full px-6 py-4 text-lg border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      disabled={sendingMessage}
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || sendingMessage}
                    className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  >
                    {sendingMessage ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Send className="w-6 h-6" />
                    )}
                  </motion.button>
                </div>
                
                {/* Helpful Hints */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    💡 Try asking: "What should I eat for breakfast?" or "Why do I feel tired?"
                  </p>
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