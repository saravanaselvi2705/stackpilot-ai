import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../services/api';
import type { Project, User } from '../../../../../packages/shared/types';

import { TaskBoard } from './pages/TaskBoard';
import { SprintPlanning } from './pages/SprintPlanning';
import { Backlog } from './pages/Backlog';
import { Timeline } from './pages/Timeline';
import { Releases } from './pages/Releases';

import { 
  IoListOutline, 
  IoFlashOutline, 
  IoLayersOutline, 
  IoCalendarOutline, 
  IoRocketOutline 
} from 'react-icons/io5';

export const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'board';

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [pData, uData] = await Promise.all([
          API.projects.list(),
          API.auth.listUsers()
        ]);
        setProjects(pData);
        setUsers(uData);
      } catch (err) {
        console.error('Failed to load initial task workspace dependencies', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleTabChange = (tabKey: string) => {
    setSearchParams({ tab: tabKey });
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 flex flex-col min-h-[calc(100vh-80px)]">
      {/* Top Header Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => handleTabChange('board')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTabParam === 'board'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <IoListOutline size={16} />
            <span>Task Board</span>
          </button>

          <button
            onClick={() => handleTabChange('sprints')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTabParam === 'sprints'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <IoFlashOutline size={16} />
            <span>Sprint Management</span>
          </button>

          <button
            onClick={() => handleTabChange('backlog')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTabParam === 'backlog'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <IoLayersOutline size={16} />
            <span>Backlog</span>
          </button>

          <button
            onClick={() => handleTabChange('timeline')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTabParam === 'timeline'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <IoCalendarOutline size={16} />
            <span>Timeline / Roadmap</span>
          </button>

          <button
            onClick={() => handleTabChange('releases')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTabParam === 'releases'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <IoRocketOutline size={16} />
            <span>Releases (v1.1.0)</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeTabParam === 'board' && (
          <TaskBoard
            userRole={user?.role}
            projects={projects}
            users={users}
          />
        )}

        {activeTabParam === 'sprints' && (
          <SprintPlanning
            userRole={user?.role}
            projects={projects}
            users={users}
          />
        )}

        {activeTabParam === 'backlog' && (
          <Backlog
            userRole={user?.role}
            projects={projects}
            users={users}
          />
        )}

        {activeTabParam === 'timeline' && (
          <Timeline
            projects={projects}
          />
        )}

        {activeTabParam === 'releases' && (
          <Releases
            userRole={user?.role}
            projects={projects}
          />
        )}
      </div>
    </div>
  );
};

export default Tasks;
