import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoArrowBackOutline,
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
  IoServerOutline,
  IoPeopleOutline,
  IoKeyOutline,
  IoCloudOutline,
  IoMailOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';
import SEO from '../../components/SEO';

const securityPillars = [
  {
    icon: <IoLockClosedOutline size={28} />,
    title: 'Data Protection',
    items: [
      'All data transmitted over TLS/SSL encrypted connections',
      'MongoDB connections secured with authentication and network isolation',
      'Sensitive fields handled server-side only — never exposed in frontend code',
      'Environment variables used for all credentials and secrets',
      'No API keys or SMTP credentials stored in client-side code',
    ]
  },
  {
    icon: <IoPeopleOutline size={28} />,
    title: 'Access Control',
    items: [
      'Role-Based Access Control (RBAC) for all platform modules',
      'Super Admin, Admin, Manager, Member, and Viewer role tiers',
      'Module-level permission guards on CRM, Finance, PM, and SEO',
      'Safe deletion dialogs prevent accidental data loss',
      'Team invitation workflows with role assignment on onboarding',
    ]
  },
  {
    icon: <IoServerOutline size={28} />,
    title: 'Infrastructure Security',
    items: [
      'API protected by Helmet.js for secure HTTP headers',
      'Rate limiting (100 requests/15 min) to prevent brute-force attacks',
      'Input sanitization middleware on all incoming requests',
      'CORS configured to allow only whitelisted origins',
      'Docker-based isolated deployment environment',
    ]
  },
  {
    icon: <IoKeyOutline size={28} />,
    title: 'Authentication',
    items: [
      'JWT-based stateless authentication with secure token storage',
      'Password reset via one-time secure email tokens',
      'Token expiry and refresh mechanisms enforced',
      'Bcrypt password hashing with appropriate cost factor',
      'Session validation on every protected API endpoint',
    ]
  },
  {
    icon: <IoCloudOutline size={28} />,
    title: 'Data Handling',
    items: [
      'Business data stored in isolated organizational contexts',
      'Audit logs capture all create, update, and delete operations',
      'Audit records include actor, action, timestamp, and resource ID',
      'Data export available on request for account portability',
      'Soft deletion patterns preserve audit trails',
    ]
  },
  {
    icon: <IoShieldCheckmarkOutline size={28} />,
    title: 'Security Practices',
    items: [
      'Centralized error handler prevents stack trace leakage',
      'API responses avoid exposing internal implementation details',
      'File uploads validated server-side for type and size',
      'Regular dependency review and updates',
      'Security-aware development practices across all modules',
    ]
  },
];

const SecurityCenter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans">
      <SEO
        title="Security Center – StackPilot AI"
        description="Learn how StackPilot AI protects your business data with enterprise-grade security practices, access controls, and infrastructure hardening."
      />

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#22C55E] to-emerald-600 flex items-center justify-center font-display font-black text-white text-lg shadow-md shadow-[#22C55E]/20">
            S
          </div>
          <span className="font-display font-black text-xl tracking-tight text-slate-900 select-none">
            StackPilot<span className="text-xs font-bold text-[#22C55E] align-super ml-0.5">AI</span>
          </span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#22C55E] transition-colors cursor-pointer"
        >
          <IoArrowBackOutline size={18} /> Back to Home
        </button>
      </header>

      <main className="pt-28 pb-24 px-6 max-w-6xl mx-auto">
        {/* Hero */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#22C55E] mb-4">
            <IoShieldCheckmarkOutline size={14} /> Security Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 mb-4">
            Enterprise-Grade Security for Your Business Data
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            StackPilot AI is built with a security-first approach. Every layer of the platform — from authentication and data storage to API access and deployment — is designed to protect your business information.
          </p>
        </div>

        {/* Security commitment banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-8 mb-16 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] flex-shrink-0">
            <IoShieldCheckmarkOutline size={32} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white mb-2">Our Security Commitment</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We are committed to protecting the confidentiality, integrity, and availability of all business data entrusted to StackPilot AI. Security is not an afterthought — it is embedded into every decision we make about platform architecture, feature development, and operations.
            </p>
          </div>
        </div>

        {/* Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {securityPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#22C55E] flex items-center justify-center mb-4">
                {pillar.icon}
              </div>
              <h3 className="text-base font-black text-slate-900 mb-3">{pillar.title}</h3>
              <ul className="space-y-2">
                {pillar.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                    <IoCheckmarkCircle size={14} className="text-[#22C55E] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Transparency note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-3">
            <IoAlertCircleOutline size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-amber-800 mb-1">Transparency Notice</h3>
              <p className="text-xs text-amber-700 leading-relaxed">
                StackPilot AI is built and maintained by Creovix Stack as an enterprise-grade SaaS platform. We present our implemented security practices honestly. We do not make claims about formal third-party certifications (e.g., SOC 2, ISO 27001) unless they have been formally achieved and audited. Our security practices are continuously reviewed and improved as the platform evolves.
              </p>
            </div>
          </div>
        </div>

        {/* Report a vulnerability */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 md:p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] mb-4">
            <IoMailOutline size={26} />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Report a Security Concern</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6 leading-relaxed">
            If you discover a potential security vulnerability or have a concern about data handling, please contact us directly. We take all security reports seriously and will respond promptly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:creovixstack@gmail.com?subject=Security%20Concern%20-%20StackPilot%20AI"
              className="px-6 py-3 rounded-xl bg-[#22C55E] hover:bg-[#1db053] text-white text-sm font-bold shadow-lg shadow-[#22C55E]/20 transition-all inline-flex items-center gap-2"
            >
              <IoMailOutline size={16} /> Report via Email
            </a>
            <a
              href="https://wa.me/918075995734?text=Security%20concern%20regarding%20StackPilot%20AI"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold border border-slate-700 transition-all inline-flex items-center gap-2"
            >
              Contact via WhatsApp
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} StackPilot AI. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
            <button onClick={() => navigate('/terms-of-service')} className="hover:text-white transition-colors cursor-pointer">Terms</button>
            <button onClick={() => navigate('/security')} className="hover:text-white transition-colors cursor-pointer">Security</button>
          </div>
          <div className="font-bold text-slate-400">
            Powered by{' '}
            <a href="https://creovix-website.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline">
              Creovix Stack
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SecurityCenter;
