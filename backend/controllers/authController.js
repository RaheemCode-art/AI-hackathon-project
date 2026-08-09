import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Plan from '../models/Plan.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      onboardingCompleted: false
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasCompletedOnboarding: user.onboardingCompleted,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error("Registration Error Details:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.role !== role) {
      return res.status(403).json({ error: `Access denied. You are not registered as an ${role}.` });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ error: "Account banned by admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    user.lastLogin = new Date();
    await user.save();

    // DOUBLE CHECK: Purane accounts ke liye jinka plan bana hua hai lekin flag false hai
    const planExists = await Plan.exists({ userId: user._id });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Agar naya flag true hai YA plan database me majood hai, to Dashboard pe bhejo
      hasCompletedOnboarding: user.onboardingCompleted || !!planExists, 
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error("Login Error Details:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bodyAnalysis } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bodyAnalysis },
      { new: true }
    ).select('-password');
    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};