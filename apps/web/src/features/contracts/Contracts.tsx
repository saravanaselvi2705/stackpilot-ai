import React, { useState, useEffect } from 'react';
import { API } from '../../services/api';
import type { Contract } from '../../../../../packages/shared/types';
import { IoBriefcaseOutline, IoAddOutline } from 'react-icons/io5';

export const Contracts: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    async function loadContracts() {
      try {
        setLoading(true);
        const data = await API.contracts.list();
        setContracts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadContracts();
  }, []);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
            <IoBriefcaseOutline size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Contract & MSA Management</h1>
            <p className="text-xs text-slate-500 font-medium">Enterprise legal contracts, client agreements & SLAs.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contracts.map(c => (
          <div key={c._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">{c.contractNumber}</span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">{c.status}</span>
            </div>
            <h3 className="text-sm font-black text-slate-900">{c.title}</h3>
            <p className="text-xs text-slate-600 font-medium">Client: <span className="font-bold">{c.clientName}</span></p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-slate-700">
              <span>Value: ${c.value.toLocaleString()}</span>
              <span>{c.startDate} - {c.endDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contracts;
