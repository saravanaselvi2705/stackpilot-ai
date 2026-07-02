import React, { useState } from 'react';
import { Card, Badge, Button, Modal } from '../../components/UI';
import { IoAdd, IoChevronBackOutline, IoChevronForwardOutline, IoTimeOutline, IoVideocamOutline, IoMailOutline } from 'react-icons/io5';

export const TeamCalendar: React.FC = () => {
  const [currentDate] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [events, setEvents] = useState([
    { id: '1', title: 'Project Review', date: '2026-07-05', time: '10:00 AM', type: 'Project', desc: 'Showcase recent project features and progress.' },
    { id: '2', title: 'Client Check-in', date: '2026-07-08', time: '02:30 PM', type: 'Client', desc: 'Check in with the sales team about new opportunities.' },
    { id: '3', title: 'Requirements Review', date: '2026-07-12', time: '11:00 AM', type: 'Engineering', desc: 'Review project requirements and specifications.' }
  ]);

  // Form State
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('10:00 AM');
  const [eventType, setEventType] = useState<string>('Project');
  const [eventDesc, setEventDesc] = useState<string>('');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate) return;

    const newEvent = {
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

  const daysInMonth = [
    { day: 1, active: false }, { day: 2, active: false }, { day: 3, active: false },
    { day: 4, active: true }, { day: 5, active: true }, { day: 6, active: false },
    { day: 7, active: false }, { day: 8, active: true }, { day: 9, active: false },
    { day: 10, active: false }, { day: 11, active: false }, { day: 12, active: true },
    { day: 13, active: false }, { day: 14, active: false }, { day: 15, active: false },
    { day: 16, active: false }, { day: 17, active: false }, { day: 18, active: false },
    { day: 19, active: false }, { day: 20, active: false }, { day: 21, active: false },
    { day: 22, active: false }, { day: 23, active: false }, { day: 24, active: false },
    { day: 25, active: false }, { day: 26, active: false }, { day: 27, active: false },
    { day: 28, active: false }, { day: 29, active: false }, { day: 30, active: false },
    { day: 31, active: false }
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Calendar</h1>
          <p className="text-xs text-slate-400 mt-1">Schedule and coordinate team meetings, client check-ins, and deadlines.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white">
          <IoAdd size={16} /> Schedule Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"><IoChevronBackOutline size={14} /></button>
              <button className="p-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"><IoChevronForwardOutline size={14} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <span key={d} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((d, idx) => (
              <div 
                key={idx} 
                className={`aspect-square rounded-xl p-2 border flex flex-col justify-between transition-all ${
                  d.active 
                    ? 'bg-[#22C55E]/10 border-[#22C55E]/35 text-[#22C55E] shadow-md shadow-[#22C55E]/[0.02]' 
                    : 'bg-slate-950/20 border-slate-900/60 text-slate-400 hover:border-slate-800'
                }`}
              >
                <span className="text-xs font-black">{d.day}</span>
                {d.active && <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mx-auto animate-pulse" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Scheduled events listings */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Upcoming Schedule</h3>
            
            <div className="space-y-4">
              {events.map((e) => (
                <div key={e.id} className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-200 leading-snug">{e.title}</h4>
                    <Badge variant={e.type === 'Project' ? 'primary' : e.type === 'Client' ? 'success' : 'purple'}>
                      {e.type}
                    </Badge>
                  </div>
                  {e.desc && <p className="text-[10px] text-slate-400 leading-relaxed">{e.desc}</p>}
                  <div className="flex items-center justify-between text-[9px] text-slate-500 pt-2 border-t border-slate-850/50">
                    <span className="flex items-center gap-1 font-semibold">
                      <IoTimeOutline size={11} /> {e.time}
                    </span>
                    <span className="font-bold text-slate-400 font-mono">{e.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Schedule Event Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Event">
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Event Title</label>
            <input
              type="text"
              required
              placeholder="Project update meeting"
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
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#22C55E]/50 cursor-pointer"
              >
                <option value="Project">Project Review</option>
                <option value="Client">Client Check-in</option>
                <option value="Engineering">Engineering</option>
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
    </div>
  );
};
export default TeamCalendar;
