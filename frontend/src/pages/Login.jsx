import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, ArrowRight, Loader2, CheckCircle2, ChevronLeft, 
  Phone, User, ArrowLeft, ShieldCheck, Zap, Lock, Sparkles, RefreshCw 
} from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const modeParam = searchParams.get('mode');

  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [isLogin, setIsLogin] = useState(modeParam !== 'signup'); // Toggle between Login and Signup
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const { requestOtp, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const otpRefs = useRef([]);

  // Sync mode if query changes
  useEffect(() => {
    if (modeParam === 'signup') {
      setIsLogin(false);
    } else if (modeParam === 'login') {
      setIsLogin(true);
    }
  }, [modeParam]);

  // Focus management
  useEffect(() => {
    if (step === 1 && inputRef.current) {
      inputRef.current.focus();
    } else if (step === 2 && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await requestOtp(email, phone, isLogin);
    setLoading(false);
    
    if (res.success) {
      setSuccessMsg('Verification code sent to your email.');
      setStep(2);
      setResendCooldown(45);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setError(res.error);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setError('');
    const res = await requestOtp(email, phone, isLogin);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('A new verification code has been sent!');
      setResendCooldown(45);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setError(res.error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    const res = await verifyOtp(email, otpValue, name);
    setLoading(false);
    
    if (res.success) {
      const redirectUrl = searchParams.get('redirect') || '/';
      navigate(redirectUrl);
    } else {
      setError(res.error);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (!isNaN(char) && index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    if (pastedData.length > 0) {
      const focusIndex = Math.min(pastedData.length, 5);
      otpRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#030305] relative overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* Animated Deep Background Ambient Orbs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-600/20 blur-[130px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-purple-600/20 blur-[130px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-[35%] left-[30%] w-[40%] h-[40%] rounded-full bg-indigo-500/15 blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10 w-full max-w-[560px] p-4 sm:p-6">
        
        {/* Back to Home Button */}
        <div className="mb-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white/70 hover:text-white text-xs font-semibold backdrop-blur-xl transition-all duration-300 group shadow-sm"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/40">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Encrypted Portal</span>
          </div>
        </div>

        {/* Auth Glass Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative bg-[#0a0a12]/80 backdrop-blur-3xl border border-white/[0.08] ring-1 ring-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_60px_rgba(79,70,229,0.12)] rounded-[2.5rem] overflow-hidden"
        >
          {/* Subtle top edge glare */}
          <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
          
          <div className="p-7 sm:p-10">
            
            {/* Header info */}
            <div className="text-center mb-6 flex flex-col items-center">
              <div className="relative group mb-5 cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-2xl rounded-full scale-[1.5] group-hover:scale-[1.8] transition-all duration-700 ease-out" />
                <div className="relative w-16 h-16 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden transform group-hover:-translate-y-0.5 transition-all duration-500 ease-out border border-white/15 bg-black/40 flex items-center justify-center p-2.5">
                  <img 
                    src="/logo_main_rounded.png" 
                    alt="Code Fusion Logo" 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                <Sparkles size={11} className="text-blue-400" />
                <span>Client Portal Access</span>
              </div>

              <h2 className="text-3xl font-black text-white mb-1.5 tracking-tight drop-shadow-md">
                {step === 2 ? 'Verify Security Code' : (isLogin ? 'Welcome Back' : 'Create Account')}
              </h2>
              <p className="text-white/45 text-xs sm:text-sm font-medium tracking-wide max-w-sm">
                {step === 2 
                  ? 'Enter the 6-digit verification code sent to your email.'
                  : (isLogin 
                      ? 'Sign in to access your client dashboard & project sprints.' 
                      : 'Join CodeFusion to request estimates & track custom software builds.')
                }
              </p>
            </div>

            {/* Segmented Tab Switcher (Step 1 only) */}
            {step === 1 && (
              <div className="flex p-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl mb-6 relative">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setError(''); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
                    isLogin ? 'text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {isLogin && (
                    <motion.div
                      layoutId="auth-tab-pill"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setError(''); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
                    !isLogin ? 'text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {!isLogin && (
                    <motion.div
                      layoutId="auth-tab-pill"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl -z-10 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span>Create Account</span>
                </button>
              </div>
            )}

            {/* Error & Success Alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }} 
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-xs font-medium text-center flex items-center justify-center gap-2 shadow-inner">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </div>
                </motion.div>
              )}
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }} 
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-2xl text-xs font-medium text-center flex items-center justify-center gap-2 shadow-inner">
                    <CheckCircle2 size={14} />
                    {successMsg}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 1: Request OTP Form */}
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  onSubmit={handleRequestOtp} 
                  className="flex flex-col gap-4"
                >
                  {/* Name field for Signup */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, scale: 0.96 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.96 }}
                        transition={{ duration: 0.25 }}
                        className="relative group overflow-hidden"
                      >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User size={18} className="text-white/40 group-focus-within:text-purple-400 transition-colors duration-300" />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Your Full Name or Company Name"
                          className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:border-purple-500/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 text-white placeholder-white/30 text-sm font-medium shadow-inner"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={!isLogin}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Email field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-white/40 group-focus-within:text-blue-400 transition-colors duration-300" />
                    </div>
                    <input 
                      ref={inputRef}
                      type="email" 
                      placeholder="Email Address (e.g. name@company.com)"
                      className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:border-blue-500/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-white placeholder-white/30 text-sm font-medium shadow-inner"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Phone field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={18} className="text-white/40 group-focus-within:text-indigo-400 transition-colors duration-300" />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="Contact Number (with country code)"
                      className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-white placeholder-white/30 text-sm font-medium shadow-inner"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  {/* Submit CTA Button */}
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit" 
                    disabled={loading || !email || !phone || (!isLogin && !name)}
                    className="group relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-2xl mt-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-[0_0_25px_rgba(79,70,229,0.35)] hover:shadow-[0_0_35px_rgba(99,102,241,0.55)] cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out pointer-events-none" />
                    <div className="relative flex items-center justify-center gap-2 text-sm tracking-wide">
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={17} />
                          <span>Generating Secure Code...</span>
                        </>
                      ) : (
                        <>
                          <span>{isLogin ? 'Continue with Email' : 'Create Account'}</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </motion.form>
              ) : (
                /* Step 2: OTP Verification Form */
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  onSubmit={handleVerifyOtp} 
                  className="flex flex-col gap-5"
                >
                  <div className="text-center">
                    <p className="text-white/50 text-xs mb-5 leading-relaxed">
                      Enter the 6-digit code sent to<br/>
                      <span className="text-white font-semibold text-sm">{email}</span>
                    </p>
                    
                    {/* 6 Digit OTP input array */}
                    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          maxLength={1}
                          className="w-11 h-14 sm:w-13 sm:h-16 bg-white/[0.04] hover:bg-white/[0.07] border border-white/15 rounded-2xl text-center text-xl sm:text-2xl font-black text-white focus:border-blue-500/60 focus:bg-white/[0.08] outline-none transition-all duration-300 shadow-inner focus:ring-4 focus:ring-blue-500/20 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verify button */}
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit" 
                    disabled={loading || otp.join('').length !== 6}
                    className="group relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_25px_rgba(79,70,229,0.35)] hover:shadow-[0_0_35px_rgba(99,102,241,0.55)] cursor-pointer mt-1"
                  >
                    <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out pointer-events-none" />
                    <div className="relative flex items-center justify-center gap-2 text-sm">
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={17} />
                          <span>Verifying Code...</span>
                        </>
                      ) : (
                        'Verify & Access Workspace'
                      )}
                    </div>
                  </motion.button>

                  {/* Resend and back controls */}
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <button 
                      type="button" 
                      onClick={() => { setStep(1); setOtp(['','','','','','']); }}
                      className="group flex items-center gap-1 text-white/50 hover:text-white transition-colors font-medium"
                    >
                      <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                      <span>Edit details</span>
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || loading}
                      onClick={handleResendOtp}
                      className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 disabled:text-white/30 font-semibold transition-colors disabled:cursor-not-allowed"
                    >
                      <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                      {resendCooldown > 0 ? (
                        <span>Resend in {resendCooldown}s</span>
                      ) : (
                        <span>Resend Code</span>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Bottom trust pillars */}
            <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-white/[0.06] text-center">
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.01]">
                <ShieldCheck size={16} className="text-emerald-400 mb-1" />
                <span className="text-[11px] text-white/80 font-bold">Passwordless</span>
                <span className="text-[9px] text-white/40 mt-0.5">Secure 1-click OTP</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.01]">
                <Zap size={16} className="text-blue-400 mb-1" />
                <span className="text-[11px] text-white/80 font-bold">Client Portal</span>
                <span className="text-[9px] text-white/40 mt-0.5">Track live sprints</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.01]">
                <Lock size={16} className="text-purple-400 mb-1" />
                <span className="text-[11px] text-white/80 font-bold">Encrypted</span>
                <span className="text-[9px] text-white/40 mt-0.5">256-bit security</span>
              </div>
            </div>

          </div>
        </motion.div>
        
        {/* Footer info */}
        <p className="text-center text-white/30 text-[11px] font-medium tracking-wider mt-6">
          Protected by CodeFusion Security • Enterprise Infrastructure
        </p>
      </div>
    </div>
  );
};

export default Login;
