import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminFaqs from './pages/AdminFaqs.jsx';
import AdminEscalations from './pages/AdminEscalations.jsx';
import AdminDocuments from './pages/AdminDocuments.jsx';
import { Home, HelpCircle, AlertTriangle, FileText } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-blue-800 text-white p-6">
          <h1 className="text-2xl font-bold mb-8">Admin UI</h1>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded">
                <Home size={20} /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded">
                <HelpCircle size={20} /> Manage FAQs
              </Link>
            </li>
            <li>
              <Link to="/escalations" className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded">
                <AlertTriangle size={20} /> Escalations
              </Link>
            </li>
            <li>
              <Link to="/documents" className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded">
                <FileText size={20} /> Documents
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/faqs" element={<AdminFaqs />} />
            <Route path="/escalations" element={<AdminEscalations />} />
            <Route path="/documents" element={<AdminDocuments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;