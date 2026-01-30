import React from 'react';
import { useEffect, useRef } from 'react';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import EscalateButton from './EscalateButton';
import { AlertCircle } from 'lucide-react';

const ChatPanel = ({
  messages,
  loading,
  onSendMessage,
  onEscalate,
  hasSession,
  isEscalated
}) => {
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    },
        [messages])
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatMessages messages={messages} loading={loading} />
      {hasSession && (
        <div className="bg-white/70 backdrop-blur-sm border-t border-slate-200/50 p-6">
          {isEscalated ? (
            <div className="text-center bg-amber-50/80 border border-amber-200/50 rounded-2xl p-6 backdrop-blur-sm">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-600" />
              <p className="font-semibold text-slate-800 mb-1">Chat Escalated</p>
              <p className="text-sm text-slate-600">This chat has been escalated to an admin.</p>
              <p className="text-sm text-slate-500 mt-2">You can start a new chat to ask more questions.</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-3">
                <EscalateButton
                  onEscalate={onEscalate}
                  disabled={messages.length === 0}
                />
              </div>
              <MessageInput onSend={onSendMessage} disabled={loading} />
            </>
          )}

        </div>
      )}
        <div ref={messagesEndRef} />

      {!hasSession && (
        <div className="bg-white/70 backdrop-blur-sm border-t border-slate-200/50 p-6 text-center">
          <p className="text-slate-500 text-sm">Select a chat or create a new one to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
