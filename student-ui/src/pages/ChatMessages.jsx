import React, { useEffect, useRef } from 'react';
import { MessageSquare, User, Bot, Shield, FileText } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const isAdmin = message.role === 'admin';
  const isBot = message.role === 'assistant';

  const getRoleIcon = () => {
    if (isUser) return <User className="w-4 h-4" />;
    if (isAdmin) return <Shield className="w-4 h-4" />;
    return <Bot className="w-4 h-4" />;
  };

  const getRoleLabel = () => {
    if (isUser) return 'YOU';
    if (isAdmin) return 'ADMIN';
    return 'BOT';
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-lg rounded-3xl p-5 ${
          isUser
            ? 'bg-blue-500 text-white shadow-sm'
            : isAdmin
            ? 'bg-green-100/80 text-green-900 border-2 border-green-300/50 backdrop-blur-sm'
            : 'bg-white/70 text-slate-800 shadow-sm backdrop-blur-sm border border-slate-200/50'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {getRoleIcon()}
          <span className="text-xs font-bold opacity-70">{getRoleLabel()}</span>
        </div>

        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>

        {isBot && (
          <div className="mt-3 space-y-2">
            {message.source && (
              <div className="flex items-start gap-2 text-xs bg-indigo-50/80 text-indigo-700 px-3 py-2 rounded-xl border border-indigo-200/50">
                <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span><span className="font-semibold">Source:</span> {message.source}</span>
              </div>
            )}
          </div>
        )}

        {message.created_at && (
          <p className="text-xs mt-3 opacity-50">
            {new Date(message.created_at).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
};

const ChatMessages = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {messages.length === 0 && (
        <div className="text-center text-slate-500 mt-20">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 border border-slate-200/50 shadow-sm max-w-md mx-auto">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-700">Welcome to MyUNI Chatbot!</p>
            <p className="text-sm text-slate-500 mt-2">Ask me anything about university policies, exams, hostels, and more!</p>
          </div>
        </div>
      )}

      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} />
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 shadow-sm border border-slate-200/50">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;