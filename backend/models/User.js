import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
  onboardingCompleted: { type: Boolean, default: false },
  bodyAnalysis: {
    bmi: Number,
    height: String, 
    postureIssues: [String],
    images: [String]
  },
  goals: {
    type: String,
    enum: ['Weight Loss', 'Weight Gain', 'Muscle', 'Maintenance']
  },
  fitnessScore: { type: Number, default: 0 },
  streaks: { type: Number, default: 0 },
  lastLogin: Date
}, { timestamps: true });

export default mongoose.model('User', userSchema);