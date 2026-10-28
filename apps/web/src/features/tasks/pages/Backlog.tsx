import React, { useState } from 'react';
import type { Task, Sprint, Project, User } from '../../../../../../packages/shared/types';
import { useTasks } from '../hooks/useTasks';
import { useSprints } from '../hooks/useSprints';
import { TaskCard } from '../components/TaskCard';
import { TaskDetails } from './TaskDetails';
import { TaskModal } from '../components/TaskModal';
import { SearchBar } from '../components/SearchBar';
import { StoryPoints } from '../components/StoryPoints';
import { 
  IoAddOutline, 
  IoArrowForwardOutline, 
  IoLayersOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';

interface BacklogProps {
  userRole?: string;
  projects: Project[];
  users: User[];
}

export const Backlog: React.FC<BacklogProps> = ({
  userRole,
  projects,
  users,
}) => {
  const { tasks, updateTask, deleteTask, createTask } = useTasks();
  const { sprints, activeSprint, planningSprints } = useSprints();

  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const backlogTasks = tasks.filter(t => !t.sprintId || t.status === 'Backlog').filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.title.toLowerCase().includes(q) || (t.taskId || '').toLowerCase().includes(q);
  });

  const totalBacklogPoints = backlogTasks.reduce((sum, t) => sum + (t.storyPoints || 1), 0);

  const handleAssignToSprint = async (taskId: string, sprintId: string) => {
    const targetSpr = sprints.find(s => s._id === sprintId);
    await updateTask(taskId, {
      sprintId,
      sprintName: targetSpr?.name,
      status: 'Todo'
    });
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Product Backlog</h1>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {backlogTasks.length} Unassigned Tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Prioritize requirements and assign work items to active or future planning sprints
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Backlog Load</span>
            <span className="font-extrabold text-slate-900">{totalBacklogPoints} Story Points</span>
          </div>

          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
          >
            <IoAddOutline size={18} />
            <span>Create Backlog Item</span>
          </button>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search product backlog..." />
        
        {activeSprint && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            Target Active: <strong>{activeSprint.name}</strong>
          </span>
        )}
      </div>

      {/* Backlog Items List Table / Cards */}
      {backlogTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <IoCheckmarkCircleOutline size={44} className="mx-auto text-emerald-500 mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Backlog is pristine and empty!</h3>
          <p className="text-xs text-slate-400 mt-1">All tasks are currently assigned to active or upcoming sprints.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {backlogTasks.map(task => (
            <div key={task._id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-emerald-500/40 transition-all flex flex-wrap items-center justify-between gap-4 group">
              <div className="flex items-center gap-3 min-w-0 flex-1" onClick={() => { setSelectedTask(task); setIsDetailsOpen(true); }}>
                <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-emerald-700">
                  {task.taskId || task._id.slice(0, 7)}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-emerald-800 transition-colors cursor-pointer">
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate max-w-md">{task.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                <StoryPoints points={task.storyPoints || 1} size="sm" />
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                  task.priority === 'High' || task.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {task.priority}
                </span>

                {/* Quick Move to Sprint Dropdown */}
                <select
                  defaultValue=""
                  onChange={e => {
                    if (e.target.value) handleAssignToSprint(task._id, e.target.value);
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                >
                  <option value="" disabled>Move to Sprint...</option>
                  {sprints.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.status})</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Details Drawer */}
      <TaskDetails
        task={selectedTask}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        users={users}
        sprints={sprints}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={async data => {
          await createTask({ ...data, status: 'Backlog', sprintId: undefined });
        }}
        projects={projects}
        sprints={sprints}
        users={users}
        defaultStatus="Backlog"
      />
    </div>
  );
};
