import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Wallet, 
  Bell, 
  Grid, 
  Sun, 
  Moon, 
  Zap, 
  X,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { useTheme } from '../../context/ThemeContext';
import { useOmniBrain } from '../../context/OmniBrainContext';
import { MiniAppId } from '../../types/superApp';

interface TopHeaderProps {
  onOpenLauncher: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenLauncher }) => {
  const { user, alerts, dismissAlert, setActiveMiniApp, logout } = useSuperApp();
  const { theme, toggleTheme } = useTheme();
  const { toggleAgentDrawer, askBrain } = useOmniBrain();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlertsPopover, setShowAlertsPopover] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    askBrain(searchQuery);
    toggleAgentDrawer();
    setSearchQuery('');
  };

  const handleAlertClick = (actionApp: MiniAppId, alertId: string) => {
    setActiveMiniApp(actionApp);
    dismissAlert(alertId);
    setShowAlertsPopover(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Mini-App Launcher Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveMiniApp('home')}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <span className="text-xl">🌐</span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  Aditi
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  SUPER APP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">The Boundless LifeOS</p>
            </div>
          </button>

          {/* Launcher Grid Trigger */}
          <button
            onClick={onOpenLauncher}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Grid className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Mini-Apps</span>
          </button>
        </div>

        {/* OmniSearch / Universal Command Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask Aditi Brain (e.g., 'find python tutor', '3BHK rent', 'draw anime city')..."
              className="w-full pl-10 pr-24 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-semibold text-white flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask AI</span>
            </button>
          </div>
        </form>

        {/* Right Header Utilities & Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* OmniBrain Floating Trigger */}
          <button
            onClick={toggleAgentDrawer}
            className="relative px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow text-yellow-300" />
            <span className="hidden sm:inline">Aditi Brain AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </button>

          {/* Proactive Notification Alerts */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsPopover(!showAlertsPopover)}
              className="relative p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 transition-colors"
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
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-sm text-slate-200">Proactive Insights</span>
                  </div>
                  <button
                    onClick={() => setShowAlertsPopover(false)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
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
                        className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-all group"
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

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 transition-colors"
            title={`Current theme: ${theme}`}
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800 transition-colors focus:outline-none"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/50"
              />
            </button>

            {/* User Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/40"
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
                        });
                      } else {
                        const waText = encodeURIComponent(`Explore Aditi Super App at ${window.location.origin}`);
                        window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
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
    </header>
  );
};
