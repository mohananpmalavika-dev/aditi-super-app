import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Zap, 
  Check, 
  Share2, 
  Copy, 
  QrCode, 
  Smartphone, 
  ExternalLink,
  Phone,
  Download
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { RegisterCredentials } from '../../types/superApp';
import { usePWAInstall } from '../../services/pwaService';
import { isDummyOrDisposableAccount, cloudResetPassword } from '../../services/cloudDatabaseService';
import confetti from 'canvas-confetti';
import { generateSvgAvatar } from '../../utils/avatarUtils';

export const AuthPage: React.FC = () => {
  const { login, loginWithGoogle, register, showToast } = useSuperApp();
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Google / Gmail OAuth Login State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  // App URL (Default to published domain malabarbazaar.shop)
  const appUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? window.location.origin
    : 'https://malabarbazaar.shop';

  // High-Res Dynamic QR Code Image URL
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(appUrl)}&color=63-66-241&bgcolor=3-7-18&margin=1`;

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Simplified Create Account State (Name, Email, Mobile, Password)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    // Strict dummy user login block
    if (isDummyOrDisposableAccount(loginEmail)) {
      showToast('❌ Dummy / Demo account logins are strictly blocked. Please use your genuine verified account.');
      return;
    }

    if (!loginPassword) {
      showToast('⚠️ Please enter your password to sign in.');
      return;
    }

    setLoading(true);
    const result = await login({ email: loginEmail.trim(), password: loginPassword });
    setLoading(false);

    if (!result.success) {
      if (result.error?.toLowerCase().includes('invalid login credentials') || result.error?.toLowerCase().includes('not found')) {
        const parsedName = loginEmail.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        setRegEmail(loginEmail.trim());
        setRegName(parsedName);
        setAuthMode('signup');
        showToast(`ℹ️ "${loginEmail}" ഡാറ്റാബേസിൽ കണ്ടെത്തിയില്ല. പുതിയ അക്കൗണ്ട് നിർമ്മാണത്തിലേക്ക് മാറ്റുന്നു (Redirected to Create Account)! 📝`);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!loginEmail) {
      showToast('⚠️ Please enter your email address first to receive a password reset link.');
      return;
    }
    setLoading(true);
    const res = await cloudResetPassword(loginEmail);
    setLoading(false);
    if (res.success) {
      showToast(`📧 Password reset link sent to ${loginEmail}. Please check your inbox.`);
    } else {
      showToast(`⚠️ ${res.error || 'Failed to send reset email'}`);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      showToast('⚠️ Please complete all required registration fields (Name, Email, Password).');
      return;
    }

    // Strict dummy user registration block
    if (isDummyOrDisposableAccount(regEmail, regName)) {
      showToast('❌ Dummy & Test account creation is strictly blocked. Please provide a genuine, valid email and real user details.');
      return;
    }

    if (regPassword.length < 6) {
      showToast('❌ Password must be at least 6 characters long for real security.');
      return;
    }

    setLoading(true);
    const autoHandle = `@${regEmail.split('@')[0]}`;
    const autoAvatar = generateSvgAvatar(regName.trim());
    const creds: RegisterCredentials = {
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
      handle: autoHandle,
      avatar: autoAvatar,
      zodiacSign: 'Leo',
      location: 'Kozhikode, Kerala, India',
      bio: 'Aditi Verified Member 🚀'
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
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(appUrl);
      showToast('📋 App link copied to clipboard!');
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
            {/* MODE 1: SIGN IN (EMAIL & PASSWORD + GOOGLE OAUTH) */}
            {/* ========================================================= */}
            {authMode === 'signin' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1 animate-in fade-in">
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
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot Password?
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

                {/* Google / Gmail Continue Button */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-2.5 shadow-md hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google / Gmail</span>
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* MODE 2: CREATE ACCOUNT (NAME, EMAIL, MOBILE, PASSWORD + GOOGLE OAUTH) */}
            {/* ========================================================= */}
            {authMode === 'signup' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-1 animate-in fade-in">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="rahul@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mobile Number</span>
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Password & Strength Meter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
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
                  {regPassword && (
                    <div className="space-y-1 pt-1">
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
                      </div>
                      <span className="text-[10px] text-slate-400">Strength: <strong className="text-white">{strength.label}</strong></span>
                    </div>
                  )}
                </div>

                {/* Submit Register */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account & Join Aditi</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Google / Gmail Quick Create Button */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">or sign up with</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-2.5 shadow-md hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign Up with Google / Gmail (Instant Auth)</span>
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

      {/* Google / Gmail OAuth Authentication & Auto-Account Creation Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            
            {/* Google Brand Header */}
            <div className="text-center space-y-2">
              <svg className="w-9 h-9 mx-auto" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <h3 className="font-extrabold text-lg text-slate-900">Sign in with Google</h3>
              <p className="text-xs text-slate-500">Choose your Gmail account to continue to Aditi Super App</p>
            </div>

            {/* Quick Gmail Account Option */}
            <div className="space-y-3">
              
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!googleEmailInput) return;
                  if (isDummyOrDisposableAccount(googleEmailInput)) {
                    showToast('❌ Dummy / Disposable emails are blocked. Please use a valid Google account.');
                    return;
                  }
                  setLoading(true);
                  setShowGoogleModal(false);
                  const effectiveName = googleNameInput || googleEmailInput.split('@')[0];
                  await loginWithGoogle({
                    name: effectiveName,
                    email: googleEmailInput.trim(),
                    avatar: generateSvgAvatar(effectiveName)
                  });
                  setLoading(false);
                }}
                className="space-y-3 pt-2"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Your Google / Gmail Address</label>
                  <input
                    type="email"
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name (Optional)</label>
                  <input
                    type="text"
                    value={googleNameInput}
                    onChange={(e) => setGoogleNameInput(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Authenticate & Sync with Database</span>
                </button>
              </form>

            </div>

            <div className="flex items-center justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
