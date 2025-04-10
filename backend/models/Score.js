const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  prediction: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }, // user’s predicted winning team
  score: { type: Number, default: 0 }, // +2, -1 or 0 based on outcome
}, { timestamps: true });

module.exports = mongoose.model('Score', ScoreSchema);