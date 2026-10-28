import React, { useState, useEffect } from 'react';
import { API } from '../../services/api';
import type { WorkflowRule } from '../../../../../packages/shared/types';
import { 
  IoHardwareChipOutline, 
  IoAddOutline, 
  IoToggleOutline,
  IoFlashOutline,
  IoArrowForwardOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline
} from 'react-icons/io5';

export const Workflows: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New Form
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState<WorkflowRule['trigger']>('Task Completed');
  const [condition, setCondition] = useState('Task Labels contain "Billable"');
  const [action, setAction] = useState<WorkflowRule['action']>('Generate Invoice');

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const list = await API.workflows.list();
      setWorkflows(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await API.workflows.toggle(id);
      fetchWorkflows();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await API.workflows.create({
        name,
        trigger,
        condition,
        action,
        status: 'Active'
      });
      setIsModalOpen(false);
      setName('');
      fetchWorkflows();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
            <IoHardwareChipOutline size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">No-Code Workflow Automation Rules</h1>
            <p className="text-xs text-slate-500 font-medium">Automate cross-functional events between Tasks, Sprints, CRM & Invoices.</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <IoAddOutline size={18} />
          <span>Create Automation Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-slate-400 font-bold text-xs">Loading workflow engine...</div>
        ) : workflows.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 font-medium text-xs bg-white rounded-2xl border border-slate-200">
            No workflow automation rules configured.
          </div>
        ) : (
          workflows.map(w => (
            <div key={w._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${w.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                  <h3 className="text-sm font-black text-slate-900">{w.name}</h3>
                </div>
                <button
                  onClick={() => handleToggle(w._id)}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer transition-colors ${
                    w.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {w.status}
                </button>
              </div>

              {/* Automation Visualizer */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1.5 text-amber-700">
                  <IoFlashOutline size={14} />
                  <span>{w.trigger}</span>
                </div>
                <IoArrowForwardOutline size={14} className="text-slate-400" />
                <div className="flex items-center gap-1.5 text-indigo-700">
                  <IoHardwareChipOutline size={14} />
                  <span>{w.action}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-medium">Condition: <span className="font-semibold text-slate-700">{w.condition || 'Always'}</span></p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>Executed {w.executionCount} times</span>
                <span>Last run: {w.lastExecuted ? new Date(w.lastExecuted).toLocaleDateString() : 'Never'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Workflow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateWorkflow} className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Create Automation Rule</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <IoCloseOutline size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                  placeholder="e.g. Notify PM on Sprint Start"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">WHEN Event Occurs (Trigger)</label>
                <select
                  value={trigger}
                  onChange={e => setTrigger(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                >
                  {['Task Completed', 'Sprint Started', 'Invoice Created', 'Client Onboarded', 'Approval Granted'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">IF Condition Matches</label>
                <input
                  type="text"
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                  placeholder="e.g. Priority is High"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">THEN Execute Action</label>
                <select
                  value={action}
                  onChange={e => setAction(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none"
                >
                  {['Notify Manager', 'Generate Invoice', 'Send Email', 'Create Follow-up Task', 'Export Audit Log'].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-extrabold text-xs">
                Save Rule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Workflows;
