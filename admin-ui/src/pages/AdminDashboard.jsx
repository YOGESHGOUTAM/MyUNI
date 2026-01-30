import { useEffect, useState } from 'react';
import { HelpCircle, AlertTriangle, FileText } from 'lucide-react';
import { faqApi, escalationApi, documentApi } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    faqs: 0,
    escalations: 0,
    documents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [faqs, escalations, docs] = await Promise.all([
          faqApi.getAll(),
          escalationApi.getAll(),
          documentApi.getAll(),
        ]);

        setStats({
          faqs: Array.isArray(faqs) ? faqs.length : 0,
          escalations: Array.isArray(escalations)
            ? escalations.filter(e => !e.status || e.status === 'open').length
            : 0,
          documents: Array.isArray(docs) ? docs.length : 0,
        });
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setStats({ faqs: 0, escalations: 0, documents: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-semibold text-slate-800 mb-1">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Welcome back! Here's your overview</p>
          </div>
          <div className="px-6 py-3 rounded-4xl flex items-center gap-1.5 shadow-sm bg-white border border-slate-200">
            <span className="text-2xl">🎓</span>
            <span className="text-2xl font-semibold text-black">MyUNI</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <a href="/faqs" className="group">
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-200 hover:shadow-md transition-all hover:border-blue-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-blue-50 p-4 rounded-2xl">
                      <HelpCircle className="text-blue-600" size={32} />
                    </div>
                    <span className="text-xs text-blue-500 font-medium group-hover:underline">View All →</span>
                  </div>
                  <h3 className="text-4xl font-bold text-slate-800 mb-2">{stats.faqs}</h3>
                  <p className="text-slate-600 font-medium">Total FAQs</p>
                  <p className="text-xs text-slate-400 mt-2">Manage knowledge base</p>
                </div>
              </a>

              <a href="/escalations" className="group">
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-200 hover:shadow-md transition-all hover:border-amber-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-amber-50 p-4 rounded-2xl">
                      <AlertTriangle className="text-amber-600" size={32} />
                    </div>
                    <span className="text-xs text-amber-500 font-medium group-hover:underline">Handle →</span>
                  </div>
                  <h3 className="text-4xl font-bold text-slate-800 mb-2">{stats.escalations}</h3>
                  <p className="text-slate-600 font-medium">Open Escalations</p>
                  <p className="text-xs text-slate-400 mt-2">Review user queries</p>
                </div>
              </a>

              <a href="/documents" className="group">
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-200 hover:shadow-md transition-all hover:border-green-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-green-50 p-4 rounded-2xl">
                      <FileText className="text-green-600" size={32} />
                    </div>
                    <span className="text-xs text-green-500 font-medium group-hover:underline">View →</span>
                  </div>
                  <h3 className="text-4xl font-bold text-slate-800 mb-2">{stats.documents}</h3>
                  <p className="text-slate-600 font-medium">Documents</p>
                  <p className="text-xs text-slate-400 mt-2">Uploaded files</p>
                </div>
              </a>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/faqs" className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-2xl text-center transition-all shadow-sm hover:shadow-md">
                  <HelpCircle className="mx-auto mb-3" size={32} />
                  <p className="font-medium">Manage FAQs</p>
                  <p className="text-xs opacity-90 mt-1">Add or edit questions</p>
                </a>
                <a href="/escalations" className="bg-amber-500 hover:bg-amber-600 text-white p-6 rounded-2xl text-center transition-all shadow-sm hover:shadow-md">
                  <AlertTriangle className="mx-auto mb-3" size={32} />
                  <p className="font-medium">Review Escalations</p>
                  <p className="text-xs opacity-90 mt-1">Respond to queries</p>
                </a>
                <a href="/documents" className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-2xl text-center transition-all shadow-sm hover:shadow-md">
                  <FileText className="mx-auto mb-3" size={32} />
                  <p className="font-medium">Upload Documents</p>
                  <p className="text-xs opacity-90 mt-1">Add knowledge base files</p>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}