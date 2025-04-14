const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
   try {
      const teams = await Team.find({}, 'teamName imageUrl additionalDetails');
      res.json(teams);
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
   try {
      const { teamName, imageUrl, additionalDetails } = req.body;

      if (!teamName || !imageUrl) {
         return res.status(400).json({ msg: 'teamName and imageUrl are required' });
      }

      const newTeam = new Team({ teamName, imageUrl, additionalDetails });
      await newTeam.save();

      res.status(201).json(newTeam);
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
   try {
      const { teamName, imageUrl, additionalDetails } = req.body;

      const updatedTeam = await Team.findByIdAndUpdate(
         req.params.id,
         { teamName, imageUrl, additionalDetails },
         { new: true, runValidators: true }
      );

      if (!updatedTeam) {
         return res.status(404).json({ msg: 'Team not found' });
      }

      res.json(updatedTeam);
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
   try {
      const deletedTeam = await Team.findByIdAndDelete(req.params.id);

      if (!deletedTeam) {
         return res.status(404).json({ msg: 'Team not found' });
      }

      res.json({ msg: 'Team deleted successfully' });
   } catch (error) {
      res.status(500).json({ msg: error.message });
   }
});

module.exports = router;