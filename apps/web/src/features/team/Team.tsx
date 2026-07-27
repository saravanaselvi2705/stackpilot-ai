import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import {
  IoMailOutline,
  IoCallOutline,
  IoTrashOutline,
  IoPersonAddOutline,
  IoCreateOutline,
  IoCalendarOutline,
  IoBriefcaseOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline
} from 'react-icons/io5';
import API from '../../services/api';
import type { User, UserRole } from '../../../../../packages/shared/types';

export const Team: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Modals state
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<User | null>(null);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<UserRole>('Developer');
  const [department, setDepartment] = useState<string>('Engineering');
  const [designation, setDesignation] = useState<string>('Software Engineer');
  const [phone, setPhone] = useState<string>('');
  const [joiningDate, setJoiningDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const loadMembers = async () => {
    try {
      const data = await API.auth.listUsers();
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('Developer');
    setDepartment('Engineering');
    setDesignation('Software Engineer');
    setPhone('');
    setJoiningDate(new Date().toISOString().split('T')[0]);
    setStatus('Active');
  };

  const handleOpenEdit = (m: User, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingMember(m);
    setName(m.name);
    setEmail(m.email);
    setRole(m.role);
    setDepartment(m.department || 'Engineering');
    setDesignation(m.designation || 'Software Engineer');
    setPhone(m.phone || '');
    setJoiningDate(m.joiningDate || new Date().toISOString().split('T')[0]);
    setStatus(m.status || 'Active');
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      if (editingMember) {
        await API.auth.updateUser(editingMember._id, {
          name,
          email,
          role,
          department,
          designation,
          phone,
          joiningDate,
          status
        });
        setEditingMember(null);
      } else {
        await API.auth.createUser({
          name,
          email,
          role,
          department,
          designation,
          phone,
          joiningDate,
          status
        });
        setAddModalOpen(false);
      }
      resetForm();
      loadMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (m: User, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = m.status === 'Inactive' ? 'Active' : 'Inactive';
    try {
      await API.auth.updateUser(m._id, { status: newStatus });
      loadMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      await API.auth.deleteUser(memberToDelete._id);
      setMemberToDelete(null);
      if (selectedMember?._id === memberToDelete._id) {
        setSelectedMember(null);
      }
      loadMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMembers = members.filter(m => {
    if (filterStatus === 'Active') return m.status !== 'Inactive';
    if (filterStatus === 'Inactive') return m.status === 'Inactive';
    return true;
  });

  const rolesList: UserRole[] = [
    'Super Admin', 'Admin', 'Project Manager', 'Business Analyst',
    'Developer', 'Tester', 'SEO Executive', 'Finance', 'Client'
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">Team Members</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Manage workforce roster, edit employee designations, update status, and allocate project resources.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            {(['All', 'Active', 'Inactive'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${filterStatus === st
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {st}
              </button>
            ))}
          </div>

          {(user?.role === 'Super Admin' || user?.role === 'Admin') && (
            <Button
              onClick={() => { resetForm(); setAddModalOpen(true); }}
              className="text-xs flex items-center gap-1.5 bg-[#22C55E] hover:bg-[#1db053] text-white font-bold"
            >
              <IoPersonAddOutline size={16} /> Add Team Member
            </Button>
          )}
        </div>
      </div>

      {/* Workforce Roster cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl">
            No team members match the selected status filter.
          </div>
        ) : (
          filteredMembers.map((m) => (
            <Card
              key={m._id}
              className="space-y-4 hover:border-[#22C55E]/50 transition-all hover:scale-[1.01] relative group"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  onClick={() => setSelectedMember(m)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <img
                    src={m.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(m.name)}`}
                    alt={m.name}
                    className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{m.name}</h4>
                    <span className="text-[10px] text-[#22C55E] font-bold uppercase tracking-wider block">{m.role}</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{m.designation || 'Software Engineer'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {(user?.role === 'Super Admin' || user?.role === 'Admin') && (
                    <button
                      onClick={(e) => handleOpenEdit(m, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Member"
                    >
                      <IoCreateOutline size={15} />
                    </button>
                  )}
                  {user?.role === 'Super Admin' && m._id !== user._id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMemberToDelete(m);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Team Member"
                    >
                      <IoTrashOutline size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div
                onClick={() => setSelectedMember(m)}
                className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3 cursor-pointer text-xs"
              >
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Department</span>
                  <span className="text-slate-900 dark:text-slate-200 font-bold">{m.department || 'Engineering'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Status</span>
                  <button
                    onClick={(e) => handleToggleStatus(m, e)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-all ${m.status === 'Inactive'
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                  >
                    {m.status === 'Inactive' ? (
                      <><IoCloseCircleOutline size={12} /> Inactive</>
                    ) : (
                      <><IoCheckmarkCircleOutline size={12} /> Active</>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add / Edit Team Member Modal */}
      {(addModalOpen || editingMember) && (
        <Modal
          isOpen={true}
          onClose={() => { setAddModalOpen(false); setEditingMember(null); resetForm(); }}
          title={editingMember ? "Edit Team Member" : "Add New Team Member"}
          size="md"
        >
          <form onSubmit={handleSaveMember} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@stackpilot.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E] cursor-pointer"
                >
                  {rolesList.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">Department</label>
                <input
                  type="text"
                  placeholder="Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">Designation</label>
                <input
                  type="text"
                  placeholder="Senior Frontend Architect"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">Joining Date</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E] cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase">Account Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#22C55E] cursor-pointer font-bold"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
              <Button type="button" variant="secondary" onClick={() => { setAddModalOpen(false); setEditingMember(null); resetForm(); }} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="text-xs bg-[#22C55E] hover:bg-[#1db053] text-white font-bold">
                {editingMember ? "Save Changes" : "Create Member"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Team Member Profile Details Modal */}
      {selectedMember && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMember(null)}
          title="Team Member Profile"
          size="md"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <img
                src={selectedMember.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(selectedMember.name)}`}
                alt={selectedMember.name}
                className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedMember.name}</h3>
                <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">{selectedMember.role}</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedMember.designation || 'Software Engineer'} • {selectedMember.department || 'Engineering'}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <IoMailOutline className="text-slate-400" size={16} />
                <span className="font-mono">{selectedMember.email}</span>
              </div>
              {selectedMember.phone && (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <IoCallOutline className="text-slate-400" size={16} />
                  <span>{selectedMember.phone}</span>
                </div>
              )}
              {selectedMember.joiningDate && (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <IoCalendarOutline className="text-slate-400" size={16} />
                  <span>Joined {selectedMember.joiningDate}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                {(user?.role === 'Super Admin' || user?.role === 'Admin') && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const m = selectedMember;
                      setSelectedMember(null);
                      handleOpenEdit(m);
                    }}
                    className="text-xs flex items-center gap-1"
                  >
                    <IoCreateOutline size={14} /> Edit
                  </Button>
                )}
                {user?.role === 'Super Admin' && selectedMember._id !== user._id && (
                  <Button
                    variant="danger"
                    onClick={() => {
                      setMemberToDelete(selectedMember);
                    }}
                    className="text-xs flex items-center gap-1.5"
                  >
                    <IoTrashOutline size={14} /> Remove Member
                  </Button>
                )}
              </div>
              <Button variant="secondary" onClick={() => setSelectedMember(null)} className="text-xs">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Super Admin Delete Team Member Confirmation Modal */}
      {memberToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setMemberToDelete(null)}
          title="Confirm Team Member Removal"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently remove <strong className="text-slate-900 dark:text-white">{memberToDelete.name}</strong> ({memberToDelete.email}) from the workspace roster? An audit log entry will be generated.
            </p>
            <div className="flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800 pt-3">
              <Button variant="secondary" onClick={() => setMemberToDelete(null)} className="text-xs">
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDeleteMember}
                className="text-xs"
              >
                Permanently Remove
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Team;
