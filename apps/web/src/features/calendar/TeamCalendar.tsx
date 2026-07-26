import React, { useState } from 'react';
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
  IoTrashOutline
} from 'react-icons/io5';
import API from '../../services/api';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: 'Meeting' | 'Task' | 'Deadline' | 'Leave' | 'Invoice' | 'Milestone';
  desc: string;
}

export const TeamCalendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 6, 1)); // Default starting month: July 2026
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'Project Review Meeting', date: '2026-07-05', time: '10:00 AM', type: 'Meeting', desc: 'Showcase recent project features and progress.' },
    { id: '2', title: 'Client Check-in', date: '2026-07-08', time: '02:30 PM', type: 'Invoice', desc: 'Discuss invoice clearance and payment gateways.' },
    { id: '3', title: 'Requirements Spec Deadline', date: '2026-07-12', time: '11:00 AM', type: 'Deadline', desc: 'Finalize project requirements specs.' },
    { id: '4', title: 'Marcus Medical Leave', date: '2026-07-15', time: 'All Day', type: 'Leave', desc: 'Annual medical wellness checkup.' },
    { id: '5', title: 'Escrow Milestone Release', date: '2026-07-20', time: '09:00 AM', type: 'Milestone', desc: 'Verification of phase 1 deliverables.' },
    { id: '6', title: 'Webpack Compiler Tasks', date: '2026-07-25', time: '04:00 PM', type: 'Task', desc: 'Debug unhandled map reference exception.' }
  ]);

  // Form State
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('10:00 AM');
  const [eventType, setEventType] = useState<CalendarEvent['type']>('Meeting');
  const [eventDesc, setEventDesc] = useState<string>('');

  // Hover Tooltip State
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate) return;

    const newEvent: CalendarEvent = {
      id: `e-${Date.now()}`,
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      type: eventType,
      desc: eventDesc
    };

    setEvents([...events, newEvent]);
    setEventTitle('');
    setEventDate('');
    setEventDesc('');
    setModalOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Helper to get category dot colors
  const getCategoryColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'Meeting': return 'bg-blue-500';
      case 'Task': return 'bg-amber-500';
      case 'Deadline': return 'bg-red-500';
      case 'Leave': return 'bg-purple-500';
      case 'Invoice': return 'bg-emerald-500';
      case 'Milestone': return 'bg-yellow-500';
      default: return 'bg-slate-400';
    }
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  // Calendar cells generation
  const calendarCells: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // 1. Previous month padding cells
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthTotalDays - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    const dateStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    calendarCells.push({ day: dayNum, dateStr, isCurrentMonth: false });
  }

  // 2. Current month cells
  for (let i = 1; i <= totalDays; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({ day: i, dateStr, isCurrentMonth: true });
  }

  // 3. Next month padding cells
  const remainingSlots = 42 - calendarCells.length; // 6 rows of 7 days
  for (let i = 1; i <= remainingSlots; i++) {
    const nextMonthDate = new Date(year, month + 1, i);
    const dateStr = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({ day: i, dateStr, isCurrentMonth: false });
  }

  // Handle Mouse Hover telemetry
  const handleMouseEnterCell = (dateStr: string, e: React.MouseEvent) => {
    const matches = events.filter(ev => ev.date === dateStr);
    if (matches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      // Position tooltip relative to calendar viewport container offset
      setHoverPosition({
        x: rect.left + window.scrollX + (rect.width / 2),
        y: rect.top + window.scrollY - 10
      });
      setHoveredDate(dateStr);
    }
  };

  const handleMouseLeaveCell = () => {
    setHoveredDate(null);
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Calendar Hub</h1>
          <p className="text-xs text-slate-400 mt-1">Schedule and coordinate team meetings, client check-ins, and deadlines.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white">
          <IoAdd size={16} /> Schedule Event
        </Button>
      </div>

      {/* Legend Badges */}
      <Card className="py-3 px-4 flex flex-wrap gap-4 items-center justify-between bg-slate-900/20 border-slate-850">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category Legend:</span>
        <div className="flex flex-wrap gap-3">
          {(['Meeting', 'Task', 'Deadline', 'Leave', 'Invoice', 'Milestone'] as const).map(cat => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${getCategoryColor(cat)}`} />
              <span className="text-[10px] font-bold text-slate-350">{cat}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-all"
              >
                <IoChevronBackOutline size={14} />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-all"
              >
                <IoChevronForwardOutline size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <span key={d} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              const matches = events.filter(e => e.date === cell.dateStr);
              const isToday = new Date().toDateString() === new Date(year, month, cell.day).toDateString() && cell.isCurrentMonth;
              
              return (
                <div 
                  key={idx}
                  onMouseEnter={(e) => handleMouseEnterCell(cell.dateStr, e)}
                  onMouseLeave={handleMouseLeaveCell}
                  className={`aspect-square rounded-xl p-2 border flex flex-col justify-between transition-all ${
                    cell.isCurrentMonth 
                      ? isToday 
                        ? 'bg-[#22C55E]/15 border-[#22C55E] text-white shadow-md' 
                        : 'bg-slate-950/20 border-slate-900 hover:border-slate-800/80 text-slate-200'
                      : 'bg-slate-950/5 border-slate-950 text-slate-650'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold ${cell.isCurrentMonth ? '' : 'opacity-40'}`}>
                      {cell.day}
                    </span>
                    {isToday && (
                      <span className="text-[7px] px-1 bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 rounded font-black uppercase">
                        Today
                      </span>
                    )}
                  </div>
                  
                  {/* Category dots */}
                  {matches.length > 0 && (
                    <div className="flex gap-1 justify-center flex-wrap max-w-full">
                      {matches.slice(0, 3).map((match, mIdx) => (
                        <span 
                          key={mIdx} 
                          className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(match.type)}`} 
                          title={match.title}
                        />
                      ))}
                      {matches.length > 3 && (
                        <span className="text-[7px] font-bold text-slate-500 leading-none">
                          +{matches.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Scheduled events listings */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Upcoming Schedule</h3>
            
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {events
                .filter(e => {
                  const evDate = new Date(e.date);
                  return evDate.getFullYear() === year && evDate.getMonth() === month;
                })
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((e) => (
                  <div key={e.id} className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-2 hover:border-slate-700 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 leading-snug">{e.title}</h4>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={
                          e.type === 'Meeting' ? 'primary' : 
                          e.type === 'Invoice' ? 'success' : 
                          e.type === 'Deadline' ? 'danger' : 
                          e.type === 'Leave' ? 'purple' : 
                          e.type === 'Task' ? 'warning' : 'secondary'
                        }>
                          {e.type}
                        </Badge>
                        {user?.role === 'Super Admin' && (
                          <button
                            onClick={() => setEventToDelete(e)}
                            title="Delete Event (Super Admin)"
                            className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                          >
                            <IoTrashOutline size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {e.desc && <p className="text-[10px] text-slate-400 leading-relaxed">{e.desc}</p>}
                    <div className="flex items-center justify-between text-[9px] text-slate-500 pt-2 border-t border-slate-850/50">
                      <span className="flex items-center gap-1 font-semibold">
                        <IoTimeOutline size={11} /> {e.time}
                      </span>
                      <span className="font-bold text-slate-450 font-mono">{e.date}</span>
                    </div>
                  </div>
                ))}
              {events.filter(e => {
                const evDate = new Date(e.date);
                return evDate.getFullYear() === year && evDate.getMonth() === month;
              }).length === 0 && (
                <p className="text-[10px] text-slate-600 italic text-center py-6">No events scheduled for this month.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Hover Tooltip overlay */}
      {hoveredDate && (
        <div 
          style={{ 
            position: 'absolute', 
            left: `${hoverPosition.x}px`, 
            top: `${hoverPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 999 
          }}
          className="w-56 bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-2xl space-y-2 pointer-events-none animate-fade-in"
        >
          <div className="border-b border-slate-850 pb-1.5 flex justify-between items-center">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Scheduled for</span>
            <span className="text-[9px] font-bold text-emerald-450 font-mono">{hoveredDate}</span>
          </div>
          <div className="space-y-2 max-h-[140px] overflow-y-auto">
            {events.filter(ev => ev.date === hoveredDate).map((ev) => (
              <div key={ev.id} className="text-[10px] space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 truncate pr-1 max-w-[120px]">{ev.title}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(ev.type)}`} />
                </div>
                <div className="text-[8px] text-slate-450 flex items-center gap-0.5">
                  <IoTimeOutline size={9} /> {ev.time} ({ev.type})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Event Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Event">
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Sprint wrap-up meeting"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Date</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Time</label>
              <input
                type="text"
                required
                placeholder="10:00 AM"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Category</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 cursor-pointer"
              >
                <option value="Meeting">Meeting</option>
                <option value="Task">Task</option>
                <option value="Deadline">Deadline</option>
                <option value="Leave">Leave</option>
                <option value="Invoice">Invoice</option>
                <option value="Milestone">Milestone</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Description</label>
              <input
                type="text"
                placeholder="Enter event description..."
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="text-xs bg-white text-[#111827] border border-[#22C55E]">
              Cancel
            </Button>
            <Button type="submit" className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white">
              Schedule Event
            </Button>
          </div>
        </form>
      </Modal>

      {/* Super Admin Delete Event Modal */}
      {eventToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setEventToDelete(null)}
          title="Confirm Event Deletion"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete event <strong className="text-slate-900 dark:text-white">"{eventToDelete.title}"</strong>? This will record an audit log entry.
            </p>
            <div className="flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800 pt-3">
              <Button variant="secondary" onClick={() => setEventToDelete(null)} className="text-xs">
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={async () => {
                  await API.calendar.deleteEvent(eventToDelete.id);
                  setEvents(events.filter(ev => ev.id !== eventToDelete.id));
                  setEventToDelete(null);
                }} 
                className="text-xs"
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TeamCalendar;
