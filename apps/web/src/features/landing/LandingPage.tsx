import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IoSparklesSharp, 
  IoArrowForwardOutline, 
  IoCheckmarkCircle, 
  IoLayersOutline, 
  IoChevronDownOutline, 
  IoChevronUpOutline,
  IoLogoTwitter,
  IoLogoGithub,
  IoLogoLinkedin
} from 'react-icons/io5';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans selection:bg-[#22C55E]/30 relative overflow-x-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#22C55E]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Header navbar */}
      <header className="fixed top-0 inset-x-0 z-50 glass-dark border-b border-slate-800/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#22C55E] to-emerald-600 flex items-center justify-center font-display font-black text-slate-950 shadow-md shadow-[#22C55E]/10">
            S
          </div>
          <span className="font-display font-black text-lg tracking-wider text-white select-none">
            StackPilot<span className="text-xs font-bold text-[#22C55E] align-super ml-0.5">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-slate-300 hover:text-white cursor-pointer"
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-4 py-2 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-white text-sm font-bold shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            Start Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto flex flex-col items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-[#22C55E] mb-6"
        >
          <IoSparklesSharp size={12} className="animate-pulse" />
          <span>Simple and Powerful Operations Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black font-display tracking-tight text-white mb-6 leading-[1.1] max-w-4xl"
        >
          Manage Your Projects and Clients in One Place
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mb-10 leading-relaxed"
        >
          A simple tool to track projects, manage clients, collaborate with your team, write documents, and run your business.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <button 
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-white font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Start Free <IoArrowForwardOutline size={16} />
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#111827] font-bold border border-[#22C55E] active:scale-[0.98] transition-all cursor-pointer"
          >
            Book a Demo
          </button>
        </motion.div>

        {/* Dashboard Preview Frame */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', duration: 0.8 }}
          className="w-full relative glass rounded-2xl border border-slate-800/80 p-2 shadow-2xl bg-slate-900/10"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10" />
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0F172A]">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" 
              alt="Dashboard Preview" 
              className="w-full h-auto opacity-80"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-4">Everything You Need in One Tool</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">No need to pay for multiple services. StackPilot brings your clients, tasks, documents, and reports together.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-2xl border border-slate-800 hover:border-[#22C55E]/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] mb-6">
              <IoLayersOutline size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Client Manager</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Keep track of your clients, project details, and client notes in one simple place.</p>
          </div>

          <div className="glass p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#22C55E] mb-6">
              <IoLayersOutline size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Task Board</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Work with your team, assign tasks, and set due dates on a simple task board.</p>
          </div>

          <div className="glass p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
              <IoSparklesSharp size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Project Planner</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Use AI to instantly write project requirements, test plans, and client emails.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-4">Simple Pricing</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Choose the plan that fits your business. Start free or upgrade for more features.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="glass p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Free Plan</h3>
              <p className="text-xs text-slate-400 mb-6">Great for small teams starting out.</p>
              <div className="text-4xl font-black font-display text-white mb-6">$0 <span className="text-sm font-semibold text-slate-500">/ forever</span></div>
              <ul className="space-y-3 mb-8">
                {['Client Manager', 'Task Board', 'AI Project Planner (5 runs/mo)', 'Alerts'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <IoCheckmarkCircle size={16} className="text-[#22C55E] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-3 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-white font-bold transition-all cursor-pointer text-center"
            >
              Sign Up Free
            </button>
          </div>

          {/* Premium Plan */}
          <div className="glass p-8 rounded-2xl border border-[#22C55E]/30 flex flex-col justify-between relative">
            <div className="absolute top-4 right-4 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 rounded-full px-2.5 py-0.5 text-[10px] font-bold">POPULAR</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Business Plan</h3>
              <p className="text-xs text-slate-400 mb-6">For growing teams who need more options.</p>
              <div className="text-4xl font-black font-display text-white mb-6">$29 <span className="text-sm font-semibold text-slate-500">/ user / mo</span></div>
              <ul className="space-y-3 mb-8">
                {['Unlimited Clients', 'Project Timelines', 'Unlimited AI Project Planner', 'Google Analytics integration', 'Billing & PDF Invoices'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <IoCheckmarkCircle size={16} className="text-[#22C55E] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-3 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-white font-bold transition-all cursor-pointer text-center"
            >
              Choose Plan
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="glass p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Enterprise Plan</h3>
              <p className="text-xs text-slate-400 mb-6">Full suite for large businesses with custom needs.</p>
              <div className="text-4xl font-black font-display text-white mb-6">Custom <span className="text-sm font-semibold text-slate-500">pricing</span></div>
              <ul className="space-y-3 mb-8">
                {['Everything in Business', 'Custom integrations', 'Dedicated support', 'Unlimited members'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <IoCheckmarkCircle size={16} className="text-[#22C55E] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-50 text-[#111827] font-bold border border-[#22C55E] transition-all cursor-pointer text-center"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {[
            { q: 'Is StackPilot AI compatible with other team planners?', a: 'Yes. You can import your tasks and clients from other tools using CSV files.' },
            { q: 'How does the AI Project Planner work?', a: 'It takes your project description and creates a clear list of requirements and plans for your team.' },
            { q: 'Can I download invoices?', a: 'Yes. You can create invoices, calculate taxes, and download them as PDF files.' }
          ].map((item, idx) => (
            <div key={idx} className="glass rounded-xl border border-slate-800 overflow-hidden">
              <button 
                onClick={() => toggleFaq(idx)}
                className="flex items-center justify-between w-full p-5 text-left font-bold text-sm text-slate-200 hover:text-white cursor-pointer"
              >
                <span>{item.q}</span>
                {faqOpen === idx ? <IoChevronUpOutline size={16} className="text-slate-400" /> : <IoChevronDownOutline size={16} className="text-slate-400" />}
              </button>
              {faqOpen === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 max-w-xl mx-auto relative z-10">
        <div className="glass p-8 rounded-3xl border border-slate-850">
          <h2 className="text-2xl font-bold font-display text-white mb-2 text-center">Get in Touch</h2>
          <p className="text-xs text-slate-400 mb-8 text-center">Have questions? Send us a message.</p>
          
          <form onSubmit={e => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Full Name</label>
              <input type="text" className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500/50" placeholder="Alexander Wright" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Email Address</label>
              <input type="email" className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500/50" placeholder="alex@stackpilot.ai" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Message</label>
              <textarea rows={4} className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500/50 resize-none" placeholder="How can we help you?" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-white font-bold shadow-md cursor-pointer text-xs">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/40 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center font-display font-black text-[10px] text-slate-950">
              S
            </div>
            <span className="font-display font-black text-sm text-slate-200">StackPilot AI</span>
          </div>

          <div className="text-xs text-slate-500">
            © 2026 StackPilot AI Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-slate-455">
            <IoLogoTwitter size={18} className="cursor-pointer hover:text-white" />
            <IoLogoGithub size={18} className="cursor-pointer hover:text-white" />
            <IoLogoLinkedin size={18} className="cursor-pointer hover:text-white" />
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
