import mongoose from 'mongoose';

const chatLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  response: { type: String, required: true },
  isFlagged: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('ChatLog', chatLogSchema);