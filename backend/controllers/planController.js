import Groq from 'groq-sdk';
import User from '../models/User.js';
import Plan from '../models/Plan.js';

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

export const generateFitnessPlan = async (req, res) => {
  try {
    const { goal, allergies, workoutPreference } = req.body;
    
    if (!goal || !workoutPreference) {
      return res.status(400).json({ error: "Goal and workout preference are required" });
    }

    const user = await User.findById(req.user._id);
    user.goals = goal;
    user.onboardingCompleted = true; // Onboarding complete flag true set kar diya
    await user.save();

    const prompt = `
      Act as an expert AI Fitness Coach. Generate a comprehensive JSON response containing a diet plan and a workout plan for a user with the following details:
      Goal: ${goal}
      BMI: ${user.bodyAnalysis?.bmi || 'Unknown'}
      Posture Issues: ${user.bodyAnalysis?.postureIssues?.join(', ') || 'None'}
      Allergies: ${allergies || 'None'}
      Workout Preference: ${workoutPreference}

      The output must be strictly in valid JSON format without any markdown blocks or extra text, following this exact structure:
      {
        "diet": {
          "dailyCalories": 2000,
          "macros": { "protein": "150g", "carbs": "200g", "fats": "60g" },
          "meals": [
            { "name": "Breakfast", "items": ["Oats", "Eggs"], "calories": 400 }
          ]
        },
        "workout": {
          "type": "${workoutPreference}",
          "weeklySplit": [
            { "day": "Day 1", "focus": "Chest", "exercises": [
              { "name": "Pushups", "sets": 3, "reps": 12 }
            ]}
          ]
        }
      }
    `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const aiResponse = completion.choices[0]?.message?.content;
    const parsedData = JSON.parse(aiResponse);

    const dietPlan = await Plan.create({
      userId: user._id,
      type: 'diet',
      content: parsedData.diet,
      source: 'ai'
    });

    const workoutPlan = await Plan.create({
      userId: user._id,
      type: 'workout',
      content: parsedData.workout,
      source: 'ai'
    });

    res.status(201).json({
      message: "Plans generated successfully",
      dietPlan,
      workoutPlan
    });

  } catch (error) {
    console.error("Plan Generation Error Details:", error);
    res.status(500).json({ error: "Server error during AI plan generation", details: error.message });
  }
};