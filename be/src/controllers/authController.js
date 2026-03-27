import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// Helper — shapes the user object returned in every response
const userResponse = (user, accessToken, refreshToken) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  company: user.company,
  bio: user.bio,
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  profilePic: user.profilePic,
  affiliateCode: user.affiliateCode,

  referrals: user.referrals,
  earnings: user.earnings,
  payouts: user.payouts,
  token: accessToken,
  refreshToken: refreshToken,
});


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, company, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields (name, email, password)' });
    }

    // Server-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Generate initial affiliate code
    const baseCode = name.replace(/\s+/g, '').toUpperCase().slice(0, 6);
    const affiliateCode = `${baseCode}${Math.floor(1000 + Math.random() * 9000)}`;

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'affiliate',
      phone: phone || '',
      company: company || '',
      bio: bio || '',
      affiliateCode,
      lastLogin: new Date(),
    });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json(userResponse(user, accessToken, refreshToken));
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.json(userResponse(user, accessToken, refreshToken));
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret_default');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

// @desc    Get logged-in user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch profile', error: error.message });
  }
};

// @desc    Update logged-in user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name       = req.body.name       ?? user.name;
    user.phone      = req.body.phone      ?? user.phone;
    user.company    = req.body.company    ?? user.company;
    user.bio        = req.body.bio        ?? user.bio;
    user.profilePic = req.body.profilePic ?? user.profilePic;


    // Only update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updated = await user.save();
    
    const accessToken = generateAccessToken(updated._id, updated.role);
    const refreshToken = generateRefreshToken(updated._id);
    res.json(userResponse(updated, accessToken, refreshToken));
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
};

// @desc    Generate User Affiliate Code
// @route   POST /api/auth/affiliate/generate
// @access  Private
export const generateAffiliateCode = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.affiliateCode) return res.status(400).json({ message: 'Already an affiliate' });

    // Generate code from name + random suffix
    const baseCode = user.name.replace(/\s+/g, '').toUpperCase().slice(0, 6);
    user.affiliateCode = `${baseCode}${Math.floor(1000 + Math.random() * 9000)}`;
    
    await user.save();
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    res.json(userResponse(user, accessToken, refreshToken));
  } catch (error) {
    res.status(500).json({ message: 'Code generation failed', error: error.message });
  }
};

// @desc    Request Affiliate Payout
// @route   POST /api/auth/affiliate/payout
// @access  Private
export const requestPayout = async (req, res) => {
  try {
    const { amount, method } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (amount > user.earnings) {
      return res.status(400).json({ message: 'Insufficient earnings' });
    }

    user.payouts.push({ amount, method, status: 'pending' });
    user.earnings -= amount;
    
    await user.save();
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    res.json(userResponse(user, accessToken, refreshToken));
  } catch (error) {
    res.status(500).json({ message: 'Payout request failed', error: error.message });
  }
};

