import React, { useState } from 'react';
import { 
  Radio, 
  Globe, 
  Lock, 
  X, 
  Sparkles, 
  Megaphone, 
  Hash, 
  Image as ImageIcon,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import confetti from 'canvas-confetti';

interface ChannelCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (channelData: {
    name: string;
    handle: string;
    description: string;
    avatar: string;
    isPrivate: boolean;
    initialPost: string;
  }) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80'
];

export const ChannelCreateModal: React.FC<ChannelCreateModalProps> = ({
  isOpen,
  onClose,
  onCreateChannel
}) => {
  const { showToast } = useSuperApp();

  const [channelName, setChannelName] = useState('');
  const [channelHandle, setChannelHandle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [initialPost, setInitialPost] = useState('Welcome to our official Aditi broadcast channel! Stay tuned for updates and announcements. 🚀');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setChannelName(val);
    if (!channelHandle || channelHandle === `@${channelName.toLowerCase().replace(/[^a-z0-9_]/g, '')}`) {
      setChannelHandle(`@${val.toLowerCase().replace(/[^a-z0-9_]/g, '')}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) {
      showToast('⚠️ Please provide a channel name.');
      return;
    }

    const formattedHandle = channelHandle.startsWith('@') ? channelHandle : `@${channelHandle}`;

    onCreateChannel({
      name: channelName.trim(),
      handle: formattedHandle,
      description: description.trim() || 'Official broadcast channel on AditiChat.',
      avatar: selectedAvatar,
      isPrivate,
      initialPost: initialPost.trim()
    });

    confetti({ particleCount: 70, spread: 70 });
    showToast(`📢 Channel "${channelName}" created successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl p-5 sm:p-6 space-y-5 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Create Broadcast Channel</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Telegram Standard
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Broadcast updates, news & announcements to unlimited subscribers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Channel Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <span>Channel Name</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Kerala Real Estate Deals or Tech Daily"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Channel Handle & Link */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-400" />
              <span>Public Handle / Link</span>
            </label>
            <input
              type="text"
              value={channelHandle}
              onChange={(e) => setChannelHandle(e.target.value)}
              placeholder="@kerala_deals"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-indigo-300 font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Channel Type / Privacy Toggle */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Channel Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  !isPrivate
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-xs">Public Channel</span>
                  <span className="text-[10px] text-slate-400 block leading-tight">Anyone can find in search and subscribe</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  isPrivate
                    ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold block text-xs">Private Channel</span>
                  <span className="text-[10px] text-slate-400 block leading-tight">Can only be joined via invite link</span>
                </div>
              </button>
            </div>
          </div>

          {/* Avatar Icon Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Channel Banner / Avatar</label>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {PRESET_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`relative flex-shrink-0 rounded-2xl overflow-hidden ring-2 transition-all ${
                    selectedAvatar === av ? 'ring-indigo-500 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt="Avatar" className="w-12 h-12 object-cover" />
                  {selectedAvatar === av && (
                    <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this channel about?"
              rows={2}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Initial Broadcast Post */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">First Broadcast Post</label>
            <textarea
              value={initialPost}
              onChange={(e) => setInitialPost(e.target.value)}
              placeholder="Write your inaugural message to subscribers..."
              rows={2}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all"
          >
            <Megaphone className="w-4 h-4" />
            <span>Launch Channel & Broadcast</span>
          </button>

        </form>

      </div>
    </div>
  );
};
