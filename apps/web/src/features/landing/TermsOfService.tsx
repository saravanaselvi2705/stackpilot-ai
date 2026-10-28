import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline, IoDocumentTextOutline } from 'react-icons/io5';
import SEO from '../../components/SEO';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans">
      <SEO
        title="Terms of Service – StackPilot AI"
        description="Read the Terms of Service for StackPilot AI. Understand your rights and responsibilities when using our enterprise platform."
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
            <IoDocumentTextOutline size={14} /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 mb-3">
            Terms of Service
          </h1>
          <p className="text-slate-500 text-sm">Last updated: August 28, 2026</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">1. Acceptance of Terms</h2>
            <p className="text-slate-600">
              By accessing or using StackPilot AI ("the Service"), operated by Creovix Stack, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">2. Description of Service</h2>
            <p className="text-slate-600">
              StackPilot AI is an enterprise business operations platform that provides:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 mt-3">
              <li>Client Relationship Management (CRM) tools</li>
              <li>Project and task management (Kanban boards, sprints)</li>
              <li>Automated billing and invoice management</li>
              <li>AI-powered document and specification generation</li>
              <li>SEO analytics and keyword tracking</li>
              <li>Team collaboration and calendar features</li>
              <li>Role-based access control and audit logging</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">3. Account Registration</h2>
            <p className="text-slate-600">
              To access StackPilot AI, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 mt-3">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">4. Acceptable Use</h2>
            <p className="text-slate-600 mb-3">You agree not to use StackPilot AI to:</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600">
              <li>Violate any applicable laws or regulations</li>
              <li>Transmit spam, unsolicited emails, or harmful code</li>
              <li>Attempt to gain unauthorized access to any portion of the platform</li>
              <li>Upload content that is illegal, offensive, or infringes on third-party rights</li>
              <li>Interfere with or disrupt the integrity or performance of the service</li>
              <li>Collect or harvest any personally identifiable information without consent</li>
              <li>Use the service for any fraudulent or deceptive purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">5. Subscription and Billing</h2>
            <p className="text-slate-600">
              StackPilot AI offers Free Trial, Professional, and Enterprise subscription tiers. By subscribing to a paid plan:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 mt-3">
              <li>You authorize us to charge the applicable subscription fees</li>
              <li>Subscription fees are non-refundable unless otherwise specified</li>
              <li>We reserve the right to modify pricing with 30 days advance notice</li>
              <li>Failure to pay may result in service suspension or termination</li>
              <li>Annual billing plans receive a 20% discount as advertised</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">6. Intellectual Property</h2>
            <p className="text-slate-600">
              The StackPilot AI platform, including its design, features, functionality, branding, and content, is and will remain the exclusive property of Creovix Stack. Our service is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-slate-600 mt-3">
              You retain ownership of all data and content you input into StackPilot AI. By using the service, you grant us a limited license to process and store your data solely for the purpose of providing the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">7. Data and Privacy</h2>
            <p className="text-slate-600">
              Your use of StackPilot AI is also governed by our <button onClick={() => navigate('/privacy-policy')} className="text-[#22C55E] hover:underline cursor-pointer">Privacy Policy</button>, which is incorporated into these Terms by reference. By using our service, you acknowledge and agree to the data practices described therein.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">8. Service Availability and Uptime</h2>
            <p className="text-slate-600">
              We strive to maintain 99.9% platform uptime. However, we do not guarantee uninterrupted, timely, or error-free service. Scheduled maintenance windows will be communicated in advance. We are not liable for any loss or damage resulting from service downtime or interruption.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">9. Termination</h2>
            <p className="text-slate-600">
              Either party may terminate these Terms at any time:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 mt-3">
              <li>You may cancel your account by contacting our support team</li>
              <li>We may suspend or terminate your access for violation of these Terms</li>
              <li>Upon termination, your right to use the service will immediately cease</li>
              <li>Data export requests should be submitted prior to account termination</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">10. Limitation of Liability</h2>
            <p className="text-slate-600">
              To the fullest extent permitted by applicable law, Creovix Stack shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, business, or goodwill, arising from or in connection with your use of StackPilot AI.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">11. Disclaimer of Warranties</h2>
            <p className="text-slate-600">
              StackPilot AI is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not warrant that the service will meet your specific requirements or that it will be free of errors or bugs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">12. Changes to Terms</h2>
            <p className="text-slate-600">
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes through the platform or via email. Your continued use of StackPilot AI after such changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">13. Contact Information</h2>
            <p className="text-slate-600">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-slate-700 space-y-1">
              <p><strong>Email:</strong> <a href="mailto:creovixstack@gmail.com" className="text-[#22C55E] hover:underline">creovixstack@gmail.com</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/918075995734" className="text-[#22C55E] hover:underline">+91 8075995734</a></p>
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

export default TermsOfService;
