import React, { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !name) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await api.auth.login(email, name);
      login(user);
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-8 py-4 rounded-3xl border border-slate-200/50 shadow-sm">
            <span className="text-3xl">🎓</span>
            <span className="text-2xl font-semibold text-slate-800">MyUNI</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm">Sign in to continue chatting</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100/80 border border-red-300/50 rounded-2xl text-red-700 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                placeholder="student@university.edu"
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl transition font-medium disabled:opacity-50 shadow-sm text-sm mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          University Chat Assistant • Powered by AI
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;