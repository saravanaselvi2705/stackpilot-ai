import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Modal } from './UI';
import { IoSearchOutline, IoFolderOpenOutline, IoListOutline, IoPeopleOutline, IoCashOutline, IoDocumentTextOutline } from 'react-icons/io5';
import API from '../services/api';

export const Layout: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<{
    projects: any[];
    tasks: any[];
    leads: any[];
    invoices: any[];
  }>({ projects: [], tasks: [], leads: [], invoices: [] });

  const navigate = useNavigate();

  // CMD+K shortcut trigger listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({ projects: [], tasks: [], leads: [], invoices: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    
    const fetchSearchData = async () => {
      try {
        const [projs, ts, ls, invs] = await Promise.all([
          API.projects.list(),
          API.tasks.list(),
          API.crm.listLeads(),
          API.finance.listInvoices()
        ]);

        const filteredProjs = projs.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
        const filteredTasks = ts.filter(t => t.title.toLowerCase().includes(query) || t.description?.toLowerCase().includes(query));
        const filteredLeads = ls.filter(l => l.name.toLowerCase().includes(query) || l.companyName?.toLowerCase().includes(query));
        const filteredInvs = invs.filter(i => i.invoiceNumber.toLowerCase().includes(query) || i.clientName.toLowerCase().includes(query));

        setResults({
          projects: filteredProjs.slice(0, 3),
          tasks: filteredTasks.slice(0, 4),
          leads: filteredLeads.slice(0, 3),
          invoices: filteredInvs.slice(0, 3)
        });
      } catch (err) {
        console.error('Global search error:', err);
      }
    };

    fetchSearchData();
  }, [searchQuery]);

  const handleNavigate = (path: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  const hasResults = results.projects.length > 0 || results.tasks.length > 0 || results.leads.length > 0 || results.invoices.length > 0;

  return (
    <div className="flex bg-white text-[#111827] min-h-screen relative overflow-hidden font-sans">
      {/* Decorative Glow Background Lights */}
      <div className="glow-orb bg-cyan-500/10 top-[-200px] left-[-200px] animate-glow" />
      <div className="glow-orb bg-indigo-500/5 bottom-[-100px] right-[-100px] animate-glow" style={{ animationDelay: '-6s' }} />

      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden z-10">
        <Navbar onSearchOpen={() => setSearchOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950/20">
          <Outlet />
        </main>
      </div>

      {/* Global Search Dialog Modal */}
      <Modal isOpen={searchOpen} onClose={() => setSearchOpen(false)} title="Global Navigator (CMD+K)">
        <div className="space-y-4">
          <div className="relative">
            <IoSearchOutline size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search across project names, task boards, invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm outline-none text-white focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {!searchQuery.trim() ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                Type keywords above to query across all collections...
              </div>
            ) : !hasResults ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No matching results found for "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-4">
                {/* Projects Section */}
                {results.projects.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-2">Projects</h4>
                    <div className="space-y-1">
                      {results.projects.map(p => (
                        <button
                          key={p._id}
                          onClick={() => handleNavigate('/projects')}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left text-xs hover:bg-slate-800/50 hover:text-white text-slate-300 transition-colors cursor-pointer"
                        >
                          <IoFolderOpenOutline size={14} className="text-cyan-400 shrink-0" />
                          <span className="font-semibold truncate">{p.name}</span>
                          <span className="ml-auto text-[10px] text-slate-500 italic shrink-0">{p.status}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks Section */}
                {results.tasks.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-2">Tasks</h4>
                    <div className="space-y-1">
                      {results.tasks.map(t => (
                        <button
                          key={t._id}
                          onClick={() => handleNavigate('/tasks')}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left text-xs hover:bg-slate-800/50 hover:text-white text-slate-300 transition-colors cursor-pointer"
                        >
                          <IoListOutline size={14} className="text-emerald-400 shrink-0" />
                          <span className="font-semibold truncate">{t.title}</span>
                          <span className="ml-auto text-[10px] text-slate-500 italic shrink-0">{t.status}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lead Section */}
                {results.leads.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-2">CRM Contacts</h4>
                    <div className="space-y-1">
                      {results.leads.map(l => (
                        <button
                          key={l._id}
                          onClick={() => handleNavigate('/crm')}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left text-xs hover:bg-slate-800/50 hover:text-white text-slate-300 transition-colors cursor-pointer"
                        >
                          <IoPeopleOutline size={14} className="text-indigo-400 shrink-0" />
                          <span className="font-semibold truncate">{l.name} ({l.companyName})</span>
                          <span className="ml-auto text-[10px] text-slate-500 italic shrink-0">{l.status}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Invoices Section */}
                {results.invoices.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-2">Invoices</h4>
                    <div className="space-y-1">
                      {results.invoices.map(i => (
                        <button
                          key={i._id}
                          onClick={() => handleNavigate('/finance')}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left text-xs hover:bg-slate-800/50 hover:text-white text-slate-300 transition-colors cursor-pointer"
                        >
                          <IoCashOutline size={14} className="text-amber-400 shrink-0" />
                          <span className="font-semibold truncate">{i.invoiceNumber} - {i.clientName}</span>
                          <span className="ml-auto text-[10px] text-slate-500 italic shrink-0">{i.status}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Layout;
