const mongoose = require('mongoose');

const MedicalHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['SymptomCheck', 'OCRScan'], required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalHistory', MedicalHistorySchema);
