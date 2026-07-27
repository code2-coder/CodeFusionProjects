import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const inputRef = useRef(null);

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
    inputRef.current?.focus();
  }, [email, navigate]);

  const handleOnChange = ({ target }) => {
    const { value } = target;
    const newOTP = [...otp];
    newOTP[activeOTPIndex] = value.substring(value.length - 1);
    setOtp(newOTP);

    if (!value) setActiveOTPIndex(activeOTPIndex - 1);
    else if (activeOTPIndex < 5) setActiveOTPIndex(activeOTPIndex + 1);
  };

  const handleOnKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOTP = [...otp];
      newOTP[index] = '';
      setOtp(newOTP);
      if (index > 0) setActiveOTPIndex(index - 1);
    }
  };

  const verifyOTP = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('/api/auth/verify-otp', { email, otp: otpValue });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeOTPIndex === 5 && otp[5] !== '') {
      verifyOTP();
    }
  }, [activeOTPIndex, otp]);

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
      <div className="bg-card p-10 rounded-3xl border border-[color:var(--border)] shadow-xl w-full max-w-lg text-center relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none"></div>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 relative z-10">
            <CheckCircle className="text-green-500 w-20 h-20 mb-4 animate-bounce" />
            <h2 className="text-3xl font-bold text-foreground">Email Verified!</h2>
            <p className="text-foreground/70">Your account is now active.</p>
            <p className="text-sm font-semibold text-purple-500 mt-4 flex items-center gap-2">
              Redirecting to login <ArrowRight size={16} className="animate-pulse" />
            </p>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            
            <h2 className="text-3xl font-bold text-foreground mb-4">Check your email</h2>
            <p className="text-foreground/60 mb-8 max-w-sm mx-auto leading-relaxed">
              We've sent a 6-digit verification code to <strong className="text-foreground">{email}</strong>. Enter the code below to verify your account.
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-xl mb-8 text-sm font-semibold animate-pulse">
                {error}
              </div>
            )}

            <div className="flex justify-center items-center gap-2 sm:gap-4 mb-8">
              {otp.map((_, index) => (
                <React.Fragment key={index}>
                  <input
                    ref={index === activeOTPIndex ? inputRef : null}
                    type="number"
                    className="w-12 h-14 sm:w-14 sm:h-16 bg-background border-2 border-[color:var(--border)] rounded-xl flex items-center justify-center text-center text-2xl font-bold text-foreground focus:border-purple-500 focus:bg-purple-500/5 outline-none transition-all spin-button-none"
                    onChange={handleOnChange}
                    onKeyDown={(e) => handleOnKeyDown(e, index)}
                    value={otp[index]}
                  />
                  {index === 2 && <span className="w-4 h-1 bg-[color:var(--border)] rounded-full mx-1"></span>}
                </React.Fragment>
              ))}
            </div>

            <button 
              onClick={verifyOTP} 
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-foreground text-background font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex justify-center items-center h-[56px]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-background/20 border-t-background rounded-full animate-spin"></div>
              ) : (
                'Verify Account'
              )}
            </button>
            
            <p className="text-center mt-8 text-foreground/50 text-sm">
              Didn't receive the email? <button className="text-purple-500 font-bold hover:underline ml-1">Resend Code</button>
            </p>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .spin-button-none::-webkit-inner-spin-button, 
        .spin-button-none::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
      `}} />
    </div>
  );
};

export default VerifyEmail;
