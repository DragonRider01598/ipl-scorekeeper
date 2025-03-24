const express = require('express');
const Match = require('../models/Match');
const Score = require('../models/Score')
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// endpoint to get list of matches
router.get('/', authMiddleware, async (req, res) => {
   try {
      const userId = req.user.id;
      const matches = await Match.find({}).sort({ matchDate: -1, matchTime: -1 });
      const userPredictions = await Score.find({ user: userId }).lean();

      const matchesWithPredictions = matches.map(match => {
         const userPrediction = userPredictions.find(p => p.match.toString() === match._id.toString());

         return {
            ...match.toObject(),
            userPrediction: userPrediction ? userPrediction.prediction : null,
            userScore: userPrediction ? userPrediction.score : null,
            declaredWinner: match.declaredWinner || null,
            canPredict: new Date(match.matchDate) > new Date()
         };
      });

      res.json(matchesWithPredictions);
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
});


// Admin endpoint to add a new match
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
   const { teamOne, teamTwo, matchDate, matchTime, additionalDetails, teamOneImage, teamTwoImage } = req.body;

   try {
      let matchDateTime = new Date(matchDate);
      const [hours, minutes] = matchTime.split(":").map(Number);
      matchDateTime.setHours(hours, minutes, 0, 0);
      matchDateTime = new Date(matchDateTime.getTime() - (5.5 * 60 * 60 * 1000));
      const match = new Match({
         teamOne,
         teamTwo,
         matchDate: matchDateTime,
         additionalDetails,
         teamOneImage,
         teamTwoImage,
      });
      await match.save();
      res.status(201).json({ msg: 'Match added successfully', match });
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
});

// Admin endpoint to declare winner for a match
router.put('/declare/:matchId', authMiddleware, adminMiddleware, async (req, res) => {
   const { matchId } = req.params;
   const { declaredWinner } = req.body;
   try {
      const match = await Match.findById(matchId);
      if (!match) return res.status(404).json({ msg: 'Match not found' });
      match.declaredWinner = declaredWinner;
      await match.save();
      res.json({ msg: 'Winner declared successfully', match });
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
});

module.exports = router;