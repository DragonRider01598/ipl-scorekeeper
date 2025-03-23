const mongoose = require("mongoose");
const Score = require("./Score");

const MatchSchema = new mongoose.Schema(
  {
    teamOne: { type: String, required: true },
    teamTwo: { type: String, required: true },
    matchDate: { type: Date, required: true },
    teamOneImage: { type: String }, // URL for team image
    teamTwoImage: { type: String }, // URL for team image
    additionalDetails: { type: String },
    declaredWinner: { type: String }, // Admin sets the winning team
  },
  { timestamps: true }
);

// Hook to recalculate user scores when declaredWinner changes
MatchSchema.pre("save", async function (next) {
  if (this.isModified("declaredWinner")) {
    try {
      const matchId = this._id;
      const declaredWinner = this.declaredWinner;

      // Fetch all predictions for this match
      const predictions = await Score.find({ match: matchId });

      for (let prediction of predictions) {
        if (prediction.prediction === declaredWinner) {
          prediction.score = 2;
        } else {
          prediction.score = -1;
        }
        await prediction.save();
      }
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  }
  next();
});

module.exports = mongoose.model("Match", MatchSchema);