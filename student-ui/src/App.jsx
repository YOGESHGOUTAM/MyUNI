import React from 'react';
import LoginScreen from './pages/LoginScreen';
import ChatLayout from './pages/ChatLayout';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <ChatLayout />;
};

export default App;