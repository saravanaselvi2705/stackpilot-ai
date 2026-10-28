import React, { useState } from 'react';
import type { Task, TaskStatus, Project, User } from '../../../../../../packages/shared/types';
import { KANBAN_COLUMNS, useBoard } from '../hooks/useBoard';
import { KanbanColumn } from '../components/KanbanColumn';
import { Filters } from '../components/Filters';
import { TaskModal } from '../components/TaskModal';
import { SprintModal } from '../components/SprintModal';
import { TaskDetails } from './TaskDetails';
import { StoryPoints } from '../components/StoryPoints';
import { useTasks } from '../hooks/useTasks';
import { useSprints } from '../hooks/useSprints';
import { 
  IoAddOutline, 
  IoFlashOutline, 
  IoStatsChartOutline, 
  IoCalendarOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';

interface TaskBoardProps {
  userRole?: string;
  projects: Project[];
  users: User[];
  onNavigateToSprintPlanning?: () => void;
  onNavigateToReports?: () => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  userRole,
  projects,
  users,
  onNavigateToSprintPlanning,
  onNavigateToReports,
}) => {
  const {
    tasks,
    filteredTasks,
    loading,
    error,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const {
    sprints,
    activeSprint,
    createSprint,
  } = useSprints();

  // Selected Task for Details Drawer
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('Todo');
  const [isSprintModalOpen, setIsSprintModalOpen] = useState<boolean>(false);

  const {
    draggedTaskId,
    dragOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useBoard(updateTask);

  const handleOpenTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleAddTaskClick = (status: TaskStatus) => {
    setNewTaskStatus(status);
    setIsTaskModalOpen(true);
  };

  const totalPointsInActive = activeSprint 
    ? tasks.filter(t => t.sprintId === activeSprint._id).reduce((sum, t) => sum + (t.storyPoints || 1), 0)
    : 0;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Agile Task Board</h1>
            {activeSprint ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                <IoFlashOutline size={13} />
                <span>{activeSprint.name} (Active)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                No Active Sprint
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {activeSprint?.goal ? `Goal: ${activeSprint.goal}` : 'Manage task flow with drag and drop status columns'}
          </p>
        </div>

        {/* Board Level Telemetry & Quick Action Buttons */}
        <div className="flex items-center gap-3">
          {activeSprint && (
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Sprint Load</span>
                <StoryPoints points={totalPointsInActive} capacity={activeSprint.capacity} showCapacity size="sm" />
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Dates</span>
                <span className="font-bold text-slate-700">{activeSprint.startDate} - {activeSprint.endDate}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSprintModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <IoCalendarOutline size={15} />
              <span>Create Sprint</span>
            </button>

            <button
              onClick={() => handleAddTaskClick('Todo')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
            >
              <IoAddOutline size={16} />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <Filters
        filters={filters}
        setFilters={setFilters}
        projects={projects}
        sprints={sprints}
        users={users}
        onReset={() => setFilters({
          search: '',
          projectId: 'all',
          sprintId: 'all',
          status: 'all',
          priority: 'all',
          assigneeId: 'all',
          groupBy: 'status'
        })}
      />

      {/* Main Kanban Columns Scroll Workspace */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs font-bold">Loading Kanban Board...</span>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <IoAlertCircleOutline size={18} />
            <span>{error}</span>
          </div>
        ) : (
          <div className="flex items-start gap-4 h-full min-w-max pb-2">
            {KANBAN_COLUMNS.map(col => {
              const colTasks = filteredTasks.filter(t => t.status === col.id);
              return (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  tasks={colTasks}
                  onTaskClick={handleOpenTaskDetails}
                  onAddTask={handleAddTaskClick}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  isDragOver={dragOverColumn === col.id}
                />
              );
            })}
          </div>
        )}
      </div>

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

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={async data => {
          await createTask(data);
        }}
        projects={projects}
        sprints={sprints}
        users={users}
        defaultStatus={newTaskStatus}
        defaultSprintId={activeSprint?._id || ''}
      />

      {/* Sprint Creation Modal */}
      <SprintModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        onSubmit={async data => {
          await createSprint(data);
        }}
        projects={projects}
      />
    </div>
  );
};
