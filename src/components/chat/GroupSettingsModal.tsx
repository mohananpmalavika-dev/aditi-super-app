import React, { useState } from 'react';
import { 
  X, 
  Users, 
  ShieldCheck, 
  Link as LinkIcon, 
  QrCode, 
  Copy, 
  Check, 
  Lock, 
  Unlock, 
  UserPlus, 
  Trash2, 
  Crown,
  Share2
} from 'lucide-react';
import { ChatConversation, GroupMemberItem, GroupPermissions } from '../../types/superApp';
import { generateGroupInviteLink } from '../../services/messagingEngine';
import { useSuperApp } from '../../context/SuperAppContext';

interface GroupSettingsModalProps {
  isOpen: boolean;
  conversation: ChatConversation;
  onClose: () => void;
}

export const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({
  isOpen,
  conversation,
  onClose
}) => {
  const { user, showToast } = useSuperApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const [permissions, setPermissions] = useState<GroupPermissions>(
    conversation.groupPermissions || {
      canSendMessages: true,
      canSendMedia: true,
      canPinMessages: true,
      canInviteMembers: true,
      canEditGroupInfo: false
    }
  );

  const [members, setMembers] = useState<GroupMemberItem[]>(
    conversation.members || [
      { id: user.id, name: user.name, avatar: user.avatar, role: 'owner', isOnline: true },
      { id: 'm-1', name: 'Malavika Mohan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'admin', isOnline: true },
      { id: 'm-2', name: 'Arun Kumar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'member', isOnline: false },
      { id: 'm-3', name: 'Suresh Menon', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', role: 'member', isOnline: true }
    ]
  );

  if (!isOpen) return null;

  const invite = generateGroupInviteLink(conversation.id, conversation.participantName);

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(invite.url);
    setCopiedLink(true);
    showToast('📋 Group invite link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const togglePermission = (key: keyof GroupPermissions) => {
    setPermissions((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(`⚙️ Group permission updated: ${key}`);
      return updated;
    });
  };

  const promoteMemberRole = (memberId: string, newRole: 'admin' | 'member' | 'moderator') => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    showToast(`👑 Member role updated to ${newRole.toUpperCase()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={conversation.participantAvatar}
              alt={conversation.participantName}
              className="w-10 h-10 rounded-2xl object-cover border border-indigo-500/40"
            />
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>{conversation.participantName}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Group Settings
                </span>
              </h3>
              <p className="text-xs text-slate-400">{members.length} members • Granular Permissions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Shareable Group Invite Link & QR Code */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-indigo-300 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Group Invite Link (ലിങ്ക് വഴി ക്ഷണിക്കുക)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowQrCode(!showQrCode)}
                className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQrCode ? 'Hide QR' : 'Show QR'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={invite.url}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-indigo-500/30 transition-all"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* QR Code Expansion */}
            {showQrCode && (
              <div className="p-4 rounded-2xl bg-white text-center space-y-2 animate-in fade-in">
                <img src={invite.qrCodeUrl} alt="Group QR Code" className="w-36 h-36 mx-auto" />
                <p className="text-[10px] text-slate-700 font-bold">Scan with camera to instantly join {conversation.participantName}</p>
              </div>
            )}
          </div>

          {/* Group Permissions Matrix */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Member Permissions (അംഗങ്ങളുടെ അനുമതികൾ)</span>
            </h4>

            <div className="space-y-1.5">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Send Messages</p>
                  <p className="text-[10px] text-slate-500">Allow standard members to send text & voice</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePermission('canSendMessages')}
                  className={`w-10 h-6 rounded-full transition-colors relative ${permissions.canSendMessages ? 'bg-indigo-600' : 'bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${permissions.canSendMessages ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Send Media & Files</p>
                  <p className="text-[10px] text-slate-500">Photos, videos, audio notes, and attachments</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePermission('canSendMedia')}
                  className={`w-10 h-6 rounded-full transition-colors relative ${permissions.canSendMedia ? 'bg-indigo-600' : 'bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${permissions.canSendMedia ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Pin Messages</p>
                  <p className="text-[10px] text-slate-500">Pin important notices at the top of the group</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePermission('canPinMessages')}
                  className={`w-10 h-6 rounded-full transition-colors relative ${permissions.canPinMessages ? 'bg-indigo-600' : 'bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${permissions.canPinMessages ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Add & Invite Other Members</p>
                  <p className="text-[10px] text-slate-500">Invite new users into the group</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePermission('canInviteMembers')}
                  className={`w-10 h-6 rounded-full transition-colors relative ${permissions.canInviteMembers ? 'bg-indigo-600' : 'bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${permissions.canInviteMembers ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Group Members Hierarchy */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Group Members ({members.length})</span>
              <span className="text-slate-500 text-[10px] font-normal">Click badge to change role</span>
            </h4>

            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                        <span>{member.name}</span>
                        {member.role === 'owner' && <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </p>
                      <p className="text-[10px] text-slate-500">{member.isOnline ? '🟢 Online' : '⚪ Offline'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {member.role === 'owner' ? (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        Group Owner
                      </span>
                    ) : member.role === 'admin' ? (
                      <button
                        type="button"
                        onClick={() => promoteMemberRole(member.id, 'member')}
                        className="px-2 py-0.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold"
                        title="Demote to Member"
                      >
                        Group Admin
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => promoteMemberRole(member.id, 'admin')}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 text-[10px] font-bold"
                        title="Promote to Admin"
                      >
                        Member
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
