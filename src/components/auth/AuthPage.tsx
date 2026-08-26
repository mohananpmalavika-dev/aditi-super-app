import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  MoonStar, 
  MapPin, 
  AtSign,
  Eye,
  EyeOff,
  Zap,
  Globe
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { RegisterCredentials } from '../../types/superApp';
import { ZODIAC_SIGNS } from '../../services/astrologyEngine';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
];

export const AuthPage: React.FC = () => {
  const { login, register, showToast, isCloudConnected } = useSuperApp();
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('dhanya@omnilife.ai');
  const [loginPassword, setLoginPassword] = useState('superpass123');

  // Registration State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regHandle, setRegHandle] = useState('');
  const [regZodiac, setRegZodiac] = useState('Leo');
  const [regAvatar, setRegAvatar] = useState(PRESET_AVATARS[0]);
  const [regLocation, setRegLocation] = useState('San Francisco, CA');
  const [regBio, setRegBio] = useState('Aditi Explorer & Tech Innovator 🚀');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setLoading(true);
    const res = await login({ email: loginEmail, password: loginPassword });
    setLoading(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      showToast('⚠️ Please complete all required registration fields');
      return;
    }
    setLoading(true);
    const creds: RegisterCredentials = {
      name: regName,
      email: regEmail,
      password: regPassword,
      handle: regHandle || regEmail.split('@')[0],
      zodiacSign: regZodiac,
      avatar: regAvatar,
      location: regLocation,
      bio: regBio
    };
    const res = await register(creds);
    setLoading(false);
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    await login({ email: 'dhanya@omnilife.ai', password: 'demo-access-pass' });
    setLoading(false);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Dynamic Animated Ambient Background Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pink-500/10 blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-500/30 mb-1">
            <span className="text-2xl">🌐</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
              Aditi LifeOS
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
              Super App
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            The Boundless All-in-One Platform: AI Studio, Real Estate, Matrimony, Tutors & Digital Wallet.
          </p>
        </div>

        {/* Auth Box Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* Sign In vs Sign Up Tabs */}
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
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ========================================================================= */}
          {/* SIGN IN FORM */}
          {/* ========================================================================= */}
          {authMode === 'signin' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Email or Handle</span>
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Demo password is: superpass123')}
                    className="text-[11px] text-indigo-400 hover:underline font-semibold"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full p-3 pr-10 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Aditi'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo 1-Click Login Option */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>One-Click Demo Login (as Dhanya Sharma)</span>
                </button>
              </div>

            </form>
          )}

          {/* ========================================================================= */}
          {/* REGISTRATION (SIGN UP) FORM */}
          {/* ========================================================================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in">
              
              {/* Full Name & Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Priya Patel"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-purple-400" />
                    <span>Username / Handle</span>
                  </label>
                  <input
                    type="text"
                    value={regHandle}
                    onChange={(e) => setRegHandle(e.target.value)}
                    placeholder="e.g. @priya.ai"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a strong password..."
                    className="w-full p-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength visualizer */}
                {regPassword.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Password Strength</span>
                      <span className="font-bold text-slate-200">{strength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Zodiac Sign & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MoonStar className="w-3.5 h-3.5 text-purple-400" />
                    <span>Zodiac Sign (Horoscope)</span>
                  </label>
                  <select
                    value={regZodiac}
                    onChange={(e) => setRegZodiac(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {ZODIAC_SIGNS.map((z) => (
                      <option key={z.sign} value={z.sign}>
                        {z.symbol} {z.sign} ({z.element})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    placeholder="e.g. New York, USA"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Choose Profile Avatar */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Choose Profile Avatar</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="Avatar option"
                      onClick={() => setRegAvatar(av)}
                      className={`w-11 h-11 rounded-xl object-cover cursor-pointer transition-all ${
                        regAvatar === av
                          ? 'ring-2 ring-purple-500 scale-110 shadow-lg shadow-purple-500/30'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </button>

            </form>
          )}

          {/* Privacy & Cloud Trust Footer */}
          <div className="pt-2 text-center flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Encrypted Identity • Zero LocalStorage</span>
          </div>

        </div>

      </div>

    </div>
  );
};
