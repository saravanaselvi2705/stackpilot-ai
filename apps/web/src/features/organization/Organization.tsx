import React, { useState, useEffect } from 'react';
import { API } from '../../services/api';
import type { Organization as OrganizationType } from '../../../../../packages/shared/types';
import { 
  IoBusinessOutline, 
  IoPeopleOutline, 
  IoFolderOpenOutline, 
  IoShieldCheckmarkOutline,
  IoAddOutline
} from 'react-icons/io5';

export const Organization: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [org, setOrg] = useState<OrganizationType | null>(null);

  useEffect(() => {
    async function loadOrg() {
      try {
        setLoading(true);
        const data = await API.organization.get();
        setOrg(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrg();
  }, []);

  if (loading || !org) {
    return <div className="p-8 text-center text-slate-400 font-bold text-xs">Loading Organization Hierarchy...</div>;
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <IoBusinessOutline size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{org.name}</h1>
            <p className="text-xs text-slate-500 font-medium">Enterprise Code: {org.code} • Domain: {org.domain} • Tier: {org.plan}</p>
          </div>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer inline-flex items-center gap-2">
          <IoAddOutline size={18} />
          <span>Add Department</span>
        </button>
      </div>

      {/* Departments Hierarchy Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">Organization Department Hierarchy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {org.departments.map(dept => (
            <div key={dept.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">{dept.name}</h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">{dept.memberCount} Members</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Department Manager: <span className="font-bold text-slate-800">{dept.manager}</span></p>
              
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>Teams Connected: 2</span>
                <span>Active Projects: 3</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Organization;
