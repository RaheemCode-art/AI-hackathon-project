import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const logDailyProgress = async (req, res) => {
  try {
    const { weight, caloriesConsumed, habits } = req.body;
    
    const progress = await Progress.create({
      userId: req.user._id,
      weight,
      caloriesConsumed,
      habits
    });

    const user = await User.findById(req.user._id);
    
    const allHabitsCompleted = habits.meals && habits.water && habits.workout && habits.sleep;
    
    if (allHabitsCompleted) {
      user.streaks += 1;
      user.fitnessScore += 10;
    } else {
      user.streaks = 0;
      user.fitnessScore = Math.max(0, user.fitnessScore - 5);
    }

    if (weight && user.bodyAnalysis) {
      user.bodyAnalysis.bmi = (weight / Math.pow(1.75, 2)).toFixed(1); 
    }

    await user.save();

    res.status(201).json({ 
      progress, 
      userStreaks: user.streaks, 
      fitnessScore: user.fitnessScore 
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during daily tracking" });
  }
};

export const logWeeklyProgress = async (req, res) => {
  try {
    const files = req.files;
    const imagePaths = files ? files.map(file => file.path) : [];
    
    const recentProgress = await Progress.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(7);
    
    const prompt = `
      Act as an AI Fitness Coach. Analyze this user's 7-day fitness tracking data and provide a highly motivating, short insight on their consistency.
      Data: ${JSON.stringify(recentProgress)}
    `;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const aiInsights = result.response.text();

    const weeklyProgress = await Progress.create({
      userId: req.user._id,
      photos: imagePaths,
      aiInsights
    });

    res.status(201).json({ weeklyProgress });
  } catch (error) {
    res.status(500).json({ error: "Server error during weekly tracking" });
  }
};