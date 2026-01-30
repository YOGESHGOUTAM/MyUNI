import { useEffect, useState } from "react";
import { MessageSquare, BookOpen, X, RefreshCw, AlertCircle, CheckCircle, Clock, CheckCheck } from "lucide-react";
import { escalationApi } from "../services/api";

export default function AdminEscalations() {
  const [escalations, setEscalations] = useState([]);
  const [allEscalations, setAllEscalations] = useState([]); // Store all escalations
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await escalationApi.getAll(); // Get all escalations without filter
      setAllEscalations(data || []); // Store all
      setEscalations(data || []); // Display all initially
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

  // Filter escalations locally when filter changes
  useEffect(() => {
    if (filterStatus === "") {
      setEscalations(allEscalations);
    } else if (filterStatus === "open") {
      setEscalations(allEscalations.filter(e => !e.status || e.status === "open"));
    } else if (filterStatus === "resolved") {
      setEscalations(allEscalations.filter(e => e.status === "resolved"));
    }
  }, [filterStatus, allEscalations]);

  const submitReply = async () => {
    if (!replyText.trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // Send proper payload matching backend schema
      await escalationApi.reply(
        replyModal.id,
        replyModal.question,  // Original question
        replyText             // Admin's answer
      );
      setReplyModal(null);
      setReplyText("");
      setSuccess("Reply submitted successfully!");
      await load();
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
      setSuccess(`Successfully promoted to FAQ! (ID: ${result.faq_id})`);
      await load();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Promote error:", err);
      setError("Failed to promote to FAQ. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from ALL escalations (not filtered)
  const totalCount = allEscalations.length;
  const openCount = allEscalations.filter(e => !e.status || e.status === "open").length;
  const resolvedCount = allEscalations.filter(e => e.status === "resolved").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header with Logo */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800 mb-1">Escalation Management</h1>
            <p className="text-sm text-slate-500">Review and respond to user escalations</p>
          </div>
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl border border-slate-200/50 shadow-sm">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-semibold text-slate-800">MyUNI</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats & Filters Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm p-6 mb-6 border border-slate-200/50">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
            <button
              onClick={load}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl flex items-center gap-2 transition-all text-sm"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Stats Grid - Always shows total counts regardless of filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100/80 text-blue-600 p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{totalCount}</p>
                  <p className="text-xs mt-1">Total</p>
                </div>
                <MessageSquare size={32} className="opacity-60" />
              </div>
            </div>

            <div className="bg-amber-100/80 text-amber-600 p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{openCount}</p>
                  <p className="text-xs mt-1">Open</p>
                </div>
                <Clock size={32} className="opacity-60" />
              </div>
            </div>

            <div className="bg-green-100/80 text-green-600 p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{resolvedCount}</p>
                  <p className="text-xs mt-1">Resolved</p>
                </div>
                <CheckCheck size={32} className="opacity-60" />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("")}
              className={`px-4 py-2 rounded-2xl font-medium transition-all text-sm ${
                filterStatus === "" 
                  ? "bg-blue-500 text-white shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("open")}
              className={`px-4 py-2 rounded-2xl font-medium transition-all text-sm ${
                filterStatus === "open" 
                  ? "bg-amber-500 text-white shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setFilterStatus("resolved")}
              className={`px-4 py-2 rounded-2xl font-medium transition-all text-sm ${
                filterStatus === "resolved" 
                  ? "bg-green-500 text-white shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100/80 border border-green-300/50 text-green-700 px-5 py-3 rounded-2xl mb-4 flex items-center gap-2 shadow-sm backdrop-blur-sm">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100/80 border border-red-300/50 text-red-700 px-5 py-3 rounded-2xl mb-4 flex items-center gap-2 shadow-sm backdrop-blur-sm">
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
          <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50">
            <div className="text-6xl mb-3">🎉</div>
            <p className="text-slate-500">No escalations found. All clear!</p>
          </div>
        )}

        {/* Escalations List */}
        <div className="space-y-4">
          {escalations.map((esc) => {
            const isResolved = esc.status === "resolved";

            return (
              <div
                key={esc.id}
                className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm p-6 border border-slate-200/50 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                      isResolved 
                        ? "bg-green-100/80 text-green-700" 
                        : "bg-amber-100/80 text-amber-700"
                    }`}>
                      {esc.status ? esc.status.toUpperCase() : "OPEN"}
                    </span>
                    <span className="text-xs text-slate-400">
                      #{esc.id}
                    </span>
                  </div>
                </div>

                {/* Question */}
                <div className="mb-3 bg-blue-50/80 p-4 rounded-2xl border border-blue-200/50">
                  <p className="text-xs text-blue-600 font-semibold mb-1">QUESTION</p>
                  <p className="text-slate-900 font-medium">{esc.question}</p>
                </div>

                {/* Bot Answer */}
                <div className="mb-3 bg-indigo-50/80 p-4 rounded-2xl border border-indigo-200/50">
                  <p className="text-xs text-indigo-600 font-semibold mb-1">BOT ANSWER</p>
                  <p className="text-slate-700 text-sm">{esc.bot_answer || "N/A"}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    Confidence: {esc.confidence ? (esc.confidence * 100).toFixed(1) + "%" : "N/A"}
                  </p>
                </div>

                {/* Admin Answer */}
                {esc.admin_answer && (
                  <div className="mb-3 bg-green-50/80 p-4 rounded-2xl border border-green-200/50">
                    <p className="text-xs text-green-600 font-semibold mb-1">ADMIN ANSWER</p>
                    <p className="text-slate-900 text-sm">{esc.admin_answer}</p>
                    {esc.resolved_at && (
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(esc.resolved_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 text-sm font-medium"
                    onClick={() => {
                      setReplyModal(esc);
                      setReplyText(esc.admin_answer || "");
                      setError("");
                    }}
                    disabled={loading}
                  >
                    <MessageSquare size={16} />
                    {isResolved ? "Edit Reply" : "Reply"}
                  </button>

                  <button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 text-sm font-medium"
                    onClick={() => promote(esc)}
                    disabled={loading || !isResolved || !esc.admin_answer}
                    title={!isResolved ? "Resolve first" : !esc.admin_answer ? "Add reply first" : "Promote to FAQ"}
                  >
                    <BookOpen size={16} />
                    Promote to FAQ
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Modal */}
        {replyModal && (
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-t-3xl border-b border-slate-200 sticky top-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {replyModal.status === "resolved" ? "Edit Reply" : "Reply to Escalation"}
                  </h3>
                  <button
                    onClick={() => {
                      setReplyModal(null);
                      setError("");
                    }}
                    className="text-slate-500 hover:bg-white/50 p-2 rounded-xl transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Question Display */}
                <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-200/50">
                  <p className="text-xs text-blue-600 font-semibold mb-2">QUESTION</p>
                  <p className="text-slate-900 font-medium">{replyModal.question}</p>
                </div>

                {/* Bot Answer Display */}
                {replyModal.bot_answer && (
                  <div className="bg-indigo-50/80 p-5 rounded-2xl border border-indigo-200/50">
                    <p className="text-xs text-indigo-600 font-semibold mb-2">BOT'S ANSWER</p>
                    <p className="text-slate-700 text-sm">{replyModal.bot_answer}</p>
                  </div>
                )}

                {/* Reply Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Your Answer</label>
                  <textarea
                    className="border border-slate-200 bg-slate-50 p-3.5 w-full h-40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition resize-none text-sm"
                    placeholder="Enter your answer..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-2xl font-medium transition text-sm"
                    onClick={() => {
                      setReplyModal(null);
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-medium transition shadow-sm disabled:opacity-50 text-sm"
                    onClick={submitReply}
                    disabled={loading}
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