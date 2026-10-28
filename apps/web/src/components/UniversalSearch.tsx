import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { 
  IoSearchOutline, 
  IoCloseOutline, 
  IoFolderOpenOutline, 
  IoListOutline, 
  IoPeopleOutline, 
  IoDocumentTextOutline, 
  IoCashOutline, 
  IoBriefcaseOutline,
  IoPersonOutline,
  IoArrowForwardOutline
} from 'react-icons/io5';

interface SearchResultItem {
  id: string;
  category: 'Projects' | 'Tasks' | 'Clients' | 'Documents' | 'Finance' | 'Contracts' | 'Users';
  title: string;
  subtitle?: string;
  path: string;
}

interface UniversalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UniversalSearch: React.FC<UniversalSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const stored = localStorage.getItem('sp_recent_searches');
    return stored ? JSON.parse(stored) : ['Sprint 15', 'Acme Corp', 'Invoice INV-2026-001', 'Security Policy'];
  });

  // ISSUE-M1: 300ms debounce to prevent high-frequency state updates & API calls on rapid keystrokes
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggering handled by parent Navbar
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const performSearch = async () => {
      try {
        const [projects, tasks, clients, invoices, docs, contracts, users] = await Promise.all([
          API.projects.list(),
          API.tasks.list(),
          API.crm.listLeads(),
          API.finance.listInvoices(),
          API.docs.list(),
          API.contracts.list(),
          API.auth.listUsers()
        ]);

        if (!isMounted) return;

        const q = debouncedQuery.toLowerCase();
        const searchResults: SearchResultItem[] = [];

        // Search Projects
        projects.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
          .forEach(p => searchResults.push({ id: p._id, category: 'Projects', title: p.name, subtitle: `${p.status} • Budget: $${p.budget}`, path: `/projects?id=${p._id}` }));

        // Search Tasks
        tasks.filter(t => t.title.toLowerCase().includes(q) || (t.taskId && t.taskId.toLowerCase().includes(q)))
          .forEach(t => searchResults.push({ id: t._id, category: 'Tasks', title: `${t.taskId || 'Task'}: ${t.title}`, subtitle: `Status: ${t.status} • Priority: ${t.priority}`, path: `/tasks?tab=board&taskId=${t._id}` }));

        // Search Clients
        clients.filter(c => c.name.toLowerCase().includes(q) || (c.companyName && c.companyName.toLowerCase().includes(q)))
          .forEach(c => searchResults.push({ id: c._id, category: 'Clients', title: c.name, subtitle: `${c.companyName || 'Company'} • ${c.email}`, path: `/crm?clientId=${c._id}` }));

        // Search Documents
        docs.filter(d => d.title.toLowerCase().includes(q) || d.type.toLowerCase().includes(q))
          .forEach(d => searchResults.push({ id: d._id, category: 'Documents', title: d.title, subtitle: `${d.type} • Version ${d.version}`, path: `/documents?id=${d._id}` }));

        // Search Invoices
        invoices.filter(i => i.invoiceNumber.toLowerCase().includes(q) || i.clientName.toLowerCase().includes(q))
          .forEach(i => searchResults.push({ id: i._id, category: 'Finance', title: i.invoiceNumber, subtitle: `${i.clientName} • $${i.total} (${i.status})`, path: `/finance?invoiceId=${i._id}` }));

        // Search Contracts
        contracts.filter(ct => ct.title.toLowerCase().includes(q) || ct.contractNumber.toLowerCase().includes(q))
          .forEach(ct => searchResults.push({ id: ct._id, category: 'Contracts', title: ct.title, subtitle: `${ct.contractNumber} • $${ct.value}`, path: `/contracts?id=${ct._id}` }));

        // Search Users
        users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
          .forEach(u => searchResults.push({ id: u._id, category: 'Users', title: u.name, subtitle: `${u.role} • ${u.email}`, path: `/team?userId=${u._id}` }));

        setResults(searchResults);
      } catch (err) {
        console.error('Universal Search error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    performSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  const handleSelect = (item: SearchResultItem) => {
    // Save to recent
    const updated = [item.title, ...recentSearches.filter(s => s !== item.title)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('sp_recent_searches', JSON.stringify(updated));
    
    navigate(item.path);
    onClose();
  };

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'Projects': return <IoFolderOpenOutline className="text-emerald-600" size={16} />;
      case 'Tasks': return <IoListOutline className="text-blue-600" size={16} />;
      case 'Clients': return <IoPeopleOutline className="text-purple-600" size={16} />;
      case 'Documents': return <IoDocumentTextOutline className="text-amber-600" size={16} />;
      case 'Finance': return <IoCashOutline className="text-emerald-700" size={16} />;
      case 'Contracts': return <IoBriefcaseOutline className="text-indigo-600" size={16} />;
      case 'Users': return <IoPersonOutline className="text-slate-600" size={16} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
          <IoSearchOutline className="text-slate-400 shrink-0" size={20} />
          <input
            type="text"
            autoFocus
            placeholder="Search Projects, Tasks, Clients, Documents, Contracts, Users..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-slate-400 hover:text-slate-600 font-bold">Clear</button>
          )}
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-xs font-bold text-slate-400 animate-pulse">
              Searching across Business Operating System...
            </div>
          )}

          {!loading && !query && (
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Recent Searches</h4>
              <div className="space-y-1">
                {recentSearches.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(s)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs text-slate-700 font-medium text-left transition-colors cursor-pointer group"
                  >
                    <span>{s}</span>
                    <IoArrowForwardOutline size={14} className="text-slate-300 group-hover:text-emerald-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500 font-medium">
              No matching records found for "<span className="font-bold text-slate-800">{query}</span>"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              {['Projects', 'Tasks', 'Clients', 'Documents', 'Finance', 'Contracts', 'Users'].map(cat => {
                const catItems = results.filter(r => r.category === cat);
                if (catItems.length === 0) return null;
                return (
                  <div key={cat} className="space-y-1">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1">{cat}</h5>
                    {catItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-emerald-50 transition-colors">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold text-slate-900 truncate">{item.title}</p>
                            {item.subtitle && <p className="text-[10px] text-slate-500 font-medium truncate">{item.subtitle}</p>}
                          </div>
                        </div>
                        <IoArrowForwardOutline size={14} className="text-slate-300 group-hover:text-emerald-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 shadow-2xs font-mono">⌘K</span>
            <span>Toggle Universal Search</span>
          </div>
          <span>Showing enterprise business records</span>
        </div>
      </div>
    </div>
  );
};
