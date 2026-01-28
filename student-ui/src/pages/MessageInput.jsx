import React, { useState } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        className="flex-1 px-5 py-3 border border-slate-200 bg-slate-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition text-sm"
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MessageInput;