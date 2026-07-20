import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Button, Badge } from '../../components/UI';
import { 
  IoBookOutline, 
  IoDocumentTextOutline, 
  IoAdd, 
  IoDownloadOutline, 
  IoTimeOutline, 
  IoSparklesSharp, 
  IoCopyOutline, 
  IoCloudUploadOutline, 
  IoFilterOutline, 
  IoSearchOutline,
  IoTrashOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';
import API from '../../services/api';
import type { Document, Project } from '../../../../../packages/shared/types';

export const Documentation: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = (searchParams.get('tab') as 'explorer' | 'requirements' | 'editor') || 'explorer';

  const [docs, setDocs] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('p-1');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Creator Form
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<Document['type']>('Technical');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string>('');

  // AI Generator / Analysis Form
  const [prompt, setPrompt] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Import / Upload Simulation
  const [importText, setImportText] = useState<string>('');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState<string>('');

  // Requirements List Local Cache (Dynamic additions supported)
  const [requirementsList, setRequirementsList] = useState([
    { id: 'BRQ-101', title: 'Collapsible Dashboard Switcher', desc: 'Allows reviewers to toggle roles instantly in the global header navbar.', type: 'Business', status: 'Approved' },
    { id: 'FRQ-201', title: 'Local Storage State Fallback', desc: 'Saves projects and task status cards to browser local storage if Express server is offline.', type: 'Functional', status: 'Implemented' },
    { id: 'FRQ-202', title: 'Client Invoice Generator', desc: 'Compiles itemized lines, calculates GST, and simulates a printable PDF billing record.', type: 'Functional', status: 'Approved' },
    { id: 'NFR-301', title: 'Tailwind v4 Theme Tokens', desc: 'Colors, border variables, and glassmorphism templates configured directly in CSS.', type: 'Non-Functional', status: 'Implemented' }
  ]);

  const loadData = async () => {
    try {
      const [projs, allDocs] = await Promise.all([
        API.projects.list(),
        API.docs.list()
      ]);
      setProjects(projs);
      
      // Filter documents belonging to selected project
      const filteredDocs = allDocs.filter(d => d.projectId === selectedProject);
      setDocs(filteredDocs);
      
      if (filteredDocs.length > 0) {
        setSelectedDoc(filteredDocs[0]);
      } else {
        setSelectedDoc(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProject]);

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    try {
      const newDoc = await API.docs.create({ 
        title, 
        type, 
        content,
        projectId: selectedProject
      });
      setTitle('');
      setContent('');
      setSearchParams({ tab: 'explorer' });
      setSelectedDoc(newDoc);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setGenerating(true);
    setOutput('');
    try {
      const markdown = await API.ai.generate('requirements', prompt);
      setOutput(markdown);
      
      // Auto save as a document in the project context
      const newDoc = await API.docs.create({
        title: `AI SRS: ${prompt.slice(0, 30)}...`,
        content: markdown,
        type: 'SRS',
        projectId: selectedProject
      });
      
      // Auto-extract a mock requirement to append to the interactive list
      const nextId = `FRQ-${200 + requirementsList.length + 1}`;
      setRequirementsList(prev => [
        ...prev,
        {
          id: nextId,
          title: `AI: ${prompt.slice(0, 35)}`,
          desc: `Extracted specifications for: ${prompt}`,
          type: 'Functional',
          status: 'Approved'
        }
      ]);

      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleAnalyzeImport = async (e: React.FormEvent) => {
    e.preventDefault();
    const sourceText = importText || `Analyzing raw imported data: ${uploadFileName}`;
    if (!sourceText.trim()) return;
    
    setAnalyzing(true);
    setImportSuccess('');
    try {
      // Simulate intelligent text segmentation and categorization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDocTitle = uploadFileName ? `Imported Doc: ${uploadFileName}` : `Analyzed Import: ${sourceText.slice(0, 25)}...`;
      const srsContent = `# Requirements Analysis Spec - ${newDocTitle}
      
## 1. Executive Summary
This document outlines key functional dependencies extracted from imported documentation resources.

## 2. Analyzed Input Source
> ${sourceText.slice(0, 200)}...

## 3. Extracted Specifications
- **Req-1**: The system must parse uploaded spreadsheets or paste items.
- **Req-2**: Auto-generate matching project metrics and metadata values.
- **Req-3**: Persist document version backups to the workspace telemetry database.
`;

      const newDoc = await API.docs.create({
        title: newDocTitle,
        content: srsContent,
        type: 'SRS',
        projectId: selectedProject
      });

      // Append extracted requirements
      setRequirementsList(prev => [
        ...prev,
        {
          id: `BRQ-${300 + prev.length + 1}`,
          title: `Imported: ${newDocTitle.slice(0, 28)}`,
          desc: 'Extracted via intelligent semantic file import analysis.',
          type: 'Business',
          status: 'Approved'
        }
      ]);

      setImportText('');
      setUploadFileName('');
      setImportSuccess('Text analyzed successfully! A new SRS document was added to the Explorer.');
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const triggerExport = (format: 'PDF' | 'DOCX') => {
    if (!selectedDoc) return;
    
    // Simulate real file download trigger
    const fileContent = `=== ${selectedDoc.title} ===\n\nVersion: ${selectedDoc.version}\nType: ${selectedDoc.type}\nLast Updated: ${new Date(selectedDoc.createdAt).toLocaleString()}\n\nContent:\n${selectedDoc.content}`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedDoc.title.replace(/\s+/g, '_').toLowerCase()}_export.${format.toLowerCase()}`;
    link.click();
    window.URL.revokeObjectURL(url);

    setExportMessage(`Successfully exported & downloaded "${selectedDoc.title}" as ${format}.`);
    setTimeout(() => setExportMessage(''), 4000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFileName(e.target.files[0].name);
      setImportSuccess(`File "${e.target.files[0].name}" loaded. Click Analyze File below.`);
    }
  };

  // Categories list for filtering
  const categories = ['All', 'SRS', 'BRD', 'Technical', 'Meeting Minutes', 'Knowledge Base'];
  
  // Filtered documents
  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.content && doc.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Documents & Specs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze, generate, and organize project requirements and specifications in a unified hub.
          </p>
        </div>

        {/* Global project context selection */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold">Workspace Project:</span>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none cursor-pointer font-bold"
          >
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs list selector */}
      <div className="flex border-b border-slate-800/80 gap-6">
        <button
          onClick={() => setSearchParams({ tab: 'explorer' })}
          className={`pb-3 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
            currentTab === 'explorer' ? 'border-b-2 border-[#22C55E] text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Documents Explorer
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'requirements' })}
          className={`pb-3 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
            currentTab === 'requirements' ? 'border-b-2 border-[#22C55E] text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Requirements Hub & AI SRS
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'editor' })}
          className={`pb-3 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
            currentTab === 'editor' ? 'border-b-2 border-[#22C55E] text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Manual Creator
        </button>
      </div>

      {/* Panel Views */}
      {currentTab === 'explorer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Sidebar file explorer and filters */}
          <div className="space-y-4 lg:col-span-1">
            <Card className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search document names or text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-[#22C55E]/50"
                />
                <IoSearchOutline size={14} className="absolute left-3 top-3 text-slate-500" />
              </div>

              {/* Category Pills list */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Filter Categories</span>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30'
                          : 'bg-slate-900/40 border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-850 pt-4 mt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Documents List</span>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {filteredDocs.length === 0 ? (
                    <div className="text-center py-6 text-[10px] text-slate-650">No documents found</div>
                  ) : (
                    filteredDocs.map((doc) => (
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
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Document Viewer */}
          <div className="lg:col-span-2 space-y-4">
            {selectedDoc ? (
              <Card className="min-h-[480px] flex flex-col justify-between">
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
                        <IoDownloadOutline size={12} /> PDF Export
                      </Button>
                      <Button onClick={() => triggerExport('DOCX')} size="sm" variant="secondary" className="text-[10px] flex items-center gap-1 bg-white text-[#111827] border border-[#22C55E]">
                        <IoDownloadOutline size={12} /> DOCX Export
                      </Button>
                    </div>
                  </div>

                  {exportMessage && (
                    <div className="p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[10px] font-bold rounded-lg mb-4">
                      {exportMessage}
                    </div>
                  )}

                  {/* Doc Content */}
                  <div className="prose prose-invert max-w-none text-xs text-slate-350 leading-relaxed font-sans whitespace-pre-wrap">
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
              <div className="text-center py-20 text-slate-600 bg-slate-900/10 border border-slate-850/60 rounded-2xl">
                No document selected. Please select or create one.
              </div>
            )}
          </div>
        </div>
      )}

      {currentTab === 'requirements' && (
        <div className="space-y-6">
          {/* Top Panel: AI SRS Creator & Text Import */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* AI SRS Generator */}
            <Card className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <IoSparklesSharp className="text-[#22C55E] animate-pulse" size={15} />
                  <span>AI SRS Generator</span>
                </h3>
                <p className="text-[9px] text-slate-500">Describe a feature to auto-generate requirements specifications.</p>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Create a payment portal supporting Stripe UPI payments, monthly invoicing lists, and multi-currency billing dashboards."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#22C55E]/50 resize-none leading-relaxed"
                />

                <Button type="submit" loading={generating} className="w-full text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">
                  Generate Specifications & Save
                </Button>
              </form>
            </Card>

            {/* Document Import & Analysis Zone */}
            <Card className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <IoCloudUploadOutline className="text-emerald-400" size={15} />
                  <span>Text Import & Requirement Extractor</span>
                </h3>
                <p className="text-[9px] text-slate-500">Paste text transcripts or drop a file to extract specifications.</p>
              </div>

              {importSuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg flex items-center gap-1.5">
                  <IoCheckmarkCircleOutline size={14} className="shrink-0" />
                  <span>{importSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAnalyzeImport} className="space-y-3">
                {/* Upload drag drop simulation */}
                <div className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/40 rounded-xl p-3 text-center transition-all relative">
                  <input
                    type="file"
                    accept=".txt,.md,.pdf,.doc,.docx"
                    onChange={handleFileUploadSim}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <IoCloudUploadOutline size={20} className="text-slate-500" />
                    <span className="text-[9px] text-slate-400">
                      {uploadFileName ? `Selected: ${uploadFileName}` : 'Drag & Drop files here, or Click to Browse'}
                    </span>
                    <span className="text-[8px] text-slate-650">Supports TXT, MD, PDF (Max 5MB)</span>
                  </div>
                </div>

                <div className="text-center text-[9px] text-slate-600 font-semibold">OR PASTE RAW TEXT TRANSCRIPT</div>

                <textarea
                  rows={2}
                  placeholder="Paste meeting transcript, notes, or feature requirements..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#22C55E]/50 resize-none"
                />

                <Button type="submit" loading={analyzing} className="w-full text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850">
                  Analyze & Import Specifications
                </Button>
              </form>
            </Card>
          </div>

          {/* AI Generator output panel */}
          {output && (
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-bold text-slate-200">Generated SRS Document Preview</h4>
                <button 
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-all cursor-pointer"
                  title="Copy Specs"
                >
                  {copied ? <span className="text-[9px] font-bold text-emerald-400">Copied!</span> : <IoCopyOutline size={14} />}
                </button>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850/80 font-mono text-[10px] leading-relaxed text-slate-350 max-h-[220px] overflow-y-auto">
                <pre className="whitespace-pre-wrap">{output}</pre>
              </div>
            </Card>
          )}

          {/* Bottom Panel: Interactive specifications list */}
          <Card>
            <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-200">Interactive Specifications Registry</h3>
                <p className="text-[9px] text-slate-500">Track key functional dependencies and approvals.</p>
              </div>
              <Badge variant="success">{requirementsList.length} Total Specs</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                    <th className="py-2.5 px-2">ID</th>
                    <th className="py-2.5 px-2">Title</th>
                    <th className="py-2.5 px-2">Description</th>
                    <th className="py-2.5 px-2">Category</th>
                    <th className="py-2.5 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requirementsList.map((req) => (
                    <tr key={req.id} className="border-b border-slate-850 hover:bg-slate-900/10 text-slate-300">
                      <td className="py-3 px-2 font-mono font-bold text-[#22C55E]">{req.id}</td>
                      <td className="py-3 px-2 font-semibold text-white">{req.title}</td>
                      <td className="py-3 px-2 text-slate-400 max-w-sm truncate">{req.desc}</td>
                      <td className="py-3 px-2">
                        <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-750 text-[8px] text-slate-300 font-bold rounded">
                          {req.type}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant={req.status === 'Implemented' ? 'success' : 'primary'}>{req.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {currentTab === 'editor' && (
        <Card className="max-w-3xl mx-auto">
          <div className="border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-sm font-bold text-slate-200">Manual Document Creator</h3>
            <p className="text-[10px] text-slate-400">Write custom specifications, tech specs, or wiki pages.</p>
          </div>

          <form onSubmit={handleCreateDoc} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Webhook signature validation guidelines"
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
                  <option value="SRS">SRS Spec</option>
                  <option value="BRD">BRD Spec</option>
                  <option value="Meeting Minutes">Meeting Minutes</option>
                  <option value="Knowledge Base">Knowledge Base</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Content Markdown</label>
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
              <Button type="button" variant="secondary" onClick={() => setSearchParams({ tab: 'explorer' })} className="text-xs bg-white text-[#111827] border border-[#22C55E]">
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">
                Save Document
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default Documentation;
