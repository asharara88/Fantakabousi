import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  SparklesIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  StopIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  BoltIcon,
  BeakerIcon,
  UserIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  typing?: boolean;
}

const AICoach: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi Ahmed! I've analyzed your recent health data and I can see you're working on fertility, muscle building, and sleep optimization. Your CGM data shows some concerning glucose patterns, and your deep sleep is quite low at 45 minutes. What would you like to focus on first?",
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Ahmed, your CGM data shows concerning patterns with post-meal spikes averaging 185 mg/dL. For fertility optimization, we need to address this insulin resistance. I recommend starting with a 16:8 intermittent fasting protocol and reducing refined carbs. This will help improve sperm motility and testosterone production.",
        "Your deep sleep at 45 minutes is significantly below the optimal 90+ minutes needed for testosterone and growth hormone production. I suggest moving your bedtime earlier to 10 PM, avoiding screens 2 hours before bed, and considering magnesium glycinate supplementation. This is crucial for both muscle building and fertility.",
        "At 90kg and 180cm with 18.2% body fat, reducing to 15% would significantly improve insulin sensitivity and fertility markers. Your current training strain of 16.8 might be too high - consider reducing volume by 20% to optimize recovery and hormone production.",
        "Your elevated resting heart rate (72 bpm) and low HRV (28 ms) suggest your body is under stress. This impacts fertility hormones. I recommend adding 10 minutes of daily meditation and ensuring 8+ hours of sleep. Would you like a specific stress management protocol?",
        "For your muscle building goals with insulin resistance, focus on post-workout carb timing. Consume 30-40g of carbs immediately after training when insulin sensitivity is highest. This supports muscle growth while minimizing glucose spikes throughout the day."
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);

    // Save to database
    try {
      await supabase.from('chat_history').insert({
        user_id: user?.id,
        message: inputMessage,
        response: 'AI response placeholder',
        role: 'user',
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording functionality
  };

  const quickPrompts = [
    { text: "Help with my glucose spikes", icon: BeakerIcon },
    { text: "Improve my deep sleep", icon: HeartIcon },
    { text: "Fertility optimization plan", icon: SparklesIcon },
    { text: "Muscle building with insulin resistance", icon: BoltIcon },
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="card-premium p-6 m-6 mb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <div>
             <h1 className="text-heading-xl text-foreground">Coach</h1>
              <div className="flex items-center space-x-2">
                <div className="status-dot success animate-pulse"></div>
                <span className="text-caption">Online & Ready</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="status-indicator status-success">
              Data Synchronized
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 pt-0">
        <div className="space-y-6">
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
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
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
                
                <div className={`card-premium p-4 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50' 
                    : 'bg-muted/30'
                }`}>
                  <p className="text-body text-foreground leading-relaxed">
                    {message.content}
                  </p>
                  <div className="text-caption mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CpuChipIcon className="w-5 h-5 text-white" />
                </div>
                <div className="card-premium p-4 bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <LoadingSpinner size="sm" variant="dots" />
                    <span className="text-body text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="px-6">
        <div className="flex flex-wrap gap-3 mb-4">
          {quickPrompts.map((prompt, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInputMessage(prompt.text)}
              className="flex items-center space-x-2 px-4 py-2 card-premium bg-muted/30 hover:bg-muted/50 transition-all duration-200"
            >
              <prompt.icon className="w-4 h-4 text-primary" />
              <span className="text-body font-medium text-foreground">{prompt.text}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="card-premium p-6 m-6 mt-0">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your AI coach anything about your health..."
              className="input-premium w-full pr-12"
              disabled={isLoading}
            />
            <button
              onClick={toggleRecording}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                isRecording 
                  ? 'text-red-500 bg-red-500/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {isRecording ? (
                <StopIcon className="w-5 h-5" />
              ) : (
                <MicrophoneIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
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
  );
};

export default AICoach;