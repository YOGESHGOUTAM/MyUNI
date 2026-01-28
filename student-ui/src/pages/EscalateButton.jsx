import React from 'react';
import { AlertCircle } from 'lucide-react';

const EscalateButton = ({ onEscalate, disabled }) => {
  const handleClick = () => {
    if (window.confirm('Are you sure you want to escalate this to an admin?')) {
      onEscalate();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="text-sm px-5 py-2.5 bg-amber-100/80 text-amber-700 rounded-2xl hover:bg-amber-200/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-amber-200/50 font-medium"
    >
      <AlertCircle className="w-4 h-4" />
      Escalate to Admin
    </button>
  );
};

export default EscalateButton;