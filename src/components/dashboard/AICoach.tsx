import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useChatSessions } from '../../hooks/useChatSessions';
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
  CpuChipIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const AICoach: React.FC = () => {
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
    if (!inputMessage.trim() || sendingMessage) return;
    
    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording implementation would go here
  };

  const quickPrompts = [
    { text: "Analyze my health trends", icon: BeakerIcon },
    { text: "Optimize my supplement stack", icon: SparklesIcon },
    { text: "Improve my sleep quality", icon: HeartIcon },
    { text: "Plan my workout routine", icon: BoltIcon },
  ];

  if (loading && !currentSession) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - Chat Sessions */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Chat Sessions</h2>
            <button
              onClick={() => createNewSession()}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => selectSession(session)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                currentSession?.id === session.id
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 truncate">
                  {session.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {session.last_message || 'No messages yet'}
                </p>
                <div className="text-xs text-gray-500">
                  {new Date(session.updated_at).toLocaleDateString()}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <CpuChipIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Wellness Coach</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Online and Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
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
                  
                  <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-200 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-50 to-cyan-50' 
                      : ''
                  }`}>
                    <p className="text-gray-900 leading-relaxed">
                      {message.content}
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(message.created_at).toLocaleTimeString()}
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
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" variant="dots" />
                      <span className="text-gray-600">AI is thinking...</span>
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
          <div className="max-w-4xl mx-auto">
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
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                >
                  <prompt.icon className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">{prompt.text}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your AI coach anything about your health..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={toggleRecording}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                    isRecording 
                      ? 'text-red-500 bg-red-100' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
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
                disabled={!inputMessage.trim() || sendingMessage}
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
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
    </div>
  );
};

export default AICoach;