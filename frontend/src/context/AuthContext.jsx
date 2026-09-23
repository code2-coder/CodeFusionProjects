import { createContext, useState } from 'react';
import api from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  });

  const requestOtp = async (email, phone, isLogin) => {
    try {
      const { data } = await api.post('/auth/request-otp', { email, phone, isLogin });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to send OTP' };
    }
  };

  const verifyOtp = async (email, otp, name) => {
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp, name });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Verification failed' };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const { data } = await api.put('/auth/profile', userData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, requestOtp, verifyOtp, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
