import Groq from 'groq-sdk';
import Plan from '../models/Plan.js';
import Progress from '../models/Progress.js';
import ChatLog from '../models/ChatLog.js';

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

export const chatWithAI = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const activePlans = await Plan.find({ userId: req.user._id, isActive: true });
    const latestProgress = await Progress.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(1);

    const contextData = {
      plans: activePlans,
      progress: latestProgress.length > 0 ? latestProgress[0] : null
    };

    const prompt = `
      You are an expert AI Fitness Coach. Use the following user context to answer their query accurately and safely.
      If the user asks something outside of fitness, diet, or health, politely decline.
      
      User Context (JSON):
      ${JSON.stringify(contextData)}
      
      User Query: ${query}
    `;

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }]
    });

    const aiResponse = completion.choices[0]?.message?.content;

    await ChatLog.create({
      userId: req.user._id,
      query,
      response: aiResponse
    });

    res.status(200).json({
      query,
      response: aiResponse
    });

  } catch (error) {
    console.error("Chat Error Details:", error);
    res.status(500).json({ error: "Server error during AI chat processing", details: error.message });
  }
};