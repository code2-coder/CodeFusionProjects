import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import { sendAuthOTP } from '../utils/sendEmail.js';

// @desc    Request OTP for Login/Register
// @route   POST /api/auth/request-otp
// @access  Public
export const requestOtp = async (req, res) => {
  const { email, phone, isLogin } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    let user = await User.findOne({ email });

    if (isLogin !== undefined) {
      if (isLogin && !user) {
        return res.status(404).json({ message: 'Account not found. Please create an account.' });
      }
      if (!isLogin && user) {
        return res.status(400).json({ message: 'Email is already registered. Please sign in.' });
      }
    }

    if (!user) {
      // Check if phone is already taken by another user
      if (phone) {
        const phoneExists = await User.findOne({ phone });
        if (phoneExists) {
          return res.status(400).json({ message: 'Phone number already registered to another account.' });
        }
      }

      user = await User.create({
        name: 'New User',
        email,
        phone,
        isVerified: false,
        otp,
        otpExpires
      });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
      if (phone && !user.phone) {
        const phoneExists = await User.findOne({ phone });
        if (!phoneExists) user.phone = phone;
      }
      await user.save();
    }

    await sendAuthOTP(email, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  const { email, otp, name } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    
    if (name && name.trim() !== '' && user.name === 'New User') {
      user.name = name;
    }
    
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      
      // If email is changed, ensure it's not taken
      if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
          return res.status(400).json({ message: 'Email is already taken by another account.' });
        }
        user.email = req.body.email;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

