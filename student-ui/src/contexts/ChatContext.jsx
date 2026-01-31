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

  // Load persisted session
  useEffect(() => {
    const savedSession = sessionStorage.getItem('currentSession');
    if (savedSession) setCurrentSession(savedSession);
  }, []);

  const loadSessions = async (userId) => {
    const data = await api.chat.getSessions(userId);
    setSessions(Array.isArray(data) ? data : []);
    return data;
  };

  const createSession = async (userId) => {
    const data = await api.chat.createSession(userId);

    const newSession = {
      session_id: data.session_id,
      first_question: 'New conversation',
      created_at: new Date().toISOString()
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(data.session_id);
    sessionStorage.setItem('currentSession', data.session_id);

    setMessages([]);
    setConfidence(null);
    setIsEscalated(false);
    sessionStorage.setItem('isEscalated', 'false');

    return data;
  };

  const loadChatHistory = async (sessionId) => {
    const data = await api.chat.getSessionHistory(sessionId);

    setCurrentSession(sessionId);
    sessionStorage.setItem('currentSession', sessionId);
    setMessages(data.messages || []);
    setConfidence(null);

    // 🔥 SINGLE SOURCE OF TRUTH FOR ESCALATION
    if (data.escalation_status === 'resolved') {
      setIsEscalated(false);
      sessionStorage.setItem('isEscalated', 'false');
    } else {
      // 🔥 ONLY TRUST BACKEND
    const blocked = data.escalation_status === 'open';

    setIsEscalated(blocked);
    sessionStorage.setItem(
        'isEscalated',
        blocked ? 'true' : 'false');

    }

    return data;
  };

  const sendMessage = async (sessionId, messageText) => {
    const userMessage = {
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString()
    };

    setLoading(true);

    try {
      await api.chat.sendMessage(sessionId, messageText);

      // ✅ Always reload from backend
      await loadChatHistory(sessionId);
    } finally {
      setLoading(false);
    }
  };

  const escalateMessage = async (sessionId) => {
    const data = await api.escalation.manualEscalate(sessionId);
    setIsEscalated(true);
    sessionStorage.setItem('isEscalated', 'true');
    return data;
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
        resetChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};

export default ChatProvider;
