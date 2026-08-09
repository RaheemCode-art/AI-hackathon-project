import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['diet', 'workout'], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  source: { type: String, enum: ['ai', 'admin_override', 'manual'], default: 'ai' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Plan', planSchema);