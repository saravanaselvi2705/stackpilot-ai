import React, { useState } from 'react';
import type { Sprint, Task, Project, User } from '../../../../../../packages/shared/types';
import { useSprints } from '../hooks/useSprints';
import { useTasks } from '../hooks/useTasks';
import { SprintCard } from '../components/SprintCard';
import { SprintModal } from '../components/SprintModal';
import { SprintReportsModal } from '../components/SprintReportsModal';
import { TaskDetails } from './TaskDetails';
import { TaskCard } from '../components/TaskCard';
import { 
  IoAddOutline, 
  IoFlashOutline, 
  IoCalendarOutline, 
  IoCheckmarkDoneCircleOutline,
  IoLayersOutline,
  IoStatsChartOutline
} from 'react-icons/io5';

interface SprintPlanningProps {
  userRole?: string;
  projects: Project[];
  users: User[];
}

export const SprintPlanning: React.FC<SprintPlanningProps> = ({
  userRole,
  projects,
  users,
}) => {
  const {
    sprints,
    activeSprint,
    planningSprints,
    completedSprints,
    loading,
    error,
    createSprint,
    updateSprint,
    deleteSprint,
    startSprint,
    completeSprint,
    archiveSprint,
    duplicateSprint,
  } = useSprints();

  const { tasks, updateTask, deleteTask } = useTasks();

  // Modals state
  const [isSprintModalOpen, setIsSprintModalOpen] = useState<boolean>(false);
  const [sprintToEdit, setSprintToEdit] = useState<Sprint | null>(null);

  // Sprint Reports Modal State
  const [selectedReportSprint, setSelectedReportSprint] = useState<Sprint | null>(null);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Selected Task Drawer State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  // Tab View Filter for Sprints
  const [viewStatus, setViewStatus] = useState<'all' | 'active' | 'planning' | 'completed'>('all');

  const handleOpenEditModal = (sprint: Sprint) => {
    setSprintToEdit(sprint);
    setIsSprintModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setSprintToEdit(null);
    setIsSprintModalOpen(true);
  };

  const handleOpenReportModal = (sprint: Sprint) => {
    setSelectedReportSprint(sprint);
    setIsReportOpen(true);
  };

  const filteredSprints = sprints.filter(s => {
    if (viewStatus === 'active') return s.status === 'Active';
    if (viewStatus === 'planning') return s.status === 'Planning';
    if (viewStatus === 'completed') return s.status === 'Completed' || s.status === 'Archived';
    return true;
  });

  const backlogTasks = tasks.filter(t => !t.sprintId);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Top Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Sprint Planning & Scope</h1>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Release v1.1.0 Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage sprint lifecycles, capacity allocation, velocity estimation, and task distribution
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
        >
          <IoAddOutline size={18} />
          <span>Create Sprint</span>
        </button>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setViewStatus('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
              viewStatus === 'all' ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Sprints ({sprints.length})
          </button>
          <button
            onClick={() => setViewStatus('active')}
            className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
              viewStatus === 'active' ? 'bg-emerald-600 text-white font-extrabold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Active ({sprints.filter(s => s.status === 'Active').length})
          </button>
          <button
            onClick={() => setViewStatus('planning')}
            className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
              viewStatus === 'planning' ? 'bg-blue-600 text-white font-extrabold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Planning / Future ({planningSprints.length})
          </button>
          <button
            onClick={() => setViewStatus('completed')}
            className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
              viewStatus === 'completed' ? 'bg-slate-700 text-white font-extrabold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed ({completedSprints.length})
          </button>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Unassigned Backlog: <strong className="text-slate-900">{backlogTasks.length} Tasks</strong>
        </span>
      </div>

      {/* Sprint Cards List */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs font-bold">Loading Sprints...</span>
        </div>
      ) : filteredSprints.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <IoLayersOutline size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No sprints found in this view</h3>
          <p className="text-xs text-slate-400 mt-1">Create a new sprint to begin planning task capacity.</p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
          >
            + Create Sprint
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSprints.map(sprint => {
            const sprintTasks = tasks.filter(t => t.sprintId === sprint._id);
            return (
              <SprintCard
                key={sprint._id}
                sprint={sprint}
                tasks={sprintTasks}
                userRole={userRole}
                onStart={sp => startSprint(sp._id)}
                onComplete={sp => {
                  if (confirm(`Complete ${sp.name}? Unfinished tasks will return to Backlog.`)) {
                    completeSprint(sp._id);
                  }
                }}
                onArchive={sp => archiveSprint(sp._id)}
                onDuplicate={sp => duplicateSprint(sp._id)}
                onEdit={handleOpenEditModal}
                onDelete={sp => {
                  if (confirm(`Are you sure you want to delete ${sp.name}?`)) {
                    deleteSprint(sp._id);
                  }
                }}
                onOpenReport={handleOpenReportModal}
              />
            );
          })}
        </div>
      )}

      {/* Sprint Modal */}
      <SprintModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        onSubmit={async data => {
          if (sprintToEdit) {
            await updateSprint(sprintToEdit._id, data);
          } else {
            await createSprint(data);
          }
        }}
        sprintToEdit={sprintToEdit}
        projects={projects}
      />

      {/* Sprint Analytics Reports Modal */}
      {selectedReportSprint && (
        <SprintReportsModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          sprint={selectedReportSprint}
        />
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
    </div>
  );
};
