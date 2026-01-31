import React, { useState, useEffect } from 'react';
import { Menu, RefreshCw } from 'lucide-react';
import SidebarSessions from './SidebarSessions';
import ChatPanel from './ChatPanel';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';

const ChatLayout = () => {
  const { user, logout } = useAuth();
  const {
    sessions,
    currentSession,
    messages,
    loading,
    isEscalated,
    loadSessions,
    createSession,
    loadChatHistory,
    sendMessage,
    escalateMessage
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (user && user.user_id) {
      loadSessionsData();
    }
  }, [user]);

  const loadSessionsData = async () => {
    try {
      await loadSessions(user.user_id);
      setLoadError(null);
      const savedSession = sessionStorage.getItem('currentSession');
      if (savedSession) {
        await loadChatHistory(savedSession);
      }
    } catch (error) {
      setLoadError(error.message || "Failed to load sessions. Please refresh.");
      console.error('Failed to load sessions:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      await createSession(user.user_id);
    } catch (error) {
      alert('Failed to create new chat. Please try again.');
    }
  };

  const handleSelectSession = async (sessionId) => {
    try {
      await loadChatHistory(sessionId);
    } catch (error) {
      if (error.message.includes('404')) {
        alert('Session not found. Returning to session list.');
        loadSessionsData();
      } else {
        alert('Failed to load chat history.');
      }
    }
  };

  const handleSendMessage = async (messageText) => {
    if (!currentSession||isEscalated) return;
    try {
      await sendMessage(currentSession, messageText);
    } catch {
      alert('Failed to send message. Please try again.');
    }
  };

  const handleEscalate = async () => {
    if (!currentSession) return;

    try {
      const data = await escalateMessage(currentSession);
      if (data.status === 'escalated') {
        alert(`Your query has been escalated to the university admin. (Escalation ID: ${data.id})`);
      }
    } catch (error) {
      alert('Failed to escalate. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {initialLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <RefreshCw className="animate-spin text-blue-500 mb-4" size={40} />
          <p className="text-slate-600">Loading sessions...</p>
        </div>
      ) : (
        <>
          {loadError && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-100/90 backdrop-blur-sm border border-red-300/50 text-red-700 px-6 py-4 rounded-2xl z-50 max-w-md shadow-lg">
              <p className="font-bold text-sm">Error loading sessions</p>
              <p className="text-sm mt-1">{loadError}</p>
              <p className="text-xs mt-2 text-red-600">You can still create a new chat.</p>
            </div>
          )}

          <SidebarSessions
            sessions={sessions}
            currentSession={currentSession}
            user={user}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onNewSession={handleCreateSession}
            onSelectSession={handleSelectSession}
            onLogout={logout}
          />

          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/50 p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hover:bg-slate-100 p-2 rounded-xl transition"
                >
                  <Menu className="w-6 h-6 text-slate-600" />
                </button>
                <h2 className="text-lg font-semibold text-slate-800">
                  {currentSession ? 'Chat Session' : 'Select or create a chat'}
                </h2>
              </div>

              {/* Logo in header with border */}
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl border border-slate-200/50 shadow-sm">
                <span className="text-2xl">🎓</span>
                <span className="text-xl font-semibold text-slate-800">MyUNI</span>
              </div>
            </div>

            <ChatPanel
              messages={messages}
              loading={loading}
              onSendMessage={handleSendMessage}
              onEscalate={handleEscalate}
              hasSession={!!currentSession}
              isEscalated={isEscalated}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatLayout;