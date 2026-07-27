import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { 
  IoSparklesSharp, 
  IoBugOutline, 
  IoCheckmarkCircleOutline, 
  IoMailOutline, 
  IoWalletOutline, 
  IoCopyOutline, 
  IoTrashOutline, 
  IoDownloadOutline, 
  IoCreateOutline, 
  IoEyeOutline, 
  IoSaveOutline, 
  IoTimeOutline 
} from 'react-icons/io5';
import API from '../../services/api';

interface AIHistoryItem {
  id: string;
  tool: string;
  prompt: string;
  output: string;
  timestamp: string;
}

export const AIScripts: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'testcases' | 'bugreport' | 'cost' | 'email'>('testcases');
  const [prompt, setPrompt] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Editor states
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedOutput, setEditedOutput] = useState<string>('');

  // History Logs
  const [history, setHistory] = useState<AIHistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  // Form parameters
  const [emailScenario, setEmailScenario] = useState<string>('Follow up on pending design approval');
  const [costScope, setCostScope] = useState<string>('React Native mobile application with payments');

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sp_ai_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    } else {
      setHistory([]);
      localStorage.setItem('sp_ai_history', JSON.stringify([]));
    }
  }, []);

  // Save history helper
  const saveHistory = (updated: AIHistoryItem[]) => {
    setHistory(updated);
    localStorage.setItem('sp_ai_history', JSON.stringify(updated));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setIsEditing(false);
    setOutput('');
    const currentPrompt = prompt || (activeTool === 'cost' ? costScope : activeTool === 'email' ? emailScenario : 'General Scenario');
    
    try {
      let resultText = '';
      if (activeTool === 'testcases') {
        resultText = await API.ai.generate('testcases', prompt || 'User Authentication Module');
      } else if (activeTool === 'bugreport') {
        resultText = await API.ai.generate('bugreport', prompt || 'Unhandled exception in compiler pipeline');
      } else if (activeTool === 'cost') {
        await new Promise(r => setTimeout(r, 1000));
        resultText = `# Cost & Budget Estimates: "${costScope}"

### 1. Scope Breakdown
- **Mobile UI & Integration**: ₹1,50,000 (80 hours dev)
- **Payment Gateway**: ₹85,000 (40 hours dev)
- **Quality Assurance**: ₹45,000 (30 hours QA)

### 2. Allocation Roster
- **Senior Developer**: ₹900/hr (80 hours) = ₹72,000
- **Lead QA Engineer**: ₹600/hr (30 hours) = ₹18,000
- **Project Strategy PM**: ₹750/hr (25 hours) = ₹18,750

**Total Internal Labor Cost**: ₹1,08,750
**Client Proposal Value**: ₹2,80,000
**Projected Margin Profit**: 61.15% (Healthy)
`;
      } else if (activeTool === 'email') {
        await new Promise(r => setTimeout(r, 800));
        resultText = `Subject: Quick updates: StackPilot AI [${emailScenario}]

Dear Client Team,

I hope this email finds you well.

This is a quick notification to update you on progress regarding the escrow milestones: [${emailScenario}]. 

Our team has completed the integration work, and testing is underway. We anticipate a review release within three business days.

Please let us know if you require any specific alterations.

Best regards,
StackPilot Operations Admin
`;
      }

      setOutput(resultText);
      setEditedOutput(resultText);

      // Append to history
      const newHistoryItem: AIHistoryItem = {
        id: `hist-${Date.now()}`,
        tool: activeTool,
        prompt: currentPrompt,
        output: resultText,
        timestamp: new Date().toLocaleString()
      };
      
      const updatedHistory = [newHistoryItem, ...history];
      saveHistory(updatedHistory);
      setActiveHistoryId(newHistoryItem.id);

    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editedOutput : output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveChanges = () => {
    setOutput(editedOutput);
    setIsEditing(false);
    // Update active history item if exists
    if (activeHistoryId) {
      const updated = history.map(item => 
        item.id === activeHistoryId ? { ...item, output: editedOutput } : item
      );
      saveHistory(updated);
    }
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    saveHistory(updated);
    if (activeHistoryId === id) {
      setOutput('');
      setEditedOutput('');
      setActiveHistoryId(null);
    }
  };

  const handleSelectHistoryItem = (item: AIHistoryItem) => {
    setActiveTool(item.tool as any);
    setPrompt(item.prompt);
    setOutput(item.output);
    setEditedOutput(item.output);
    setActiveHistoryId(item.id);
    setIsEditing(false);
  };

  const triggerExport = (format: 'PDF' | 'DOCX') => {
    const textToExport = isEditing ? editedOutput : output;
    if (!textToExport) return;
    
    // Simulate real file download trigger
    const blob = new Blob([textToExport], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai_${activeTool}_export.${format.toLowerCase()}`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const tools = [
    { key: 'testcases', title: 'Test Case Writer', icon: <IoCheckmarkCircleOutline size={16} />, desc: 'Write test scenarios for features' },
    { key: 'bugreport', title: 'Bug Reporter', icon: <IoBugOutline size={16} />, desc: 'Draft bug reports' },
    { key: 'cost', title: 'Project Cost Estimator', icon: <IoWalletOutline size={16} />, desc: 'Estimate project costs' },
    { key: 'email', title: 'Client Email Composer', icon: <IoMailOutline size={16} />, desc: 'Compose follow-up emails' }
  ] as const;

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">AI Tools Workspace</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Use pre-configured AI templates to write emails, estimate project costs, and draft reports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Selectors & Inputs */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Select AI Tool</h3>
            <div className="space-y-2">
              {tools.map((t) => (
                <button
                  key={t.key}
                  onClick={() => { 
                    setActiveTool(t.key); 
                    setOutput(''); 
                    setEditedOutput('');
                    setPrompt(''); 
                    setActiveHistoryId(null);
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    activeTool === t.key 
                      ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/25 shadow-inner' 
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="shrink-0">{t.icon}</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{t.title}</h4>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Parameters</h3>
            <form onSubmit={handleGenerate} className="space-y-4">
              {activeTool === 'testcases' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Feature Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. JWT Token refresh flow with authorization header validation..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]/50 resize-none"
                  />
                </div>
              )}

              {activeTool === 'bugreport' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Issue Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. Unhandled ReferenceError map property is undefined in sidebar components..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]/50 resize-none"
                  />
                </div>
              )}

              {activeTool === 'cost' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Project Scope</label>
                  <input
                    type="text"
                    required
                    value={costScope}
                    onChange={(e) => setCostScope(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]/50"
                  />
                </div>
              )}

              {activeTool === 'email' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Email Topic</label>
                  <input
                    type="text"
                    required
                    value={emailScenario}
                    onChange={(e) => setEmailScenario(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]/50"
                  />
                </div>
              )}

              <Button type="submit" loading={generating} className="w-full text-xs flex items-center justify-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white">
                <IoSparklesSharp size={12} className="animate-spin-slow" />
                Run AI Tool
              </Button>
            </form>
          </Card>

          {/* History log panel */}
          <Card>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest">Past Runs History</h3>
              {history.length > 0 && (
                <button 
                  onClick={() => saveHistory([])}
                  className="text-[10px] text-slate-500 hover:text-red-500 font-bold cursor-pointer"
                >
                  Clear History
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <p className="text-[10px] text-slate-500 dark:text-slate-400 italic py-4 text-center">No past runs in history. Run an AI tool above to generate output logs.</p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectHistoryItem(item)}
                    className={`flex items-start justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      activeHistoryId === item.id 
                        ? 'bg-[#22C55E]/10 border-[#22C55E] text-slate-900 dark:text-white' 
                        : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">{item.tool}</span>
                        <span className="text-[8px] text-slate-500 dark:text-slate-400 font-mono">{item.timestamp}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-900 dark:text-slate-200 truncate mt-1">{item.prompt}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteHistory(item.id, e)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      title="Delete History Entry"
                    >
                      <IoTrashOutline size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Side: Output Visualizer and Editor */}
        <div className="lg:col-span-2">
          <Card className="min-h-[500px] flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display">AI Workspace Output</h3>
                <Badge variant="primary">{activeTool.toUpperCase()}</Badge>
              </div>

              {output && (
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Export Options */}
                  <button 
                    onClick={() => triggerExport('PDF')}
                    className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold border border-slate-300 dark:border-slate-800 px-2.5 py-1"
                    title="Export as PDF"
                  >
                    <IoDownloadOutline size={12} /> PDF
                  </button>
                  <button 
                    onClick={() => triggerExport('DOCX')}
                    className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold border border-slate-300 dark:border-slate-800 px-2.5 py-1"
                    title="Export as DOCX"
                  >
                    <IoDownloadOutline size={12} /> DOCX
                  </button>

                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                  {/* Toggle Preview / Edit modes */}
                  {isEditing ? (
                    <button
                      onClick={handleSaveChanges}
                      className="text-[#22C55E] hover:text-[#1db053] p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                    >
                      <IoSaveOutline size={13} /> Save Edits
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                    >
                      <IoCreateOutline size={13} /> Edit Output
                    </button>
                  )}

                  <button 
                    onClick={handleCopy}
                    className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold border border-slate-300 dark:border-slate-800 px-2.5 py-1"
                  >
                    {copied ? <span className="text-[10px] font-bold text-[#22C55E]">Copied!</span> : <IoCopyOutline size={13} />}
                    Copy
                  </button>

                  <button
                    onClick={() => {
                      setOutput('');
                      setEditedOutput('');
                      setIsEditing(false);
                    }}
                    className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                    title="Clear Current Output"
                  >
                    <IoTrashOutline size={13} /> Clear
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto mt-4 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200">
              {generating ? (
                <div className="flex flex-col items-center justify-center h-full space-y-3 py-16">
                  <svg className="animate-spin h-6 w-6 text-[#22C55E]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-slate-600 dark:text-slate-400 text-xs font-bold animate-pulse">StackPilot AI is generating response...</p>
                </div>
              ) : isEditing ? (
                <textarea
                  className="w-full h-80 bg-transparent text-slate-900 dark:text-slate-100 outline-none font-mono text-[11px] leading-relaxed resize-none"
                  value={editedOutput}
                  onChange={(e) => setEditedOutput(e.target.value)}
                />
              ) : output ? (
                <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-900 dark:text-slate-200">{output}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 text-center py-20 px-6">
                  <IoSparklesSharp size={32} className="text-slate-400 dark:text-slate-600 mb-3" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No output generated yet.</p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-sm">Select a tool from the left panel, provide the parameters, and click "Run AI Tool".</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIScripts;
