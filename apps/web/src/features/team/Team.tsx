import React, { useState, useEffect } from 'react';
import { Card, ProgressBar, Button, Modal } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { 
  IoMailOutline, 
  IoCallOutline,
  IoTrashOutline,
  IoPersonAddOutline
} from 'react-icons/io5';
import API from '../../services/api';
import type { User } from '../../../../../packages/shared/types';

export const Team: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<User | null>(null);

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

  return (
    <div className="space-y-8 pb-12">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">Team Members</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Manage workforce roster, review user accounts, and allocate project resources.</p>
        </div>
      </div>

      {/* Workforce Roster cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400">
            No team members found. Initialized with clean production database.
          </div>
        ) : (
          members.map((m) => (
            <Card 
              key={m._id} 
              className="space-y-4 hover:border-[#22C55E]/50 transition-all hover:scale-[1.01] relative group"
            >
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => setSelectedMember(m)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <img src={m.avatarUrl} alt={m.name} className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{m.name}</h4>
                    <span className="text-[10px] text-[#22C55E] font-bold uppercase tracking-wider block">{m.role}</span>
                  </div>
                </div>

                {user?.role === 'Super Admin' && m._id !== user._id && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMemberToDelete(m);
                    }}
                    className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    title="Delete Team Member (Super Admin)"
                  >
                    <IoTrashOutline size={14} />
                  </button>
                )}
              </div>

              <div 
                onClick={() => setSelectedMember(m)}
                className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3 cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  <span>Department</span>
                  <span className="text-slate-900 dark:text-slate-200 font-bold">{m.department || 'Administration'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Status</span>
                  <span className="text-[#22C55E] font-bold">{m.availability || 'Available'}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

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
                src={selectedMember.avatarUrl} 
                alt={selectedMember.name} 
                className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedMember.name}</h3>
                <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">{selectedMember.role}</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedMember.department || 'Administration'}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <IoMailOutline className="text-slate-400" size={16} />
                <span className="font-mono">{selectedMember.email}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-4">
              {user?.role === 'Super Admin' && selectedMember._id !== user._id ? (
                <Button 
                  variant="danger" 
                  onClick={() => {
                    setMemberToDelete(selectedMember);
                  }}
                  className="text-xs flex items-center gap-1.5"
                >
                  <IoTrashOutline size={14} /> Remove Team Member
                </Button>
              ) : <div />}
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
