const express = require('express');
const Score = require('../models/Score');
const Match = require('../models/Match');
const Team = require('../models/Team');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:matchId', async (req, res) => {
  const { matchId } = req.params;
  try {
    // Find all predictions for the given match and populate user details and team details
    const predictions = await Score.find({ match: matchId }).populate('user', 'username').populate('prediction', 'teamName');

    // Group predictions by the predicted team name
    const grouped = predictions.reduce((acc, curr) => {
      const teamName = curr.prediction.teamName;
      if (!acc[teamName]) {
        acc[teamName] = [];
      }
      acc[teamName].push(curr.user.username);
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

    // Check if current time is at least 1 hour before match start
    const now = new Date();
    if (now > new Date(matchStart.getTime() - 30 * 60 * 1000)) {
      return res.status(400).json({ msg: 'Prediction closed for this match' });
    }

    // Check if a prediction already exists for this user and match
    let scoreEntry = await Score.findOne({ user: req.user.id, match: matchId });
    const team = await Team.findOne({ teamName: prediction });

    if (!(team._id.equals(match.teamOne) || team._id.equals(match.teamTwo))) {
      return res.status(400).json({ msg: 'Team not participating in this match' });
    }

    if (scoreEntry) {
      // Update existing prediction if needed
      scoreEntry.prediction = team._id;
      await scoreEntry.save();
      return res.json({ msg: 'Prediction updated', scoreEntry });
    }

    // Create new prediction entry
    scoreEntry = new Score({
      user: req.user.id,
      match: matchId,
      prediction: team._id,
    });
    await scoreEntry.save();
    res.status(201).json({ msg: 'Prediction submitted', scoreEntry });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;