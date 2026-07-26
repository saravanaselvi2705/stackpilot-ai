import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, ProgressBar } from '../../components/UI';
import { useCustomization } from '../../context/CustomizationContext';
import { 
  IoAdd, 
  IoChatbubbleOutline, 
  IoCheckmarkDoneOutline, 
  IoCalendarOutline, 
  IoArrowForwardOutline, 
  IoArrowBackOutline,
  IoAttachOutline,
  IoTrashOutline,
  IoPersonOutline,
  IoSparklesOutline
} from 'react-icons/io5';
import API from '../../services/api';
import type { Task, Project } from '../../../../../packages/shared/types';

export const Tasks: React.FC = () => {
  const { settings, hasPermission } = useCustomization();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Modals / forms
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [inspectModalOpen, setInspectModalOpen] = useState<boolean>(false);
  
  // Create Task Form
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDesc, setTaskDesc] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('Medium');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [taskLabels, setTaskLabels] = useState<string>('Engineering');
  const [taskEstimatedTime, setTaskEstimatedTime] = useState<number>(4);
  const [taskAssigneeId, setTaskAssigneeId] = useState<string>('1');

  // Grouping swimlanes
  const [groupBy, setGroupBy] = useState<'None' | 'Priority' | 'Assignee'>('None');

  // Drag and drop tracking
  const [activeDragCol, setActiveDragCol] = useState<Task['status'] | null>(null);

  // Comment & Checklist & Attachment Form State
  const [commentText, setCommentText] = useState<string>('');
  const [checkText, setCheckText] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');

  const members = [
    { id: '1', name: 'Alexander Wright', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin' },
    { id: '2', name: 'Sarah Jenkins', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah' },
    { id: '3', name: 'Marcus Aurelius', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus' },
    { id: '4', name: 'Tony Soprano', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tony' },
    { id: '5', name: 'Guillermo Rauch', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Guillermo' }
  ];

  const loadTasksAndProjects = async () => {
    try {
      const [projs, ts] = await Promise.all([
        API.projects.list(),
        API.tasks.list()
      ]);
      setProjects(projs);
      setTasks(ts);
      if (projs.length > 0 && !selectedProject) {
        setSelectedProject(projs[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTasksAndProjects();
  }, []);

  // Listen to deep-links to auto-trigger the Create Task modal if permitted
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'add' && hasPermission('PM', 'create')) {
      setAddModalOpen(true);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [hasPermission]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !hasPermission('PM', 'create')) return;
    try {
      await API.tasks.create({
        projectId: selectedProject,
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
        dueDate: taskDueDate || new Date().toISOString().split('T')[0],
        labels: taskLabels.split(',').map(l => l.trim()),
        estimatedTime: taskEstimatedTime,
        status: 'Todo',
        assigneeId: taskAssigneeId,
        comments: [],
        checklist: [],
        attachments: []
      });
      // Reset
      setTaskTitle('');
      setTaskDesc('');
      setTaskPriority('Medium');
      setTaskDueDate('');
      setTaskLabels('Engineering');
      setTaskEstimatedTime(4);
      setTaskAssigneeId('1');
      setAddModalOpen(false);
      loadTasksAndProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCardDrop = async (taskId: string, targetStatus: Task['status']) => {
    if (!hasPermission('PM', 'edit')) return;
    try {
      await API.tasks.update(taskId, { status: targetStatus });
      loadTasksAndProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleColumnMove = async (task: Task, direction: 'forward' | 'backward') => {
    if (!hasPermission('PM', 'edit')) return;
    const statuses: Task['status'][] = ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'];
    const idx = statuses.indexOf(task.status);
    let nextIdx = idx;

    if (direction === 'forward' && idx < statuses.length - 1) {
      nextIdx = idx + 1;
    } else if (direction === 'backward' && idx > 0) {
      nextIdx = idx - 1;
    }

    if (nextIdx !== idx) {
      try {
        await API.tasks.update(task._id, { status: statuses[nextIdx] });
        loadTasksAndProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleInspectTask = (task: Task) => {
    setSelectedTask(task);
    setInspectModalOpen(true);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !commentText.trim() || !hasPermission('PM', 'edit')) return;

    const cachedUser = localStorage.getItem('stackpilot_user');
    const u = cachedUser ? JSON.parse(cachedUser) : { _id: 'u-1', name: 'Alexander Wright' };

    const newComment = {
      id: `c-${Date.now()}`,
      userId: u._id,
      userName: u.name,
      userAvatar: u.avatarUrl,
      text: commentText,
      createdAt: new Date().toISOString()
    };

    const updatedComments = [...(selectedTask.comments || []), newComment];
    try {
      const res = await API.tasks.update(selectedTask._id, { comments: updatedComments });
      setSelectedTask(res);
      setCommentText('');
      loadTasksAndProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !checkText.trim() || !hasPermission('PM', 'edit')) return;

    const newItem = {
      id: `check-${Date.now()}`,
      text: checkText,
      done: false
    };

    const updatedChecklist = [...(selectedTask.checklist || []), newItem];
    try {
      const res = await API.tasks.update(selectedTask._id, { checklist: updatedChecklist });
      setSelectedTask(res);
      setCheckText('');
      loadTasksAndProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleChecklist = async (itemId: string, currentVal: boolean) => {
    if (!selectedTask || !hasPermission('PM', 'edit')) return;

    const updatedChecklist = selectedTask.checklist?.map(item => {
      if (item.id === itemId) return { ...item, done: !currentVal };
      return item;
    });

    try {
      const res = await API.tasks.update(selectedTask._id, { checklist: updatedChecklist });
      setSelectedTask(res);
      loadTasksAndProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !attachmentName.trim() || !hasPermission('PM', 'edit')) return;

    const newAttach = {
      id: `att-${Date.now()}`,
      name: attachmentName,
      url: '#',
      size: '1.4 MB',
      createdAt: new Date().toISOString()
    };

    const updated = [...(selectedTask.attachments || []), newAttach];
    try {
      const res = await API.tasks.update(selectedTask._id, { attachments: updated });
      setSelectedTask(res);
      setAttachmentName('');
      loadTasksAndProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAttachment = async (attachId: string) => {
    if (!selectedTask || !hasPermission('PM', 'edit')) return;
    const updated = selectedTask.attachments?.filter(a => a.id !== attachId) || [];
    try {
      const res = await API.tasks.update(selectedTask._id, { attachments: updated });
      setSelectedTask(res);
      loadTasksAndProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssigneeChange = async (userId: string) => {
    if (!selectedTask || !hasPermission('PM', 'edit')) return;
    try {
      const res = await API.tasks.update(selectedTask._id, { assigneeId: userId });
      setSelectedTask(res);
      loadTasksAndProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePriorityChange = async (prio: Task['priority']) => {
    if (!selectedTask || !hasPermission('PM', 'edit')) return;
    try {
      const res = await API.tasks.update(selectedTask._id, { priority: prio });
      setSelectedTask(res);
      loadTasksAndProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: { key: Task['status']; title: string; color: string }[] = [
    { key: 'Backlog', title: 'Backlog Queue', color: 'border-slate-800 text-slate-500' },
    { key: 'Todo', title: 'Todo', color: 'border-[#22C55E]/20 text-[#22C55E]' },
    { key: 'In Progress', title: 'In Progress', color: 'border-amber-500/20 text-amber-400' },
    { key: 'In Review', title: 'In Review', color: 'border-indigo-500/20 text-indigo-400' },
    { key: 'Done', title: 'Done', color: 'border-emerald-500/20 text-emerald-400' }
  ];

  const getPriorityColor = (priority: string) => {
    if (priority === 'Critical') return 'danger';
    if (priority === 'High') return 'warning';
    if (priority === 'Medium') return 'primary';
    return 'secondary';
  };

  const getMember = (id?: string) => {
    return members.find(m => m.id === id) || { name: 'Unassigned', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Unassigned' };
  };

  const renderCard = (t: Task, colKey: Task['status']) => {
    const assignee = getMember(t.assigneeId);
    return (
      <div 
        key={t._id} 
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', t._id);
        }}
        className="p-4 bg-slate-900/90 border border-slate-850 hover:border-slate-700/80 rounded-xl space-y-3 transition-all shadow-sm cursor-grab active:cursor-grabbing hover:scale-[1.01] hover:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-1">
          <button 
            onClick={() => handleInspectTask(t)}
            className="text-xs font-bold text-slate-200 text-left hover:text-white cursor-pointer line-clamp-2 truncate"
          >
            {t.title}
          </button>
        </div>

        {t.description && <p className="text-[10px] text-slate-450 leading-relaxed line-clamp-2">{t.description}</p>}

        {/* Labels & Estimates */}
        <div className="flex flex-wrap gap-1 items-center">
          {t.labels?.map(lbl => (
            <span key={lbl} className="px-1.5 py-0.5 bg-slate-800 border border-slate-750 text-[8px] text-slate-350 font-bold rounded">
              {lbl}
            </span>
          ))}
          {t.estimatedTime !== undefined && t.estimatedTime > 0 && (
            <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-[8px] text-emerald-400 font-mono font-bold rounded flex items-center gap-0.5" title="Story Points">
              ⭐️ {t.estimatedTime} SP
            </span>
          )}
          {t.dueDate && (
            <span className="text-[8px] text-slate-500 font-mono font-bold flex items-center gap-0.5">
              📅 {new Date(t.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {/* Card Footer controls */}
        <div className="flex items-center justify-between border-t border-slate-850/60 pt-2.5 mt-1">
          <div className="flex items-center gap-2.5 text-slate-500 text-[10px]">
            <Badge variant={getPriorityColor(t.priority)}>{t.priority}</Badge>
            {t.comments && t.comments.length > 0 && (
              <span className="flex items-center gap-0.5 font-bold" title="Comments">
                <IoChatbubbleOutline size={10} /> {t.comments.length}
              </span>
            )}
            {t.checklist && t.checklist.length > 0 && (
              <span className="flex items-center gap-0.5 font-bold" title="Checklist Done">
                <IoCheckmarkDoneOutline size={10} /> {t.checklist.filter(item => item.done).length}/{t.checklist.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <img 
              src={assignee.avatar} 
              alt={assignee.name} 
              className="w-5.5 h-5.5 rounded-full border border-slate-800 bg-slate-950" 
              title={`Assigned to: ${assignee.name}`}
            />
            <div className="flex items-center gap-0.5">
              {colKey !== 'Backlog' && (
                <button 
                  onClick={() => handleColumnMove(t, 'backward')}
                  className="text-slate-500 hover:text-white p-0.5 bg-slate-950 border border-slate-850 rounded hover:bg-slate-800 cursor-pointer"
                >
                  <IoArrowBackOutline size={8} />
                </button>
              )}
              {colKey !== 'Done' && (
                <button 
                  onClick={() => handleColumnMove(t, 'forward')}
                  className="text-slate-500 hover:text-white p-0.5 bg-slate-950 border border-slate-850 rounded hover:bg-slate-800 cursor-pointer"
                >
                  <IoArrowForwardOutline size={8} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBoardGrid = (boardTasks: Task[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTasks = boardTasks.filter(t => t.status === col.key);
          return (
            <div 
              key={col.key} 
              onDragOver={(e) => {
                e.preventDefault();
                setActiveDragCol(col.key);
              }}
              onDragLeave={() => setActiveDragCol(null)}
              onDrop={async (e) => {
                e.preventDefault();
                setActiveDragCol(null);
                const taskId = e.dataTransfer.getData('text/plain');
                if (taskId) {
                  await handleCardDrop(taskId, col.key);
                }
              }}
              className={`glass rounded-2xl p-4 flex flex-col min-w-[240px] min-h-[460px] border transition-all duration-200 ${
                activeDragCol === col.key
                  ? 'border-[#22C55E] bg-[#22C55E]/5 shadow-lg shadow-[#22C55E]/5 scale-[1.01]'
                  : 'border-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-2">
                <h3 className={`text-[10px] font-black uppercase tracking-wider ${col.color.split(' ')[1]}`}>{col.title}</h3>
                <span className="bg-slate-900 border border-slate-800 text-[9px] px-2 py-0.5 rounded-full text-slate-450 font-bold">
                  {colTasks.length}
                </span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-0.5">
                {colTasks.length === 0 ? (
                  <div className="text-center py-10 text-[9px] text-slate-650">No board tasks</div>
                ) : (
                  colTasks.map((t) => renderCard(t, col.key))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Filter tasks by selected project
  const filteredProjectTasks = tasks.filter(t => t.projectId === selectedProject);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Jira Tasks Board</h1>
          <p className="text-xs text-slate-400 mt-1">Organize team workloads, prioritize issues, and review checklist logs.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Swimlane Group Filter */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Group By:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer border-none"
            >
              <option value="None" className="bg-slate-950">None (Columns)</option>
              <option value="Priority" className="bg-slate-950">Priority Swimlanes</option>
              <option value="Assignee" className="bg-slate-950">Assignee Swimlanes</option>
            </select>
          </div>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none cursor-pointer font-bold"
          >
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          {hasPermission('PM', 'create') && (
            <Button onClick={() => setAddModalOpen(true)} className="text-xs flex items-center gap-1.5 shrink-0 bg-[#22C55E] hover:bg-[#1db053] text-white">
              <IoAdd size={16} /> New Task
            </Button>
          )}
        </div>
      </div>

      {/* Board Render depending on GroupBy */}
      {groupBy === 'None' && renderBoardGrid(filteredProjectTasks)}

      {groupBy === 'Priority' && (
        <div className="space-y-8">
          {(['Critical', 'High', 'Medium', 'Low'] as Task['priority'][]).map(prio => {
            const prioTasks = filteredProjectTasks.filter(t => t.priority === prio);
            return (
              <div key={prio} className="rounded-2xl border border-slate-850 p-4 bg-slate-900/10 space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-850">
                  <Badge variant={prio === 'Critical' ? 'danger' : prio === 'High' ? 'warning' : 'primary'}>
                    {prio}
                  </Badge>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{prioTasks.length} tasks</span>
                </div>
                {renderBoardGrid(prioTasks)}
              </div>
            );
          })}
        </div>
      )}

      {groupBy === 'Assignee' && (
        <div className="space-y-8">
          {members.map(member => {
            const memberTasks = filteredProjectTasks.filter(t => t.assigneeId === member.id);
            return (
              <div key={member.id} className="rounded-2xl border border-slate-850 p-4 bg-slate-900/10 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-850">
                  <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full border border-slate-800" />
                  <span className="text-xs font-bold text-slate-200">{member.name}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">({memberTasks.length} tasks)</span>
                </div>
                {renderBoardGrid(memberTasks)}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal Form */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Create Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Integrate unit testing matrices"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the details of this task..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Assignee</label>
              <select
                value={taskAssigneeId}
                onChange={(e) => setTaskAssigneeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 cursor-pointer"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Due Date</label>
              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Story Points (Hours)</label>
              <input
                type="number"
                min="1"
                value={taskEstimatedTime}
                onChange={(e) => setTaskEstimatedTime(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Labels (Comma-separated)</label>
            <input
              type="text"
              placeholder="Engineering, QA"
              value={taskLabels}
              onChange={(e) => setTaskLabels(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
            <Button type="button" variant="secondary" onClick={() => setAddModalOpen(false)} className="text-xs bg-white text-[#111827] border border-[#22C55E]">
              Cancel
            </Button>
            <Button type="submit" className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Task Inspect drawer modal */}
      {selectedTask && (
        <Modal 
          isOpen={inspectModalOpen} 
          onClose={() => { setInspectModalOpen(false); setSelectedTask(null); }} 
          title="Task Details"
          size="lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Content column */}
            <div className="md:col-span-2 space-y-6">
              {selectedTask.description && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</h4>
                  <p className="text-xs text-slate-350 leading-relaxed bg-slate-950/40 p-4 border border-slate-850 rounded-xl">{selectedTask.description}</p>
                </div>
              )}

              {/* Checklist Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Checklist Tasks</h4>
                  {selectedTask.checklist && selectedTask.checklist.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-400">
                      {Math.round((selectedTask.checklist.filter(i => i.done).length / selectedTask.checklist.length) * 100)}% Done
                    </span>
                  )}
                </div>

                {selectedTask.checklist && selectedTask.checklist.length > 0 && (
                  <ProgressBar 
                    value={Math.round((selectedTask.checklist.filter(i => i.done).length / selectedTask.checklist.length) * 100)} 
                    color="bg-[#22C55E]" 
                  />
                )}
                
                {/* Checklist items list */}
                <div className="space-y-2">
                  {selectedTask.checklist?.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-2.5 bg-slate-950/20 border border-slate-850/65 rounded-xl">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => handleToggleChecklist(item.id, item.done)}
                        className="w-4 h-4 rounded border-slate-800 text-[#22C55E] focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-xs ${item.done ? 'line-through text-slate-500' : 'text-slate-300'}`}>{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Add Checklist item form */}
                <form onSubmit={handleAddChecklist} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    required
                    placeholder="Add step-by-step checklist task..."
                    value={checkText}
                    onChange={(e) => setCheckText(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
                  />
                  <Button type="submit" size="sm" className="text-[10px] bg-[#22C55E] hover:bg-[#1db053] text-white">Add Step</Button>
                </form>
              </div>

              {/* Attachments Section */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/40 pb-1.5">Attachments File Roster</h4>
                
                <div className="space-y-2">
                  {selectedTask.attachments?.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-2.5 bg-slate-950/30 border border-slate-850 rounded-xl">
                      <div className="flex items-center gap-2 text-xs">
                        <IoAttachOutline size={14} className="text-[#22C55E]" />
                        <span className="font-bold text-slate-300">{file.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono">({file.size})</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteAttachment(file.id)}
                        className="text-slate-500 hover:text-red-400 cursor-pointer"
                      >
                        <IoTrashOutline size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddAttachment} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Attachment name (e.g. Layout mockup.png)..."
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
                  />
                  <Button type="submit" size="sm" className="text-[10px] bg-[#22C55E] hover:bg-[#1db053] text-white">Upload File</Button>
                </form>
              </div>

              {/* Comments Thread */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/40 pb-1.5">Comments Flow</h4>

                <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                  {selectedTask.comments && selectedTask.comments.length > 0 ? (
                    selectedTask.comments.map(c => (
                      <div key={c.id} className="p-3 bg-slate-950/30 border border-slate-850 rounded-xl space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-slate-200">{c.userName}</span>
                          <span className="text-[9px] text-slate-500">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-slate-400">{c.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-650 italic">No comments yet. Type below to start the thread.</p>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ask a question or publish updates..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#22C55E]/50"
                  />
                  <Button type="submit" size="sm" className="text-xs px-4 bg-[#22C55E] hover:bg-[#1db053] text-white font-bold">Comment</Button>
                </form>
              </div>
            </div>

            {/* Right Metadata column */}
            <div className="space-y-5 bg-slate-900/10 border-l border-slate-850 pl-0 md:pl-6 text-xs">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">State Column</span>
                <select
                  value={selectedTask.status}
                  onChange={(e) => handleCardDrop(selectedTask._id, e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer font-bold"
                >
                  <option value="Backlog">Backlog</option>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Assignee</span>
                <div className="flex items-center gap-2">
                  <img src={getMember(selectedTask.assigneeId).avatar} alt="Assignee" className="w-6 h-6 rounded-full border border-slate-800 bg-slate-950" />
                  <select
                    value={selectedTask.assigneeId || '1'}
                    onChange={(e) => handleAssigneeChange(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer font-bold"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Card Priority</span>
                <select
                  value={selectedTask.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer font-bold"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {selectedTask.dueDate && (
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Due Date</span>
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <IoCalendarOutline size={12} />
                    {new Date(selectedTask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}

              {selectedTask.estimatedTime !== undefined && selectedTask.estimatedTime > 0 && (
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Story Points</span>
                  <span className="text-xs font-semibold text-emerald-450 flex items-center gap-1.5 font-mono">
                    ⭐️ {selectedTask.estimatedTime} Story Points
                  </span>
                </div>
              )}

              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Labels</span>
                <div className="flex flex-wrap gap-1">
                  {selectedTask.labels?.map(l => (
                    <span key={l} className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-[8px] text-slate-350 font-bold rounded">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Simulated Activity Log */}
              <div className="space-y-2 border-t border-slate-850 pt-4">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Activity Log</span>
                <div className="space-y-2 max-h-[140px] overflow-y-auto text-[10px] text-slate-450">
                  <div className="flex gap-1.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-1.5 shrink-0" />
                    <p>Assignee updated to <strong className="text-slate-300">{getMember(selectedTask.assigneeId).name}</strong></p>
                  </div>
                  <div className="flex gap-1.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-1.5 shrink-0" />
                    <p>Priority changed to <strong className="text-slate-300">{selectedTask.priority}</strong></p>
                  </div>
                  <div className="flex gap-1.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-1.5 shrink-0" />
                    <p>Checklist tasks synced</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Tasks;
