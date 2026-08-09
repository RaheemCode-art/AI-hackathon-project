import SupportMessage from '../models/SupportMessage.js';

export const getMessages = async (req, res) => {
  try {
    const targetUserId = req.user.role === 'admin' ? req.query.userId : req.user._id;
    if (!targetUserId && req.user.role === 'admin') {
      return res.status(400).json({ error: "User ID required for admin" });
    }
    const messages = await SupportMessage.find({ userId: targetUserId }).sort('createdAt');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message, recipientUserId } = req.body;
    const userId = req.user.role === 'admin' ? recipientUserId : req.user._id;
    const sender = req.user.role === 'admin' ? 'admin' : 'user';

    if (!userId || !message) {
      return res.status(400).json({ error: "Message and user context required" });
    }

    const newMsg = await SupportMessage.create({
      userId,
      sender,
      message
    });

    res.status(201).json(newMsg);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};