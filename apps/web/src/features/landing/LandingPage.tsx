import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
import API from '../../services/api';
import { 
  IoSparklesSharp, 
  IoArrowForwardOutline, 
  IoCheckmarkCircle, 
  IoLayersOutline, 
  IoChevronDownOutline, 
  IoChevronUpOutline,
  IoPeopleOutline,
  IoListOutline,
  IoCashOutline,
  IoDocumentTextOutline,
  IoStatsChartOutline,
  IoCalendarOutline,
  IoFlashOutline,
  IoShieldCheckmarkOutline,
  IoCloseOutline,
  IoMailOutline,
  IoCallOutline,
  IoBriefcaseOutline,
  IoRibbonOutline,
  IoDesktopOutline,
  IoSearchOutline
} from 'react-icons/io5';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Modals state
  const [isStartFreeOpen, setIsStartFreeOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'crm' | 'pm' | 'finance' | 'seo'>('pm');

  // Billing toggle
  const [isAnnual, setIsAnnual] = useState(true);

  // FAQ toggle
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Form states
  const [startFreeData, setStartFreeData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    businessType: 'Technology / Software',
    employees: '10-50',
    message: ''
  });
  const [startFreeSuccess, setStartFreeSuccess] = useState(false);
  const [startFreeLoading, setStartFreeLoading] = useState(false);

  const [presData, setPresData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: ''
  });
  const [presSuccess, setPresSuccess] = useState(false);
  const [presLoading, setPresLoading] = useState(false);

  const handleStartFreeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartFreeLoading(true);
    try {
      await API.enquiries.create(startFreeData);
      setStartFreeSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setStartFreeLoading(false);
    }
  };

  const handlePresSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPresLoading(true);
    try {
      await API.presentationRequests.create(presData);
      setPresSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setPresLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans selection:bg-[#22C55E]/30 relative overflow-x-hidden">
      {/* Dynamic SEO Tags & Structured Data */}
      <SEO 
        title="StackPilot AI - Streamline Workflows & Scale Business Operations with AI"
        description="Unified enterprise platform connecting CRM, Project Management, Automated Billing, SEO Tracking, and AI Productivity. Powered by Creovix.Stack."
      />

      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#22C55E]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#22C55E] to-emerald-600 flex items-center justify-center font-display font-black text-white text-lg shadow-md shadow-[#22C55E]/20">
            S
          </div>
          <span className="font-display font-black text-xl tracking-tight text-slate-900 select-none">
            StackPilot<span className="text-xs font-bold text-[#22C55E] align-super ml-0.5">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-[#22C55E] transition-colors">Features</a>
          <a href="#why-us" className="hover:text-[#22C55E] transition-colors">Why StackPilot</a>
          <a href="#presentation" className="hover:text-[#22C55E] transition-colors">Product PPT</a>
          <a href="#pricing" className="hover:text-[#22C55E] transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-[#22C55E] transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-slate-700 hover:text-[#22C55E] cursor-pointer"
          >
            Log In
          </button>
          <button 
            onClick={() => { setStartFreeSuccess(false); setIsStartFreeOpen(true); }}
            className="px-5 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-white text-sm font-bold shadow-md shadow-[#22C55E]/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            Start Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#22C55E] mb-6 shadow-sm"
        >
          <IoSparklesSharp size={14} className="animate-pulse" />
          <span>AI-Powered Enterprise Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-slate-900 mb-6 leading-[1.1] max-w-5xl"
        >
          Streamline Workflows, Manage Projects & Scale Operations with AI
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-3xl mb-10 leading-relaxed font-normal"
        >
          StackPilot AI brings your entire business together in one easy-to-use workspace. Manage customer pipelines, track project sprints, automate billing, generate documents, and monitor growth without switching between multiple complex tools.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <button 
            onClick={() => { setStartFreeSuccess(false); setIsStartFreeOpen(true); }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-white font-bold text-base shadow-lg shadow-[#22C55E]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Start Free Trial <IoArrowForwardOutline size={18} />
          </button>
          <button 
            onClick={() => { setPresSuccess(false); setIsPresentationOpen(true); }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border-2 border-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <IoDesktopOutline size={18} className="text-[#22C55E]" /> Schedule Demo
          </button>
        </motion.div>

        {/* Live Interactive Product Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-2xl text-left overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400 font-semibold">stackpilot.ai/workspace/live</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => setActivePreviewTab('pm')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activePreviewTab === 'pm' ? 'bg-[#22C55E] text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Project Kanban
              </button>
              <button 
                onClick={() => setActivePreviewTab('crm')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activePreviewTab === 'crm' ? 'bg-[#22C55E] text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Client CRM
              </button>
              <button 
                onClick={() => setActivePreviewTab('finance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activePreviewTab === 'finance' ? 'bg-[#22C55E] text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Billing Hub
              </button>
              <button 
                onClick={() => setActivePreviewTab('seo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activePreviewTab === 'seo' ? 'bg-[#22C55E] text-white' : 'text-slate-400 hover:text-white'}`}
              >
                SEO Analytics
              </button>
            </div>
          </div>

          {/* Dynamic Mockup Body */}
          <div className="min-h-[300px] p-4 bg-slate-950 rounded-2xl border border-slate-850/60">
            {activePreviewTab === 'pm' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>To Do</span>
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">3</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-white space-y-2">
                    <span className="text-[10px] text-[#22C55E] font-bold uppercase tracking-wider">Frontend</span>
                    <h4 className="text-xs font-bold">Implement Dark/Light Theme Persistence</h4>
                    <p className="text-[11px] text-slate-400">Save theme settings to localStorage and update root HTML element.</p>
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl space-y-3">
                  <div className="flex justify-between text-xs font-bold text-amber-400 uppercase">
                    <span>In Progress</span>
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">2</span>
                  </div>
                  <div className="bg-slate-900 border border-amber-500/30 p-3 rounded-lg text-white space-y-2">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">AI Assistant</span>
                    <h4 className="text-xs font-bold">Generate Enterprise SRS Document</h4>
                    <p className="text-[11px] text-slate-400">Auto-create requirements specification for client onboarding.</p>
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl space-y-3">
                  <div className="flex justify-between text-xs font-bold text-[#22C55E] uppercase">
                    <span>Completed</span>
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">8</span>
                  </div>
                  <div className="bg-slate-900 border border-emerald-500/30 p-3 rounded-lg text-white space-y-2">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Security</span>
                    <h4 className="text-xs font-bold">Super Admin Role-Based Access</h4>
                    <p className="text-[11px] text-slate-400">Audit log tracking and safe deletion dialogs integrated.</p>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'crm' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold border-b border-slate-800 pb-2">
                  <span>Client Name & Company</span>
                  <span>Deal Status</span>
                  <span>Pipeline Value</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <h4 className="font-bold text-white">Acme Global Corporation</h4>
                    <span className="text-slate-400 text-[10px]">contact@acmeglobal.com</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[#22C55E] font-bold text-[10px]">Active Contract</span>
                  <span className="font-black text-white">$120,000</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <h4 className="font-bold text-white">Vortex Software Labs</h4>
                    <span className="text-slate-400 text-[10px]">sales@vortexlabs.io</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px]">Negotiation</span>
                  <span className="font-black text-white">$45,000</span>
                </div>
              </div>
            )}

            {activePreviewTab === 'finance' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Total Revenue</span>
                  <h3 className="text-2xl font-black text-white mt-1">$248,500</h3>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Pending Invoices</span>
                  <h3 className="text-2xl font-black text-amber-400 mt-1">$32,100</h3>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Paid Invoices</span>
                  <h3 className="text-2xl font-black text-[#22C55E] mt-1">100% On-Time</h3>
                </div>
              </div>
            )}

            {activePreviewTab === 'seo' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Health Score</span>
                    <h4 className="text-xl font-black text-[#22C55E]">98 / 100</h4>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Search Clicks</span>
                    <h4 className="text-xl font-black text-white">48,200</h4>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Rank</span>
                    <h4 className="text-xl font-black text-white">#3.2</h4>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">JSON-LD Schema</span>
                    <h4 className="text-xl font-black text-emerald-400">Verified</h4>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Social Proof Counter */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-black text-slate-900">99.9%</h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Platform Uptime</p>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#22C55E]">10k+</h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Active Teams</p>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">5M+</h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Tasks Completed</p>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#22C55E]">100%</h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Data Security</p>
          </div>
        </div>
      </section>

      {/* Product Information Section */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#22C55E] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Integrated Enterprise Platform
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-display text-slate-900 mt-4 tracking-tight">
            Everything Your Business Needs in One Place
          </h2>
          <p className="text-slate-600 text-base md:text-lg mt-4 leading-relaxed">
            Forget paying for separate CRM, task tracking, invoicing, and documentation apps. StackPilot AI connects all core operations into a unified, easy-to-understand system.
          </p>
        </div>

        {/* 10 Core Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#22C55E] flex items-center justify-center mb-4">
              <IoPeopleOutline size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">1. Client CRM</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track leads, customer details, deal pipelines, and contract values with easy visual stages.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#22C55E] flex items-center justify-center mb-4">
              <IoLayersOutline size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">2. Project Management</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Organize projects with start and end dates, team assignment, budget tracking, and status health scores.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#22C55E] flex items-center justify-center mb-4">
              <IoListOutline size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">3. Task Boards</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Drag-and-drop Kanban task boards with priorities, subtasks, checklists, and time estimates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#22C55E] flex items-center justify-center mb-4">
              <IoCashOutline size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">4. Automated Billing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Create professional client invoices, calculate tax & discounts automatically, and monitor payment statuses.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#22C55E] flex items-center justify-center mb-4">
              <IoSparklesSharp size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">5. AI Assistant Workspace</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generate project requirement specifications, bug reports, and software test plans instantly with built-in AI.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#22C55E] flex items-center justify-center mb-4">
              <IoSearchOutline size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">6. SEO Workspace</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Audit site health, monitor keyword search positions, and track competitors' digital visibility.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#22C55E] flex items-center justify-center mb-4">
              <IoStatsChartOutline size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">7. Reports & Analytics</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Gain instant clarity into team productivity, project profitability, and revenue analytics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#22C55E] flex items-center justify-center mb-4">
              <IoDocumentTextOutline size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">8. Document Management</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Centralized document repository with version history tracking for specifications, contracts, and notes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#22C55E] flex items-center justify-center mb-4">
              <IoCalendarOutline size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">9. Calendar & Meetings</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Schedule team syncs, client calls, and project milestones directly on an integrated calendar.
            </p>
          </div>
        </div>
      </section>

      {/* Why StackPilot Section */}
      <section id="why-us" className="py-20 bg-slate-50 border-y border-slate-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#22C55E] uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200">
              Why Business Leaders Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display text-slate-900 mt-4 tracking-tight">
              Designed for Growth, Built for Enterprise Security
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <IoBriefcaseOutline size={28} className="text-[#22C55E] mb-3" />
              <h4 className="text-base font-black text-slate-900 mb-1">All-in-One Platform</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Eliminate app-switching fatigue and keep team data unified.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <IoFlashOutline size={28} className="text-[#22C55E] mb-3" />
              <h4 className="text-base font-black text-slate-900 mb-1">AI Operations</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Automate specifications and task creation with embedded AI.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <IoShieldCheckmarkOutline size={28} className="text-[#22C55E] mb-3" />
              <h4 className="text-base font-black text-slate-900 mb-1">Enterprise Security</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Super Admin deletion safeguards and complete activity audit logging.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <IoRibbonOutline size={28} className="text-[#22C55E] mb-3" />
              <h4 className="text-base font-black text-slate-900 mb-1">Higher Productivity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Teams complete projects 40% faster with automated workflows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Presentation Request Section */}
      <section id="presentation" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 space-y-4">
            <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Product Overview Deck
            </span>
            <h3 className="text-2xl md:text-4xl font-black font-display tracking-tight text-white">
              StackPilot AI Product Presentation (PPT)
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore our complete architecture slides, feature breakdown, and enterprise deployment options in our official presentation deck.
            </p>
            <button 
              onClick={() => { setPresSuccess(false); setIsPresentationOpen(true); }}
              className="mt-2 px-6 py-3 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-white font-bold text-sm shadow-lg shadow-[#22C55E]/20 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <IoDesktopOutline size={18} /> Request Presentation
            </button>
          </div>

          <div className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <IoRibbonOutline size={32} />
            </div>
            <h4 className="text-base font-bold text-white">Enterprise Deck v1.0.1</h4>
            <p className="text-xs text-slate-400">Includes system architecture, module workflows, and client case studies.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#22C55E] uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200">
              Transparent Pricing
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display text-slate-900 mt-4 tracking-tight">
              Simple Plans for Teams of All Sizes
            </h2>

            {/* Monthly / Annual Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${!isAnnual ? 'bg-[#22C55E] text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Monthly Billing
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${isAnnual ? 'bg-[#22C55E] text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Annual Billing <span className="bg-emerald-100 text-[#22C55E] text-[10px] px-2 py-0.5 rounded-full font-black">20% Off</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Trial */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Free Trial</h3>
                <p className="text-xs text-slate-500 mt-1">Perfect for evaluating StackPilot AI with core features.</p>
                <div className="my-6">
                  <span className="text-4xl font-black text-slate-900">$0</span>
                  <span className="text-xs text-slate-500 font-semibold"> / 14 days</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> Up to 5 Team Members</li>
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> 3 Active Projects</li>
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> Basic CRM & Task Kanban</li>
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> AI Workspace Preview</li>
                </ul>
              </div>
              <button 
                onClick={() => { setStartFreeSuccess(false); setIsStartFreeOpen(true); }}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Start Free Trial
              </button>
            </div>

            {/* Professional (Highlighted) */}
            <div className="bg-white rounded-3xl border-2 border-[#22C55E] p-8 shadow-xl flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#22C55E] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Professional</h3>
                <p className="text-xs text-slate-500 mt-1">Ideal for growing companies requiring complete module integration.</p>
                <div className="my-6">
                  <span className="text-4xl font-black text-slate-900">{isAnnual ? '$29' : '$36'}</span>
                  <span className="text-xs text-slate-500 font-semibold"> / month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> Unlimited Team Members</li>
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> Unlimited Projects & Tasks</li>
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> Client CRM & Invoicing</li>
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> AI Spec Generator</li>
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> SEO & Keyword Tracker</li>
                </ul>
              </div>
              <button 
                onClick={() => { setStartFreeSuccess(false); setIsStartFreeOpen(true); }}
                className="w-full py-3.5 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-white text-xs font-bold shadow-md shadow-[#22C55E]/20 transition-all cursor-pointer"
              >
                Get Started Now
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Enterprise</h3>
                <p className="text-xs text-slate-500 mt-1">Custom deployment with dedicated support and SLA compliance.</p>
                <div className="my-6">
                  <span className="text-4xl font-black text-slate-900">Custom</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> Custom Role Permissions (RBAC)</li>
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> Dedicated Account Manager</li>
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> Custom Domain Branding</li>
                  <li className="flex items-center gap-2"><IoCheckmarkCircle className="text-[#22C55E]" size={16} /> Audit Log Export API</li>
                </ul>
              </div>
              <button 
                onClick={() => { setPresSuccess(false); setIsPresentationOpen(true); }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[#22C55E] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-display text-slate-900 mt-4 tracking-tight">
            Got Questions? We Have Answers.
          </h2>
        </div>

        <div className="space-y-4">
          {[
            { q: "What makes StackPilot AI different from standard project management tools?", a: "StackPilot AI combines CRM, project boards, automated billing, document generation, and SEO intelligence into a single integrated platform. You do not need to purchase multiple software subscriptions." },
            { q: "Can non-technical team members use StackPilot AI easily?", a: "Yes! StackPilot AI features a clean, intuitive interface designed for managers, marketers, analysts, and business owners without any complex coding required." },
            { q: "Is my business data secure?", a: "Absolutetly. StackPilot AI uses enterprise-grade role-based access controls, automatic audit logging, and encrypted database connections to keep your business records safe." },
            { q: "How can I request a live demo or presentation deck?", a: "Simply click the 'Request Presentation' or 'Schedule Demo' button on this page. Our team will contact you directly to share details." },
            { q: "Who provides support for StackPilot AI?", a: "StackPilot AI is powered and supported by Creovix.Stack. You can reach out directly via email at creovixstack@gmail.com." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-base cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <span>{item.q}</span>
                {faqOpen === idx ? <IoChevronUpOutline className="text-[#22C55E]" size={20} /> : <IoChevronDownOutline className="text-slate-400" size={20} />}
              </button>
              {faqOpen === idx && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-[#22C55E] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight">
              Ready to Transform Your Business Operations?
            </h2>
            <p className="text-emerald-50 text-base md:text-lg">
              Join thousands of forward-thinking teams streamlining their CRM, projects, billing, and productivity today.
            </p>
            <button 
              onClick={() => { setStartFreeSuccess(false); setIsStartFreeOpen(true); }}
              className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-base shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              Start Your Free Trial Now <IoArrowForwardOutline size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 text-sm">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E] flex items-center justify-center font-black text-white text-lg">S</div>
              <span className="font-display font-black text-xl text-white">StackPilot AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The unified AI business operations platform for CRM, project management, automated billing, and team collaboration.
            </p>
            <div className="text-xs font-semibold text-slate-300">
              Support Email: <a href="mailto:creovixstack@gmail.com" className="text-[#22C55E] hover:underline">creovixstack@gmail.com</a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="#presentation" className="hover:text-white">Product Deck</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#security" className="hover:text-white">Security Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" className="hover:text-white">About Us</a></li>
              <li><a href="#contact" className="hover:text-white">Contact Sales</a></li>
              <li><a href="mailto:creovixstack@gmail.com" className="hover:text-white">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>© {new Date().getFullYear()} StackPilot AI. All rights reserved.</div>
          <div className="mt-2 sm:mt-0 font-bold text-slate-400">
            Powered by <span className="text-[#22C55E]">Creovix.Stack</span>
          </div>
        </div>
      </footer>

      {/* Start Free Lead Capture Modal */}
      <AnimatePresence>
        {isStartFreeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsStartFreeOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <IoCloseOutline size={24} />
              </button>

              {startFreeSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-[#22C55E] flex items-center justify-center">
                    <IoCheckmarkCircle size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Thank You!</h3>
                  <p className="text-sm text-slate-600">
                    Our team will contact you shortly to set up your StackPilot AI workspace.
                  </p>
                  <button 
                    onClick={() => setIsStartFreeOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#22C55E] text-white font-bold text-xs shadow-md"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-slate-900">Start Free Trial</h3>
                    <p className="text-xs text-slate-500 mt-1">Get immediate access to StackPilot AI for your team.</p>
                  </div>

                  <form onSubmit={handleStartFreeSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="John Doe" 
                        value={startFreeData.name}
                        onChange={(e) => setStartFreeData({ ...startFreeData, name: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Acme Corp" 
                          value={startFreeData.companyName}
                          onChange={(e) => setStartFreeData({ ...startFreeData, companyName: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Business Email</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="john@acme.com" 
                          value={startFreeData.email}
                          onChange={(e) => setStartFreeData({ ...startFreeData, email: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="+1 (555) 000-0000" 
                          value={startFreeData.phone}
                          onChange={(e) => setStartFreeData({ ...startFreeData, phone: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Employees</label>
                        <select 
                          value={startFreeData.employees}
                          onChange={(e) => setStartFreeData({ ...startFreeData, employees: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
                        >
                          <option>1-10</option>
                          <option>10-50</option>
                          <option>50-200</option>
                          <option>200+</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Requirements / Message</label>
                      <textarea 
                        rows={2} 
                        placeholder="Tell us about your team size and operational goals..."
                        value={startFreeData.message}
                        onChange={(e) => setStartFreeData({ ...startFreeData, message: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={startFreeLoading}
                      className="w-full py-3 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-white font-bold text-xs shadow-md shadow-[#22C55E]/20 transition-all cursor-pointer mt-2"
                    >
                      {startFreeLoading ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Presentation Request Modal */}
      <AnimatePresence>
        {isPresentationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full shadow-2xl relative text-left"
            >
              <button 
                onClick={() => setIsPresentationOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <IoCloseOutline size={24} />
              </button>

              {presSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-[#22C55E] flex items-center justify-center">
                    <IoCheckmarkCircle size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Request Received!</h3>
                  <p className="text-sm text-slate-600">
                    Thank you! Our enterprise sales team will review your details and send the StackPilot AI Presentation Deck to your email.
                  </p>
                  <button 
                    onClick={() => setIsPresentationOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#22C55E] text-white font-bold text-xs shadow-md"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-slate-900">Request Presentation</h3>
                    <p className="text-xs text-slate-500 mt-1">Receive the official StackPilot AI overview deck directly.</p>
                  </div>

                  <form onSubmit={handlePresSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="John Doe" 
                        value={presData.name}
                        onChange={(e) => setPresData({ ...presData, name: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Acme Corp" 
                        value={presData.companyName}
                        onChange={(e) => setPresData({ ...presData, companyName: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Business Email</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="john@acme.com" 
                        value={presData.email}
                        onChange={(e) => setPresData({ ...presData, email: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+1 (555) 000-0000" 
                        value={presData.phone}
                        onChange={(e) => setPresData({ ...presData, phone: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={presLoading}
                      className="w-full py-3 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-white font-bold text-xs shadow-md shadow-[#22C55E]/20 transition-all cursor-pointer mt-2"
                    >
                      {presLoading ? 'Submitting...' : 'Request Presentation Deck'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
