import React, { useState, useEffect } from 'react';
import type { Task, TaskStatus, TaskPriority, User, Sprint } from '../../../../../../packages/shared/types';
import { StoryPoints } from '../components/StoryPoints';
import { 
  IoCloseOutline, 
  IoCheckmarkCircleOutline, 
  IoTrashOutline, 
  IoAddOutline, 
  IoTimeOutline, 
  IoAttachOutline, 
  IoChatboxEllipsesOutline, 
  IoFlashOutline,
  IoPencilOutline,
  IoSaveOutline,
  IoCalendarOutline
} from 'react-icons/io5';

interface TaskDetailsProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => Promise<any>;
  onDeleteTask: (id: string) => Promise<any>;
  users: User[];
  sprints: Sprint[];
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
  users,
  sprints,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'comments' | 'attachments'>('details');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Todo');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [sprintId, setSprintId] = useState('');
  const [storyPoints, setStoryPoints] = useState(3);
  const [estimatedTime, setEstimatedTime] = useState(8);
  const [loggedTime, setLoggedTime] = useState(0);
  const [timeToAdd, setTimeToAdd] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Checklist state
  const [newCheckitem, setNewCheckitem] = useState('');

  // Comment state
  const [newCommentText, setNewCommentText] = useState('');

  // Attachment state
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setAssigneeId(task.assigneeId || '');
      setSprintId(task.sprintId || '');
      setStoryPoints(task.storyPoints || 1);
      setEstimatedTime(task.estimatedTime || 4);
      setLoggedTime(task.loggedTime || 0);
      setDueDate(task.dueDate || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleFieldChange = async (updates: Partial<Task>) => {
    try {
      setSaving(true);
      await onUpdateTask(task._id, updates);
    } catch (err) {
      console.error('Failed to update task', err);
    } finally {
      setSaving(false);
    }
  };

  // ISSUE-M2: Clamp decimal hours input to prevent negative values
  const handleTimeToAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      setTimeToAdd('');
      return;
    }
    const num = parseFloat(rawVal);
    if (!isNaN(num)) {
      setTimeToAdd(num < 0 ? Math.abs(num).toString() : rawVal);
    } else {
      setTimeToAdd(rawVal);
    }
  };

  const handleTimeToAddBlur = () => {
    if (!timeToAdd) return;
    const num = parseFloat(timeToAdd);
    if (!isNaN(num) && num < 0) {
      setTimeToAdd(Math.abs(num).toString());
    }
  };

  const handleLogTimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hours = Math.abs(parseFloat(timeToAdd));
    if (isNaN(hours) || hours <= 0) return;

    const newLogged = (task.loggedTime || 0) + hours;
    await handleFieldChange({ loggedTime: newLogged });
    setTimeToAdd('');
  };

  const handleAddChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckitem.trim()) return;

    const currentList = task.checklist || [];
    const updatedList = [...currentList, { id: `chk-${Date.now()}`, text: newCheckitem.trim(), done: false }];
    await handleFieldChange({ checklist: updatedList });
    setNewCheckitem('');
  };

  const handleToggleCheckitem = async (checkId: string) => {
    const currentList = task.checklist || [];
    const updatedList = currentList.map(c => (c.id === checkId ? { ...c, done: !c.done } : c));
    await handleFieldChange({ checklist: updatedList });
  };

  const handleDeleteCheckitem = async (checkId: string) => {
    const currentList = task.checklist || [];
    const updatedList = currentList.filter(c => c.id !== checkId);
    await handleFieldChange({ checklist: updatedList });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const cachedUser = localStorage.getItem('stackpilot_user');
    const u = cachedUser ? JSON.parse(cachedUser) : { _id: 'u-1', name: 'Super Admin' };

    const currentComments = task.comments || [];
    const newComm = {
      id: `comm-${Date.now()}`,
      userId: u._id,
      userName: u.name,
      userAvatar: u.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.name)}`,
      text: newCommentText.trim(),
      createdAt: new Date().toISOString()
    };

    await handleFieldChange({ comments: [...currentComments, newComm] });
    setNewCommentText('');
  };

  const handleAddAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachmentName.trim()) return;

    const currentAtt = task.attachments || [];
    const newAtt = {
      id: `att-${Date.now()}`,
      name: attachmentName.trim(),
      url: attachmentUrl.trim() || 'https://via.placeholder.com/150',
      createdAt: new Date().toISOString(),
      size: '1.2 MB'
    };

    await handleFieldChange({ attachments: [...currentAtt, newAtt] });
    setAttachmentName('');
    setAttachmentUrl('');
  };

  const remaining = Math.max(0, (task.estimatedTime || 0) - (task.loggedTime || 0));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex justify-end transition-opacity duration-300">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Top Navigation Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-md bg-slate-200 text-slate-800">
              {task.taskId || task._id.slice(0, 8).toUpperCase()}
            </span>
            <span className="text-xs font-bold text-slate-500">{task.projectName}</span>
            {saving && <span className="text-[10px] font-bold text-emerald-600 animate-pulse">Saving...</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this task?')) {
                  onDeleteTask(task._id);
                  onClose();
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Task"
            >
              <IoTrashOutline size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <IoCloseOutline size={22} />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Editable Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={() => handleFieldChange({ title })}
              className="w-full text-lg font-black text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none py-1 transition-colors"
              placeholder="Task Title..."
            />
          </div>

          {/* Quick Select Fields Grid (Status, Priority, Assignee, Sprint, Story Points) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            {/* Status Picker */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Status</label>
              <select
                value={status}
                onChange={e => {
                  const val = e.target.value as TaskStatus;
                  setStatus(val);
                  handleFieldChange({ status: val });
                }}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="Backlog">Backlog</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
                <option value="Blocked">Blocked</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Priority Picker */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => {
                  const val = e.target.value as TaskPriority;
                  setPriority(val);
                  handleFieldChange({ priority: val });
                }}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Assignee Picker */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Assignee</label>
              <select
                value={assigneeId}
                onChange={e => {
                  const uid = e.target.value;
                  setAssigneeId(uid);
                  const selectedUser = users.find(u => u._id === uid);
                  handleFieldChange({ assigneeId: uid || undefined, assigneeName: selectedUser?.name });
                }}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Sprint Picker */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Sprint</label>
              <select
                value={sprintId}
                onChange={e => {
                  const spId = e.target.value;
                  setSprintId(spId);
                  const spr = sprints.find(s => s._id === spId);
                  handleFieldChange({ sprintId: spId || undefined, sprintName: spr?.name });
                }}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Backlog (No Sprint)</option>
                {sprints.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Story Points */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Story Points</label>
              <input
                type="number"
                min="1"
                max="50"
                value={storyPoints}
                onChange={e => setStoryPoints(Number(e.target.value))}
                onBlur={() => handleFieldChange({ storyPoints })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => {
                  setDueDate(e.target.value);
                  handleFieldChange({ dueDate: e.target.value });
                }}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Time Tracking Widget */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="flex items-center gap-1.5 text-emerald-400 uppercase tracking-wider">
                <IoTimeOutline size={15} /> Time Tracking
              </span>
              <span className="text-slate-400 font-medium">Estimated: {task.estimatedTime || 0}h</span>
            </div>

            {/* Time progress bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Logged: <strong className="text-emerald-400">{task.loggedTime || 0}h</strong></span>
                <span>Remaining: <strong className="text-amber-400">{remaining}h</strong></span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.round(((task.loggedTime || 0) / (task.estimatedTime || 1)) * 100))}%` }}
                />
              </div>
            </div>

            {/* Log Time Form */}
            <form onSubmit={handleLogTimeSubmit} className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <input
                type="number"
                step="0.5"
                min="0"
                value={timeToAdd}
                onChange={handleTimeToAddChange}
                onBlur={handleTimeToAddBlur}
                placeholder="Add hours (e.g. 2.5)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 transform-gpu transition-all duration-150 text-white text-xs font-bold cursor-pointer"
              >
                Log Time
              </button>
            </form>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Description</h4>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              onBlur={() => handleFieldChange({ description })}
              placeholder="Add detailed task requirements, technical context, or acceptance criteria..."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Checklist Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Checklist ({task.checklist?.filter(c => c.done).length || 0} / {task.checklist?.length || 0})
              </h4>
            </div>

            <div className="space-y-2">
              {task.checklist?.map(c => (
                <div key={c.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-xs group">
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={c.done}
                      onChange={() => handleToggleCheckitem(c.id)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span className={`font-semibold truncate ${c.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {c.text}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteCheckitem(c.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <IoTrashOutline size={14} />
                  </button>
                </div>
              ))}

              <form onSubmit={handleAddChecklist} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newCheckitem}
                  onChange={e => setNewCheckitem(e.target.value)}
                  placeholder="Add checklist item..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  <IoAddOutline size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Activity Timeline, Comments, & Attachments Tabs */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'details' ? 'border-emerald-600 text-emerald-700 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Activity Timeline
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'comments' ? 'border-emerald-600 text-emerald-700 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Comments ({task.comments?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('attachments')}
                className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'attachments' ? 'border-emerald-600 text-emerald-700 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Attachments ({task.attachments?.length || 0})
              </button>
            </div>

            {/* Activity Timeline View */}
            {activeTab === 'details' && (
              <div className="space-y-3">
                {(!task.activity || task.activity.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No activity recorded yet.</p>
                ) : (
                  task.activity.map(act => (
                    <div key={act.id} className="flex items-start gap-3 text-xs">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {act.user.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{act.user}</span>
                          <span className="text-[10px] text-slate-400">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{act.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Comments View */}
            {activeTab === 'comments' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {task.comments?.map(comm => (
                    <div key={comm.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={comm.userAvatar} alt={comm.userName} className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-xs font-bold text-slate-900">{comm.userName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{new Date(comm.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium pl-7">{comm.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Attachments View */}
            {activeTab === 'attachments' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {task.attachments?.map(att => (
                    <div key={att.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <IoAttachOutline size={16} className="text-slate-400" />
                        <div>
                          <a href={att.url} target="_blank" rel="noreferrer" className="font-bold text-emerald-700 hover:underline">
                            {att.name}
                          </a>
                          <span className="text-[10px] text-slate-400 block">{att.size} • {new Date(att.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddAttachment} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="text-xs font-bold text-slate-800">Attach Reference File</h5>
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={e => setAttachmentName(e.target.value)}
                    placeholder="File Title (e.g. Design Specs PDF)"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
                  />
                  <input
                    type="text"
                    value={attachmentUrl}
                    onChange={e => setAttachmentUrl(e.target.value)}
                    placeholder="File URL or Link"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      Add Attachment
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
