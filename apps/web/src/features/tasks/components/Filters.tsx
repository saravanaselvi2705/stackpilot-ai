import React from 'react';
import type { Project, Sprint, User } from '../../../../../../packages/shared/types';
import type { TaskFilters } from '../hooks/useTasks';
import { SearchBar } from './SearchBar';
import { IoFunnelOutline, IoGridOutline, IoRefreshOutline } from 'react-icons/io5';

interface FiltersProps {
  filters: TaskFilters;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  projects: Project[];
  sprints: Sprint[];
  users: User[];
  onReset?: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  setFilters,
  projects,
  sprints,
  users,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Bar */}
        <SearchBar
          value={filters.search}
          onChange={val => setFilters(prev => ({ ...prev, search: val }))}
        />

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Project Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider hidden sm:inline">Project:</span>
            <select
              value={filters.projectId}
              onChange={e => setFilters(prev => ({ ...prev, projectId: e.target.value }))}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">All Projects</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Sprint Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider hidden sm:inline">Sprint:</span>
            <select
              value={filters.sprintId}
              onChange={e => setFilters(prev => ({ ...prev, sprintId: e.target.value }))}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="all">All Sprints</option>
              <option value="backlog">Backlog Only</option>
              {sprints.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.status})</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={e => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={filters.assigneeId}
            onChange={e => setFilters(prev => ({ ...prev, assigneeId: e.target.value }))}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">All Assignees</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>

          {/* Group By Select */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <IoGridOutline size={14} className="text-slate-400" />
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider hidden md:inline">Group By:</span>
            <select
              value={filters.groupBy}
              onChange={e => setFilters(prev => ({ ...prev, groupBy: e.target.value as any }))}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="status">Status</option>
              <option value="sprint">Sprint</option>
              <option value="priority">Priority</option>
              <option value="assignee">Assignee</option>
            </select>
          </div>

          {/* Reset Filters */}
          {onReset && (
            <button
              onClick={onReset}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset Filters"
            >
              <IoRefreshOutline size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
