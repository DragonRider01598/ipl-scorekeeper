const express = require('express');
const connectDB = require('./config/db');
const path = require("path");
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/scoreboard', require('./routes/scoreboard'));
app.use('/api/predictions', require('./routes/matchPredictions'));

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) return; // Prevents API routes from being overridden
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});