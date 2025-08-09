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
  const [analysisPhase, setAnalysisPhase] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        message: predeterminedResponse.quickTips,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        fullMode: predeterminedResponse.fullMode
      };
      setMessages(prev => [...prev, aiMessage]);
      setSendingMessage(false);
      setInputMessage('');
      return;
    }
    
    try {
      // For non-predetermined questions, use the API
      setAnalysisPhase('Thinking...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await sendChatMessage(inputMessage, user.id);
      
      setAnalysisPhase('');
      
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
                    </motion.button>
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
                        
                        {/* Full Mode Toggle for predetermined responses */}
                        {message.role === 'assistant' && message.fullMode && (
                          <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                            <details className="group">
                              <summary className="cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-2">
                                <span>View Full Analysis</span>
                                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </summary>
                              <div className="mt-3 p-4 bg-slate-50/60 dark:bg-slate-800/60 rounded-xl">
                                <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {message.fullMode}
                                </pre>
                              </div>
                            </details>
                          </div>
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
                          <span className="text-slate-600 dark:text-slate-400">
                            {analysisPhase || 'Thinking...'}
                          </span>
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