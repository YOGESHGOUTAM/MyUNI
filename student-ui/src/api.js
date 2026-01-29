export const API_BASE = import.meta.env.VITE_API_URL;
export const api = {
  auth: {
    login: async (email, name) => {
      try {
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name })
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Login failed: ${response.status} - ${errorText}`);
        }
        return response.json();
      } catch (error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to server. Please check if backend is running on ' + API_BASE);
        }
        throw error;
      }
    }
  },

  chat: {
  getSessions: async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/api/chat/sessions?user_id=${userId}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch sessions: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      // Unwrap the response: expect {"sessions": [...]}, return the array
      return data.sessions || [];
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please check if backend is running on ' + API_BASE);
      }
      throw error;
    }
  },
  // ... rest of chat object

    createSession: async (userId) => {
      try {
        const response = await fetch(`${API_BASE}/api/chat/new`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create session: ${response.status} - ${errorText}`);
        }
        return response.json();
      } catch (error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to server. Please check if backend is running on ' + API_BASE);
        }
        throw error;
      }
    },

    getSessionHistory: async (sessionId) => {
      try {
        const response = await fetch(`${API_BASE}/api/chat/${sessionId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch chat history: ${response.status} - ${errorText}`);
        }
        return response.json();
      } catch (error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to server. Please check if backend is running on ' + API_BASE);
        }
        throw error;
      }
    },

    sendMessage: async (sessionId, question) => {
      try {
        const response = await fetch(`${API_BASE}/api/chat/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            question: question
          })
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to send message: ${response.status} - ${errorText}`);
        }
        return response.json();
      } catch (error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to server. Please check if backend is running on ' + API_BASE);
        }
        throw error;
      }
    }
  },

  escalation: {
    manualEscalate: async (sessionId) => {
      try {
        const response = await fetch(`${API_BASE}/api/escalation/manual/${sessionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to escalate: ${response.status} - ${errorText}`);
        }
        return response.json();
      } catch (error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to server. Please check if backend is running on ' + API_BASE);
        }
        throw error;
      }
    }
  }
};

export const authStorage = {
  save: (user) => {
    sessionStorage.setItem('user_id', user.user_id);
    sessionStorage.setItem('email', user.email);
    sessionStorage.setItem('name', user.name);
  },

  load: () => {
    const user_id = sessionStorage.getItem('user_id');
    const email = sessionStorage.getItem('email');
    const name = sessionStorage.getItem('name');

    return user_id ? { user_id, email, name } : null;
  },

  clear: () => {
    sessionStorage.clear();
  }
};