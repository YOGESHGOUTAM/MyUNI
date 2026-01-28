import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const [isEscalated, setIsEscalated] = useState(false);

  // Load persisted states on mount
  useEffect(() => {
    const savedSession = sessionStorage.getItem('currentSession');
    const savedEscalated = sessionStorage.getItem('isEscalated') === 'true';
    if (savedSession) {
      setCurrentSession(savedSession);
    }
    setIsEscalated(savedEscalated);
  }, []);

  const loadSessions = async (userId) => {
    try {
      const data = await api.chat.getSessions(userId);
      setSessions(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setSessions([]);
      throw error;
    }
  };

  const createSession = async (userId) => {
    try {
      const data = await api.chat.createSession(userId);
      const newSession = {
        session_id: data.session_id,
        first_question: 'New conversation',
        created_at: new Date().toISOString()
      };
      setSessions([newSession, ...sessions]);
      setCurrentSession(data.session_id);
      sessionStorage.setItem('currentSession', data.session_id);
      setMessages([]);
      setConfidence(null);
      setIsEscalated(false);
      sessionStorage.setItem('isEscalated', 'false');
      return data;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  };

  const loadChatHistory = async (sessionId) => {
    try {
      const data = await api.chat.getSessionHistory(sessionId);
      setCurrentSession(sessionId);
      sessionStorage.setItem('currentSession', sessionId);
      setMessages(data.messages || []);
      setConfidence(null);

      // Check for escalation and persist (prioritize message data)
      const escalatedFromMessages = data.messages?.some(msg => msg.escalated === true);
      const finalEscalated = escalatedFromMessages || (sessionStorage.getItem('isEscalated') === 'true');
      setIsEscalated(finalEscalated);
      sessionStorage.setItem('isEscalated', finalEscalated ? 'true' : 'false');

      // Ensure session in sidebar
      setSessions(prev => {
        const exists = prev.some(s => s.session_id === sessionId);
        if (!exists) {
          return [{
            session_id: sessionId,
            first_question: data.messages?.[0]?.content?.substring(0, 50) || 'Loaded session',
            created_at: new Date().toISOString()
          }, ...prev];
        }
        return prev;
      });

      return data;
    } catch (error) {
      console.error('Failed to load chat:', error);
      throw error;
    }
  };

  const sendMessage = async (sessionId, messageText) => {
    if (isEscalated) {
      throw new Error('Cannot send message: Chat is escalated.');
    }

    const userMessage = {
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = await api.chat.sendMessage(sessionId, messageText);

      const botMessage = {
        role: 'assistant',
        content: data.answer,
        source: data.source,
        escalated: data.escalated,
        escalation_id: data.escalation_id,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
      setConfidence(data.confidence || null);

      if (data.escalated) {
        setIsEscalated(true);
        sessionStorage.setItem('isEscalated', 'true');
      }

      if (messages.length === 0) {
        setSessions(prev => prev.map(s =>
          s.session_id === sessionId
            ? { ...s, first_question: messageText.substring(0, 50) }
            : s
        ));
      }

      return data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const escalateMessage = async (sessionId) => {
    try {
      const data = await api.escalation.manualEscalate(sessionId);
      setIsEscalated(true);
      sessionStorage.setItem('isEscalated', 'true');
      return data;
    } catch (error) {
      console.error('Escalation failed:', error);
      throw error;
    }
  };

  const resetChat = () => {
    setCurrentSession(null);
    setMessages([]);
    setConfidence(null);
    setIsEscalated(false);
    sessionStorage.removeItem('currentSession');
    sessionStorage.removeItem('isEscalated');
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSession,
        messages,
        loading,
        confidence,
        isEscalated,
        loadSessions,
        createSession,
        loadChatHistory,
        sendMessage,
        escalateMessage,
        resetChat,
        setSessions
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export default ChatProvider;