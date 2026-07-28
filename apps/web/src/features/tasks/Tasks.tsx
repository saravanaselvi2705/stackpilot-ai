import React, { useState, useEffect, useMemo } from 'react';
import { Button, Badge, ProgressBar } from '../../components/UI';
import { useCustomization } from '../../context/CustomizationContext';
import { useAuth } from '../../context/AuthContext';
import {
  IoAdd,
  IoSearchOutline,
  IoFilterOutline,
  IoSwapVerticalOutline,
  IoGridOutline,
  IoChatbubbleOutline,
  IoCheckmarkDoneOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoAttachOutline,
  IoTrashOutline,
  IoPersonOutline,
  IoCloseOutline,
  IoEllipsisHorizontal,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoEyeOutline,
  IoPencilOutline,
  IoChevronForwardOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoDocumentTextOutline,
  IoDownloadOutline
} from 'react-icons/io5';
import API from '../../services/api';
import type { Task, Project, User, TaskAttachment, TaskComment, TaskChecklistItem } from '../../../../../packages/shared/types';

export const Tasks: React.FC = () => {
  const { user } = useAuth();
  const { settings, hasPermission } = useCustomization();

  // Data states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeMembers, setActiveMembers] = useState<{ id: string; name: string; avatar: string; email?: string }[]>([]);

  // Toolbar state
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('All');
  const [sprintFilter, setSprintFilter] = useState<string>('All');
  const [dueDateFilter, setDueDateFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'id' | 'priority' | 'dueDate' | 'title' | 'createdAt'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [groupBy, setGroupBy] = useState<'Status' | 'Assignee' | 'Priority' | 'Sprint' | 'Project'>('Status');

  // Drawer & Modals state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [previewAttachment, setPreviewAttachment] = useState<TaskAttachment | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Drag & drop state
  const [activeDragCol, setActiveDragCol] = useState<Task['status'] | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  // Form & Drawer edit states
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDesc, setTaskDesc] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('Medium');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [taskEstimatedTime, setTaskEstimatedTime] = useState<number>(4);
  const [taskAssigneeId, setTaskAssigneeId] = useState<string>('');
  const [taskProjectId, setTaskProjectId] = useState<string>('');
  const [taskSprint, setTaskSprint] = useState<string>('Sprint 14');

  // Task Details Inline Editing State
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [isEditingDesc, setIsEditingDesc] = useState<boolean>(false);
  const [editedDesc, setEditedDesc] = useState<string>('');

  // Comment & Checklist & Attachment Inputs in Details Drawer
  const [commentText, setCommentText] = useState<string>('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');
  const [checkText, setCheckText] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [logTimeAmount, setLogTimeAmount] = useState<number>(1);

  // Load Tasks, Projects, and Users
  const loadWorkspaceData = async () => {
    try {
      const [projs, ts, users] = await Promise.all([
        API.projects.list(),
        API.tasks.list(),
        API.auth.listUsers(true)
      ]);
      setProjects(projs);
      setTasks(ts);

      const mappedUsers = users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        avatar: u.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.name)}`
      }));

      if (mappedUsers.length === 0) {
        setActiveMembers([{ id: 'u-1', name: 'Super Admin', email: 'admin@stackpilot.ai', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin' }]);
      } else {
        setActiveMembers(mappedUsers);
      }
    } catch (err) {
      console.error('Error loading workspace data:', err);
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, []);

  // Listen to deep-links to auto-trigger Create Task modal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'add' && hasPermission('PM', 'create')) {
      setAddModalOpen(true);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [hasPermission]);

  // Keep selectedTask in sync when tasks list updates
  useEffect(() => {
    if (selectedTask) {
      const updated = tasks.find(t => t._id === selectedTask._id);
      if (updated) setSelectedTask(updated);
    }
  }, [tasks]);

  // 7 Kanban Board Columns configuration
  const columns: { key: Task['status']; name: string; bgStyle: string; borderStyle: string }[] = [
    { key: 'Backlog', name: 'Backlog', bgStyle: 'bg-white dark:bg-slate-900/40', borderStyle: 'border-slate-200 dark:border-slate-800' },
    { key: 'Todo', name: 'Todo', bgStyle: 'bg-slate-50 dark:bg-slate-900/60', borderStyle: 'border-slate-200 dark:border-slate-800' },
    { key: 'In Progress', name: 'In Progress', bgStyle: 'bg-[#fffbeb]/70 dark:bg-[#78350f]/15', borderStyle: 'border-amber-200/50 dark:border-amber-900/30' },
    { key: 'In Review', name: 'In Review', bgStyle: 'bg-[#f0f9ff]/70 dark:bg-[#075985]/15', borderStyle: 'border-sky-200/50 dark:border-sky-900/30' },
    { key: 'Done', name: 'Done', bgStyle: 'bg-[#f0fdf4]/70 dark:bg-[#064e3b]/15', borderStyle: 'border-emerald-200/50 dark:border-emerald-900/30' },
    { key: 'Blocked', name: 'Blocked', bgStyle: 'bg-[#fef2f2]/70 dark:bg-[#7f1d1d]/15', borderStyle: 'border-red-200/50 dark:border-red-900/30' },
    { key: 'Cancelled', name: 'Cancelled', bgStyle: 'bg-slate-100/50 dark:bg-slate-900/30', borderStyle: 'border-slate-200 dark:border-slate-800' }
  ];

  // Priority color variants
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      case 'Medium': return 'primary';
      case 'Low': default: return 'secondary';
    }
  };

  // Helper to find member by ID
  const getMember = (id?: string) => {
    return activeMembers.find(m => m.id === id) || activeMembers[0] || { id: 'u-1', name: 'Super Admin', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin' };
  };

  // Helper to format timestamps relative
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 5) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Filter & Sort Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Project filter
      if (selectedProject !== 'All' && task.projectId !== selectedProject && task.projectName !== selectedProject) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'All' && task.status !== statusFilter) {
        return false;
      }
      // Priority filter
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) {
        return false;
      }
      // Assignee filter
      if (assigneeFilter !== 'All' && task.assigneeId !== assigneeFilter) {
        return false;
      }
      // Sprint filter
      if (sprintFilter !== 'All' && (task.sprint || 'Sprint 14') !== sprintFilter) {
        return false;
      }
      // Due Date filter
      if (dueDateFilter !== 'All' && task.dueDate) {
        const today = new Date().toISOString().split('T')[0];
        if (dueDateFilter === 'Overdue' && task.dueDate >= today) return false;
        if (dueDateFilter === 'Today' && task.dueDate !== today) return false;
      }
      // Search query (Task ID, Title, Description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const idMatch = (task.taskId || task._id).toLowerCase().includes(q);
        const titleMatch = task.title.toLowerCase().includes(q);
        const descMatch = (task.description || '').toLowerCase().includes(q);
        if (!idMatch && !titleMatch && !descMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') {
        comparison = (a.taskId || a._id).localeCompare(b.taskId || b._id);
      } else if (sortBy === 'priority') {
        const pMap = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        comparison = (pMap[a.priority] || 0) - (pMap[b.priority] || 0);
      } else if (sortBy === 'dueDate') {
        comparison = (a.dueDate || '').localeCompare(b.dueDate || '');
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'createdAt') {
        comparison = a.createdAt.localeCompare(b.createdAt);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tasks, selectedProject, statusFilter, priorityFilter, assigneeFilter, sprintFilter, dueDateFilter, searchQuery, sortBy, sortDirection]);

  // Create Task Handler
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !hasPermission('PM', 'create')) return;

    try {
      const projObj = projects.find(p => p._id === taskProjectId || p.name === taskProjectId);
      const assigneeObj = activeMembers.find(m => m.id === taskAssigneeId);

      await API.tasks.create({
        projectId: taskProjectId || projects[0]?._id || 'p-1',
        projectName: projObj?.name || 'StackPilot SaaS',
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
        dueDate: taskDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Todo',
        assigneeId: taskAssigneeId || activeMembers[0]?.id,
        assigneeName: assigneeObj?.name || activeMembers[0]?.name,
        sprint: taskSprint || 'Sprint 14',
        estimatedTime: taskEstimatedTime || 4,
        checklist: [],
        comments: [],
        attachments: []
      });

      // Reset form & reload
      setTaskTitle('');
      setTaskDesc('');
      setTaskPriority('Medium');
      setTaskDueDate('');
      setTaskEstimatedTime(4);
      setAddModalOpen(false);
      loadWorkspaceData();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  // Drag & Drop Handlers
  const handleCardDrop = async (taskId: string, targetStatus: Task['status']) => {
    if (!hasPermission('PM', 'edit')) return;
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: targetStatus, updatedAt: new Date().toISOString() } : t));
      await API.tasks.update(taskId, { status: targetStatus });
      loadWorkspaceData();
    } catch (err) {
      console.error('Error dropping task card:', err);
      loadWorkspaceData();
    }
  };

  // Task Details Drawer inspect trigger
  const handleInspectTask = (task: Task) => {
    setSelectedTask(task);
    setEditedTitle(task.title);
    setEditedDesc(task.description || '');
    setIsEditingTitle(false);
    setIsEditingDesc(false);
    setIsDrawerOpen(true);
  };

  // Save Inline Edit Title
  const handleSaveTitle = async () => {
    if (!selectedTask || !editedTitle.trim() || !hasPermission('PM', 'edit')) return;
    try {
      const res = await API.tasks.update(selectedTask._id, { title: editedTitle });
      setSelectedTask(res);
      setIsEditingTitle(false);
      loadWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  // Save Inline Edit Description
  const handleSaveDesc = async () => {
    if (!selectedTask || !hasPermission('PM', 'edit')) return;
    try {
      const res = await API.tasks.update(selectedTask._id, { description: editedDesc });
      setSelectedTask(res);
      setIsEditingDesc(false);
      loadWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Comment Handler
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !commentText.trim() || !hasPermission('PM', 'edit')) return;

    const cachedUser = localStorage.getItem('stackpilot_user');
    const u = cachedUser ? JSON.parse(cachedUser) : { _id: 'u-1', name: user?.name || 'Alexander Wright', avatarUrl: user?.avatarUrl };

    const newComment: TaskComment = {
      id: `c-${Date.now()}`,
      userId: u._id,
      userName: u.name,
      userAvatar: u.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.name)}`,
      text: commentText,
      createdAt: new Date().toISOString()
    };

    const updatedComments = [...(selectedTask.comments || []), newComment];
    try {
      const res = await API.tasks.update(selectedTask._id, { comments: updatedComments });
      setSelectedTask(res);
      setCommentText('');
      loadWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Comment Handler
  const handleSaveEditedComment = async (commentId: string) => {
    if (!selectedTask || !editingCommentText.trim() || !hasPermission('PM', 'edit')) return;
    const updated = (selectedTask.comments || []).map(c => {
      if (c.id === commentId) return { ...c, text: editingCommentText };
      return c;
    });

    try {
      const res = await API.tasks.update(selectedTask._id, { comments: updated });
      setSelectedTask(res);
      setEditingCommentId(null);
      setEditingCommentText('');
      loadWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Comment Handler
  const handleDeleteComment = async (commentId: string) => {
    if (!selectedTask || !hasPermission('PM', 'edit')) return;
    const updated = (selectedTask.comments || []).filter(c => c.id !== commentId);
    try {
      const res = await API.tasks.update(selectedTask._id, { comments: updated });
      setSelectedTask(res);
      loadWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  // Checklist Handlers
  const handleAddChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !checkText.trim() || !hasPermission('PM', 'edit')) return;

    const newItem: TaskChecklistItem = {
      id: `chk-${Date.now()}`,
      text: checkText,
      done: false
    };

    const updatedChecklist = [...(selectedTask.checklist || []), newItem];
    try {
      const res = await API.tasks.update(selectedTask._id, { checklist: updatedChecklist });
      setSelectedTask(res);
      setCheckText('');
      loadWorkspaceData();
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
      loadWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveChecklist = async (index: number, direction: 'up' | 'down') => {
    if (!selectedTask || !selectedTask.checklist || !hasPermission('PM', 'edit')) return;
    const list = [...selectedTask.checklist];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    try {
      const res = await API.tasks.update(selectedTask._id, { checklist: list });
      setSelectedTask(res);
      loadWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChecklist = async (itemId: string) => {
    if (!selectedTask || !hasPermission('PM', 'edit')) return;
    const updatedChecklist = selectedTask.checklist?.filter(item => item.id !== itemId);
    try {
      const res = await API.tasks.update(selectedTask._id, { checklist: updatedChecklist });
      setSelectedTask(res);
      loadWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  // Attachment Handlers
  const handleAddAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !attachmentName.trim() || !hasPermission('PM', 'edit')) return;

    const ext = attachmentName.split('.').pop()?.toLowerCase();
    let type: TaskAttachment['type'] = 'other';
    if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext || '')) type = 'image';
    else if (ext === 'pdf') type = 'pdf';
    else if (['doc', 'docx'].includes(ext || '')) type = 'docx';
    else if (['xls', 'xlsx'].includes(ext || '')) type = 'excel';
    else if (['zip', 'rar', '7z'].includes(ext || '')) type = 'zip';

    const newAttach: TaskAttachment = {
      id: `att-${Date.now()}`,
      name: attachmentName,
      url: '#',
      size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
      type,
      createdAt: new Date().toISOString()
    };

    const updated = [...(selectedTask.attachments || []), newAttach];
    try {
      const res = await API.tasks.update(selectedTask._id, { attachments: updated });
      setSelectedTask(res);
      setAttachmentName('');
      loadWorkspaceData();
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
      loadWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  // Time Tracking Handlers
  const handleLogTime = async (hoursToAdd: number) => {
    if (!selectedTask || !hasPermission('PM', 'edit')) return;
    const newLogged = (selectedTask.loggedTime || 0) + hoursToAdd;
    try {
      const res = await API.tasks.update(selectedTask._id, { loggedTime: newLogged });
      setSelectedTask(res);
      loadWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  // Property Change Handlers for Drawer
  const handleDrawerPropertyChange = async (key: keyof Task, val: any) => {
    if (!selectedTask || !hasPermission('PM', 'edit')) return;
    try {
      const res = await API.tasks.update(selectedTask._id, { [key]: val });
      setSelectedTask(res);
      loadWorkspaceData();
    } catch (err) {
      console.error(err);
    }
  };

  // Render Task Card Component
  const renderTaskCard = (t: Task) => {
    const assignee = getMember(t.assigneeId);
    const projectNameStr = t.projectName || projects.find(p => p._id === t.projectId)?.name || 'StackPilot SaaS';
    const taskIdDisplay = t.taskId || t._id;
    const checklistDone = t.checklist?.filter(i => i.done).length || 0;
    const checklistTotal = t.checklist?.length || 0;

    return (
      <div
        key={t._id}
        draggable
        onDragStart={(e) => {
          setDraggingTaskId(t._id);
          e.dataTransfer.setData('text/plain', t._id);
        }}
        onDragEnd={() => setDraggingTaskId(null)}
        onClick={() => handleInspectTask(t)}
        className={`p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2.5 shadow-xs transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-[#22C55E]/40 ${draggingTaskId === t._id ? 'opacity-40 scale-95 border-dashed border-[#22C55E]' : ''
          }`}
      >
        {/* Header Row: Task ID & Priority */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/60">
            {taskIdDisplay}
          </span>
          <Badge variant={getPriorityColor(t.priority)}>{t.priority}</Badge>
        </div>

        {/* Task Title */}
        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-[#22C55E] transition-colors">
          {t.title}
        </h4>

        {/* Short Description (2 lines max) */}
        {t.description && (
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {t.description}
          </p>
        )}

        {/* Project Name */}
        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <span className="text-slate-400 dark:text-slate-500">Project:</span>
          <span className="text-slate-700 dark:text-slate-300 truncate max-w-[170px]">{projectNameStr}</span>
        </div>

        {/* Card Footer: Metadata & Assignee */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-2 mt-1 text-[10px]">
          {/* Left metrics */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
            {t.comments && t.comments.length > 0 && (
              <span className="flex items-center gap-0.5" title={`${t.comments.length} Comments`}>
                <IoChatbubbleOutline size={11} /> {t.comments.length}
              </span>
            )}
            {checklistTotal > 0 && (
              <span className="flex items-center gap-0.5" title={`Checklist ${checklistDone}/${checklistTotal}`}>
                <IoCheckmarkDoneOutline size={11} /> {checklistDone}/{checklistTotal}
              </span>
            )}
            {t.attachments && t.attachments.length > 0 && (
              <span className="flex items-center gap-0.5" title={`${t.attachments.length} Attachments`}>
                <IoAttachOutline size={11} /> {t.attachments.length}
              </span>
            )}
            {t.estimatedTime !== undefined && t.estimatedTime > 0 && (
              <span className="flex items-center gap-0.5 font-mono text-emerald-600 dark:text-emerald-400" title={`Logged ${t.loggedTime || 0}h / ${t.estimatedTime}h`}>
                <IoTimeOutline size={11} /> {t.loggedTime || 0}/{t.estimatedTime}h
              </span>
            )}
          </div>

          {/* Right Assignee & Last Updated */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-400 dark:text-slate-500" title={t.updatedAt ? new Date(t.updatedAt).toLocaleString() : ''}>
              {formatTimeAgo(t.updatedAt || t.createdAt)}
            </span>
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="w-5.5 h-5.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 object-cover"
              title={`Assigned to: ${assignee.name}`}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render Standard Kanban Grid (7 Columns)
  const renderStandardKanban = (boardTasks: Task[]) => {
    return (
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start min-h-[calc(100vh-270px)]">
        {columns.map(col => {
          const colTasks = boardTasks.filter(t => t.status === col.key);
          const isDropActive = activeDragCol === col.key;

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
              className={`flex-1 min-w-[275px] max-w-[320px] rounded-xl p-3 flex flex-col border transition-all duration-200 ${col.bgStyle} ${col.borderStyle} ${isDropActive ? 'ring-2 ring-[#22C55E] scale-[1.01] bg-[#22C55E]/10' : ''
                }`}
            >
              {/* Column Clean Text Header - strictly text-only, no colored status icons */}
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200/70 dark:border-slate-800/80 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide font-display">
                    {col.name}
                  </h3>
                  <span className="px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-full font-mono">
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                  <button
                    onClick={() => {
                      setTaskPriority('Medium');
                      setAddModalOpen(true);
                    }}
                    title="Add task to column"
                    className="p-1 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <IoAdd size={15} />
                  </button>
                  <button
                    title="Column options"
                    className="p-1 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <IoEllipsisHorizontal size={14} />
                  </button>
                </div>
              </div>

              {/* Tasks List / Empty State */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-320px)] pr-0.5 min-h-[160px]">
                {colTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-200/60 dark:border-slate-800/60 rounded-xl my-2">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">No tasks</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">Create a new task to get started.</span>
                  </div>
                ) : (
                  colTasks.map(t => renderTaskCard(t))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-xs">
        {/* Row 1: Breadcrumb, Title & New Task Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <span>Projects</span>
              <span>/</span>
              <span className="text-[#22C55E]">StackPilot SaaS</span>
              <span>/</span>
              <span>Task Board</span>
            </div>
            <h1 className="text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight mt-0.5">
              Enterprise Task Board
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Assignee Filter Avatars */}
            <div className="hidden lg:flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Assignee:</span>
              <button
                onClick={() => setAssigneeFilter('All')}
                className={`text-[10px] px-2 py-1 rounded-full font-bold transition-all ${assigneeFilter === 'All'
                    ? 'bg-[#22C55E] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                All
              </button>
              {activeMembers.slice(0, 4).map(m => (
                <button
                  key={m.id}
                  onClick={() => setAssigneeFilter(assigneeFilter === m.id ? 'All' : m.id)}
                  title={m.name}
                  className={`relative rounded-full transition-transform ${assigneeFilter === m.id ? 'ring-2 ring-[#22C55E] scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                >
                  <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-800 object-cover" />
                </button>
              ))}
            </div>

            {hasPermission('PM', 'create') && (
              <Button
                onClick={() => setAddModalOpen(true)}
                className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white shadow-sm font-bold px-4 py-2"
              >
                <IoAdd size={16} /> + New Task
              </Button>
            )}
          </div>
        </div>

        {/* Row 2: Controls Toolbar (Search, Project, Filter, Sort, Group By) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <IoSearchOutline size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Task ID, title, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#22C55E]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <IoCloseOutline size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Project Selector */}
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-[#22C55E]"
            >
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-[#22C55E]"
            >
              <option value="All">All Statuses</option>
              {columns.map(c => (
                <option key={c.key} value={c.key}>{c.name}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-[#22C55E]"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Sprint Filter */}
            <select
              value={sprintFilter}
              onChange={(e) => setSprintFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-[#22C55E]"
            >
              <option value="All">All Sprints</option>
              <option value="Sprint 14">Sprint 14 (Active)</option>
              <option value="Sprint 15">Sprint 15</option>
              <option value="Sprint 16">Sprint 16</option>
              <option value="Backlog">Sprint Backlog</option>
            </select>

            {/* Sort Dropdown & Direction */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase mr-1.5 flex items-center gap-1">
                <IoSwapVerticalOutline size={12} /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="priority">Priority</option>
                <option value="id">Task ID</option>
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="createdAt">Created Date</option>
              </select>
              <button
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="ml-1 text-slate-400 hover:text-slate-800 dark:hover:text-white p-0.5 cursor-pointer"
                title={`Sort Direction: ${sortDirection}`}
              >
                {sortDirection === 'asc' ? <IoArrowUpOutline size={12} /> : <IoArrowDownOutline size={12} />}
              </button>
            </div>

            {/* Group By Selector */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase mr-1.5 flex items-center gap-1">
                <IoGridOutline size={12} /> Group:
              </span>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="Status">Status (7 Columns)</option>
                <option value="Assignee">Assignee Swimlanes</option>
                <option value="Priority">Priority Swimlanes</option>
                <option value="Sprint">Sprint Swimlanes</option>
                <option value="Project">Project Swimlanes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Board Workspace Rendering */}
      {groupBy === 'Status' && renderStandardKanban(filteredTasks)}

      {groupBy === 'Assignee' && (
        <div className="space-y-6">
          {activeMembers.map(member => {
            const memberTasks = filteredTasks.filter(t => t.assigneeId === member.id);
            return (
              <div key={member.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <img src={member.avatar} alt={member.name} className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-800" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{member.name}</h3>
                    <p className="text-[10px] text-slate-500 font-medium">{member.email}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {memberTasks.length} tasks
                  </span>
                </div>
                {renderStandardKanban(memberTasks)}
              </div>
            );
          })}
        </div>
      )}

      {groupBy === 'Priority' && (
        <div className="space-y-6">
          {(['Critical', 'High', 'Medium', 'Low'] as Task['priority'][]).map(prio => {
            const prioTasks = filteredTasks.filter(t => t.priority === prio);
            return (
              <div key={prio} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(prio)}>{prio} Priority</Badge>
                    <span className="text-xs text-slate-500 font-semibold">Swimlane</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {prioTasks.length} tasks
                  </span>
                </div>
                {renderStandardKanban(prioTasks)}
              </div>
            );
          })}
        </div>
      )}

      {groupBy === 'Sprint' && (
        <div className="space-y-6">
          {['Sprint 14', 'Sprint 15', 'Sprint 16', 'Sprint Backlog'].map(sprint => {
            const sprintTasks = filteredTasks.filter(t => (t.sprint || 'Sprint 14') === sprint || (sprint === 'Sprint Backlog' && t.sprint === 'Backlog'));
            return (
              <div key={sprint} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display uppercase tracking-wider">{sprint}</h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {sprintTasks.length} tasks
                  </span>
                </div>
                {renderStandardKanban(sprintTasks)}
              </div>
            );
          })}
        </div>
      )}

      {groupBy === 'Project' && (
        <div className="space-y-6">
          {projects.map(proj => {
            const projTasks = filteredTasks.filter(t => t.projectId === proj._id || t.projectName === proj.name);
            return (
              <div key={proj._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display">{proj.name}</h3>
                    <p className="text-[10px] text-slate-500">{proj.description}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {projTasks.length} tasks
                  </span>
                </div>
                {renderStandardKanban(projTasks)}
              </div>
            );
          })}
        </div>
      )}

      {/* New Task Modal Form */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">+ Create New Task</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg">
                <IoCloseOutline size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Integrate Payment Gateway Webhook"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide task scope, criteria, or context..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Project</label>
                  <select
                    value={taskProjectId}
                    onChange={(e) => setTaskProjectId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Assignee</label>
                  <select
                    value={taskAssigneeId}
                    onChange={(e) => setTaskAssigneeId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    {activeMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sprint</label>
                  <select
                    value={taskSprint}
                    onChange={(e) => setTaskSprint(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="Sprint 14">Sprint 14</option>
                    <option value="Sprint 15">Sprint 15</option>
                    <option value="Sprint 16">Sprint 16</option>
                    <option value="Backlog">Backlog</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Est. Hours</label>
                  <input
                    type="number"
                    min="1"
                    value={taskEstimatedTime}
                    onChange={(e) => setTaskEstimatedTime(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 outline-none cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <Button type="button" variant="secondary" onClick={() => setAddModalOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white font-bold">
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Task Details Side Drawer */}
      {isDrawerOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200 overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700">
                  {selectedTask.taskId || selectedTask._id}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {selectedTask.projectName || projects.find(p => p._id === selectedTask.projectId)?.name || 'StackPilot SaaS'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {user?.role === 'Super Admin' && (
                  <button
                    onClick={() => setTaskToDelete(selectedTask)}
                    title="Delete Task (Super Admin)"
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-500/10 cursor-pointer transition-colors"
                  >
                    <IoTrashOutline size={16} />
                  </button>
                )}
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <IoCloseOutline size={20} />
                </button>
              </div>
            </div>

            {/* Drawer Content split layout */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
              {/* Left Panel: Main Content */}
              <div className="lg:col-span-2 p-6 space-y-6">
                {/* Title */}
                <div>
                  {isEditingTitle ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="flex-1 text-lg font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1 text-slate-900 dark:text-white outline-none"
                      />
                      <Button size="sm" onClick={handleSaveTitle} className="text-xs bg-[#22C55E]">Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => setIsEditingTitle(false)} className="text-xs">Cancel</Button>
                    </div>
                  ) : (
                    <h2
                      onClick={() => { setEditedTitle(selectedTask.title); setIsEditingTitle(true); }}
                      className="text-xl font-bold font-display text-slate-900 dark:text-white group flex items-center gap-2 cursor-pointer hover:text-[#22C55E] transition-colors"
                    >
                      <span>{selectedTask.title}</span>
                      <IoPencilOutline size={14} className="opacity-0 group-hover:opacity-100 text-slate-400" />
                    </h2>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</h4>
                    {!isEditingDesc && (
                      <button
                        onClick={() => { setEditedDesc(selectedTask.description || ''); setIsEditingDesc(true); }}
                        className="text-[10px] text-[#22C55E] font-bold hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {isEditingDesc ? (
                    <div className="space-y-2">
                      <textarea
                        rows={4}
                        value={editedDesc}
                        onChange={(e) => setEditedDesc(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white outline-none resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="secondary" onClick={() => setIsEditingDesc(false)} className="text-xs">Cancel</Button>
                        <Button size="sm" onClick={handleSaveDesc} className="text-xs bg-[#22C55E]">Save Description</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {selectedTask.description || <span className="italic text-slate-400">No description provided. Click edit to add details.</span>}
                    </div>
                  )}
                </div>

                {/* Attachments Section */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <IoAttachOutline size={14} className="text-[#22C55E]" />
                      <span>Attachments ({selectedTask.attachments?.length || 0})</span>
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {selectedTask.attachments?.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                        <div className="flex items-center gap-2.5">
                          <IoDocumentTextOutline size={16} className="text-[#22C55E]" />
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">{file.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{file.size} • Uploaded {formatTimeAgo(file.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewAttachment(file)}
                            className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                          >
                            <IoEyeOutline size={12} /> Preview
                          </button>
                          <button
                            onClick={() => handleDeleteAttachment(file.id)}
                            className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                            title="Delete file"
                          >
                            <IoTrashOutline size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Attachment Form */}
                  <form onSubmit={handleAddAttachment} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      required
                      placeholder="Attach file name (e.g. Architecture_Diagram.png)..."
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]"
                    />
                    <Button type="submit" size="sm" className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">Upload</Button>
                  </form>
                </div>

                {/* Checklist Section */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <IoCheckmarkDoneOutline size={14} className="text-[#22C55E]" />
                      <span>Checklist</span>
                    </h4>
                    {selectedTask.checklist && selectedTask.checklist.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                        {selectedTask.checklist.filter(i => i.done).length} of {selectedTask.checklist.length} completed
                      </span>
                    )}
                  </div>

                  {selectedTask.checklist && selectedTask.checklist.length > 0 && (
                    <ProgressBar
                      value={Math.round((selectedTask.checklist.filter(i => i.done).length / selectedTask.checklist.length) * 100)}
                      color="bg-[#22C55E]"
                    />
                  )}

                  <div className="space-y-2">
                    {selectedTask.checklist?.map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={item.done}
                            onChange={() => handleToggleChecklist(item.id, item.done)}
                            className="w-4 h-4 rounded border-slate-300 text-[#22C55E] focus:ring-0 cursor-pointer"
                          />
                          <span className={`${item.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                            {item.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveChecklist(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Move up"
                          >
                            <IoArrowUpOutline size={12} />
                          </button>
                          <button
                            onClick={() => handleMoveChecklist(idx, 'down')}
                            disabled={idx === (selectedTask.checklist?.length || 0) - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Move down"
                          >
                            <IoArrowDownOutline size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteChecklist(item.id)}
                            className="p-1 text-slate-400 hover:text-red-500 cursor-pointer ml-1"
                            title="Delete item"
                          >
                            <IoTrashOutline size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddChecklist} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Add step-by-step checklist task..."
                      value={checkText}
                      onChange={(e) => setCheckText(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]"
                    />
                    <Button type="submit" size="sm" className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">Add Item</Button>
                  </form>
                </div>

                {/* Comments Section */}
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <IoChatbubbleOutline size={14} className="text-[#22C55E]" />
                    <span>Comments ({selectedTask.comments?.length || 0})</span>
                  </h4>

                  <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                    {selectedTask.comments && selectedTask.comments.length > 0 ? (
                      selectedTask.comments.map(c => (
                        <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={c.userAvatar || getMember(c.userId).avatar} alt={c.userName} className="w-5 h-5 rounded-full object-cover" />
                              <span className="font-bold text-slate-800 dark:text-slate-200">{c.userName}</span>
                              <span className="text-[9px] text-slate-400 font-mono">{formatTimeAgo(c.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => { setEditingCommentId(c.id); setEditingCommentText(c.text); }}
                                className="text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer px-1"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(c.id)}
                                className="text-[10px] text-slate-400 hover:text-red-500 cursor-pointer px-1"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {editingCommentId === c.id ? (
                            <div className="space-y-2 pt-1">
                              <input
                                type="text"
                                value={editingCommentText}
                                onChange={(e) => setEditingCommentText(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                              />
                              <div className="flex justify-end gap-1.5">
                                <Button size="sm" variant="secondary" onClick={() => setEditingCommentId(null)} className="text-[10px]">Cancel</Button>
                                <Button size="sm" onClick={() => handleSaveEditedComment(c.id)} className="text-[10px] bg-[#22C55E]">Save</Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{c.text}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No comments yet. Write an update below.</p>
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Add a comment or update..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]"
                    />
                    <Button type="submit" size="sm" className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white font-bold">Comment</Button>
                  </form>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <IoTimeOutline size={14} className="text-[#22C55E]" />
                    <span>Activity Timeline</span>
                  </h4>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {selectedTask.activity && selectedTask.activity.length > 0 ? (
                      selectedTask.activity.map(act => (
                        <div key={act.id} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-[#22C55E] mt-1.5 shrink-0" />
                          <div className="flex-1">
                            <p className="leading-tight">
                              <strong className="text-slate-800 dark:text-slate-200">{act.user}</strong> {act.text}
                            </p>
                            <span className="text-[9px] text-slate-400 font-mono">{formatTimeAgo(act.timestamp)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No activity history recorded.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel: Properties */}
              <div className="p-6 space-y-5 bg-slate-50/60 dark:bg-slate-950/30 text-xs">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">
                  Task Properties
                </h3>

                {/* Status */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleDrawerPropertyChange('status', e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-[#22C55E]"
                  >
                    {columns.map(c => (
                      <option key={c.key} value={c.key}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Priority</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => handleDrawerPropertyChange('priority', e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-[#22C55E]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assignee</label>
                  <div className="flex items-center gap-2">
                    <img
                      src={getMember(selectedTask.assigneeId).avatar}
                      alt="Assignee"
                      className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-800"
                    />
                    <select
                      value={selectedTask.assigneeId || ''}
                      onChange={(e) => handleDrawerPropertyChange('assigneeId', e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-[#22C55E]"
                    >
                      {activeMembers.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Project</label>
                  <select
                    value={selectedTask.projectId}
                    onChange={(e) => {
                      const proj = projects.find(p => p._id === e.target.value);
                      handleDrawerPropertyChange('projectId', e.target.value);
                      if (proj) handleDrawerPropertyChange('projectName', proj.name);
                    }}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-[#22C55E]"
                  >
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Reporter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Reporter</label>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                    {selectedTask.reporterName || 'Super Admin'}
                  </span>
                </div>

                {/* Sprint */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sprint</label>
                  <select
                    value={selectedTask.sprint || 'Sprint 14'}
                    onChange={(e) => handleDrawerPropertyChange('sprint', e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-[#22C55E]"
                  >
                    <option value="Sprint 14">Sprint 14</option>
                    <option value="Sprint 15">Sprint 15</option>
                    <option value="Sprint 16">Sprint 16</option>
                    <option value="Backlog">Sprint Backlog</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Due Date</label>
                  <input
                    type="date"
                    value={selectedTask.dueDate || ''}
                    onChange={(e) => handleDrawerPropertyChange('dueDate', e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-[#22C55E]"
                  />
                </div>

                {/* Time Tracking (Estimated, Logged, Remaining) */}
                <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Time Tracking</label>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase block font-bold">Estimated</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">{selectedTask.estimatedTime || 0}h</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase block font-bold">Logged</span>
                      <span className="text-xs font-bold text-[#22C55E] font-mono">{selectedTask.loggedTime || 0}h</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase block font-bold">Remaining</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {Math.max(0, (selectedTask.estimatedTime || 0) - (selectedTask.loggedTime || 0))}h
                      </span>
                    </div>
                  </div>

                  {/* Quick Log Time Action */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <Button size="sm" onClick={() => handleLogTime(1)} className="text-[10px] flex-1 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300">
                      +1 Hour
                    </Button>
                    <Button size="sm" onClick={() => handleLogTime(2)} className="text-[10px] flex-1 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300">
                      +2 Hours
                    </Button>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Created Date:</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300">{new Date(selectedTask.createdAt).toLocaleDateString()}</span>
                  </div>
                  {selectedTask.updatedAt && (
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-mono text-slate-600 dark:text-slate-300">{formatTimeAgo(selectedTask.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                <IoDocumentTextOutline className="text-[#22C55E]" size={16} />
                <span>Attachment Preview: {previewAttachment.name}</span>
              </h3>
              <button onClick={() => setPreviewAttachment(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg">
                <IoCloseOutline size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
                {previewAttachment.type === 'image' ? (
                  <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 font-bold">
                    [ Simulated Image Preview: {previewAttachment.name} ]
                  </div>
                ) : (
                  <div className="space-y-2">
                    <IoDocumentTextOutline size={48} className="text-[#22C55E] mx-auto" />
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{previewAttachment.name}</p>
                    <p className="text-xs text-slate-400 font-mono">File Size: {previewAttachment.size} • Format: {previewAttachment.type?.toUpperCase()}</p>
                    <p className="text-xs text-slate-500 max-w-md">Enterprise file document preview validated for StackPilot v1.0.6. Ready for secure download.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <Button variant="secondary" onClick={() => setPreviewAttachment(null)} className="text-xs">
                  Close Preview
                </Button>
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent("StackPilot AI Document Preview for " + previewAttachment.name)}`}
                  download={previewAttachment.name}
                  className="px-4 py-2 bg-[#22C55E] hover:bg-[#1db053] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <IoDownloadOutline size={14} /> Download File
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Super Admin Delete Task Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Confirm Task Deletion</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete task <strong className="text-slate-900 dark:text-white">"{taskToDelete.title}"</strong> ({taskToDelete.taskId})? This will record an audit log entry in system activities.
            </p>
            <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
              <Button variant="secondary" onClick={() => setTaskToDelete(null)} className="text-xs">
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  await API.tasks.delete(taskToDelete._id);
                  setTaskToDelete(null);
                  setIsDrawerOpen(false);
                  loadWorkspaceData();
                }}
                className="text-xs"
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
