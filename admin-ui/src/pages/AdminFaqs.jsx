import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X, Search, RefreshCw, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Eye, Code, Upload } from "lucide-react";
import { faqApi } from "../services/api";

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionsJson, setQuestionsJson] = useState("[]");
  const [bulkJson, setBulkJson] = useState("[]");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [viewingFaq, setViewingFaq] = useState(null);

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

  const openView = (faq) => {
    setViewingFaq(faq);
    setViewModalOpen(true);
  };

  const openEdit = (faq) => {
    setEditId(faq.id);
    setQuestion(faq.canonical_question);
    setAnswer(faq.answer_en);

    // Extract question variants (excluding canonical)
    const variants = faq.questions
      ?.filter(q => q.question_text !== faq.canonical_question)
      .map(q => q.question_text) || [];

    setQuestionsJson(JSON.stringify(variants, null, 2));
    setModalOpen(true);
    setError("");
    setSuccess("");
  };

  const openCreate = () => {
    setEditId(null);
    setQuestion("");
    setAnswer("");
    setQuestionsJson("[]");
    setModalOpen(true);
    setError("");
    setSuccess("");
  };

  const openBulkUpload = () => {
    setBulkJson(JSON.stringify([
      {
        "canonical_question": "How do I reset my password?",
        "answer_en": "Go to settings and click 'Reset Password'.",
        "questions": ["Password reset help", "Forgot password"]
      }
    ], null, 2));
    setBulkModalOpen(true);
    setError("");
    setSuccess("");
  };

  const submitForm = async () => {
    if (!question.trim() || !answer.trim()) {
      setError("Question and answer are required.");
      return;
    }

    let questionVariants = [];
    try {
      questionVariants = JSON.parse(questionsJson);
      if (!Array.isArray(questionVariants)) {
        setError("Questions must be a JSON array.");
        return;
      }
    } catch (err) {
      setError("Invalid JSON format for questions.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        canonical_question: question,
        answer_en: answer,
        questions: questionVariants,
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
      setQuestionsJson("[]");
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

  const submitBulkUpload = async () => {
    let faqsData = [];
    try {
      faqsData = JSON.parse(bulkJson);
      if (!Array.isArray(faqsData)) {
        setError("Bulk data must be a JSON array.");
        return;
      }
    } catch (err) {
      setError("Invalid JSON format.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await faqApi.bulkUpload(faqsData);
      setBulkModalOpen(false);
      setBulkJson("[]");
      setSuccess("Bulk upload successful!");
      await loadFaqs();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Bulk upload error:", err);
      setError("Failed to upload FAQs. Please check your JSON format.");
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

            <div className="flex gap-2">
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-sm text-sm font-medium"
                onClick={openBulkUpload}
                title="Bulk upload FAQs via JSON"
              >
                <Upload size={18} />
                Bulk Upload
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-sm text-sm font-medium"
                onClick={openCreate}
                title="Add a new FAQ"
              >
                <Plus size={18} />
                Add New FAQ
              </button>
            </div>
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

                  {/* Question count badge */}
                  {faq.questions && faq.questions.length > 1 && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-purple-50 text-purple-600 px-3 py-1 rounded-xl text-xs font-medium">
                      <Code size={12} />
                      {faq.questions.length} question variant{faq.questions.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-2xl flex items-center gap-1.5 transition-all text-sm"
                    onClick={() => openView(faq)}
                    title="View all question variants"
                  >
                    <Eye size={16} />
                    View
                  </button>
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

        {/* View Modal - Shows all questions and answer */}
        {viewModalOpen && viewingFaq && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-t-3xl border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-slate-800">FAQ Details</h3>
                  <button
                    onClick={() => {
                      setViewModalOpen(false);
                      setViewingFaq(null);
                    }}
                    className="text-slate-500 hover:bg-white/50 p-2 rounded-xl transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Canonical Question */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    Canonical Question
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <p className="text-slate-800 font-medium">{viewingFaq.canonical_question}</p>
                  </div>
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    Answer
                  </label>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                    <p className="text-slate-700 leading-relaxed">{viewingFaq.answer_en}</p>
                  </div>
                </div>

                {/* All Question Variants */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                    All Question Variants ({viewingFaq.questions?.length || 0})
                  </label>
                  <div className="space-y-2">
                    {viewingFaq.questions?.map((q, idx) => (
                      <div
                        key={q.id}
                        className={`rounded-2xl p-3 text-sm ${
                          q.question_text === viewingFaq.canonical_question
                            ? 'bg-blue-50 border border-blue-200 font-medium'
                            : 'bg-slate-50 border border-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-slate-400 text-xs mt-0.5 font-mono">#{idx + 1}</span>
                          <p className="flex-1 text-slate-700">{q.question_text}</p>
                          {q.question_text === viewingFaq.canonical_question && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                              Canonical
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-3xl">
                <button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-medium transition shadow-sm text-sm"
                  onClick={() => {
                    setViewModalOpen(false);
                    setViewingFaq(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Modal with JSON Editor */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
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

              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    Canonical Question
                  </label>
                  <input
                    className="border border-slate-200 bg-slate-50 p-3.5 w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition text-sm"
                    placeholder="Enter the main question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Answer</label>
                  <textarea
                    className="border border-slate-200 bg-slate-50 p-3.5 w-full h-32 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition resize-none text-sm"
                    placeholder="Enter the answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <Code size={14} />
                    Question Variants (JSON Array)
                  </label>
                  <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
                    <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-slate-400 text-xs ml-2">questions.json</span>
                    </div>
                    <textarea
                      className="w-full h-48 bg-slate-900 text-green-400 p-4 font-mono text-sm focus:outline-none resize-none"
                      placeholder='[\n  "How do I reset my password?",\n  "Password reset help",\n  "Forgot password"\n]'
                      value={questionsJson}
                      onChange={(e) => setQuestionsJson(e.target.value)}
                      spellCheck={false}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    💡 Add alternative phrasings of the canonical question inside [] enclosed by "" seperated by comma(,). The canonical question is automatically included.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-3xl">
                <div className="flex justify-end gap-3">
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
                    {loading ? "Saving..." : editId ? "Update FAQ" : "Create FAQ"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Upload Modal */}
        {bulkModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-t-3xl border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">Bulk FAQ Upload</h3>
                    <p className="text-sm text-slate-500 mt-1">Upload multiple FAQs at once using JSON format</p>
                  </div>
                  <button
                    onClick={() => {
                      setBulkModalOpen(false);
                      setError("");
                    }}
                    className="text-slate-500 hover:bg-white/50 p-2 rounded-xl transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
                  <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-slate-400 text-xs ml-2">bulk-faqs.json</span>
                    </div>
                    <span className="text-slate-400 text-xs">JSON Array</span>
                  </div>
                  <textarea
                    className="w-full h-96 bg-slate-900 text-green-400 p-4 font-mono text-sm focus:outline-none resize-none"
                    placeholder='[\n  {\n    "canonical_question": "...",\n    "answer_en": "...",\n    "questions": ["variant1", "variant2"]\n  }\n]'
                    value={bulkJson}
                    onChange={(e) => setBulkJson(e.target.value)}
                    spellCheck={false}
                  />
                </div>
                <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                  <p className="text-sm text-indigo-900 font-medium mb-2">📋 Format Example:</p>
                  <pre className="text-xs text-indigo-700 font-mono overflow-x-auto">
{`[
  {
    "canonical_question": "How do I reset my password?",
    "answer_en": "Go to settings and click Reset Password.",
    "questions": ["Password reset", "Forgot password"]
  },
  {
    "canonical_question": "What is the refund policy?",
    "answer_en": "You can request a refund within 30 days.",
    "questions": ["Refund policy", "Can I get a refund?"]
  }
]`}
                  </pre>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-3xl">
                <div className="flex justify-end gap-3">
                  <button
                    className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-2xl font-medium transition text-sm"
                    onClick={() => {
                      setBulkModalOpen(false);
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-medium transition shadow-sm disabled:opacity-50 text-sm"
                    onClick={submitBulkUpload}
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload FAQs"}
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
                This action cannot be undone. All question variants will be deleted.
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