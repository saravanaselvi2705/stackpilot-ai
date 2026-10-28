import React, { useState, useEffect } from 'react';
import { API } from '../../services/api';
import type { TimesheetEntry } from '../../../../../packages/shared/types';
import { IoRibbonOutline, IoAddOutline, IoCloseOutline } from 'react-icons/io5';

export const Timesheets: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Modal Form State
  const [hours, setHours] = useState<string>('7.5');
  const [description, setDescription] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('StackPilot AI');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    async function loadTimesheets() {
      try {
        setLoading(true);
        const data = await API.timesheets.list();
        setTimesheets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTimesheets();
  }, []);

  // ISSUE-M2: Decimal Hours Input Clamping (onChange & onBlur)
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      setHours('');
      return;
    }
    const parsed = parseFloat(rawVal);
    if (!isNaN(parsed)) {
      // Prevent negative numbers by resetting to 0 or taking absolute value
      setHours(parsed < 0 ? Math.abs(parsed).toString() : rawVal);
    } else {
      setHours(rawVal);
    }
  };

  const handleHoursBlur = () => {
    if (hours === '') return;
    const parsed = parseFloat(hours);
    if (isNaN(parsed) || parsed < 0) {
      setHours(Math.abs(parsed || 0).toString());
    }
  };

  const handleLogTimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedHours = Math.abs(parseFloat(hours));
    if (isNaN(parsedHours) || parsedHours <= 0) return;

    try {
      setSubmitting(true);
      const cachedUser = localStorage.getItem('stackpilot_user');
      const u = cachedUser ? JSON.parse(cachedUser) : { _id: 'u-1', name: 'Super Admin' };

      await API.timesheets.create({
        userId: u._id,
        userName: u.name,
        projectId: 'p-1',
        projectName,
        date: new Date().toISOString().split('T')[0],
        hours: parsedHours,
        billable: true,
        description: description.trim() || 'Logged time'
      });

      const updated = await API.timesheets.list();
      setTimesheets(updated);
      setIsModalOpen(false);
      setDescription('');
      setHours('7.5');
    } catch (err) {
      console.error('Failed to create timesheet entry', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <IoRibbonOutline size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Enterprise Team Timesheets</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Weekly billable and non-billable time logs across all projects.</p>
          </div>
        </div>

        {/* Log Time Action Button with ISSUE-L2 Micro-animations */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 transform-gpu transition-all duration-150 text-white text-xs font-bold shadow-md cursor-pointer"
        >
          <IoAddOutline size={18} />
          <span>Log Hours</span>
        </button>
      </div>

      {/* Timesheets Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-white/10 font-black text-slate-500 dark:text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">User</th>
              <th className="p-4">Project</th>
              <th className="p-4">Description</th>
              <th className="p-4">Hours</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
            {timesheets.map(t => (
              <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{t.date}</td>
                <td className="p-4 font-bold text-slate-900 dark:text-white">{t.userName}</td>
                <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">{t.projectName}</td>
                <td className="p-4">{t.description}</td>
                <td className="p-4 font-black text-slate-900 dark:text-white">{t.hours} hrs</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                    t.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Timesheet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          {/* ISSUE-L1: dark:border-white/10 border token blending with dark background */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Log Timesheet Entry</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <IoCloseOutline size={20} />
              </button>
            </div>

            <form onSubmit={handleLogTimeSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              {/* ISSUE-M2: Decimal Hours Input with onChange & onBlur Negative Clamping */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Decimal Hours Logged (Cannot be negative)
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={hours}
                  onChange={handleHoursChange}
                  onBlur={handleHoursBlur}
                  placeholder="e.g. 7.5"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Work Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Summarize tasks completed today..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                {/* ISSUE-L2: Button Micro-animations transform-gpu active:scale-95 */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 transform-gpu transition-all duration-150 text-white text-xs font-bold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timesheets;
