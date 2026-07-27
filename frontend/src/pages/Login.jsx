import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Loader2, CheckCircle2, ChevronLeft, Sparkles, Phone, User } from 'lucide-react';

const Login = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { requestOtp, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step === 1 && inputRef.current) {
      inputRef.current.focus();
    } else if (step === 2 && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await requestOtp(email, phone, isLogin);
    setLoading(false);
    
    if (res.success) {
      setSuccessMsg('OTP sent to your email.');
      setStep(2);
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
      navigate('/');
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
    <div className="min-h-screen pt-24 pb-8 flex items-center justify-center bg-[#030303] relative overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/30 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10 w-full max-w-[580px] p-4 sm:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] rounded-[2.5rem] overflow-hidden"
        >
          {/* Subtle top glare */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10 flex flex-col items-center">
              <div className="relative group mb-8 cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-2xl rounded-full scale-[1.5] group-hover:scale-[1.8] transition-all duration-700 ease-out" />
                <div className="relative w-20 h-20 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden transform group-hover:-translate-y-1 transition-all duration-500 ease-out border-2 border-white/10">
                  <img 
                    src="/logo_main_rounded.png" 
                    alt="Brand Logo" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              <h1 className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-[0.3em] uppercase mb-4 drop-shadow-sm">
                Code Fusion Projects
              </h1>
              <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-white/40 text-sm font-medium tracking-wide">
                {isLogin ? 'Sign in to your account' : 'Join us to get started'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }} 
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
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }} 
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-2xl text-xs font-medium text-center flex items-center justify-center gap-2 shadow-inner">
                    <CheckCircle2 size={14} />
                    {successMsg}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  onSubmit={handleRequestOtp} 
                  className="flex flex-col gap-5"
                >
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="relative group overflow-hidden"
                      >
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <User size={18} className="text-white/40 group-focus-within:text-white transition-colors duration-300" />
                        </div>
                        <motion.input 
                          whileFocus={{ scale: 1.01 }}
                          type="text" 
                          placeholder="Full Name"
                          className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-purple-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 text-white placeholder-white/30 font-medium tracking-wide shadow-inner mb-5"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={!isLogin}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Mail size={18} className="text-white/40 group-focus-within:text-white transition-colors duration-300" />
                    </div>
                    <motion.input 
                      whileFocus={{ scale: 1.01 }}
                      ref={inputRef}
                      type="email" 
                      placeholder="Email Address"
                      className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-purple-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 text-white placeholder-white/30 font-medium tracking-wide shadow-inner"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Phone size={18} className="text-white/40 group-focus-within:text-white transition-colors duration-300" />
                    </div>
                    <motion.input 
                      whileFocus={{ scale: 1.01 }}
                      type="tel" 
                      placeholder="Mobile Number"
                      className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-purple-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 text-white placeholder-white/30 font-medium tracking-wide shadow-inner"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={loading || !email || !phone || (!isLogin && !name)}
                    className="group relative w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-bold py-4 rounded-2xl mt-4 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <div className="relative flex items-center justify-center gap-2 text-[15px] tracking-wide">
                      {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>
                          <span>{isLogin ? 'Continue with Email' : 'Create Account'}</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </div>
                  </motion.button>

                  <div className="text-center mt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-white/40 hover:text-white text-xs font-semibold transition-colors"
                    >
                      {isLogin ? 'New user? Create an account' : 'Already have an account? Sign in'}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  onSubmit={handleVerifyOtp} 
                  className="flex flex-col gap-6"
                >
                  <div className="text-center">
                    <p className="text-white/40 text-sm mb-6 leading-relaxed">
                      We sent a verification code to<br/>
                      <span className="text-white/90 font-semibold">{email}</span>
                    </p>
                    <div className="flex justify-center gap-3 sm:gap-4" onPaste={handlePaste}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          maxLength={1}
                          className="w-12 h-14 sm:w-14 sm:h-16 bg-white/[0.05] hover:bg-white/[0.08] border border-white/20 rounded-2xl text-center text-2xl font-bold text-white focus:border-purple-500/50 focus:bg-white/[0.1] outline-none transition-all duration-300 shadow-inner focus:ring-4 focus:ring-purple-500/20 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                      ))}
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={loading || otp.join('').length !== 6}
                    className="group relative w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] mt-2"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify & Access'}
                    </div>
                  </motion.button>
                  
                  <button 
                    type="button" 
                    onClick={() => { setStep(1); setOtp(['','','','','','']); }}
                    className="group flex items-center justify-center gap-1.5 text-white/40 text-xs font-semibold hover:text-white transition-colors mt-2"
                  >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Use a different email
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* Footer info */}
        <p className="text-center text-white/20 text-[10px] font-bold tracking-[0.2em] uppercase mt-8">
          Secure Authentication
        </p>
      </div>
    </div>
  );
};

export default Login;
