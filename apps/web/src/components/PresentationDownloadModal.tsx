import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoCloseOutline,
  IoDownloadOutline,
  IoDesktopOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoSparklesOutline
} from 'react-icons/io5';
import API from '../services/api';

interface PresentationDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
  initialEmail?: string;
  initialCompany?: string;
}

export const PresentationDownloadModal: React.FC<PresentationDownloadModalProps> = ({
  isOpen,
  onClose,
  initialName = '',
  initialEmail = '',
  initialCompany = ''
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [companyName, setCompanyName] = useState(initialCompany);
  const [phone, setPhone] = useState('');
  const [format, setFormat] = useState<'pptx' | 'pdf'>('pptx');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialName && !name) setName(initialName);
      if (initialEmail && !email) setEmail(initialEmail);
      if (initialCompany && !companyName) setCompanyName(initialCompany);
      setError('');
    }
  }, [isOpen, initialName, initialEmail, initialCompany]);

  const triggerDirectDownload = (selectedFormat: 'pptx' | 'pdf' = format) => {
    const filename = selectedFormat === 'pdf' ? 'StackPilot-AI-Enterprise-Deck.pdf' : 'StackPilot-AI-Enterprise-Deck.pptx';
    const link = document.createElement('a');
    link.href = `/assets/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid business email address.');
      return;
    }

    setLoading(true);
    try {
      // 1. Capture customer lead data
      await API.presentationRequests.create({
        name: trimmedName,
        email: trimmedEmail,
        companyName: companyName.trim() || 'Organization',
        phone: phone.trim() || ''
      });

      // 2. Trigger instant direct download of the PowerPoint / PDF presentation file
      triggerDirectDownload(format);
      setSuccess(true);
    } catch (err) {
      console.error('Presentation lead capture error:', err);
      // Guarantee customer still receives their direct download immediately
      triggerDirectDownload(format);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setSuccess(false);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-8 max-w-md w-full shadow-2xl relative text-left overflow-hidden"
          >
            {/* Top accent gradient line */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#22C55E] to-cyan-500" />

            <button
              onClick={handleModalClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <IoCloseOutline size={22} />
            </button>

            {success ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-[#22C55E] flex items-center justify-center shadow-inner">
                  <IoDownloadOutline size={34} className="animate-bounce" />
                </div>

                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#22C55E] text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                    Direct Download Started
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Presentation Downloading!</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Thank you, <strong className="text-slate-800">{name}</strong>! Your StackPilot AI Presentation Deck (<span className="text-[#22C55E] font-bold">{format.toUpperCase()}</span>) is downloading directly to your device.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-slate-600 text-[11px]">
                    <span className="text-slate-400">Customer Name:</span>
                    <span className="font-bold text-slate-800">{name}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 text-[11px]">
                    <span className="text-slate-400">Registered Email:</span>
                    <span className="font-bold text-slate-800">{email}</span>
                  </div>
                  {companyName && (
                    <div className="flex justify-between items-center text-slate-600 text-[11px]">
                      <span className="text-slate-400">Company:</span>
                      <span className="font-medium text-slate-700">{companyName}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-slate-600 text-[11px] pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400">File Contents:</span>
                    <span className="font-bold text-[#22C55E]">10 Executive Slides • Full Telemetry</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => triggerDirectDownload('pptx')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <IoDownloadOutline size={16} className="text-[#22C55E]" />
                    Download Again (.PPTX PowerPoint)
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => triggerDirectDownload('pdf')}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <IoDocumentTextOutline size={14} className="text-red-500" />
                      Download PDF
                    </button>

                    <a
                      href="/presentation.html"
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <IoDesktopOutline size={14} className="text-[#22C55E]" />
                      Live Slides
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleModalClose}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer mt-1"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#22C55E] text-[10px] font-black uppercase tracking-wider border border-emerald-200/80 inline-flex items-center gap-1">
                    <IoDownloadOutline size={12} /> Direct Customer Download
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Download Product Presentation</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Please provide your name and email to immediately download the 10-slide Enterprise Presentation Deck.
                  </p>
                </div>

                {/* Format Selector Pills */}
                <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormat('pptx')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      format === 'pptx'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <IoDesktopOutline size={14} className={format === 'pptx' ? 'text-[#22C55E]' : ''} />
                    PowerPoint (.PPTX)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('pdf')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      format === 'pdf'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <IoDocumentTextOutline size={14} className={format === 'pdf' ? 'text-red-500' : ''} />
                    Document (.PDF)
                  </button>
                </div>

                {error && (
                  <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name <span className="text-[#22C55E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Wright"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(''); }}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Business Email <span className="text-[#22C55E]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alexander@company.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Direct download begins immediately; backup copy delivered to email.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Company (Optional)</label>
                      <input
                        type="text"
                        placeholder="Company name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone (Optional)</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#22C55E] hover:bg-[#1db053] active:scale-[0.99] text-white font-bold text-xs shadow-lg shadow-[#22C55E]/25 transition-all cursor-pointer mt-3 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Preparing Direct Download...</>
                    ) : (
                      <>
                        <IoDownloadOutline size={18} />
                        Download Presentation Now ({format.toUpperCase()})
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-slate-400">
                    Instant file download • 100% Free • No credit card needed
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PresentationDownloadModal;
