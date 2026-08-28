import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Fingerprint, 
  ScanFace, 
  KeyRound, 
  Sparkles, 
  Smartphone, 
  RefreshCw, 
  LogOut,
  AlertCircle
} from 'lucide-react';
import { 
  DeviceSessionUser, 
  verifyDeviceLock, 
  clearActiveSession 
} from '../../services/deviceLockService';
import confetti from 'canvas-confetti';

import { getSafeAvatarUrl, handleAvatarError } from '../../utils/avatarUtils';

interface DeviceLockScreenProps {
  sessionUser: DeviceSessionUser;
  onUnlockSuccess: () => void;
  onSwitchAccount: () => void;
}

export const DeviceLockScreen: React.FC<DeviceLockScreenProps> = ({
  sessionUser,
  onUnlockSuccess,
  onSwitchAccount
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Trigger Real Device Hardware Biometric/PIN prompt
  const handleVerifyDeviceLock = async () => {
    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const res = await verifyDeviceLock();
      if (res.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        onUnlockSuccess();
      } else {
        setErrorMsg(res.error || 'Device verification could not be completed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Device verification error');
    } finally {
      setIsVerifying(false);
    }
  };

  // Auto prompt device unlock on load
  useEffect(() => {
    const timer = setTimeout(() => {
      handleVerifyDeviceLock();
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Ambient background lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none animate-pulse-slow" />

      <div className="w-full max-w-sm relative z-10 space-y-6 text-center">
        
        {/* Brand Shield Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-2xl shadow-indigo-500/40 p-1 mb-1">
          <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
            <Lock className="w-7 h-7 text-indigo-400 animate-pulse" />
          </div>
        </div>

        {/* User Profile Card */}
        <div className="space-y-3">
          <div className="relative inline-block">
            <img
              src={getSafeAvatarUrl(sessionUser.avatar, sessionUser.name)}
              alt={sessionUser.name}
              onError={(e) => handleAvatarError(e, sessionUser.name)}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/50 shadow-2xl mx-auto"
            />
            <span className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-indigo-600 text-white shadow-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">{sessionUser.name}</h2>
            <p className="text-xs text-indigo-300 font-mono">{sessionUser.email || sessionUser.handle}</p>
          </div>
        </div>

        {/* Security Lock Notice */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2 text-xs">
          <div className="flex items-center justify-center gap-1.5 text-indigo-400 font-bold">
            <Smartphone className="w-4 h-4" />
            <span>Device Security Lock Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Verify using your phone or PC's native screen lock (<strong>Face ID</strong>, <strong>Touch ID</strong>, <strong>Windows Hello</strong>, or <strong>Device PIN</strong>).
          </p>

          {errorMsg && (
            <div className="p-2 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-1.5 justify-center mt-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Primary Action Button: Trigger Device Lock */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleVerifyDeviceLock}
            disabled={isVerifying}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking Device Biometrics...</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Unlock with Device Screen Lock</span>
              </>
            )}
          </button>

          {/* Switch Account or Password Login */}
          <button
            type="button"
            onClick={() => {
              clearActiveSession();
              onSwitchAccount();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Sign In with Password / Switch Account</span>
          </button>
        </div>

      </div>
    </div>
  );
};
