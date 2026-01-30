import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, HelpCircle, AlertTriangle, FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminFaqs from './pages/AdminFaqs.jsx';
import AdminEscalations from './pages/AdminEscalations.jsx';
import AdminDocuments from './pages/AdminDocuments.jsx';

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/faqs', label: 'FAQs', icon: HelpCircle },
    { path: '/escalations', label: 'Escalations', icon: AlertTriangle },
    { path: '/documents', label: 'Documents', icon: FileText },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 h-screen
        w-72 bg-white/70 backdrop-blur-sm 
        border-r border-slate-200/50
        transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎓</span>
              <span className="text-2xl font-semibold text-slate-800">MyUNI</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden hover:bg-slate-100 p-2 rounded-xl transition"
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>

          {/* Admin Badge */}
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-4 mb-6 border border-blue-200/50">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Admin Panel</p>
            <p className="text-sm text-slate-700">Manage your campus</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-2xl
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-200/50">
            <p className="text-xs text-slate-400 text-center">
              © 2025 MyUNI Admin
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-30 bg-white/70 backdrop-blur-sm border-b border-slate-200/50 p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="hover:bg-slate-100 p-2 rounded-xl transition"
            >
              <Menu size={24} className="text-slate-600" />
            </button>
          </header>

          {/* Page Content */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/faqs" element={<AdminFaqs />} />
              <Route path="/escalations" element={<AdminEscalations />} />
              <Route path="/documents" element={<AdminDocuments />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;