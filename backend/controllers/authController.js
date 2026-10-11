import crypto from 'crypto';
import User from '../models/User.js';
import ProjectRequest from '../models/ProjectRequest.js';
import Payment from '../models/Payment.js';
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

// @desc    Get all users with analytics & project counts (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Only administrators can view all users' });
    }

    const users = await User.find({})
      .select('-password -otp -otpExpires')
      .sort({ createdAt: -1 })
      .lean();

    // Aggregate project inquiries per user
    const projectCounts = await ProjectRequest.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } }
    ]);
    const projectCountMap = {};
    projectCounts.forEach((pc) => {
      if (pc._id) projectCountMap[pc._id.toString()] = pc.count;
    });

    // Aggregate orders/payments if Payment collection exists
    let paymentCountMap = {};
    try {
      const paymentCounts = await Payment.aggregate([
        { $group: { _id: '$user', count: { $sum: 1 }, totalSpent: { $sum: '$amount' } } }
      ]);
      paymentCounts.forEach((p) => {
        if (p._id) paymentCountMap[p._id.toString()] = { count: p.count, totalSpent: p.totalSpent };
      });
    } catch {
      // payment model optional/empty fallback
    }

    const enrichedUsers = users.map((u) => {
      const userIdStr = u._id.toString();
      return {
        ...u,
        projectCount: projectCountMap[userIdStr] || 0,
        ordersCount: paymentCountMap[userIdStr]?.count || 0,
        totalSpent: paymentCountMap[userIdStr]?.totalSpent || 0,
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      users: enrichedUsers,
    });
  } catch (error) {
    console.error('Get all users error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve users', error: error.message });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
    }

    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    if (req.params.id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot revoke your own admin access.' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
      },
    });
  } catch (error) {
    console.error('Update user role error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update user role' });
  }
};

// @desc    Toggle user verification status (Admin only)
// @route   PUT /api/auth/users/:id/verify
// @access  Private/Admin
export const toggleUserVerification = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    targetUser.isVerified = !targetUser.isVerified;
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `User marked as ${targetUser.isVerified ? 'verified' : 'unverified'}`,
      isVerified: targetUser.isVerified,
    });
  } catch (error) {
    console.error('Toggle verification error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update verification status' });
  }
};

// @desc    Delete user account (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'User account removed successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

