const express = require('express');
const Score = require('../models/Score');
const Match = require('../models/Match');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:matchId', async (req, res) => {
  const { matchId } = req.params;
  try {
    // Find all predictions for the given match and populate user details
    const predictions = await Score.find({ match: matchId }).populate('user', 'username');

    // Group predictions by the predicted team
    const grouped = predictions.reduce((acc, curr) => {
      const team = curr.prediction;
      if (!acc[team]) {
        acc[team] = [];
      }
      // Add the user's basic info (username, id) to the corresponding team group
      acc[team].push({
        userId: curr.user._id,
        username: curr.user.username
      });
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


// Endpoint to submit a prediction
router.post('/', authMiddleware, async (req, res) => {
  const { matchId, prediction } = req.body;
  try {
    // Find the match to check time restrictions
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ msg: 'Match not found' });

    const matchStart = new Date(match.matchDate);

    // Check if current time is before match start
    const now = new Date();
    if (now > new Date(matchStart.getTime())) {
      return res.status(400).json({ msg: 'Prediction closed for this match' });
    }

    // Check if a prediction already exists for this user and match
    let scoreEntry = await Score.findOne({ user: req.user.id, match: matchId });
    if (scoreEntry) {
      // Update existing prediction if needed
      scoreEntry.prediction = prediction;
      await scoreEntry.save();
      return res.json({ msg: 'Prediction updated', scoreEntry });
    }

    // Create new prediction entry
    scoreEntry = new Score({
      user: req.user.id,
      match: matchId,
      prediction,
    });
    await scoreEntry.save();
    res.status(201).json({ msg: 'Prediction submitted', scoreEntry });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;