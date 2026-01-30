import { useEffect, useState } from "react";
import { FileText, Upload, Trash2, X, RefreshCw, AlertCircle, CheckCircle, File } from "lucide-react";
import { documentApi } from "../services/api";

export default function AdminDocuments() {
  const [docs, setDocs] = useState([]);
  const [uploadModal, setUploadModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await documentApi.getAll();
      setDocs(data || []);
    } catch (err) {
      console.error("Load documents error:", err);
      setError("Failed to load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    try {
      setUploadProgress(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      await documentApi.upload(formData);

      setUploadModal(false);
      setFile(null);
      setSuccess("Document uploaded successfully!");
      await load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload document. Please try again.");
    } finally {
      setUploadProgress(false);
    }
  };

  const remove = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      setError("");
      await documentApi.delete(deleteId);
      setDeleteId(null);
      setSuccess("Document deleted successfully!");
      await load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getFileIcon = (sourceType) => {
    const type = sourceType?.toLowerCase() || "";
    if (type.includes("pdf")) return { icon: <FileText size={40} />, color: "text-red-500" };
    if (type.includes("doc")) return { icon: <FileText size={40} />, color: "text-blue-500" };
    if (type.includes("txt")) return { icon: <FileText size={40} />, color: "text-slate-500" };
    return { icon: <File size={40} />, color: "text-indigo-500" };
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-semibold text-slate-800 mb-1">Document Management</h1>
            <p className="text-sm text-slate-500">Upload and manage your knowledge base documents</p>
          </div>
          <div className="px-6 py-3 rounded-4xl flex items-center gap-1.5 shadow-sm bg-white border border-slate-200">
            <span className="text-2xl">🎓</span>
            <span className="text-2xl font-semibold text-black">MyUNI</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6 border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="bg-blue-50 text-blue-600 px-5 py-3 rounded-2xl">
              <p className="text-2xl font-bold">{docs.length}</p>
              <p className="text-xs">Documents</p>
            </div>

            <div className="flex gap-2">
              <button
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-2xl flex items-center gap-2 transition-all text-sm"
                onClick={load}
                disabled={loading}
                title="Refresh document list"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-2xl flex items-center gap-2 transition-all shadow-sm text-sm font-medium"
                onClick={() => {
                  setUploadModal(true);
                  setError("");
                }}
                title="Upload a new document"
              >
                <Upload size={16} />
                Upload
              </button>
            </div>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-2xl mb-4 flex items-center gap-2 shadow-sm">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl mb-4 flex items-center gap-2 shadow-sm">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {loading && !docs.length && (
          <div className="text-center py-16">
            <RefreshCw className="animate-spin mx-auto text-blue-500 mb-3" size={32} />
            <p className="text-slate-500 text-sm">Loading documents...</p>
          </div>
        )}

        {!loading && docs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-200">
            <div className="text-6xl mb-3">📄</div>
            <p className="text-slate-500 mb-4 text-sm">No documents uploaded yet.</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-2xl shadow-sm text-sm"
              onClick={() => setUploadModal(true)}
              title="Start uploading your first document"
            >
              Upload Your First Document
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc) => {
            const fileDisplay = getFileIcon(doc.source_type);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-md transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`bg-slate-50 p-3 rounded-2xl ${fileDisplay.color}`}>
                      {fileDisplay.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm truncate mb-1">
                        {doc.title || "Untitled Document"}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium capitalize">
                        {doc.source_type || "unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 bg-slate-50 p-4 rounded-2xl">
                    {doc.file_size && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Size:</span>
                        <span className="text-xs text-slate-700 font-semibold">
                          {formatFileSize(doc.file_size)}
                        </span>
                      </div>
                    )}
                    {doc.created_at && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Date:</span>
                        <span className="text-xs text-slate-700 font-semibold">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setDeleteId(doc.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-2xl w-full flex items-center justify-center gap-2 transition-all text-sm font-medium"
                    title="Delete this document"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {uploadModal && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-3xl border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-slate-800">Upload Document</h3>
                  <button
                    onClick={() => {
                      setUploadModal(false);
                      setFile(null);
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
                  <label className="block text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                    Select File
                  </label>
                  <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-blue-50/30">
                    <input
                      type="file"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                        setError("");
                      }}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="mx-auto text-blue-500 mb-3" size={40} />
                      <p className="text-slate-700 font-medium mb-1 text-sm">
                        Click to upload
                      </p>
                      <p className="text-xs text-slate-500">
                        PDF, DOC, DOCX, TXT (Max 10MB)
                      </p>
                    </label>
                  </div>

                  {file && (
                    <div className="mt-4 p-4 bg-blue-50/80 border border-blue-200/50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-600" size={28} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate text-sm">{file.name}</p>
                          <p className="text-xs text-slate-600">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          onClick={() => setFile(null)}
                          className="text-red-500 hover:text-red-600 p-1"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    className="flex-1 px-5 py-2.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-2xl font-medium transition text-sm"
                    onClick={() => {
                      setUploadModal(false);
                      setFile(null);
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-medium transition shadow-sm disabled:opacity-50 text-sm"
                    onClick={upload}
                    disabled={!file || uploadProgress}
                  >
                    {uploadProgress ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 text-center">
              <div className="bg-red-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Delete Document?</h3>
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
                  onClick={remove}
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