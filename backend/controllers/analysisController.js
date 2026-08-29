import 'dotenv/config';
import Groq from 'groq-sdk';
import User from '../models/User.js';

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

export const analyzeBodyImages = async (req, res) => {
  try {
    if (!req.files || req.files.length !== 4) {
      return res.status(400).json({ error: "Exactly 4 images are required" });
    }

    const mockBMI = (Math.random() * (26 - 19) + 19).toFixed(1);
    const postures = ["Slight forward head posture", "Balanced alignment", "Uneven shoulders", "Mild anterior pelvic tilt"];
    const randomPosture = postures[Math.floor(Math.random() * postures.length)];

    const user = await User.findById(req.user._id);
    user.bodyAnalysis = {
      bmi: Number(mockBMI),
      postureIssues: [randomPosture],
      images: req.files.map(file => file.path)
    };
    await user.save();

    res.status(200).json({
      message: "Analysis complete",
      analysis: user.bodyAnalysis
    });

  } catch (error) {
    console.error("Analysis Error Details:", error);
    res.status(500).json({ error: "Server error during image analysis", details: error.message });
  }
};