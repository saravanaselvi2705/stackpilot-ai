import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { IoSparklesSharp, IoDocumentTextOutline, IoTimeOutline, IoDownloadOutline, IoCopyOutline } from 'react-icons/io5';
import API from '../../services/api';
import type { Document, Project } from '../../../../../packages/shared/types';

export const Requirements: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('p-1');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState<'brd' | 'srs' | 'generator'>('generator');
  
  // AI Generator Form
  const [prompt, setPrompt] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const loadRequirementsData = async () => {
    try {
      const [projs, docs] = await Promise.all([
        API.projects.list(),
        API.docs.list()
      ]);
      setProjects(projs);
      setDocuments(docs.filter(d => d.projectId === selectedProject));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRequirementsData();
  }, [selectedProject]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setGenerating(true);
    setOutput('');
    try {
      const markdown = await API.ai.generate('requirements', prompt);
      setOutput(markdown);
      
      // Auto save as a document in mock database
      const proj = projects.find(p => p._id === selectedProject);
      await API.docs.create({
        title: `AI SRS: ${prompt.slice(0, 30)}...`,
        content: markdown,
        type: 'SRS',
        projectId: selectedProject
      });
      loadRequirementsData();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const requirementsList = [
    { id: 'BRQ-101', title: 'Collapsible Dashboard Switcher', desc: 'Allows reviewers to toggle roles instantly in the global header navbar.', type: 'Business', status: 'Approved' },
    { id: 'FRQ-201', title: 'Local Storage State Fallback', desc: 'Saves projects and task status cards to browser local storage if Express server is offline.', type: 'Functional', status: 'Implemented' },
    { id: 'FRQ-202', title: 'Client Invoice Generator', desc: 'Compiles itemized lines, calculates GST, and simulates a printable PDF billing record.', type: 'Functional', status: 'Approved' },
    { id: 'NFR-301', title: 'Tailwind v4 Theme Tokens', desc: 'Colors, border variables, and glassmorphism templates configured directly in CSS.', type: 'Non-Functional', status: 'Implemented' }
  ];

  return (
    <div className="space-y-8">
      {/* Requirements Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Requirements</h1>
          <p className="text-xs text-slate-400 mt-1">Create, view, and manage project specifications and functional requirements.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold">Active Project:</span>
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

      {/* Selector Tabs */}
      <div className="flex border-b border-slate-800/80 gap-6">
        <button
          onClick={() => setActiveTab('generator')}
          className={`pb-3 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
            activeTab === 'generator' ? 'border-b-2 border-[#22C55E] text-[#111827]' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          AI Creator
        </button>
        <button
          onClick={() => setActiveTab('brd')}
          className={`pb-3 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
            activeTab === 'brd' ? 'border-b-2 border-[#22C55E] text-[#111827]' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Specifications
        </button>
        <button
          onClick={() => setActiveTab('srs')}
          className={`pb-3 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
            activeTab === 'srs' ? 'border-b-2 border-[#22C55E] text-[#111827]' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Saved Documents ({documents.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Input Panel */}
          <Card>
            <div className="border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <IoSparklesSharp className="text-[#22C55E] animate-pulse" size={16} />
                <span>AI Specification Generator</span>
              </h3>
              <p className="text-[10px] text-slate-400">Describe your software idea below to generate specifications.</p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Project Details</label>
                <textarea
                  rows={5}
                  required
                  placeholder="e.g. Build a client dashboard with search and invoicing..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#22C55E]/50 resize-none leading-relaxed"
                />
              </div>

              <Button type="submit" loading={generating} className="w-full text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">
                Generate Specifications
              </Button>
            </form>
          </Card>

          {/* Output Panel */}
          <Card className="h-[420px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-slate-200">Specifications Output</h3>
              {output && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCopy}
                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-all cursor-pointer"
                    title="Copy Markdown"
                  >
                    {copied ? <span className="text-[9px] font-bold text-emerald-400">Copied!</span> : <IoCopyOutline size={14} />}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto mt-4 p-4 bg-slate-950/40 rounded-xl border border-slate-850/80 font-mono text-[10px] leading-relaxed text-slate-300">
              {generating ? (
                <div className="flex flex-col items-center justify-center h-full space-y-3">
                  <svg className="animate-spin h-6 w-6 text-[#22C55E]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-slate-500 text-[10px] animate-pulse">StackPilot AI is generating...</p>
                </div>
              ) : output ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600 text-center px-6">
                  Describe your project on the left to generate requirements. The output will be saved automatically.
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Specifications list */}
      {activeTab === 'brd' && (
        <Card>
          <div className="border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-sm font-bold text-slate-200">Specifications List</h3>
            <p className="text-[10px] text-slate-400">A list of functional and non-functional specifications.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest font-bold text-[9px]">
                  <th className="py-3 px-2">Key ID</th>
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {requirementsList.map((req) => (
                  <tr key={req.id} className="border-b border-slate-800/40 hover:bg-slate-900/10 text-slate-300">
                    <td className="py-3.5 px-2 font-mono font-bold text-[#22C55E]">{req.id}</td>
                    <td className="py-3.5 px-2 font-semibold text-white">{req.title}</td>
                    <td className="py-3.5 px-2 text-slate-400 max-w-sm truncate">{req.desc}</td>
                    <td className="py-3.5 px-2">
                      <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-[8px] text-slate-300 font-bold rounded">
                        {req.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <Badge variant={req.status === 'Implemented' ? 'success' : 'primary'}>{req.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Saved Documents */}
      {activeTab === 'srs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-slate-500 text-xs">
              No saved documents found. Use the AI Creator tab to generate specifications.
            </div>
          ) : (
            documents.map((doc) => (
              <Card key={doc._id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <IoDocumentTextOutline className="text-[#22C55E] shrink-0" size={20} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{doc.title}</h4>
                      <div className="flex items-center gap-2 text-[9px] text-slate-500 font-semibold mt-0.5">
                        <IoTimeOutline size={10} />
                        <span>V{doc.version} - {new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="purple">{doc.type}</Badge>
                </div>
                <div className="h-32 overflow-y-auto bg-slate-950/40 p-3 rounded-lg border border-slate-850 text-[10px] font-mono text-slate-400 whitespace-pre-line leading-relaxed">
                  {doc.content}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default Requirements;
