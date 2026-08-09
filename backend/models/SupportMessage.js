import mongoose from 'mongoose';

const supportMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: String, enum: ['user', 'admin'], required: true },
  message: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('SupportMessage', supportMessageSchema);