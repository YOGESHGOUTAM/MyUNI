export const API_BASE = import.meta.env.VITE_API_URL;

// Base HTTP methods with error handling
const httpMethods = {
  get: (endpoint) =>
    fetch(`${API_BASE}${endpoint}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        return r.json();
      }),

  post: (endpoint, body) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        return r.json();
      }),

  put: (endpoint, body) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        return r.json();
      }),

  delete: (endpoint) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE"
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        return r.json();
      }),
};

// ==================== FAQ APIs ====================
export const faqApi = {
  getAll: () => httpMethods.get("/admin/faqs/"),

  create: (faq) => httpMethods.post("/admin/faqs/", faq),

  update: (id, faq) => httpMethods.put(`/admin/faqs/${id}`, faq),

  delete: (id) => httpMethods.delete(`/admin/faqs/${id}`),

  addQuestion: (id, questionText) =>
    httpMethods.post(`/admin/faqs/${id}/questions`, { question_text: questionText }),
};

// ==================== ESCALATION APIs ====================
export const escalationApi = {
  getAll: (status = null) => {
    const endpoint = status
      ? `/admin/escalations/?status=${status}`
      : `/admin/escalations/`;
    return httpMethods.get(endpoint);
  },

  getById: (id) => httpMethods.get(`/admin/escalations/${id}`),

  reply: (id, question, answer) =>
    httpMethods.post(`/admin/escalations/${id}/reply`, {
      question: question,
      answer: answer,
      resolved_at: new Date().toISOString()
    }),

  promoteToFaq: (id) =>
    fetch(`${API_BASE}/admin/escalations/${id}/promote/faq`, {
      method: "POST"
    }).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
      return r.json();
    }),
};

// ==================== DOCUMENT APIs ====================
export const documentApi = {
  getAll: () => httpMethods.get("/admin/documents/"),

  getById: (docId) => httpMethods.get(`/admin/documents/${docId}`),

  updateText: (docId, finalText) =>
    httpMethods.put(`/admin/documents/${docId}`, { final_text: finalText }),

  upload: (formData) =>
    fetch(`${API_BASE}/admin/documents/upload`, {
      method: "POST",
      body: formData, // Don't set Content-Type for FormData
    }).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
      return r.json();
    }),

  delete: (docId) => httpMethods.delete(`/admin/documents/${docId}`),
};

// ==================== LEGACY API (for backwards compatibility) ====================
export const api = {
  get: httpMethods.get,
  post: httpMethods.post,
  put: httpMethods.put,
  delete: httpMethods.delete,

  // FAQ shortcuts
  getFaqs: faqApi.getAll,
  createFaq: faqApi.create,
  updateFaq: faqApi.update,
  deleteFaq: faqApi.delete,

  // Escalation shortcuts
  getEscalations: escalationApi.getAll,
  replyEscalation: (id, question, answer) => escalationApi.reply(id, question, answer),
  promoteEscalationToFaq: escalationApi.promoteToFaq,

  // Document shortcuts
  getDocuments: documentApi.getAll,
  uploadDocument: documentApi.upload,
  deleteDocument: documentApi.delete,
};