import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Helper — shapes the user object returned in every response
const userResponse = (user, token) => ({
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
  token,
});


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, company, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
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


    res.status(201).json(userResponse(user, generateToken(user._id, user.role)));
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

    res.json(userResponse(user, generateToken(user._id, user.role)));
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
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
    res.json(userResponse(updated, generateToken(updated._id, updated.role)));
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
    res.json(userResponse(user, generateToken(user._id, user.role)));
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
    res.json(userResponse(user, generateToken(user._id, user.role)));
  } catch (error) {
    res.status(500).json({ message: 'Payout request failed', error: error.message });
  }
};

