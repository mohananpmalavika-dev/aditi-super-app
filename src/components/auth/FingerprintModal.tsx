import React, { useState, useEffect } from 'react';
import { Fingerprint, X, ShieldCheck, Lock } from 'lucide-react';

interface FingerprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FingerprintModal: React.FC<FingerprintModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Checking platform biometric sensor...');

  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined' && window.PublicKeyCredential) {
        setIsSupported(true);
        setStatusMessage('Platform WebAuthn passkey sensor available');
      } else {
        setIsSupported(false);
        setStatusMessage('Hardware biometric passkey is not supported on this browser.');
      }
    }
  }, [isOpen]);

  const handleTriggerWebAuthn = async () => {
    if (!isSupported) {
      setStatusMessage('Please use standard Email & Password authentication.');
      return;
    }

    try {
      setStatusMessage('Awaiting device security prompt...');
      // In production WebAuthn, challenge options must be generated server-side.
      // If server-side WebAuthn endpoint is ready, invoke navigator.credentials.get()
      setStatusMessage('Standard credentials authentication required.');
    } catch (err: any) {
      setStatusMessage('Biometric assertion cancelled.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-3xl bg-slate-950 border-2 border-indigo-500/50 shadow-2xl p-6 text-center space-y-5 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-sm text-white">Touch ID & Fingerprint</h3>
              <p className="text-[10px] text-slate-400 font-mono">WebAuthn FIDO2 Biometrics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fingerprint Scanner Pad */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <button
            type="button"
            onClick={handleTriggerWebAuthn}
            className="relative w-28 h-28 rounded-3xl border-2 border-indigo-500/50 hover:border-indigo-400 bg-slate-900 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl hover:scale-105"
          >
            <Fingerprint className="w-14 h-14 text-indigo-400" />
          </button>

          <div className="space-y-1">
            <span className="text-xs font-bold block text-slate-300">
              {statusMessage}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Hardware passkey authentication
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
          >
            Use Email & Password / Google
          </button>
        </div>

      </div>
    </div>
  );
};
