const express = require('express');
const Match = require('../models/Match');
const Score = require('../models/Score');
const Team = require('../models/Team');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// endpoint to get list of matches
router.get('/', authMiddleware, async (req, res) => {
   try {
      const userId = req.user.id;
      const matches = await Match.find({})
         .sort({ matchDate: -1 })
         .populate('teamOne', 'teamName imageUrl')
         .populate('teamTwo', 'teamName imageUrl')
         .populate('declaredWinner', 'teamName');

      const userPredictions = await Score.find({ user: userId })
         .populate('prediction', 'teamName')
         .lean();

      const matchesWithPredictions = matches.map(match => {
         const userPrediction = userPredictions.find(p => p.match.toString() === match._id.toString());

         const teamOne = match.teamOne;
         const teamTwo = match.teamTwo;
         const winner = match.declaredWinner;

         return {
            _id: match._id,
            teamOneName: teamOne ? teamOne.teamName : 'T1',
            teamOneImage: teamOne ? teamOne.imageUrl : null,
            teamTwoName: teamTwo ? teamTwo.teamName : 'T2',
            teamTwoImage: teamTwo ? teamTwo.imageUrl : null,
            matchDate: match.matchDate,
            additionalDetails: match.additionalDetails,
            declaredWinner: winner ? winner.teamName : null,
            userPrediction: userPrediction?.prediction?.teamName || null,
            userScore: userPrediction?.score || null,
         };
      });

      res.json(matchesWithPredictions);
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
});


// Admin endpoint to add a new match
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
   try {
      const { teamOneName, teamTwoName, matchDate, matchTime, additionalDetails } = req.body;

      let matchDateTime = new Date(matchDate);
      const [hours, minutes] = matchTime.split(":").map(Number);
      matchDateTime.setHours(hours, minutes, 0, 0);

      // Fetch team IDs based on team names
      const teamOne = await Team.findOne({ teamName: teamOneName });
      const teamTwo = await Team.findOne({ teamName: teamTwoName });

      if (!teamOne || !teamTwo) {
         return res.status(404).json({ msg: 'One or both teams not found' });
      }

      // Create and save the match
      const newMatch = new Match({
         teamOne: teamOne._id,
         teamTwo: teamTwo._id,
         matchDate: matchDateTime,
         additionalDetails,
      });

      await newMatch.save();
      res.status(201).json(newMatch);
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
});

// Admin endpoint to declare winner for a match
router.put('/declare', authMiddleware, adminMiddleware, async (req, res) => {
   const { matchId, declaredWinner } = req.body;
   try {
      const match = await Match.findById(matchId);
      if (!match) return res.status(404).json({ msg: 'Match not found' });
      const team = await Team.findOne({ teamName: declaredWinner });
      if (!team) return res.status(404).json({ msg: 'Team not found' });

      if (!(team._id.equals(match.teamOne) || team._id.equals(match.teamTwo))) {
         return res.status(400).json({ msg: 'Team not participating in this match' });
      }

      match.declaredWinner = team._id;
      await match.save();
      res.json({ msg: 'Winner declared successfully', match });
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
});

// Admin ednpoint to delete a match
router.delete('/:matchId', authMiddleware, adminMiddleware, async (req, res) => {
   const { matchId } = req.params;

   try {
      const deletedMatch = await Match.findByIdAndDelete(matchId);

      if (!deletedMatch) return res.status(404).json({ msg: 'Match not found' });

      res.json({ msg: 'Match deleted successfully' });
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
});

module.exports = router;