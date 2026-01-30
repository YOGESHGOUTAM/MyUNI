import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X, Search, RefreshCw, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from "lucide-react";
import { faqApi } from "../services/api";

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await faqApi.getAll();
      setFaqs(data);
    } catch (err) {
      console.error("Load FAQs error:", err);
      setError("Failed to load FAQs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openEdit = (faq) => {
    setEditId(faq.id);
    setQuestion(faq.canonical_question);
    setAnswer(faq.answer_en);
    setModalOpen(true);
    setError("");
    setSuccess("");
  };

  const openCreate = () => {
    setEditId(null);
    setQuestion("");
    setAnswer("");
    setModalOpen(true);
    setError("");
    setSuccess("");
  };

  const submitForm = async () => {
    if (!question.trim() || !answer.trim()) {
      setError("Question and answer are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        canonical_question: question,
        answer_en: answer,
      };

      if (editId) {
        await faqApi.update(editId, payload);
        setSuccess("FAQ updated successfully!");
      } else {
        await faqApi.create(payload);
        setSuccess("FAQ created successfully!");
      }

      setModalOpen(false);
      setQuestion("");
      setAnswer("");
      setEditId(null);
      await loadFaqs();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Save FAQ error:", err);
      if (err.message.includes("409")) {
        setError("FAQ with this question already exists.");
      } else {
        setError("Failed to save FAQ. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      setError("");
      await faqApi.delete(deleteId);
      setDeleteId(null);
      setSuccess("FAQ deleted successfully!");
      await loadFaqs();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete FAQ error:", err);
      setError("Failed to delete FAQ. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.canonical_question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer_en?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header with Logo */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800 mb-1">FAQ Management</h1>
            <p className="text-sm text-slate-500">Manage your frequently asked questions</p>
          </div>
          <div className="px-6 py-3 rounded-4xl flex items-center gap-1.5 shadow-sm bg-white border border-slate-200">
            <span className="text-2xl">🎓</span>
            <span className="text-2xl font-semibold text-black">MyUNI</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats & Search Card */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6 border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 text-blue-600 px-5 py-3 rounded-2xl">
                <p className="text-2xl font-bold">{faqs.length}</p>
                <p className="text-xs">Total FAQs</p>
              </div>
              <div className="bg-indigo-50 text-indigo-600 px-5 py-3 rounded-2xl">
                <p className="text-2xl font-bold">{filteredFaqs.length}</p>
                <p className="text-xs">Showing</p>
              </div>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-sm text-sm font-medium"
              onClick={openCreate}
              title="Add a new FAQ"
            >
              <Plus size={18} />
              Add New FAQ
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="absolute right-2 top-2 bg-white hover:bg-slate-100 p-1.5 rounded-xl transition"
              onClick={loadFaqs}
              disabled={loading}
              title="Refresh FAQ list"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-2xl mb-4 flex items-center gap-2 shadow-sm">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl mb-4 flex items-center gap-2 shadow-sm">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && !faqs.length && (
          <div className="text-center py-16">
            <RefreshCw className="animate-spin mx-auto text-blue-500 mb-3" size={32} />
            <p className="text-slate-500 text-sm">Loading FAQs...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFaqs.length === 0 && faqs.length > 0 && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-200">
            <Search className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-500">No FAQs match your search.</p>
          </div>
        )}

        {!loading && faqs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-200">
            <div className="text-6xl mb-3">📝</div>
            <p className="text-slate-500 mb-4">No FAQs yet. Start by adding one!</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-2xl shadow-sm text-sm"
              onClick={openCreate}
              title="Create your first FAQ"
            >
              Add Your First FAQ
            </button>
          </div>
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              className="bg-white rounded-3xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all"
              key={faq.id}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-base mb-2 flex items-start gap-2">
                    <span className="text-blue-500 text-sm">Q:</span>
                    <span>{faq.canonical_question}</span>
                  </p>
                  <p className={`text-slate-600 text-sm leading-relaxed ${expandedFaq === faq.id ? "" : "line-clamp-2"}`}>
                    <span className="font-medium text-indigo-500">A:</span> {faq.answer_en}
                  </p>
                  {faq.answer_en?.length > 150 && (
                    <button
                      className="text-blue-500 hover:text-blue-600 mt-2 flex items-center gap-1 text-sm font-medium"
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    >
                      {expandedFaq === faq.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {expandedFaq === faq.id ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-amber-50 hover:bg-amber-100 text-amber-600 px-4 py-2 rounded-2xl flex items-center gap-1.5 transition-all text-sm"
                    onClick={() => openEdit(faq)}
                    title="Edit this FAQ"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-2xl flex items-center gap-1.5 transition-all text-sm"
                    onClick={() => setDeleteId(faq.id)}
                    title="Delete this FAQ"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-3xl border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {editId ? "Edit FAQ" : "Create New FAQ"}
                  </h3>
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      setError("");
                    }}
                    className="text-slate-500 hover:bg-white/50 p-2 rounded-xl transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Question</label>
                  <input
                    className="border border-slate-200 bg-slate-50 p-3.5 w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition text-sm"
                    placeholder="Enter the question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Answer</label>
                  <textarea
                    className="border border-slate-200 bg-slate-50 p-3.5 w-full h-40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition resize-none text-sm"
                    placeholder="Enter the answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-2xl font-medium transition text-sm"
                    onClick={() => {
                      setModalOpen(false);
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-medium transition shadow-sm disabled:opacity-50 text-sm"
                    onClick={submitForm}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save FAQ"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 text-center">
              <div className="bg-red-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Delete FAQ?</h3>
              <p className="text-slate-500 mb-6 text-sm">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-5 py-2.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-2xl font-medium transition text-sm"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-2xl font-medium transition shadow-sm disabled:opacity-50 text-sm"
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}