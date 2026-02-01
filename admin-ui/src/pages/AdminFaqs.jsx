import { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Plus,
  X,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Code
} from "lucide-react";
import { faqApi } from "../services/api";

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // Single FAQ modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [canonicalQuestion, setCanonicalQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionsJson, setQuestionsJson] = useState("[]");

  // View modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingFaq, setViewingFaq] = useState(null);

  // Bulk modal
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkJson, setBulkJson] = useState("[]");

  // Delete
  const [deleteId, setDeleteId] = useState(null);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await faqApi.getAll();
      setFaqs(data);
    } catch {
      setError("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setCanonicalQuestion("");
    setAnswer("");
    setQuestionsJson("[]");
    setModalOpen(true);
  };

  const openEdit = (faq) => {
    setEditId(faq.id);
    setCanonicalQuestion(faq.canonical_question);
    setAnswer(faq.answer_en);

    const variants =
      faq.questions
        ?.filter(q => q.question_text !== faq.canonical_question)
        .map(q => q.question_text) || [];

    setQuestionsJson(JSON.stringify(variants, null, 2));
    setModalOpen(true);
  };

  const submitForm = async () => {
    if (!canonicalQuestion.trim() || !answer.trim()) {
      setError("Canonical question and answer are required");
      return;
    }

    let questions = [];
    try {
      questions = JSON.parse(questionsJson);
      if (!Array.isArray(questions)) throw new Error();
    } catch {
      setError("Questions must be a valid JSON array");
      return;
    }

    const payload = {
      canonical_question: canonicalQuestion,
      answer_en: answer,
      questions
    };

    try {
      setLoading(true);
      if (editId) {
        await faqApi.update(editId, payload);
        setSuccess("FAQ updated");
      } else {
        await faqApi.create(payload);
        setSuccess("FAQ created");
      }
      setModalOpen(false);
      await loadFaqs();
    } catch {
      setError("Failed to save FAQ");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await faqApi.delete(deleteId);
      setDeleteId(null);
      setSuccess("FAQ deleted");
      await loadFaqs();
    } catch {
      setError("Failed to delete FAQ");
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(
    f =>
      f.canonical_question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer_en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-semibold">FAQ Management</h1>
        <div className="flex gap-3">
          <button
            className="bg-indigo-500 text-white px-5 py-2 rounded-xl flex items-center gap-2"
            onClick={() => setBulkModalOpen(true)}
          >
            <Code size={18} />
            Bulk Upload
          </button>
          <button
            className="bg-blue-500 text-white px-5 py-2 rounded-xl flex items-center gap-2"
            onClick={openCreate}
          >
            <Plus size={18} />
            Add FAQ
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 flex gap-2">
          <CheckCircle size={18} /> {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 flex gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <input
        className="w-full mb-6 p-3 rounded-xl border"
        placeholder="Search FAQs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="space-y-4">
        {filteredFaqs.map(faq => (
          <div key={faq.id} className="bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{faq.canonical_question}</p>
                <p className="text-sm text-slate-600">{faq.answer_en}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setViewingFaq(faq); setViewModalOpen(true); }}>
                  <Eye />
                </button>
                <button onClick={() => openEdit(faq)}>
                  <Edit />
                </button>
                <button onClick={() => setDeleteId(faq.id)}>
                  <Trash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BULK MODAL */}
      {bulkModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-3">Bulk FAQ Upload</h2>
            <textarea
              className="w-full h-80 bg-black text-green-400 font-mono p-4 rounded-xl"
              value={bulkJson}
              onChange={e => setBulkJson(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setBulkModalOpen(false)}>Cancel</button>
              <button
                className="bg-indigo-500 text-white px-5 py-2 rounded-xl"
                onClick={async () => {
                  try {
                    const parsed = JSON.parse(bulkJson);
                    await faqApi.bulkUpload(parsed);
                    setBulkModalOpen(false);
                    setSuccess("Bulk upload successful");
                    await loadFaqs();
                  } catch {
                    setError("Invalid JSON or upload failed");
                  }
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <p>Delete this FAQ?</p>
            <div className="flex gap-4 mt-4 justify-center">
              <button onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
