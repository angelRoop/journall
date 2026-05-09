import mongoose from 'mongoose';

const tradeTemplateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  templateName: { type: String, required: true },
  templateData: { type: mongoose.Schema.Types.Mixed, required: true },
}, {
  timestamps: true,
});

export default mongoose.model('TradeTemplate', tradeTemplateSchema);
