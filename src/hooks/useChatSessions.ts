import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getChatSessions, createChatSession, getChatHistory, sendChatMessage } from '../lib/api';
import { useToast } from './useToast';

export interface ChatSession {
  id: string;
  title: string;
  last_message: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export const useChatSessions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getChatSessions(user!.id);
      setSessions(data);
      
      // Auto-select first session or create new one
      if (data.length > 0) {
        selectSession(data[0]);
      } else {
        await createNewSession();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load chat sessions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async (title?: string) => {
    try {
      const session = await createChatSession(user!.id, title);
      setSessions(prev => [session, ...prev]);
      setCurrentSession(session);
      setMessages([]);
      return session;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create new chat session.",
        variant: "destructive",
      });
    }
  };

  const selectSession = async (session: ChatSession) => {
    try {
      setCurrentSession(session);
      setLoading(true);
      const history = await getChatHistory(session.id);
      setMessages(history);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load chat history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!currentSession || !message.trim()) return;

    try {
      setSendingMessage(true);
      
      // Add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        message,
        role: 'user',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Send to OpenAI API via edge function
      const response = await sendChatMessage(message, user!.id, currentSession.id);
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.response,
        role: 'assistant',
        timestamp: response.timestamp,
      };
      setMessages(prev => [...prev, aiMessage]);

      // Update session
      setSessions(prev => prev.map(s => 
        s.id === currentSession.id 
          ? { ...s, last_message: response.response, updated_at: response.timestamp }
          : s
      ));

    } catch (error: any) {
      // Remove the user message if API call failed
      setMessages(prev => prev.slice(0, -1));
      
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  return {
    sessions,
    currentSession,
    messages,
    loading,
    sendingMessage,
    createNewSession,
    selectSession,
    sendMessage,
    refetch: loadSessions,
  };
};