import { useEffect, useState } from "react";
import { MessageSquare, BookOpen, X, RefreshCw, AlertCircle, CheckCircle, Clock, CheckCheck, Award, ChevronDown, ChevronUp } from "lucide-react";
import { escalationApi } from "../services/api";

export default function AdminEscalations() {
  const [escalations, setEscalations] = useState([]);
  const [allEscalations, setAllEscalations] = useState([]);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("open");
  const [expandedEsc, setExpandedEsc] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await escalationApi.getAll();
      setAllEscalations(data || []);
    } catch (err) {
      console.error("Load escalations error:", err);
      setError("Failed to load escalations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (activeTab === "open") {
      setEscalations(allEscalations.filter(e => e.status === "open"));
    } else if (activeTab === "resolved") {
      setEscalations(allEscalations.filter(e => e.status === "resolved"));
    } else if (activeTab === "promoted") {
      setEscalations(allEscalations.filter(e => e.status === "promoted"));
    }
  }, [activeTab, allEscalations]);

  const submitReply = async () => {
    if (!replyText.trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await escalationApi.reply(
        replyModal.id,
        replyModal.question,
        replyText
      );

      const updatedEsc = {
        ...replyModal,
        admin_answer: replyText,
        status: "resolved",
        resolved_at: new Date().toISOString()
      };

      setAllEscalations(prev => prev.map(esc => esc.id === replyModal.id ? updatedEsc : esc));

      setReplyModal(null);
      setReplyText("");
      setSuccess("Reply submitted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Reply error:", err);
      setError("Failed to submit reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const promote = async (esc) => {
    if (esc.status !== "resolved") {
      setError("Escalation must be resolved before promoting to FAQ.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!esc.admin_answer) {
      setError("Cannot promote: Admin answer is missing.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await escalationApi.promoteToFaq(esc.id);

      setAllEscalations(prev =>
        prev.map(e => e.id === esc.id ? { ...e, status: "promoted" } : e)
      );

      setSuccess(`Promoted to FAQ successfully! (ID: ${result.faq_id})`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Promote error:", err);
      setError("Failed to promote to FAQ. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openCount = allEscalations.filter(e => e.status === "open").length;
  const resolvedCount = allEscalations.filter(e => e.status === "resolved").length;
  const promotedCount = allEscalations.filter(e => e.status === "promoted").length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header with Logo */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800 mb-1">Escalation Management</h1>
            <p className="text-sm text-slate-500">Review and respond to user escalations</p>
          </div>
          <div className="px-6 py-3 rounded-4xl flex items-center gap-1.5 shadow-sm bg-white border border-slate-200">
            <span className="text-2xl">🎓</span>
            <span className="text-2xl font-semibold text-black">MyUNI</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats & Tab Filter Card */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6 border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
            <div className="flex items-center gap-4">
              <div className="bg-amber-50 text-amber-600 px-5 py-3 rounded-2xl">
                <p className="text-2xl font-bold">{openCount}</p>
                <p className="text-xs">Open</p>
              </div>
              <div className="bg-green-50 text-green-600 px-5 py-3 rounded-2xl">
                <p className="text-2xl font-bold">{resolvedCount}</p>
                <p className="text-xs">Resolved</p>
              </div>
              <div className="bg-purple-50 text-purple-600 px-5 py-3 rounded-2xl">
                <p className="text-2xl font-bold">{promotedCount}</p>
                <p className="text-xs">Promoted</p>
              </div>
            </div>

            <button
              onClick={load}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-2xl flex items-center gap-2 transition-all text-sm"
              disabled={loading}
              title="Refresh escalations"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Tab Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("open")}
              className={`px-5 py-2.5 rounded-2xl font-medium transition-all text-sm ${
                activeTab === "open" 
                  ? "bg-amber-500 text-white shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock size={16} />
                Open ({openCount})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("resolved")}
              className={`px-5 py-2.5 rounded-2xl font-medium transition-all text-sm ${
                activeTab === "resolved" 
                  ? "bg-green-500 text-white shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCheck size={16} />
                Resolved ({resolvedCount})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("promoted")}
              className={`px-5 py-2.5 rounded-2xl font-medium transition-all text-sm ${
                activeTab === "promoted" 
                  ? "bg-purple-500 text-white shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Award size={16} />
                Promoted ({promotedCount})
              </div>
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
        {loading && !escalations.length && (
          <div className="text-center py-16">
            <RefreshCw className="animate-spin mx-auto text-blue-500 mb-3" size={32} />
            <p className="text-slate-500 text-sm">Loading escalations...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && escalations.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-200">
            <div className="text-6xl mb-3">
              {activeTab === "open" && "📭"}
              {activeTab === "resolved" && "✅"}
              {activeTab === "promoted" && "🎉"}
            </div>
            <p className="text-slate-500 mb-2">
              {activeTab === "open" && "No open escalations"}
              {activeTab === "resolved" && "No resolved escalations"}
              {activeTab === "promoted" && "No promoted escalations yet"}
            </p>
            <p className="text-slate-400 text-sm">
              {activeTab === "open" && "All questions are being handled!"}
              {activeTab === "resolved" && "Start replying to open escalations"}
              {activeTab === "promoted" && "Promote resolved escalations to build your FAQ"}
            </p>
          </div>
        )}

        {/* Escalation List */}
        <div className="space-y-4">
          {escalations.map((esc) => {
            const isOpen = esc.status === "open";
            const isResolved = esc.status === "resolved";
            const isPromoted = esc.status === "promoted";
            const isExpanded = expandedEsc === esc.id;

            return (
              <div
                key={esc.id}
                className="bg-white rounded-3xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-all"
              >
                {/* Header with Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      isOpen ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      isResolved ? "bg-green-50 text-green-700 border border-green-200" :
                      "bg-purple-50 text-purple-700 border border-purple-200"
                    }`}>
                      {isOpen && <Clock size={12} className="inline mr-1" />}
                      {isResolved && <CheckCheck size={12} className="inline mr-1" />}
                      {isPromoted && <Award size={12} className="inline mr-1" />}
                      {esc.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {esc.id}</span>
                  </div>
                  {esc.created_at && (
                    <span className="text-xs text-slate-400">
                      {new Date(esc.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                </div>

                {/* Question */}
                <div className="mb-3">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-blue-500 text-sm font-semibold">Q:</span>
                    <p className="flex-1 text-slate-800 font-medium leading-relaxed">{esc.question}</p>
                  </div>
                </div>

                {/* Bot Answer - Collapsed by default */}
                {esc.bot_answer && (
                  <div className="mb-3 bg-indigo-50 border border-indigo-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedEsc(isExpanded ? null : esc.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-indigo-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">Bot Answer</span>
                        {esc.confidence && (
                          <span className="bg-indigo-200 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            {(esc.confidence * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-indigo-600" /> : <ChevronDown size={16} className="text-indigo-600" />}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4">
                        <p className="text-slate-700 text-sm leading-relaxed">{esc.bot_answer}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Answer */}
                {esc.admin_answer && (
                  <div className="mb-3">
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                      <p className="text-xs text-green-600 font-semibold mb-2 uppercase tracking-wide">Admin Answer</p>
                      <p className="text-slate-800 text-sm leading-relaxed">{esc.admin_answer}</p>
                      {esc.resolved_at && (
                        <div className="flex items-center gap-1 mt-3 text-xs text-green-600">
                          <CheckCircle size={12} />
                          <span>Resolved {new Date(esc.resolved_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* User Feedback */}
                {esc.user_feedback && (
                  <div className="mb-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <p className="text-xs text-slate-600 font-semibold mb-1.5 uppercase tracking-wide">User Feedback</p>
                    <p className="text-slate-700 text-sm italic">"{esc.user_feedback}"</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  {!isPromoted && (
                    <button
                      className={`flex-1 px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm text-sm font-medium ${
                        isOpen 
                          ? "bg-blue-500 hover:bg-blue-600 text-white" 
                          : "bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200"
                      }`}
                      onClick={() => {
                        setReplyModal(esc);
                        setReplyText(esc.admin_answer || "");
                        setError("");
                      }}
                      disabled={loading}
                      title={isResolved ? "Edit your reply" : "Reply to this escalation"}
                    >
                      <MessageSquare size={16} />
                      {isResolved ? "Edit Reply" : "Reply"}
                    </button>
                  )}

                  {isResolved && (
                    <button
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 text-sm font-medium"
                      onClick={() => promote(esc)}
                      disabled={loading || !esc.admin_answer}
                      title="Promote to FAQ"
                    >
                      <BookOpen size={16} />
                      Promote to FAQ
                    </button>
                  )}

                  {isPromoted && (
                    <div className="flex-1 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium">
                      <Award size={16} />
                      Already Promoted
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Modal */}
        {replyModal && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-3xl border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {replyModal.status === "resolved" ? "Edit Reply" : "Reply to Escalation"}
                  </h3>
                  <button
                    onClick={() => {
                      setReplyModal(null);
                      setReplyText("");
                      setError("");
                    }}
                    className="text-slate-500 hover:bg-white/50 p-2 rounded-xl transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* Question */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    Question
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <p className="text-slate-900 font-medium leading-relaxed">{replyModal.question}</p>
                  </div>
                </div>

                {/* Bot Answer */}
                {replyModal.bot_answer && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                      Bot's Answer
                      {replyModal.confidence && (
                        <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
                          {(replyModal.confidence * 100).toFixed(0)}% confidence
                        </span>
                      )}
                    </label>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                      <p className="text-slate-700 text-sm leading-relaxed">{replyModal.bot_answer}</p>
                    </div>
                  </div>
                )}

                {/* Admin Answer Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    Your Answer
                  </label>
                  <textarea
                    className="border border-slate-200 bg-slate-50 p-3.5 w-full h-40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition resize-none text-sm"
                    placeholder="Provide a clear and helpful answer..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-3xl">
                <div className="flex justify-end gap-3">
                  <button
                    className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-2xl font-medium transition text-sm"
                    onClick={() => {
                      setReplyModal(null);
                      setReplyText("");
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-medium transition shadow-sm disabled:opacity-50 text-sm"
                    onClick={submitReply}
                    disabled={loading || !replyText.trim()}
                  >
                    {loading ? "Submitting..." : "Submit Reply"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}