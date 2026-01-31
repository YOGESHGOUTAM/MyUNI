import React from 'react';
import { MessageSquare, Plus, LogOut, X } from 'lucide-react';

const SidebarSessions = ({
  sessions,
  currentSession,
  user,
  isOpen,
  onClose,
  onNewSession,
  onSelectSession,
  onLogout
}) => {
  return (
    <div className={`${isOpen ? 'w-80' : 'w-0'} bg-white/70 backdrop-blur-sm border-r border-slate-200/50 transition-all duration-300 overflow-hidden flex flex-col sticky top-0 h-screen`}>
      <div className="p-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-lg font-semibold text-slate-800">MyUNI</span>
          </div>
          <button onClick={onClose} className="lg:hidden hover:bg-slate-100 p-2 rounded-xl transition">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <button
          onClick={onNewSession}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">No chats yet</p>
            <p className="text-xs mt-1">Start a new conversation!</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.session_id}
              onClick={() => onSelectSession(session.session_id)}
              className={`p-4 mx-3 my-2 rounded-2xl cursor-pointer transition ${
                currentSession === session.session_id 
                  ? 'bg-blue-100/80 border-2 border-blue-300/50' 
                  : 'hover:bg-slate-50'
              }`}
            >
              <p className="text-sm font-medium text-slate-800 truncate">
                {session.first_question || 'New conversation'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(session.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="p-6 border-t border-slate-200/50 bg-white/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">{user.name}</span>
          <button
            onClick={onLogout}
            className="text-slate-500 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-xl"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500">{user.email}</p>
      </div>
    </div>
  );
};

export default SidebarSessions;