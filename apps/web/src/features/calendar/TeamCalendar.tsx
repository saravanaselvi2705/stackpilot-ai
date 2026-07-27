import React, { useState, useMemo } from 'react';
import { Card, Badge, Button, Modal } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { 
  IoAdd, 
  IoChevronBackOutline, 
  IoChevronForwardOutline, 
  IoTimeOutline, 
  IoCalendarOutline,
  IoLocationOutline,
  IoBookmarkOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoCopyOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoPersonOutline,
  IoFolderOutline,
  IoNotificationsOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';

export type EventCategory = 
  | 'Meeting' 
  | 'Task' 
  | 'Milestone' 
  | 'Deadline' 
  | 'Leave' 
  | 'Client Meeting' 
  | 'Invoice' 
  | 'Personal';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  category: EventCategory;
  desc: string;
  project?: string;
  client?: string;
  assignee?: string;
  recurring?: 'None' | 'Weekly' | 'Monthly' | 'Yearly';
  reminder?: '15 mins before' | '1 hour before' | '1 day before' | 'None';
  status?: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
}

const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string; dot: string; border: string }> = {
  'Meeting': { bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500', border: 'border-blue-500/30' },
  'Task': { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500', border: 'border-amber-500/30' },
  'Milestone': { bg: 'bg-yellow-500/10 dark:bg-yellow-500/20', text: 'text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500', border: 'border-yellow-500/30' },
  'Deadline': { bg: 'bg-red-500/10 dark:bg-red-500/20', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500', border: 'border-red-500/30' },
  'Leave': { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500', border: 'border-purple-500/30' },
  'Client Meeting': { bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', dot: 'bg-indigo-500', border: 'border-indigo-500/30' },
  'Invoice': { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', border: 'border-emerald-500/30' },
  'Personal': { bg: 'bg-teal-500/10 dark:bg-teal-500/20', text: 'text-teal-600 dark:text-teal-400', dot: 'bg-teal-500', border: 'border-teal-500/30' }
};

const INITIAL_EVENTS: CalendarEvent[] = [];

export const TeamCalendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 6, 1)); // Default July 2026
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('10:00 AM');
  const [endTime, setEndTime] = useState<string>('11:00 AM');
  const [category, setCategory] = useState<EventCategory>('Meeting');
  const [desc, setDesc] = useState<string>('');
  const [project, setProject] = useState<string>('');
  const [client, setClient] = useState<string>('');
  const [assignee, setAssignee] = useState<string>('Alexander Wright');
  const [recurring, setRecurring] = useState<CalendarEvent['recurring']>('None');
  const [reminder, setReminder] = useState<CalendarEvent['reminder']>('15 mins before');

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            e.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (e.project && e.project.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, categoryFilter]);

  // Open modal for new event or editing
  const handleOpenModal = (evtToEdit?: CalendarEvent | null) => {
    if (evtToEdit) {
      setEditingEvent(evtToEdit);
      setTitle(evtToEdit.title);
      setDate(evtToEdit.date);
      setStartTime(evtToEdit.startTime);
      setEndTime(evtToEdit.endTime);
      setCategory(evtToEdit.category);
      setDesc(evtToEdit.desc);
      setProject(evtToEdit.project || '');
      setClient(evtToEdit.client || '');
      setAssignee(evtToEdit.assignee || 'Alexander Wright');
      setRecurring(evtToEdit.recurring || 'None');
      setReminder(evtToEdit.reminder || '15 mins before');
    } else {
      setEditingEvent(null);
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setStartTime('10:00 AM');
      setEndTime('11:00 AM');
      setCategory('Meeting');
      setDesc('');
      setProject('');
      setClient('');
      setAssignee(user?.name || 'Alexander Wright');
      setRecurring('None');
      setReminder('15 mins before');
    }
    setModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    if (editingEvent) {
      setEvents(events.map(item => item.id === editingEvent.id ? {
        ...item,
        title,
        date,
        startTime,
        endTime,
        category,
        desc,
        project,
        client,
        assignee,
        recurring,
        reminder
      } : item));
    } else {
      const newEvt: CalendarEvent = {
        id: `e-${Date.now()}`,
        title,
        date,
        startTime,
        endTime,
        category,
        desc,
        project,
        client,
        assignee,
        recurring,
        reminder,
        status: 'Upcoming'
      };
      setEvents([newEvt, ...events]);
    }
    setModalOpen(false);
  };

  const handleDuplicate = (evt: CalendarEvent) => {
    const dup: CalendarEvent = {
      ...evt,
      id: `e-${Date.now()}`,
      title: `${evt.title} (Copy)`
    };
    setEvents([dup, ...events]);
  };

  const handleDeleteConfirmed = () => {
    if (eventToDelete) {
      setEvents(events.filter(e => e.id !== eventToDelete.id));
      setEventToDelete(null);
    }
  };

  // Date Navigation Helpers
  const handlePrev = () => {
    if (currentView === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (currentView === 'week') {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(currentDate.getDate() - 7);
      setCurrentDate(prevWeek);
    } else {
      const prevDay = new Date(currentDate);
      prevDay.setDate(currentDate.getDate() - 1);
      setCurrentDate(prevDay);
    }
  };

  const handleNext = () => {
    if (currentView === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (currentView === 'week') {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(currentDate.getDate() + 7);
      setCurrentDate(nextWeek);
    } else {
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      setCurrentDate(nextDay);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month Grid Calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const calendarCells: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthTotalDays - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    const dateStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    calendarCells.push({ day: dayNum, dateStr, isCurrentMonth: false });
  }

  // Current month
  for (let i = 1; i <= totalDays; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({ day: i, dateStr, isCurrentMonth: true });
  }

  // Next month padding
  const remainingSlots = 42 - calendarCells.length;
  for (let i = 1; i <= remainingSlots; i++) {
    const nextMonthDate = new Date(year, month + 1, i);
    const dateStr = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({ day: i, dateStr, isCurrentMonth: false });
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">Enterprise Calendar</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Schedule meetings, track milestone deadlines, client check-ins, and leave requests.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs">
            {(['month', 'week', 'day', 'agenda'] as const).map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  currentView === view
                    ? 'bg-white dark:bg-slate-800 text-[#22C55E] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <Button onClick={() => handleOpenModal()} className="text-xs flex items-center gap-1.5 bg-[#22C55E] text-white hover:bg-[#1db053]">
            <IoAdd size={16} /> Add Event
          </Button>
        </div>
      </div>

      {/* Toolbar: Navigation, Search, Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Month/Date Controls */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleToday} className="text-xs px-3 py-1.5">
            Today
          </Button>
          <div className="flex items-center gap-1">
            <button 
              onClick={handlePrev} 
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <IoChevronBackOutline size={16} />
            </button>
            <button 
              onClick={handleNext} 
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <IoChevronForwardOutline size={16} />
            </button>
          </div>
          <h2 className="text-base font-black text-slate-900 dark:text-white ml-2">
            {monthNames[month]} {year}
          </h2>
        </div>

        {/* Search and Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <IoSearchOutline className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search schedule..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-900 dark:text-slate-200 placeholder-slate-400 w-36"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <IoFilterOutline className="text-slate-400" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer text-slate-900 dark:text-slate-200"
            >
              <option value="All" className="dark:bg-slate-900">All Categories</option>
              {Object.keys(CATEGORY_COLORS).map(cat => (
                <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid + Upcoming Schedule Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left 3 Columns: Calendar Grid / View */}
        <div className="lg:col-span-3 space-y-4">

          {/* 1. MONTH VIEW */}
          {currentView === 'month' && (
            <Card className="p-4 overflow-hidden border border-slate-200 dark:border-slate-800">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* 7x6 Calendar Cells */}
              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((cell, idx) => {
                  const dayEvents = filteredEvents.filter(e => e.date === cell.dateStr);
                  const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        setDate(cell.dateStr);
                        handleOpenModal();
                      }}
                      className={`min-h-[100px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        cell.isCurrentMonth 
                          ? 'bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 hover:border-[#22C55E]/50' 
                          : 'bg-slate-50/50 dark:bg-slate-900/10 border-transparent text-slate-400 opacity-40'
                      } ${isToday ? 'ring-2 ring-[#22C55E] bg-[#22C55E]/5' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-black ${isToday ? 'text-[#22C55E]' : cell.isCurrentMonth ? 'text-slate-900 dark:text-slate-200' : 'text-slate-400'}`}>
                          {cell.day}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] font-bold">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* Event items preview */}
                      <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map(evt => {
                          const catMeta = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['Meeting'];
                          return (
                            <div 
                              key={evt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModal(evt);
                              }}
                              className={`p-1 rounded text-[10px] font-bold truncate border ${catMeta.bg} ${catMeta.text} ${catMeta.border} hover:opacity-80`}
                              title={`${evt.startTime} - ${evt.title}`}
                            >
                              {evt.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <span className="text-[9px] text-slate-500 font-bold block truncate">
                            +{dayEvents.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* 2. AGENDA / LIST VIEW */}
          {(currentView === 'agenda' || currentView === 'week' || currentView === 'day') && (
            <Card className="p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                  {currentView === 'agenda' ? 'Agenda & Event List' : `${currentView.toUpperCase()} Schedule Timeline`}
                </h3>
                <span className="text-xs font-mono font-bold text-[#22C55E]">{filteredEvents.length} Events Total</span>
              </div>

              <div className="space-y-3">
                {filteredEvents.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <IoCalendarOutline className="mx-auto text-slate-400 text-3xl" />
                    <p className="text-xs font-bold text-slate-500">No events found matching criteria.</p>
                  </div>
                ) : (
                  filteredEvents.map(evt => {
                    const catMeta = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['Meeting'];
                    return (
                      <div 
                        key={evt.id}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${catMeta.dot}`} />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-slate-900 dark:text-white">{evt.title}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${catMeta.bg} ${catMeta.text}`}>
                                {evt.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{evt.desc}</p>
                            <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                              <span className="flex items-center gap-1 font-mono">
                                <IoCalendarOutline /> {evt.date} ({evt.startTime} - {evt.endTime})
                              </span>
                              {evt.project && (
                                <span className="flex items-center gap-1">
                                  <IoFolderOutline /> {evt.project}
                                </span>
                              )}
                              {evt.assignee && (
                                <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                                  <IoPersonOutline /> {evt.assignee}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Event Quick Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleDuplicate(evt)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#22C55E] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Duplicate Event"
                          >
                            <IoCopyOutline size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenModal(evt)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Event"
                          >
                            <IoCreateOutline size={15} />
                          </button>
                          <button
                            onClick={() => setEventToDelete(evt)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete Event"
                          >
                            <IoTrashOutline size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          )}

        </div>

        {/* Right 1 Column: Standardized Upcoming Schedule Panel */}
        <div>
          <Card className="p-5 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Upcoming Schedule</h3>
              <Badge variant="primary">Next 7 Days</Badge>
            </div>

            <div className="space-y-3">
              {filteredEvents.slice(0, 4).map(evt => {
                const catMeta = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['Meeting'];
                return (
                  <div 
                    key={evt.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${catMeta.bg} ${catMeta.text}`}>
                        {evt.category}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(evt)}
                          className="text-slate-400 hover:text-blue-500 p-1"
                          title="Quick Edit"
                        >
                          <IoCreateOutline size={13} />
                        </button>
                        <button 
                          onClick={() => setEventToDelete(evt)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Quick Delete"
                        >
                          <IoTrashOutline size={13} />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{evt.title}</h4>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                      <span className="font-mono">{evt.date}</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{evt.startTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats Summary */}
            <div className="p-4 bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Total Scheduled:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{events.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Deadlines & Milestones:</span>
                <span className="font-mono font-bold text-amber-500">
                  {events.filter(e => e.category === 'Deadline' || e.category === 'Milestone').length}
                </span>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Modal: Create & Edit Event */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? "Edit Event" : "Create New Calendar Event"}
        size="md"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Event Title *</label>
            <input 
              type="text"
              required
              placeholder="e.g. Q3 Sprint Release Signoff"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Event Date *</label>
              <input 
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as EventCategory)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
              >
                {Object.keys(CATEGORY_COLORS).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Start Time</label>
              <input 
                type="text"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">End Time</label>
              <input 
                type="text"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Link Project</label>
              <input 
                type="text"
                placeholder="e.g. Next.js Optimization"
                value={project}
                onChange={e => setProject(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Assignee</label>
              <input 
                type="text"
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Description</label>
            <textarea 
              rows={3}
              placeholder="Add event context or meeting agenda details..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#22C55E]"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800 pt-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" className="text-xs bg-[#22C55E] text-white hover:bg-[#1db053]">
              {editingEvent ? "Save Changes" : "Create Event"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Delete Confirmation */}
      {eventToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setEventToDelete(null)}
          title="Delete Event Confirmation"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">"{eventToDelete.title}"</strong>?
            </p>
            <div className="flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800 pt-3">
              <Button variant="secondary" onClick={() => setEventToDelete(null)} className="text-xs">
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirmed} className="text-xs">
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default TeamCalendar;
