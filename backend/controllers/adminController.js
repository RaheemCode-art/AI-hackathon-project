import User from '../models/User.js';
import Plan from '../models/Plan.js';
import ChatLog from '../models/ChatLog.js';
import AdminLog from '../models/AdminLog.js';

export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', status: 'active' });
    const allUsers = await User.find({ role: 'user' });
    
    const totalScore = allUsers.reduce((acc, curr) => acc + curr.fitnessScore, 0);
    const avgFitnessScore = totalUsers > 0 ? (totalScore / totalUsers).toFixed(1) : 0;

    res.status(200).json({ totalUsers, activeUsers, avgFitnessScore });
  } catch (error) {
    res.status(500).json({ error: "Server error fetching analytics" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching users" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const user = await User.findByIdAndUpdate(userId, { status }, { new: true }).select('-password');
    
    await AdminLog.create({
      adminId: req.user._id,
      actionType: 'UPDATE_USER_STATUS',
      targetId: userId,
      details: { status }
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error updating user status" });
  }
};

export const overridePlan = async (req, res) => {
  try {
    const { planId, newContent } = req.body;
    const plan = await Plan.findByIdAndUpdate(planId, { 
      content: newContent, 
      source: 'admin_override' 
    }, { new: true });

    await AdminLog.create({
      adminId: req.user._id,
      actionType: 'OVERRIDE_PLAN',
      targetId: planId,
      details: { source: 'admin_override' }
    });

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: "Server error overriding plan" });
  }
};

export const flagChat = async (req, res) => {
  try {
    const { chatId, isFlagged } = req.body;
    const chat = await ChatLog.findByIdAndUpdate(chatId, { isFlagged }, { new: true });

    await AdminLog.create({
      adminId: req.user._id,
      actionType: 'FLAG_CHAT',
      targetId: chatId,
      details: { isFlagged }
    });

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Server error flagging chat" });
  }
};

export const getChatLogs = async (req, res) => {
  try {
    const logs = await ChatLog.find().populate('userId', 'name email').sort('-createdAt').limit(100);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserPlans = async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await Plan.find({ userId });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUserPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { content } = req.body;
    const updatedPlan = await Plan.findByIdAndUpdate(
      planId,
      { content },
      { new: true }
    );
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};