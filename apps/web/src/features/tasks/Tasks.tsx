import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../components/UI';
import { 
  IoAdd, 
  IoChatbubbleOutline, 
  IoCheckmarkDoneOutline, 
  IoCalendarOutline, 
  IoPersonOutline, 
  IoArrowForwardOutline, 
  IoArrowBackOutline,
  IoTrashOutline
} from 'react-icons/io5';
import API from '../../services/api';
import type { Task, Project } from '../../../../../packages/shared/types';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('p-1');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Modals / forms
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [inspectModalOpen, setInspectModalOpen] = useState<boolean>(false);
  
  // Create Task Form
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDesc, setTaskDesc] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [taskLabels, setTaskLabels] = useState<string>('Engineering');

  // Comment Form State
  const [commentText, setCommentText] = useState<string>('');

  // Checklist Form State
  const [checkText, setCheckText] = useState<string>('');

  const loadTasksAndProjects = async () => {
    try {
      const [projs, ts] = await Promise.all([
        API.projects.list(),
        API.tasks.list()
      ]);
      setProjects(projs);
      setTasks(ts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTasksAndProjects();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    try {
      await API.tasks.create({
        projectId: selectedProject,
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
        dueDate: taskDueDate || new Date().toISOString().split('T')[0],
        labels: taskLabels.split(',').map(l => l.trim()),
        status: 'Todo'
      });
      // Reset
      setTaskTitle('');
      setTaskDesc('');
      setTaskPriority('Medium');
      setTaskDueDate('');
      setTaskLabels('Engineering');
      setAddModalOpen(false);
      loadTasksAndProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleColumnMove = async (task: Task, direction: 'forward' | 'backward') => {
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

  // Add Comment to selected task
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !commentText.trim()) return;

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

  // Add Item to Checklist
  const handleAddChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !checkText.trim()) return;

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

  // Toggle Checklist item checkbox
  const handleToggleChecklist = async (itemId: string, currentVal: boolean) => {
    if (!selectedTask) return;

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

  return (
    <div className="space-y-8">
      {/* Task Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Tasks</h1>
          <p className="text-xs text-slate-400 mt-1">Organize project tasks, track progress, and collaborate.</p>
        </div>

        {/* Project filtering & Creation shortcuts */}
        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none cursor-pointer font-bold"
          >
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <Button onClick={() => setAddModalOpen(true)} className="text-xs flex items-center gap-1.5 shrink-0 bg-[#22C55E] hover:bg-[#1db053] text-white">
            <IoAdd size={16} /> New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.projectId === selectedProject && t.status === col.key);

          return (
            <div key={col.key} className="glass rounded-2xl p-4 flex flex-col min-w-[240px] min-h-[460px] border border-slate-800/40">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-2">
                <h3 className={`text-[10px] font-black uppercase tracking-wider ${col.color.split(' ')[1]}`}>{col.title}</h3>
                <span className="bg-slate-900 border border-slate-800 text-[9px] px-2 py-0.5 rounded-full text-slate-400 font-bold">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-0.5">
                {colTasks.length === 0 ? (
                  <div className="text-center py-10 text-[9px] text-slate-600">No board tasks</div>
                ) : (
                  colTasks.map((t) => (
                    <div 
                      key={t._id} 
                      className="p-3.5 bg-slate-900/90 border border-slate-850 hover:border-slate-700/80 rounded-xl space-y-2.5 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <button 
                          onClick={() => handleInspectTask(t)}
                          className="text-xs font-bold text-slate-200 text-left hover:text-white cursor-pointer line-clamp-2 truncate"
                        >
                          {t.title}
                        </button>
                      </div>

                      {t.description && <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{t.description}</p>}

                      {/* Labels */}
                      <div className="flex flex-wrap gap-1">
                        {t.labels?.map(lbl => (
                          <span key={lbl} className="px-1.5 py-0.5 bg-slate-800 border border-slate-750 text-[8px] text-slate-300 font-bold rounded">
                            {lbl}
                          </span>
                        ))}
                      </div>

                      {/* Card Footer controls */}
                      <div className="flex items-center justify-between border-t border-slate-850 pt-2.5 mt-1">
                        <div className="flex items-center gap-2.5 text-slate-500 text-[10px]">
                          <Badge variant={getPriorityColor(t.priority)}>{t.priority}</Badge>
                          {t.comments && t.comments.length > 0 && (
                            <span className="flex items-center gap-0.5 font-bold">
                              <IoChatbubbleOutline size={10} /> {t.comments.length}
                            </span>
                          )}
                          {t.checklist && t.checklist.length > 0 && (
                            <span className="flex items-center gap-0.5 font-bold">
                              <IoCheckmarkDoneOutline size={10} /> {t.checklist.filter(item => item.done).length}/{t.checklist.length}
                            </span>
                          )}
                        </div>

                        {/* Column Navigation triggers */}
                        <div className="flex items-center gap-1">
                          {col.key !== 'Backlog' && (
                            <button 
                              onClick={() => handleColumnMove(t, 'backward')}
                              className="text-slate-500 hover:text-white p-0.5 bg-slate-950 border border-slate-850 rounded hover:bg-slate-800 cursor-pointer"
                              title="Move Left"
                            >
                              <IoArrowBackOutline size={10} />
                            </button>
                          )}
                          {col.key !== 'Done' && (
                            <button 
                              onClick={() => handleColumnMove(t, 'forward')}
                              className="text-slate-500 hover:text-white p-0.5 bg-slate-950 border border-slate-850 rounded hover:bg-slate-800 cursor-pointer"
                              title="Move Right"
                            >
                              <IoArrowForwardOutline size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

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

          <div className="grid grid-cols-3 gap-4">
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
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Due Date</label>
              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50"
              />
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
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 border border-slate-850 rounded-xl">{selectedTask.description}</p>
                </div>
              )}

              {/* Checklist Section */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Checklist</h4>
                
                {/* Checklist items list */}
                <div className="space-y-2">
                  {selectedTask.checklist?.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-950/20 border border-slate-850/65 rounded-lg">
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
                <form onSubmit={handleAddChecklist} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Add step-by-step checklist task..."
                    value={checkText}
                    onChange={(e) => setCheckText(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
                  />
                  <Button type="submit" size="sm" className="text-[10px] bg-[#22C55E] hover:bg-[#1db053] text-white">Add Step</Button>
                </form>
              </div>

              {/* Comments Thread */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/40 pb-1.5">Comments</h4>

                {/* Comments List */}
                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
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
                    <p className="text-xs text-slate-600 italic">No comments yet. Type below to start the thread.</p>
                  )}
                </div>

                {/* Comment creator */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ask a question or publish updates..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#22C55E]/50"
                  />
                  <Button type="submit" size="sm" className="text-xs px-4 bg-[#22C55E] hover:bg-[#1db053] text-white">Comment</Button>
                </form>
              </div>
            </div>

            {/* Right Metadata column */}
            <div className="space-y-4 bg-slate-900/10 border-l border-slate-850 pl-0 md:pl-6">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">State Column</span>
                <Badge variant={selectedTask.status === 'Done' ? 'success' : selectedTask.status === 'In Progress' ? 'warning' : 'primary'}>
                  {selectedTask.status}
                </Badge>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Card Priority</span>
                <Badge variant={getPriorityColor(selectedTask.priority)}>{selectedTask.priority}</Badge>
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

              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Labels</span>
                <div className="flex flex-wrap gap-1">
                  {selectedTask.labels?.map(l => (
                    <span key={l} className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-[8px] text-slate-300 font-bold rounded">
                      {l}
                    </span>
                  ))}
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
