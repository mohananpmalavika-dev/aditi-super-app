import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  Grid, 
  Sun, 
  Moon, 
  Zap, 
  X,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Palette
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { useTheme, THEME_PRESETS } from '../../context/ThemeContext';
import { useOmniBrain } from '../../context/OmniBrainContext';
import { MiniAppId } from '../../types/superApp';
import { getSafeAvatarUrl, handleAvatarError } from '../../utils/avatarUtils';

interface TopHeaderProps {
  onOpenLauncher: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenLauncher }) => {
  const { user, alerts, dismissAlert, setActiveMiniApp, logout } = useSuperApp();
  const { theme, setTheme, toggleTheme } = useTheme();
  const { toggleAgentDrawer, askBrain } = useOmniBrain();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showAlertsPopover, setShowAlertsPopover] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    askBrain(searchQuery);
    toggleAgentDrawer();
    setSearchQuery('');
    setShowMobileSearch(false);
  };

  const handleAlertClick = (actionApp: MiniAppId, alertId: string) => {
    setActiveMiniApp(actionApp);
    dismissAlert(alertId);
    setShowAlertsPopover(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-header px-3 sm:px-6 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Brand Logo & Mini-App Launcher Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveMiniApp('chat')}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Go to Chat"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(99,102,241,0.6),inset_0_1px_1px_rgba(255,255,255,0.45)] group-hover:scale-105 active:scale-95 transition-all flex-shrink-0 border border-white/20">
              <span className="text-xl drop-shadow-md">🌐</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent drop-shadow-sm">
                  Aditi
                </span>
                <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 shadow-[0_0_10px_rgba(99,102,241,0.4)] leading-none">
                  PRO
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 font-medium leading-none mt-0.5">The Boundless LifeOS</p>
            </div>
          </button>

          {/* Launcher Grid Trigger */}
          <button
            onClick={onOpenLauncher}
            className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-slate-300 text-xs font-bold border border-slate-700/80 shadow-3d-sm transition-all"
            title="Open Mini-Apps Grid"
          >
            <Grid className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Apps</span>
          </button>
        </div>

        {/* OmniSearch / Universal Command Input (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask Aditi Brain AI (e.g. 'find python tutor', '3BHK rent')..."
              className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-slate-950/80 border border-white/10 text-xs sm:text-sm text-slate-200 placeholder-slate-500 shadow-inner focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-[11px] font-bold text-white flex items-center gap-1 shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>Ask AI</span>
            </button>
          </div>
        </form>

        {/* Right Header Utilities & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/60 shadow-3d-sm transition-all active:scale-95"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-slate-300" />
          </button>

          {/* OmniBrain Floating Trigger */}
          <button
            onClick={toggleAgentDrawer}
            className="px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 active:scale-95 text-white text-xs font-black flex items-center gap-1.5 sm:gap-2 shadow-[0_8px_20px_-4px_rgba(99,102,241,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow flex-shrink-0" />
            <span className="hidden sm:inline">Brain AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </button>

          {/* Proactive Notification Alerts */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsPopover(!showAlertsPopover)}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {alerts.length}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {showAlertsPopover && (
              <div className="absolute right-0 mt-2 w-72 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3.5 sm:p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-xs sm:text-sm text-slate-200">Proactive Insights</span>
                  </div>
                  <button
                    onClick={() => setShowAlertsPopover(false)}
                    className="p-1 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2.5 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {alerts.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400 opacity-60" />
                      All caught up! No new alerts.
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => handleAlertClick(alert.actionMiniApp, alert.id)}
                        className="p-2.5 sm:p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                            {alert.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-indigo-400 font-semibold">
                          <span>Open in {alert.actionMiniApp.toUpperCase()}</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3D & 4D Theme Switcher Popover */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 transition-all flex items-center gap-1 border border-slate-700/50"
              title={`Switch 3D/4D theme (Current: ${theme})`}
              aria-label="3D and 4D Themes"
            >
              <Palette className="w-4 h-4 text-indigo-400" />
            </button>

            {/* Theme Dropdown Menu */}
            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-extrabold text-xs text-white uppercase tracking-wider">3D & 4D Themes</span>
                  </div>
                  <button
                    onClick={() => setShowThemeMenu(false)}
                    className="p-1 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto pr-1">
                  {THEME_PRESETS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                      className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                        theme === t.id
                          ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${t.gradient} flex-shrink-0 shadow-sm`} />
                        <div className="min-w-0">
                          <span className="text-xs font-bold truncate block">{t.name}</span>
                          <span className="text-[9px] text-slate-400 truncate block">{t.desc}</span>
                        </div>
                      </div>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase flex-shrink-0 ${
                        t.category === '4D Holographic'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                      }`}>
                        {t.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 p-0.5 rounded-xl hover:bg-slate-800 active:scale-95 transition-all focus:outline-none"
            >
              <img
                src={getSafeAvatarUrl(user.avatar, user.name)}
                alt={user.name}
                onError={(e) => handleAvatarError(e, user.name)}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/40 shadow-sm"
              />
              <ChevronDown className="w-3 h-3 text-slate-400 hidden xs:block" />
            </button>

            {/* User Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <img
                    src={getSafeAvatarUrl(user.avatar, user.name)}
                    alt={user.name}
                    onError={(e) => handleAvatarError(e, user.name)}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/40 shadow-md"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-white truncate">{user.name}</h4>
                    <p className="text-[11px] text-indigo-400 font-mono truncate">{user.handle}</p>
                    <span className="text-[10px] text-slate-400 font-semibold">{user.zodiacSign} ♌</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setActiveMiniApp('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full p-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>⚙️</span>
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (navigator.share) {
                        navigator.share({
                          title: 'Aditi Super App',
                          text: 'Explore Aditi Super App on malabarbazaar.shop',
                          url: window.location.origin
                        }).catch(() => {});
                      } else if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.origin);
                        alert('App link copied to clipboard: ' + window.location.origin);
                      }
                    }}
                    className="w-full p-2 rounded-xl text-left text-indigo-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>📱</span>
                    <span>Share App / QR Code</span>
                  </button>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full p-2 rounded-xl text-left font-bold text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                    >
                      <span>🚪</span>
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {showMobileSearch && (
        <form onSubmit={handleSearchSubmit} className="mt-2.5 pt-2 border-t border-slate-800/80 md:hidden animate-in fade-in slide-in-from-top-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask Aditi Brain AI..."
              autoFocus
              className="w-full pl-9 pr-20 py-2 rounded-xl bg-slate-900 border border-indigo-500/50 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 px-2.5 py-1 rounded-lg bg-indigo-600 text-[11px] font-bold text-white flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask</span>
            </button>
          </div>
        </form>
      )}
    </header>
  );
};
