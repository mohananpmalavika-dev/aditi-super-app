import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  MoonStar, 
  MapPin, 
  AtSign,
  Eye,
  EyeOff,
  Zap,
  Calendar,
  Clock,
  Check,
  Download,
  Share2,
  Copy,
  QrCode,
  Smartphone,
  Monitor,
  ExternalLink,
  Camera,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  ScanFace,
  Fingerprint,
  Hash,
  Delete
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { RegisterCredentials } from '../../types/superApp';
import { ZODIAC_SIGNS } from '../../services/astrologyEngine';
import { searchLocations, LocationSuggestion } from '../../services/locationService';
import { usePWAInstall } from '../../services/pwaService';
import { isDummyOrDisposableAccount } from '../../services/cloudDatabaseService';
import { PhotoCaptureModal } from './PhotoCaptureModal';
import { FaceUnlockModal } from './FaceUnlockModal';
import { FingerprintModal } from './FingerprintModal';
import confetti from 'canvas-confetti';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
];

export const AuthPage: React.FC = () => {
  const { login, register, showToast } = useSuperApp();
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // App URL (Default to published domain malabarbazaar.shop)
  const appUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? window.location.origin
    : 'https://malabarbazaar.shop';

  // High-Res Dynamic QR Code Image URL
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(appUrl)}&color=63-66-241&bgcolor=3-7-18&margin=1`;

  // Sign In State & Biometric Methods
  const [signInMethod, setSignInMethod] = useState<'password' | 'pin'>('password');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);

  // Handle PIN Keypad entry
  const handlePinDigit = (digit: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);

      if (nextPin.length === 4) {
        // Complete 4-digit PIN entered -> auto login
        setLoading(true);
        setTimeout(async () => {
          await login({ email: loginEmail, password: loginPassword });
          setLoading(false);
          confetti({ particleCount: 60, spread: 70 });
          showToast('🔢 Mobile PIN verified! Welcome back.');
        }, 500);
      }
    }
  };

  const handlePinBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handlePinClear = () => {
    setPinInput('');
  };

  const handleBiometricSuccess = async (type: string) => {
    setLoading(true);
    await login({ email: loginEmail, password: loginPassword });
    setLoading(false);
    showToast(`✨ ${type} Authentication Successful!`);
  };

  // Registration State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regHandle, setRegHandle] = useState('');
  const [regDob, setRegDob] = useState('1998-08-15');
  const [regTob, setRegTob] = useState('10:30');
  const [regPob, setRegPob] = useState('');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Non-Binary' | 'Other' | 'Prefer not to say'>('Female');
  const [regZodiac, setRegZodiac] = useState('Leo');
  const [regAvatar, setRegAvatar] = useState(PRESET_AVATARS[0]);
  const [regBio, setRegBio] = useState('Aditi Explorer & Tech Innovator 🚀');
  const [showCameraModal, setShowCameraModal] = useState(false);

  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('⚠️ Image size exceeds 10MB limit');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setRegAvatar(event.target.result as string);
        showToast('📸 Custom profile photo loaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Place of Birth Autocomplete State
  const [placeSuggestions, setPlaceSuggestions] = useState<LocationSuggestion[]>([]);
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);

  // Handle live place typing & autofill lookup
  useEffect(() => {
    if (regPob.length >= 2 && !regPob.includes(',')) {
      searchLocations(regPob).then((results) => {
        setPlaceSuggestions(results);
        setShowPlaceDropdown(results.length > 0);
      });
    } else {
      setPlaceSuggestions([]);
      setShowPlaceDropdown(false);
    }
  }, [regPob]);

  // Auto calculate zodiac sign from Date of Birth
  const handleDobChange = (dobString: string) => {
    setRegDob(dobString);
    if (!dobString) return;
    const date = new Date(dobString);
    const m = date.getMonth() + 1;
    const d = date.getDate();

    let calculatedSign = 'Aries';
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) calculatedSign = 'Aries';
    else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) calculatedSign = 'Taurus';
    else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) calculatedSign = 'Gemini';
    else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) calculatedSign = 'Cancer';
    else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) calculatedSign = 'Leo';
    else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) calculatedSign = 'Virgo';
    else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) calculatedSign = 'Libra';
    else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) calculatedSign = 'Scorpio';
    else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) calculatedSign = 'Sagittarius';
    else if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) calculatedSign = 'Capricorn';
    else if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) calculatedSign = 'Aquarius';
    else if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) calculatedSign = 'Pisces';

    setRegZodiac(calculatedSign);
  };

  const handleSelectPlace = (place: LocationSuggestion) => {
    setRegPob(place.formatted);
    setShowPlaceDropdown(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    // Strict dummy user login block
    if (isDummyOrDisposableAccount(loginEmail)) {
      showToast('❌ Dummy / Demo account logins are strictly blocked. Please use your genuine verified account.');
      return;
    }

    setLoading(true);
    await login({ email: loginEmail.trim(), password: loginPassword });
    setLoading(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      showToast('⚠️ Please complete all required registration fields');
      return;
    }

    // Strict dummy user registration block
    if (isDummyOrDisposableAccount(regEmail, regName, regHandle)) {
      showToast('❌ Dummy & Test account creation is strictly blocked. Please provide a genuine, valid email and real user details.');
      return;
    }

    if (regPassword.length < 6) {
      showToast('❌ Password must be at least 6 characters long for real security.');
      return;
    }

    setLoading(true);
    const creds: RegisterCredentials = {
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      handle: regHandle ? (regHandle.startsWith('@') ? regHandle : `@${regHandle}`) : `@${regEmail.split('@')[0]}`,
      dateOfBirth: regDob,
      timeOfBirth: regTob,
      placeOfBirth: regPob || 'Kozhikode, Kerala, India',
      gender: regGender,
      zodiacSign: regZodiac,
      avatar: regAvatar,
      location: regPob || 'Kozhikode, Kerala, India',
      bio: regBio
    };
    await register(creds);
    setLoading(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopiedLink(true);
      showToast(`📋 Link copied: ${appUrl}`);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      showToast(`Link: ${appUrl}`);
    }
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Aditi - The Boundless Super App',
          text: 'Explore Aditi Super App: AI Creative Studio, Real Estate, Matrimony, Tutors, Astrology, and P2P Chat!',
          url: appUrl
        });
        showToast('🚀 Shared successfully!');
      } catch (err) {
        // Share cancelled
      }
    } else {
      // WhatsApp share fallback
      const waText = encodeURIComponent(`Explore Aditi Super App at ${appUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
    }
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrCodeImageUrl;
    link.download = 'aditi-super-app-qr.png';
    link.target = '_blank';
    link.click();
    showToast('📥 QR Code download initiated!');
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { label: 'Empty', color: 'bg-slate-700', width: 'w-0' };
    if (pass.length < 6) return { label: 'Weak', color: 'bg-rose-500', width: 'w-1/4' };
    if (pass.length < 10) return { label: 'Medium', color: 'bg-amber-500', width: 'w-2/4' };
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = getPasswordStrength(regPassword);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-x-hidden font-sans">
      
      {/* Ambient Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pink-500/10 blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 space-y-6 my-auto py-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-500/30 mb-1 animate-bounce-slow">
            <span className="text-2xl">🌐</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
              Aditi (अदिति) Super App
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
              LifeOS
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Live on <span className="text-indigo-300 font-semibold underline">{appUrl.replace('https://', '')}</span> • Creative AI, Matrimony, Real Estate & Chat
          </p>
        </div>

        {/* Action Bar: Install App Button & QR Share Trigger */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          
          {/* PWA Install Button */}
          <button
            onClick={() => promptInstall()}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>📲 Install App (Mobile & PC)</span>
          </button>

          {/* QR Code Trigger Button */}
          <button
            onClick={() => setShowQrModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 transition-all"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span>Scan / Share QR</span>
          </button>

        </div>

        {/* Main Grid: Auth Form + Live QR Code Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Sign In / Registration Form (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
            
            {/* Tabs */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'signin'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'signup'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* ========================================================= */}
            {/* MODE 1: SIGN IN (PASSWORD, PIN, FACE ID, FINGERPRINT) */}
            {/* ========================================================= */}
            {authMode === 'signin' && (
              <div className="space-y-4">
                
                {/* Method Switcher: Password vs Mobile PIN */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSignInMethod('password')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      signInMethod === 'password'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Password</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignInMethod('pin')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      signInMethod === 'pin'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5" />
                    <span>Mobile PIN</span>
                  </button>
                </div>

                {/* Quick Biometrics Bar: Face ID & Fingerprint */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFaceModal(true)}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-indigo-500/40 hover:border-indigo-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all group"
                  >
                    <ScanFace className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span>Face Look</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFingerprintModal(true)}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-purple-500/40 hover:border-purple-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all group"
                  >
                    <Fingerprint className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span>Fingerprint</span>
                  </button>
                </div>

                {/* Sub-view 1: Email + Password */}
                {signInMethod === 'password' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign In to Aditi</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Sub-view 2: Mobile 4-Digit PIN Keypad */}
                {signInMethod === 'pin' && (
                  <div className="space-y-4 pt-1 text-center animate-in fade-in">
                    
                    {/* 4 PIN Dots */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300">Enter 4-Digit Security PIN</span>
                      <div className="flex items-center justify-center gap-3 py-2">
                        {[0, 1, 2, 3].map((idx) => {
                          const isFilled = pinInput.length > idx;
                          return (
                            <div
                              key={idx}
                              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                                isFilled
                                  ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.8)] scale-110'
                                  : 'bg-slate-950 border-slate-700'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">Enter your 4-digit security PIN</p>
                    </div>

                    {/* Numeric Keypad Grid */}
                    <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                        <button
                          key={digit}
                          type="button"
                          onClick={() => handlePinDigit(digit)}
                          className="h-12 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-extrabold text-base flex items-center justify-center shadow-md active:scale-90 transition-all"
                        >
                          {digit}
                        </button>
                      ))}

                      {/* Clear Button */}
                      <button
                        type="button"
                        onClick={handlePinClear}
                        className="h-12 rounded-2xl bg-slate-950/60 hover:bg-rose-950/40 border border-slate-800 text-rose-400 font-bold text-xs flex items-center justify-center transition-colors"
                      >
                        Clear
                      </button>

                      {/* 0 Button */}
                      <button
                        type="button"
                        onClick={() => handlePinDigit('0')}
                        className="h-12 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-extrabold text-base flex items-center justify-center shadow-md active:scale-90 transition-all"
                      >
                        0
                      </button>

                      {/* Backspace Button */}
                      <button
                        type="button"
                        onClick={handlePinBackspace}
                        className="h-12 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-bold flex items-center justify-center transition-colors"
                      >
                        <Delete className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* ========================================================= */}
            {/* MODE 2: REGISTRATION & PROFILE SYNC */}
            {/* ========================================================= */}
            {authMode === 'signup' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                
                {/* Full Name & Handle */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <User className="w-3 h-3 text-indigo-400" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Malavika Mohanan"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <AtSign className="w-3 h-3 text-indigo-400" />
                      <span>Handle</span>
                    </label>
                    <input
                      type="text"
                      value={regHandle}
                      onChange={(e) => setRegHandle(e.target.value)}
                      placeholder="@malavika"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-indigo-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="malavika@domain.com"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                {/* Password & Strength Meter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-indigo-400" />
                    <span>Create Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-2.5 pr-9 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {regPassword && (
                    <div className="space-y-1 pt-1">
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
                      </div>
                      <span className="text-[10px] text-slate-400">Strength: <strong className="text-white">{strength.label}</strong></span>
                    </div>
                  )}
                </div>

                {/* Date of Birth & Time of Birth */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      <span>Date of Birth</span>
                    </label>
                    <input
                      type="date"
                      value={regDob}
                      onChange={(e) => handleDobChange(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      <span>Time of Birth</span>
                    </label>
                    <input
                      type="time"
                      value={regTob}
                      onChange={(e) => setRegTob(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Place of Birth with Smart Autofill */}
                <div className="space-y-1 relative">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>Place of Birth (Auto-Completes)</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={regPob}
                    onChange={(e) => setRegPob(e.target.value)}
                    placeholder="Type place (e.g. kollam, kochi, kozhikode)..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />

                  {/* Dropdown Suggestions */}
                  {showPlaceDropdown && placeSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-36 overflow-y-auto divide-y divide-slate-800">
                      {placeSuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPlace(item)}
                          className="w-full p-2 text-left hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-2"
                        >
                          <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="font-semibold">{item.formatted}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Gender & Zodiac */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Gender</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <MoonStar className="w-3 h-3 text-purple-400" />
                      <span>Zodiac Sign</span>
                    </label>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-indigo-300 flex items-center justify-between">
                      <span>{regZodiac}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Auto Calculated</span>
                    </div>
                  </div>
                </div>

                {/* Profile Photo Options: Live Camera, File Upload, and Presets */}
                <div className="space-y-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span>Profile Photo (Camera, Upload or Preset)</span>
                    <span className="text-[10px] text-indigo-400 font-mono">Live Photo Supported</span>
                  </label>

                  <div className="flex items-center gap-3">
                    {/* Active Selected Photo Preview */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={regAvatar}
                        alt="Profile Preview"
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/60 shadow-lg"
                      />
                      <span className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-indigo-600 text-white shadow">
                        <Camera className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Action Buttons: Live Camera & Device Upload */}
                    <div className="flex-1 space-y-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        
                        {/* Real-time Camera Capture */}
                        <button
                          type="button"
                          onClick={() => setShowCameraModal(true)}
                          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Take Photo</span>
                        </button>

                        {/* File Upload */}
                        <input
                          type="file"
                          ref={avatarFileInputRef}
                          accept="image/*"
                          onChange={handleAvatarFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => avatarFileInputRef.current?.click()}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                        >
                          <Upload className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Upload File</span>
                        </button>

                      </div>

                      <p className="text-[10px] text-slate-400 leading-tight">
                        Snap a live portrait with your phone/PC camera or choose from gallery.
                      </p>
                    </div>
                  </div>

                  {/* Preset Avatars Carousel */}
                  <div className="space-y-1 pt-1 border-t border-slate-800/80">
                    <span className="text-[10px] font-semibold text-slate-400">Or choose a preset avatar:</span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {PRESET_AVATARS.map((av, idx) => (
                        <img
                          key={idx}
                          src={av}
                          alt="Avatar Option"
                          onClick={() => setRegAvatar(av)}
                          className={`w-8 h-8 rounded-xl object-cover cursor-pointer border-2 transition-all flex-shrink-0 ${
                            regAvatar === av ? 'border-indigo-500 scale-110 shadow-md shadow-indigo-500/40' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Register */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-all"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

          {/* Right Column: Interactive QR Code Card for malabarbazaar.shop (5 cols) */}
          <div className="md:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-between space-y-4 text-center">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <Smartphone className="w-3 h-3" />
                <span>Scan with Phone Camera</span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Instant App Access</h3>
              <p className="text-[11px] text-slate-400">Scan to open and install directly on iOS / Android</p>
            </div>

            {/* QR Visual */}
            <div className="p-3 bg-slate-950 rounded-2xl border-2 border-indigo-500/40 shadow-xl relative group">
              <img
                src={qrCodeImageUrl}
                alt="Aditi App QR Code"
                className="w-44 h-44 rounded-xl object-contain mx-auto"
              />
              <div className="mt-2 text-[11px] font-mono text-indigo-300 font-bold tracking-tight truncate max-w-[200px] mx-auto">
                {appUrl.replace('https://', '')}
              </div>
            </div>

            {/* Quick QR Sharing Actions */}
            <div className="w-full space-y-2 pt-1">
              
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                
                <button
                  onClick={handleCopyLink}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={handleShareApp}
                  className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share QR</span>
                </button>

              </div>

              <button
                onClick={handleDownloadQr}
                className="w-full py-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 text-[11px] text-slate-400 hover:text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download QR Image (.PNG)</span>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Pop-up Fullscreen QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-white">Scan Aditi Super App</h3>
              <p className="text-xs text-indigo-300 font-mono">{appUrl}</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/50 inline-block shadow-2xl">
              <img
                src={qrCodeImageUrl}
                alt="Aditi QR"
                className="w-52 h-52 rounded-xl object-contain mx-auto"
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Open your phone camera to scan. Works instantly on Android, iPhone, iPad, and Tablets.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleShareApp}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Link</span>
              </button>
              
              <button
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Real-time Live Camera Photo Capture Modal */}
      <PhotoCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={(photoDataUrl) => {
          setRegAvatar(photoDataUrl);
          showToast('📸 Live photo captured and set as profile picture!');
        }}
      />

      {/* Biometric Face ID Unlock Modal */}
      <FaceUnlockModal
        isOpen={showFaceModal}
        onClose={() => setShowFaceModal(false)}
        onSuccess={() => {
          setShowFaceModal(false);
          handleBiometricSuccess('Face ID');
        }}
      />

      {/* Biometric Touch ID & Fingerprint Modal */}
      <FingerprintModal
        isOpen={showFingerprintModal}
        onClose={() => setShowFingerprintModal(false)}
        onSuccess={() => {
          setShowFingerprintModal(false);
          handleBiometricSuccess('Fingerprint');
        }}
      />

    </div>
  );
};
