import React, { useState, useEffect } from 'react';
import { API } from '../../services/api';
import type { Document } from '../../../../../packages/shared/types';
import { 
  IoDocumentTextOutline, 
  IoFolderOpenOutline, 
  IoAddOutline, 
  IoSearchOutline, 
  IoPencilOutline, 
  IoTrashOutline,
  IoEyeOutline,
  IoCloseOutline
} from 'react-icons/io5';

export const Documents: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [docs, setDocs] = useState<Document[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New Doc Form
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<Document['type']>('PRD');
  const [docCategory, setDocCategory] = useState<Document['category']>('PRD');
  const [docContent, setDocContent] = useState('');
  const [docTags, setDocTags] = useState('Architecture, Enterprise');

  const categories = [
    'All',
    'Project Documents',
    'Contracts',
    'SRS',
    'PRD',
    'Meeting Notes',
    'Policies',
    'Knowledge Base',
    'SOPs',
    'Client Documents',
    'HR Documents'
  ];

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const list = await API.docs.list();
      setDocs(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim()) {
      alert('Please enter valid, non-empty document title and content.');
      return;
    }

    try {
      const newDoc: Omit<Document, '_id' | 'createdAt'> = {
        title: docTitle,
        content: docContent,
        type: docType,
        category: docCategory,
        createdBy: 'u-1',
        authorName: 'Super Admin',
        version: 1,
        tags: docTags.split(',').map(t => t.trim())
      };
      await API.docs.create(newDoc);
      setIsModalOpen(false);
      setDocTitle('');
      setDocContent('');
      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDocs = docs.filter(d => {
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory || d.type === selectedCategory;
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <IoDocumentTextOutline size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Document Management System</h1>
            <p className="text-xs text-slate-500 font-medium">Enterprise Repository for SRS, PRD, Contracts, SOPs & Knowledge Base.</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <IoAddOutline size={18} />
          <span>Create Document</span>
        </button>
      </div>

      {/* Category Folders & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Category Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-3 py-1">Document Folders</h3>
          <div className="space-y-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                  selectedCategory === cat ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IoFolderOpenOutline size={16} className={selectedCategory === cat ? 'text-emerald-600' : 'text-slate-400'} />
                  <span>{cat}</span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {cat === 'All' ? docs.length : docs.filter(d => d.category === cat || d.type === cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Documents List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <IoSearchOutline className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search documents by title, contents, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 py-12 text-center text-slate-400 font-bold text-xs">Loading enterprise documents...</div>
            ) : filteredDocs.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-400 font-medium text-xs bg-white rounded-2xl border border-slate-200">
                No documents found in folder "{selectedCategory}".
              </div>
            ) : (
              filteredDocs.map(d => (
                <div key={d._id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs space-y-3 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">{d.type}</span>
                      <span className="text-[10px] text-slate-400 font-bold">v{d.version}</span>
                    </div>
                    <button
                      onClick={() => setSelectedDoc(d)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
                      title="Preview Document"
                    >
                      <IoEyeOutline size={16} />
                    </button>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 truncate">{d.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-3 font-medium">{d.content}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>By: {d.authorName || 'Super Admin'}</span>
                    <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* View Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded">{selectedDoc.type}</span>
                <h2 className="text-lg font-black text-slate-900">{selectedDoc.title}</h2>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <IoCloseOutline size={20} />
              </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap max-h-[350px] overflow-y-auto">
              {selectedDoc.content}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setSelectedDoc(null)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateDoc} className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Create New Business Document</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <IoCloseOutline size={20} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Q3 Enterprise Service Agreement"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Document Type</label>
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                  >
                    {['SRS', 'PRD', 'FSD', 'Technical', 'Meeting Notes', 'Knowledge Base', 'Contract', 'Policy', 'SOP'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category Folder</label>
                  <select
                    value={docCategory}
                    onChange={e => setDocCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Content</label>
                <textarea
                  rows={5}
                  required
                  value={docContent}
                  onChange={e => setDocContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none"
                  placeholder="Type or paste document content..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-xs">
                Save Document
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Documents;
