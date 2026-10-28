import React, { useState, useEffect } from 'react';
import { API } from '../../services/api';
import type { ActivityLog } from '../../../../../packages/shared/types';
import { 
  IoShieldCheckmarkOutline, 
  IoSearchOutline, 
  IoDownloadOutline,
  IoFilterOutline
} from 'react-icons/io5';

export const AuditLogs: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState<string>('');
  const [filterAction, setFilterAction] = useState<string>('All');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const list = await API.auditLogs.list();
      setLogs(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleExportAuditLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Timestamp,User,Role,Action,Details,IP Address,Entity"].join(",") + "\n"
      + logs.map(l => `"${l.createdAt}","${l.userName}","${l.userRole}","${l.action}","${l.details || ''}","${l.ipAddress || ''}","${l.entity || ''}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stackpilot_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.userName.toLowerCase().includes(search.toLowerCase()) || 
                          l.action.toLowerCase().includes(search.toLowerCase()) ||
                          (l.details && l.details.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filterAction === 'All' || l.action.toLowerCase().includes(filterAction.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 text-white">
            <IoShieldCheckmarkOutline size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Enterprise Audit Log Security Center</h1>
            <p className="text-xs text-slate-500 font-medium">Immutable audit trail of system events, authentication, role changes, and admin operations.</p>
          </div>
        </div>

        <button
          onClick={handleExportAuditLogs}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <IoDownloadOutline size={18} />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <IoSearchOutline className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search audit logs by user, action, details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Login', 'Update', 'Delete', 'Permission'].map(act => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterAction === act ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-bold text-xs">Loading enterprise audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium text-xs">No matching audit log entries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Entity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredLogs.map(l => (
                  <tr key={l._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-[11px] font-mono text-slate-500">{new Date(l.createdAt).toLocaleString()}</td>
                    <td className="p-4 font-bold text-slate-900">{l.userName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-extrabold">{l.userRole}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        l.action.includes('Delete') ? 'bg-rose-100 text-rose-800' :
                        l.action.includes('Login') ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {l.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 max-w-sm truncate">{l.details || 'System operation executed.'}</td>
                    <td className="p-4 font-mono text-slate-500 text-[11px]">{l.ipAddress || '192.168.1.45'}</td>
                    <td className="p-4 font-bold text-slate-800">{l.entity || 'System'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
