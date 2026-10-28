import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import SEO from '../../components/SEO';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans">
      <SEO
        title="Privacy Policy – StackPilot AI"
        description="Read StackPilot AI's Privacy Policy to understand how we collect, use, and protect your personal data."
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

      <main className="pt-28 pb-24 px-6 max-w-4xl mx-auto">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#22C55E] mb-4">
            <IoShieldCheckmarkOutline size={14} /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm">Last updated: August 28, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-10 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">1. Introduction</h2>
            <p className="text-slate-600">
              StackPilot AI ("we," "us," or "our"), operated by Creovix Stack, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at stackpilot.ai and related services.
            </p>
            <p className="text-slate-600 mt-3">
              By accessing or using StackPilot AI, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">2. Information We Collect</h2>
            <h3 className="text-base font-bold text-slate-800 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 mb-4">
              <li>Account registration details (name, email, company name, phone number)</li>
              <li>Profile information and preferences</li>
              <li>Business data you input (CRM contacts, project details, invoices, tasks)</li>
              <li>Communications with our support team</li>
              <li>Presentation deck requests and enquiry form submissions</li>
            </ul>
            <h3 className="text-base font-bold text-slate-800 mb-2">2.2 Information Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600">
              <li>Device information (browser type, operating system)</li>
              <li>IP address and general geographic location</li>
              <li>Usage analytics (pages visited, features used, session duration)</li>
              <li>Log data and error reports</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600">
              <li>To provide, operate, and maintain StackPilot AI services</li>
              <li>To process your registration and manage your account</li>
              <li>To send you requested product information and presentation decks</li>
              <li>To respond to support inquiries and technical issues</li>
              <li>To improve platform performance and user experience</li>
              <li>To send transactional emails related to your account activity</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">4. Data Sharing and Disclosure</h2>
            <p className="text-slate-600 mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share data in limited circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600">
              <li><strong>Service Providers:</strong> Trusted third parties that assist in operating our platform (e.g., cloud hosting, email delivery) under strict confidentiality agreements</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
              <li><strong>Protection of Rights:</strong> To protect the rights, property, or safety of StackPilot AI, our users, or others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">5. Data Security</h2>
            <p className="text-slate-600">
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 mt-3">
              <li>Encrypted database connections (TLS/SSL)</li>
              <li>Role-based access control (RBAC) within the platform</li>
              <li>Activity audit logging for all sensitive operations</li>
              <li>Regular security assessments</li>
              <li>Secure SMTP configuration for email communications</li>
            </ul>
            <p className="text-slate-600 mt-3">
              No method of data transmission over the internet is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">6. Data Retention</h2>
            <p className="text-slate-600">
              We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting us at <a href="mailto:creovixstack@gmail.com" className="text-[#22C55E] hover:underline">creovixstack@gmail.com</a>. We will process such requests subject to any legal retention obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">7. Your Rights</h2>
            <p className="text-slate-600 mb-3">Depending on your jurisdiction, you may have rights to:</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your personal data</li>
              <li>Restrict or object to certain processing activities</li>
              <li>Receive your data in a portable format</li>
            </ul>
            <p className="text-slate-600 mt-3">
              To exercise any of these rights, contact us at <a href="mailto:creovixstack@gmail.com" className="text-[#22C55E] hover:underline">creovixstack@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">8. Cookies</h2>
            <p className="text-slate-600">
              StackPilot AI uses cookies and similar tracking technologies to maintain session state, remember user preferences, and analyze platform usage. You can control cookie settings through your browser settings. Disabling cookies may affect platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">9. Changes to This Policy</h2>
            <p className="text-slate-600">
              We may update this Privacy Policy periodically. We will notify you of significant changes by updating the "Last updated" date and, where appropriate, by sending an email notification. Continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">10. Contact Us</h2>
            <p className="text-slate-600">
              For any questions, concerns, or requests related to this Privacy Policy, contact Creovix Stack at:
            </p>
            <div className="mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-slate-700 space-y-1">
              <p><strong>Email:</strong> <a href="mailto:creovixstack@gmail.com" className="text-[#22C55E] hover:underline">creovixstack@gmail.com</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/918075995734" className="text-[#22C55E] hover:underline">+91 8075995734</a></p>
              <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/creovixstack" target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline">linkedin.com/in/creovixstack</a></p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-sm">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
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

export default PrivacyPolicy;
