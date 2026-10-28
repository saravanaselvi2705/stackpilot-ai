import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../services/api';
import type { Task, Document, Meeting, ApprovalRequest, TimesheetEntry } from '../../../../../packages/shared/types';
import { 
  IoPersonOutline, 
  IoCheckmarkCircleOutline, 
  IoTimeOutline, 
  IoCalendarOutline, 
  IoDocumentTextOutline, 
  IoShieldCheckmarkOutline, 
  IoPlayOutline, 
  IoPauseOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';

export const MyWork: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [myDocs, setMyDocs] = useState<Document[]>([]);
  const [myApprovals, setMyApprovals] = useState<ApprovalRequest[]>([]);
  const [myTimesheets, setMyTimesheets] = useState<TimesheetEntry[]>([]);

  // StopWatch Timer state
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerTask, setTimerTask] = useState<string>('Business OS Upgrade');

  useEffect(() => {
    async function loadMyWorkData() {
      try {
        setLoading(true);
        const [tasks, docs, approvals, timesheets] = await Promise.all([
          API.tasks.list(),
          API.docs.list(),
          API.approvals.list(),
          API.timesheets.list()
        ]);

        setMyTasks(tasks.filter(t => t.assigneeId === user?._id || t.assigneeName === user?.name || true));
        setMyDocs(docs);
        setMyApprovals(approvals.filter(a => a.requestedBy === user?._id || a.requestedByName === user?.name));
        setMyTimesheets(timesheets.filter(ts => ts.userId === user?._id || ts.userName === user?.name));
      } catch (err) {
        console.error('Failed to load employee work data', err);
      } finally {
        setLoading(false);
      }
    }
    loadMyWorkData();
  }, [user]);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogTimer = async () => {
    if (timerSeconds === 0) return;
    const hoursLogged = Number((timerSeconds / 3600).toFixed(2));
    try {
      await API.timesheets.create({
        userId: user?._id || 'u-1',
        userName: user?.name || 'Super Admin',
        projectId: 'p-1',
        projectName: 'StackPilot SaaS',
        date: new Date().toISOString().split('T')[0],
        hours: Math.max(hoursLogged, 0.25),
        billable: true,
        description: `Timer Log: Worked on ${timerTask}`
      });
      alert(`Logged ${hoursLogged || 0.25} hours to timesheet!`);
      setTimerActive(false);
      setTimerSeconds(0);
      const updated = await API.timesheets.list();
      setMyTimesheets(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const todayTasks = myTasks.filter(t => t.status === 'In Progress' || t.status === 'Todo');
  const overdueTasks = myTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done');

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-bold text-sm animate-pulse min-h-[400px] flex items-center justify-center">
        Loading My Work Workspace...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Employee Profile Header & Timer Widget */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin'}
            alt="Avatar"
            className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">{user?.role}</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Employee Personal Workspace • {user?.email}</p>
          </div>
        </div>

        {/* Live Work Timer */}
        <div className="bg-slate-900 rounded-2xl p-4 text-white flex items-center gap-4 shadow-lg border border-slate-800">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Live Time Tracker</span>
            <div className="text-xl font-mono font-black text-emerald-400">{formatTimer(timerSeconds)}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`p-2.5 rounded-xl font-bold cursor-pointer transition-all ${
                timerActive ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
              title={timerActive ? 'Pause Timer' : 'Start Timer'}
            >
              {timerActive ? <IoPauseOutline size={18} /> : <IoPlayOutline size={18} />}
            </button>
            <button
              onClick={handleLogTimer}
              disabled={timerSeconds === 0}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-extrabold border border-slate-700 cursor-pointer"
            >
              Save Hours
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout: Tasks, Approvals, Docs, Timesheets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Assigned Tasks & Overdue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned & Today's Tasks */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IoCheckmarkCircleOutline className="text-emerald-600" size={20} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">My Active Assigned Tasks ({todayTasks.length})</h3>
              </div>
            </div>

            <div className="space-y-2">
              {todayTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No pending assigned tasks found.</p>
              ) : (
                todayTasks.map(t => (
                  <div key={t._id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{t.taskId || 'SP'}</span>
                        <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-500">{t.projectName} • Story Points: {t.storyPoints || 3} • Priority: {t.priority}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">{t.status}</span>
                      <button
                        onClick={() => { setTimerTask(t.title); setTimerActive(true); }}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-xs font-bold"
                        title="Track time for this task"
                      >
                        <IoPlayOutline size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Overdue Tasks Alert */}
          {overdueTasks.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-rose-800">
                <IoAlertCircleOutline size={20} />
                <h3 className="text-xs font-black uppercase tracking-wider">Overdue Tasks ({overdueTasks.length})</h3>
              </div>
              <div className="space-y-2">
                {overdueTasks.map(t => (
                  <div key={t._id} className="p-3 rounded-xl bg-white border border-rose-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{t.title}</span>
                    <span className="text-[10px] text-rose-600 font-extrabold">Due: {t.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Submitted Timesheets */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IoTimeOutline className="text-emerald-600" size={20} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">My Timesheet Log</h3>
              </div>
            </div>

            <div className="space-y-2">
              {myTimesheets.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No timesheet entries logged yet.</p>
              ) : (
                myTimesheets.map(ts => (
                  <div key={ts._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{ts.description}</p>
                      <span className="text-[10px] text-slate-500">{ts.projectName} • {ts.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-emerald-700 text-sm">{ts.hours} hrs</span>
                      <span className="block text-[9px] text-slate-400 font-semibold uppercase">{ts.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): My Approvals & My Documents */}
        <div className="space-y-6">
          {/* My Approval Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IoShieldCheckmarkOutline className="text-purple-600" size={20} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">My Approval Status</h3>
              </div>
            </div>

            <div className="space-y-2">
              {myApprovals.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No pending approval requests.</p>
              ) : (
                myApprovals.map(a => (
                  <div key={a._id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-600 uppercase">{a.type}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        a.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>{a.status}</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">{a.title}</h5>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* My Created Documents */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IoDocumentTextOutline className="text-amber-600" size={20} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">My Documents ({myDocs.length})</h3>
              </div>
            </div>

            <div className="space-y-2">
              {myDocs.map(d => (
                <div key={d._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900 truncate max-w-[180px]">{d.title}</h5>
                    <span className="text-[10px] text-slate-500">{d.type} • v{d.version}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">View</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyWork;
