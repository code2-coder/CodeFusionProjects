import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendAuthOTP } from '../utils/sendEmail.js';

// @desc    Request OTP for Login/Register
// @route   POST /api/auth/request-otp
// @access  Public
export const requestOtp = async (req, res) => {
  const { email: rawEmail, phone, isLogin } = req.body;
  if (!rawEmail) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const email = rawEmail.trim().toLowerCase();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }

  try {
    // Cryptographically secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    let user = await User.findOne({ email });

    if (isLogin !== undefined) {
      if (isLogin && !user) {
        return res.status(404).json({ success: false, message: 'Account not found. Please create an account.' });
      }
      if (!isLogin && user) {
        return res.status(400).json({ success: false, message: 'Email is already registered. Please sign in.' });
      }
    }

    if (!user) {
      // Check if phone is already taken by another user
      if (phone) {
        const phoneExists = await User.findOne({ phone: phone.trim() });
        if (phoneExists) {
          return res.status(400).json({ success: false, message: 'Phone number already registered to another account.' });
        }
      }

      user = await User.create({
        name: 'New User',
        email,
        phone: phone ? phone.trim() : undefined,
        isVerified: false,
        otp,
        otpExpires,
      });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
      if (phone && !user.phone) {
        const phoneExists = await User.findOne({ phone: phone.trim() });
        if (!phoneExists) user.phone = phone.trim();
      }
      await user.save();
    }

    await sendAuthOTP(email, otp);

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Request OTP Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error sending OTP' });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  const { email: rawEmail, otp, name } = req.body;

  if (!rawEmail || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const email = rawEmail.trim().toLowerCase();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.otp || user.otp !== String(otp).trim() || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Invalidate OTP immediately to prevent replay attacks
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    if (name && name.trim() !== '' && user.name === 'New User') {
      user.name = name.trim();
    }

    await user.save();

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Verify OTP Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error verifying OTP' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name ? req.body.name.trim() : user.name;
    user.phone = req.body.phone ? req.body.phone.trim() : user.phone;

    // If email is changed, ensure it's not taken
    if (req.body.email && req.body.email.trim().toLowerCase() !== user.email) {
      const newEmail = req.body.email.trim().toLowerCase();
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already taken by another account.' });
      }
      user.email = newEmail;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};
