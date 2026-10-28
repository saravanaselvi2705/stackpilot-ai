import React, { useState } from 'react';
import type { Release, Sprint, Project } from '../../../../../../packages/shared/types';
import { useSprints } from '../hooks/useSprints';
import { 
  IoAddOutline, 
  IoRocketOutline, 
  IoCheckmarkDoneCircleOutline, 
  IoCalendarOutline,
  IoCloseOutline
} from 'react-icons/io5';

interface ReleasesProps {
  userRole?: string;
  projects: Project[];
}

export const Releases: React.FC<ReleasesProps> = ({ userRole, projects }) => {
  const { releases, sprints, createRelease, updateRelease, deleteRelease } = useSprints();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [version, setVersion] = useState('v1.1.0');
  const [sprintId, setSprintId] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'Planned' | 'In Progress' | 'Deployed' | 'Rolled Back'>('Planned');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selSprint = sprints.find(s => s._id === sprintId);
    await createRelease({
      projectId: projects[0]?._id || 'p-1',
      projectName: projects[0]?.name || 'StackPilot SaaS',
      version,
      sprintId,
      sprintName: selSprint?.name,
      releaseNotes,
      releaseDate,
      status,
    });
    setIsModalOpen(false);
    setVersion('');
    setReleaseNotes('');
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Releases & Versioning</h1>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {releases.length} Active Releases
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Track software release tags, deployment status, and sprint release notes
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
        >
          <IoAddOutline size={18} />
          <span>New Release</span>
        </button>
      </div>

      {/* Releases Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {releases.map(rel => (
          <div key={rel._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-slate-900 font-mono">{rel.version}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
                    rel.status === 'Deployed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    rel.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {rel.status}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500 block mt-0.5">
                  Associated: {rel.sprintName || 'Sprint 1'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                <IoCalendarOutline size={14} />
                <span>{rel.releaseDate}</span>
              </div>
            </div>

            {rel.releaseNotes && (
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                {rel.releaseNotes}
              </p>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <select
                value={rel.status}
                onChange={e => updateRelease(rel._id, { status: e.target.value as any })}
                className="px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 cursor-pointer"
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Deployed">Deployed</option>
                <option value="Rolled Back">Rolled Back</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Release Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Create New Release</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <IoCloseOutline size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Version *</label>
                <input
                  type="text"
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  placeholder="e.g. v1.1.0"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Associated Sprint</label>
                <select
                  value={sprintId}
                  onChange={e => setSprintId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                >
                  <option value="">Select Sprint...</option>
                  {sprints.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.status})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Release Date</label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={e => setReleaseDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Release Notes</label>
                <textarea
                  rows={3}
                  value={releaseNotes}
                  onChange={e => setReleaseNotes(e.target.value)}
                  placeholder="Summary of feature additions, bug fixes, or enhancements..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700">
                  Create Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
