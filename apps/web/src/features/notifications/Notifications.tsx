import React, { useState, useEffect } from 'react';
import { API } from '../../services/api';
import type { Notification } from '../../../../../packages/shared/types';
import { 
  IoNotificationsOutline, 
  IoCheckmarkDoneOutline, 
  IoArchiveOutline, 
  IoFilterOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline
} from 'react-icons/io5';

export const Notifications: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const list = await API.notifications.list();
      setNotifications(list);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } fontLoading: false;
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: string) => {
    await API.notifications.markRead(id);
    fetchNotifs();
  };

  const handleMarkAllRead = async () => {
    await API.notifications.markAllRead();
    fetchNotifs();
  };

  const handleArchive = async (id: string) => {
    await API.notifications.archive(id);
    fetchNotifs();
  };

  const filteredNotifs = notifications.filter(n => {
    if (n.archived && filter !== 'archived') return false;
    if (filter === 'unread') return !n.read && !n.archived;
    if (filter === 'archived') return n.archived;
    return !n.archived;
  });

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <IoNotificationsOutline size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Enterprise Notification Center</h1>
            <p className="text-xs text-slate-500 font-medium">Real-time alerts across Task assignments, Sprint updates, Invoices, and Approvals.</p>
          </div>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <IoCheckmarkDoneOutline size={16} />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['all', 'unread', 'archived'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize cursor-pointer transition-all ${
              filter === f ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f} Notifications {f === 'unread' && `(${notifications.filter(n => !n.read && !n.archived).length})`}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-bold text-sm">Loading notifications...</div>
        ) : filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 font-medium text-xs">
            No {filter} notifications found.
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div
              key={n._id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                n.read ? 'bg-white border-slate-200' : 'bg-emerald-50/60 border-emerald-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {n.type === 'success' && <IoCheckmarkCircleOutline size={20} className="text-emerald-600" />}
                  {n.type === 'warning' && <IoAlertCircleOutline size={20} className="text-amber-600" />}
                  {n.type === 'info' && <IoInformationCircleOutline size={20} className="text-blue-600" />}
                  {n.type === 'error' && <IoAlertCircleOutline size={20} className="text-rose-600" />}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-slate-900">{n.title}</h4>
                    {n.category && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">{n.category}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 font-semibold">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}
                {!n.archived && (
                  <button
                    onClick={() => handleArchive(n._id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Archive"
                  >
                    <IoArchiveOutline size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
