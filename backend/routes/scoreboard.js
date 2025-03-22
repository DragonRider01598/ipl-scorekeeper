const express = require('express');
const Score = require('../models/Score');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Aggregate scores for each user, summing up the "score" field.
    const scoreboard = await Score.aggregate([
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" }
        }
      },
      // Lookup user details from the users collection.
      {
        $lookup: {
          from: "users", // collection name (MongoDB auto-lowercases model name)
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          username: "$user.username",
          totalScore: 1
        }
      },
      { $sort: { totalScore: -1 } }
    ]);
    res.json(scoreboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;