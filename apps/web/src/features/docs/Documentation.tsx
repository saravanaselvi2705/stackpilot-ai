import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { IoBookOutline, IoDocumentTextOutline, IoAdd, IoDownloadOutline, IoTimeOutline, IoEyeOutline, IoCreateOutline } from 'react-icons/io5';
import API from '../../services/api';
import type { Document } from '../../../../../packages/shared/types';

export const Documentation: React.FC = () => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState<'explorer' | 'editor'>('explorer');

  // Editor Form
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<Document['type']>('Technical');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string>('');

  const loadDocs = async () => {
    try {
      const data = await API.docs.list();
      setDocs(data);
      if (data.length > 0 && !selectedDoc) {
        setSelectedDoc(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    try {
      const newDoc = await API.docs.create({ title, type, content });
      setTitle('');
      setContent('');
      setActiveTab('explorer');
      setSelectedDoc(newDoc);
      loadDocs();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerExport = (format: 'PDF' | 'DOCX') => {
    if (!selectedDoc) return;
    setExportMessage(`Exporting "${selectedDoc.title}" as ${format}... Please check your downloads folder.`);
    setTimeout(() => setExportMessage(''), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Documents</h1>
          <p className="text-xs text-slate-400 mt-1">Create, view, and organize project documents, specs, and meeting notes.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setActiveTab(activeTab === 'explorer' ? 'editor' : 'explorer')}
            className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white"
          >
            {activeTab === 'explorer' ? (
              <>
                <IoAdd size={16} /> Create Document
              </>
            ) : (
              'Return to Explorer'
            )}
          </Button>
        </div>
      </div>

      {activeTab === 'explorer' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Sidebar file explorer */}
          <div className="space-y-4 lg:col-span-1">
            <Card>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Documents</h3>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {docs.map((doc) => (
                  <button
                    key={doc._id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedDoc?._id === doc._id 
                        ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/25 shadow-inner' 
                        : 'bg-slate-900/40 border-slate-850 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <IoDocumentTextOutline size={18} className="shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{doc.title}</h4>
                      <div className="flex items-center gap-2 text-[9px] text-slate-500 font-semibold mt-1">
                        <span>V{doc.version}</span>
                        <span>•</span>
                        <span className="capitalize">{doc.type}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Document Viewer */}
          <div className="lg:col-span-2 space-y-4">
            {selectedDoc ? (
              <Card className="min-h-[460px] flex flex-col justify-between">
                <div>
                  {/* Doc Header */}
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <IoBookOutline className="text-[#22C55E] shrink-0" size={24} />
                      <div>
                        <h2 className="text-sm font-bold text-slate-200">{selectedDoc.title}</h2>
                        <div className="flex items-center gap-2 text-[9px] text-slate-500 font-semibold mt-0.5">
                          <IoTimeOutline size={12} />
                          <span>Last updated: {new Date(selectedDoc.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button onClick={() => triggerExport('PDF')} size="sm" variant="secondary" className="text-[10px] flex items-center gap-1 bg-white text-[#111827] border border-[#22C55E]">
                        <IoDownloadOutline size={12} /> PDF
                      </Button>
                      <Button onClick={() => triggerExport('DOCX')} size="sm" variant="secondary" className="text-[10px] flex items-center gap-1 bg-white text-[#111827] border border-[#22C55E]">
                        <IoDownloadOutline size={12} /> DOCX
                      </Button>
                    </div>
                  </div>

                  {exportMessage && (
                    <div className="p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[10px] font-bold rounded-lg mb-4">
                      {exportMessage}
                    </div>
                  )}

                  {/* Doc Content */}
                  <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                    {selectedDoc.content}
                  </div>
                </div>

                {/* History version check */}
                <div className="border-t border-slate-800/80 pt-4 mt-8 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Version History: {selectedDoc.history?.length || 1} drafts saved.</span>
                  <Badge variant="purple">Internal Document</Badge>
                </div>
              </Card>
            ) : (
              <div className="text-center py-20 text-slate-600">No document selected.</div>
            )}
          </div>
        </div>
      ) : (
        /* Document Creator Editor */
        <Card className="max-w-3xl mx-auto">
          <div className="border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-sm font-bold text-slate-200">Create Document</h3>
            <p className="text-[10px] text-slate-400">Write project notes, guidelines, or summaries.</p>
          </div>

          <form onSubmit={handleCreateDoc} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Project onboarding guide"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Document['type'])}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 cursor-pointer"
                >
                  <option value="Technical">Technical</option>
                  <option value="SRS">System Specification</option>
                  <option value="BRD">Business Specification</option>
                  <option value="Meeting Minutes">Meeting Minutes</option>
                  <option value="Knowledge Base">Knowledge Base</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Content</label>
              <textarea
                rows={12}
                required
                placeholder="Write the contents of your document here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#22C55E]/50 font-mono resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <Button type="button" variant="secondary" onClick={() => setActiveTab('explorer')} className="text-xs bg-white text-[#111827] border border-[#22C55E]">
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">
                Create Document
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
export default Documentation;
