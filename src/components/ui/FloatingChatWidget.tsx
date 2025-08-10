import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { sendChatMessage } from '../../lib/api';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from './LoadingSpinner';
import { 
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ChatMessage {
  id: string;
  message: string;
  role: 'user' | 'assistant';
  timestamp: string;
  fullMode?: string;
}

interface FloatingChatWidgetProps {
  className?: string;
}

const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Predetermined responses for quick prompts
  const predeterminedResponses = {
    "How can I sleep better?": {
      fullMode: `Ahmed, over the past week your average sleep was 6h 35m, with deep sleep averaging 42m and REM sleep 58m.

Even 42 minutes of deep sleep is below the ideal target of 1–1.5 hours.

Last night dropped further to 28m, limiting recovery and hormone regulation.

⚠️ Do you feel bloated?
Your recent smart scale reading shows an increase in water retention — reduce sodium intake today, stay hydrated, and supplement with electrolytes.

Sleep Strategy:

🕒 Consistent bedtime (within 30 min window)
📵 No screens 60 min before bed
☕ Caffeine cutoff before 1 pm
❄️ Cool bedroom (18–20 °C)

Supplements:
💊 Magnesium glycinate (200–400 mg)
💊 L-theanine (200 mg) before bed
💊 Ashwagandha if stress is high`,
      quickTips: `🛌 6h 35m sleep avg, deep sleep only 42m (goal: 1–1.5h).
Last night: 28m deep sleep — recovery impact likely.
⚠️ Water retention high — cut sodium, hydrate, and take electrolytes.
💡 Consistent bedtime + magnesium glycinate + L-theanine for deeper rest.
Coach Summary: Tonight's mission — protect your recovery window like it's an appointment you can't miss.`
    },
    "What should I eat today?": {
      fullMode: `Your smart scale shows body fat at 24.5%, muscle mass steady, and elevated water retention.
Yesterday: 612 active calories burned, 7,800 steps.

⚠️ Do you feel bloated?
Your recent smart scale reading shows an increase in water retention — reduce sodium intake today, stay hydrated, and supplement with electrolytes.

Meal Plan:
🍳 Breakfast (optional): 2 boiled eggs, spinach, avocado
🥗 Lunch: Grilled salmon, quinoa, steamed broccoli
🍗 Dinner: Chicken breast, roasted sweet potato, mixed greens

Supplements:
💊 Omega-3 fish oil (2–3 g EPA/DHA)
💊 Whey protein isolate or hydrolyzed whey
💊 Electrolyte powder with potassium + magnesium`,
      quickTips: `🍽 Body fat 24.5%, muscle steady, water retention up.
⚠️ Reduce sodium, hydrate, and take electrolytes.
🥗 Meals: Eggs + spinach + avocado | Salmon + quinoa + broccoli | Chicken + sweet potato + greens.
💊 Omega-3s, whey isolate, electrolytes.
Coach Summary: Eat clean, hydrate well, and keep your fuel working for you — not against you.`
    },
    "Should I exercise today?": {
      fullMode: `Your wearable shows:

Recovery score: 74%
RHR: 61 bpm (above 7-day avg of 58)
Condition: Mild leg soreness from last resistance workout

⚠️ Do you feel bloated?
Your recent smart scale reading shows an increase in water retention — reduce sodium intake today, stay hydrated, and supplement with electrolytes.

Training Plan:
🚶 Moderate activity (30-min swim, brisk walk, mobility work)
❌ Avoid max-effort lower-body training

Supplements:
💊 Creatine monohydrate (3–5 g)
💊 BCAAs during light workouts
💊 Electrolytes`,
      quickTips: `🏃 Recovery 74%, RHR slightly high at 61 bpm, mild leg soreness.
⚠️ Water retention up — reduce sodium, hydrate, electrolytes.
🚶 Go light today: swim, walk, or mobility. Avoid heavy legs.
💊 Creatine and BCAAs for muscle recovery.
Coach Summary: Move with purpose today — the goal is to recharge, not deplete.`
    },
    "How is my health doing?": {
      fullMode: `📊 This week's data:
🚶 Steps: 9,200/day average
❤️ Resting HR: 58 bpm (healthy)
⚖️ Body fat: 24–25% (stable)
🛌 Sleep: 6h 35m average, deep sleep at 42m (below target)

⚠️ Do you feel bloated?
Your recent smart scale reading shows an increase in water retention — reduce sodium intake today, stay hydrated, and supplement with electrolytes.

✅ Overall: Active, maintaining muscle mass. Improving sleep depth & composition will boost recovery and energy.

Supplements:
💊 Vitamin D3 + K2
💊 Magnesium glycinate
💊 Whey protein
💊 Omega-3s`,
      quickTips: `📊 Steps 9,200/day, RHR 58 bpm, body fat 24–25%, deep sleep 42m (low).
⚠️ Water retention high — cut sodium, hydrate, electrolytes.
✅ Active, maintaining muscle; improve sleep quality for bigger gains.
💊 Vitamin D3 + K2, magnesium glycinate, whey, omega-3s.
Coach Summary: You're building a solid base — now let's level up recovery so every effort counts.`
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Global keyboard shortcut (Cmd/Ctrl + /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sendingMessage || !user?.id) return;
    
    setSendingMessage(true);
    setHasNewMessage(false);
    
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Check if this is a predetermined question
    const predeterminedResponse = predeterminedResponses[inputMessage as keyof typeof predeterminedResponses];
    
    if (predeterminedResponse) {
      // Show analysis phases for predetermined responses
      const phases = ['Analyzing your data...', 'Processing health patterns...', 'Generating personalized insights...'];
      
      for (let i = 0; i < phases.length; i++) {
        setAnalysisPhase(phases[i]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setAnalysisPhase('');
      
      // Add predetermined response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: predeterminedResponse.quickTips,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        fullMode: predeterminedResponse.fullMode
      };
      setMessages(prev => [...prev, aiMessage]);
      setSendingMessage(false);
      setInputMessage('');
      setHasNewMessage(true);
      return;
    }
    
    try {
      // For non-predetermined questions, use the API
      setAnalysisPhase('Thinking...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await sendChatMessage(inputMessage, user.id);
      
      setAnalysisPhase('');
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.response,
        role: 'assistant',
        timestamp: response.timestamp
      };
      setMessages(prev => [...prev, aiMessage]);
      setHasNewMessage(true);
      
    } catch (error: any) {
      // Remove the user message if API call failed
      setMessages(prev => prev.slice(0, -1));
      setAnalysisPhase('');
      
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

  const quickPrompts = [
    "How can I sleep better?",
    "What should I eat today?", 
    "Should I exercise today?",
    "How is my health doing?"
  ];

  const firstName = user?.email?.split('@')[0] || 'there';

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center ${className}`}
            aria-label="Open chat with AI coach"
          >
            <div className="relative">
              <MessageCircle className="w-7 h-7" />
              {hasNewMessage && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              )}
            </div>
            
            {/* Keyboard shortcut hint */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              ⌘ /
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Coach</h3>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-xs text-white/80">Online</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    title={audioEnabled ? "Disable audio" : "Enable audio"}
                  >
                    {audioEnabled ? (
                      <Volume2 className="w-4 h-4 text-white" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-white/60" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4 text-white" />
                    ) : (
                      <Minimize2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  {messages.length === 0 ? (
                    /* Welcome State */
                    <div className="p-6 space-y-4">
                      <div className="text-center space-y-3">
                        <div className="text-4xl">👋</div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            Hi {firstName}! I'm here to help
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Ask me anything about your health
                          </p>
                        </div>
                      </div>

                      {/* Quick Prompts */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">
                          Quick questions:
                        </div>
                        {quickPrompts.map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickPrompt(prompt)}
                            className="w-full p-3 text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-sm"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Chat Messages */
                    <div className="h-80 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-2 max-w-[85%] ${
                            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                          }`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.role === 'user' 
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-600' 
                                : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                            }`}>
                              {message.role === 'user' ? (
                                <User className="w-3 h-3 text-white" />
                              ) : (
                                <Bot className="w-3 h-3 text-white" />
                              )}
                            </div>
                            
                            <div className={`rounded-2xl p-3 max-w-full ${
                              message.role === 'user' 
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                            }`}>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.message}
                              </p>
                              
                              {/* Full Mode Toggle */}
                              {message.role === 'assistant' && message.fullMode && (
                                <details className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                                  <summary className="cursor-pointer text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1">
                                    <span>View Full Analysis</span>
                                    <Sparkles className="w-3 h-3" />
                                  </summary>
                                  <div className="mt-2 p-3 bg-slate-50/60 dark:bg-slate-800/60 rounded-xl">
                                    <pre className="whitespace-pre-wrap text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                      {message.fullMode}
                                    </pre>
                                  </div>
                                </details>
                              )}
                              
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
                        </motion.div>
                      ))}
                      
                      {sendingMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="flex items-start space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                              <Bot className="w-3 h-3 text-white" />
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3">
                              <div className="flex items-center space-x-2">
                                <LoadingSpinner size="sm" variant="dots" />
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                  {analysisPhase || 'Thinking...'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Ask me anything about your health..."
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          disabled={sendingMessage}
                        />
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || sendingMessage}
                        className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                      >
                        {sendingMessage ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                    
                    <div className="mt-2 text-center">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Press ⌘ / to open chat • Enter to send
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatWidget;