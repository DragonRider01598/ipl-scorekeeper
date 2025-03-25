const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  additionalDetails: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);