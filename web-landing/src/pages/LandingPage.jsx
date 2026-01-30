import { APP_ONE } from "../config.js";
import {APP_TWO} from "../config.js";


import React from 'react';
import {
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Users,
  Shield,
  Zap,
  Globe,
  Brain,
  Bell,
  BarChart3,
  FileText,
  Github,
  Linkedin,
  Mail,
  ExternalLink
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    { icon: <MessageSquare size={24} />, text: "Eliminates long email chains & office queues" },
    { icon: <FileText size={24} />, text: "Works with real campus information, not random internet answers" },
    { icon: <Users size={24} />, text: "Transparent escalation between student ↔ administration" },
    { icon: <CheckCircle size={24} />, text: "Persistent chat history — no more repeating yourself" },
    { icon: <Globe size={24} />, text: "Works across devices — mobile, laptop, tablets" },
  ];

  const techStack = [
    { category: "Frontend", items: ["React", "Vite", "Tailwind", "Lucide UI"] },
    { category: "Backend", items: ["FastAPI", "pgvector", "PostgreSQL"] },
    { category: "LLM & Retrieval", items: ["External LLM APIs", "Hybrid RAG pipeline"] },
    { category: "Storage", items: ["Dockerized PostgreSQL", "Volume persistence"] },
    { category: "Infra", items: ["Container-based deployment"] },
  ];

  const upcoming = [
    { icon: <Shield size={20} />, text: "Admin login with permissions & identity verification" },
    { icon: <Brain size={20} />, text: "Automatic question clustering (exam, hostel, admissions, etc.)" },
    { icon: <Globe size={20} />, text: "Multilingual support (Hindi, English, Regional languages)" },
    { icon: <Zap size={20} />, text: "Web search + LLM reasoning before escalation" },
    { icon: <Bell size={20} />, text: "Push notifications for resolved queries" },
    { icon: <BarChart3 size={20} />, text: "Analytics panel for admin" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎓</span>
            <span className="text-2xl font-semibold text-slate-800">MyUNI</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-blue-500 transition">About</a>
            <a href="#features" className="hover:text-blue-500 transition">Features</a>
            <a href="#tech" className="hover:text-blue-500 transition">Tech Stack</a>
            <a href="#access" className="hover:text-blue-500 transition">Access</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-100/80 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200/50">
          Smart Campus Assistant
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
          MyUNI — Smart<br />Campus Assistant
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          A modern, multilingual campus helpdesk that lets students get verified answers instantly — and seamlessly escalate unresolved queries to university admins.
        </p>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12">
          Built to reduce chaos, save admin time, and empower students with clarity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center" id="access">
          <a
            href= {APP_ONE}
            className="group bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-medium transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Users size={20} />
            Login as Student
            <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
          </a>
          <a
            href={APP_TWO}
            className="group bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-medium transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Shield size={20} />
            Login as Admin
            <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
          </a>
        </div>

        <p className="text-sm text-slate-500 mt-6">
          Ask, chat, escalate & track responses — all in one place.
        </p>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-16" id="about">
        <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">💡 How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Ask a Question", desc: "Students ask about exams, fees, hostel, academics, forms etc." },
            { step: "2", title: "Smart Answering", desc: "LLM + internal knowledgebase returns verified answers." },
            { step: "3", title: "Manual Escalation", desc: "If not satisfied, the student escalates the query to admins." },
            { step: "4", title: "Admin Resolves", desc: "Admin replies through the portal, student gets updates." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-600 mt-8 font-medium">
          Case Closed — Chat remains stored for future reference & analytics.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16" id="features">
        <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">🌟 What's Different?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition flex items-start gap-4">
              <div className="bg-green-100/80 text-green-600 p-3 rounded-2xl flex-shrink-0">
                {feature.icon}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-7xl mx-auto px-6 py-16" id="tech">
        <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">🧰 Tech Stack</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, idx) => (
            <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4 text-lg">{tech.category}</h3>
              <div className="flex flex-wrap gap-2">
                {tech.items.map((item, i) => (
                  <span key={i} className="bg-blue-100/80 text-blue-700 px-3 py-1 rounded-xl text-sm border border-blue-200/50">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-indigo-50/80 backdrop-blur-sm rounded-3xl p-6 border border-indigo-200/50">
          <h3 className="font-semibold text-slate-800 mb-3">Client Apps:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/70 p-4 rounded-2xl border border-slate-200/50">
              <p className="font-medium text-blue-600 mb-1">Student App</p>
              <p className="text-sm text-slate-600">Chat + escalation + history</p>
            </div>
            <div className="bg-white/70 p-4 rounded-2xl border border-slate-200/50">
              <p className="font-medium text-blue-600 mb-1">Admin App</p>
              <p className="text-sm text-slate-600">Escalation inbox + responses + FAQs + docs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">🚧 Upcoming Enhancements</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {upcoming.map((item, idx) => (
            <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition flex items-center gap-3">
              <div className="text-amber-600 flex-shrink-0">
                {item.icon}
              </div>
              <p className="text-slate-700 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-sm border-t border-slate-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl">🎓</span>
              <span className="text-2xl font-semibold text-slate-800">MyUNI</span>
            </div>
            <p className="text-slate-600 mb-2">A student-driven initiative to modernize campus communication.</p>
            <p className="text-sm text-slate-500">Made with ❤️ by Yogesh Goutam </p>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            <a
              href="https://github.com/YOGESHGOUTAM/MyUNI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition group"
            >
              <Github size={20} />
              <span className="text-sm font-medium">GitHub</span>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition" />
            </a>
            <a
              href="https://www.linkedin.com/in/yogesh-goutam-dtu/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition group"
            >
              <Linkedin size={20} />
              <span className="text-sm font-medium">LinkedIn</span>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition" />
            </a>
            <a
              href="mailto:yogeshgoutamm@gmail.com"
              className="flex items-center gap-2 text-slate-600 hover:text-green-600 transition group"
            >
              <Mail size={20} />
              <span className="text-sm font-medium">Email</span>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition" />
            </a>
          </div>

          <p className="text-center text-xs text-slate-400">
            MyUNI. Built to empower students with clarity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;