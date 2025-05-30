const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const sendPasswordResetEmail = require("../utils/sendPasswordResetEmail.js");

const router = express.Router();

// Register Route
router.post('/register',
   [
      body('username').notEmpty().withMessage('Username is required'),
      body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;
      try {
         let user = await User.findOne({ email: email.toLowerCase() });
         if (user) return res.status(400).json({ msg: 'User already exists' });

         // Create new user
         user = new User({ username, email: email.toLowerCase(), password });

         // Hash password
         const salt = await bcrypt.genSalt(12);
         user.password = await bcrypt.hash(password, salt);
         await user.save();

         res.status(201).json({ msg: 'User registered successfully' });
      } catch (error) {
         res.status(500).json({ msg: error.message });
      }
   }
);

// Login Route
router.post('/login',
   [
      body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
      body('password').notEmpty().withMessage('Password is required'),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      try {
         const user = await User.findOne({ email: email.toLowerCase() });
         if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

         // Generate JWT Token
         const payload = { id: user._id, username: user.username, role: user.role, tokenVersion: user.tokenVersion };

         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '90d' });

         res.json({ token });
      } catch (error) {
         res.status(500).json({ msg: error.message });
      }
   }
);

// Authorization
router.get('/verify', async (req, res) => {
   const token = req.headers.authorization?.split(" ")[1];
   if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) return res.status(404).json({ msg: "User not found" });

      if (decoded.tokenVersion !== user.tokenVersion) {
         return res.status(401).json({ msg: "Session expired. Please log in again." });
      }

      res.status(200).json({ valid: true, user: decoded });
   } catch (error) {
      res.status(401).json({ valid: false, msg: "Token is not valid" });
   }
});

// Forgot Password (send link)
router.post('/forgot-password', async (req, res) => {
   const { email } = req.body;
   const user = await User.findOne({ email });

   if (!user) {
      return res.status(200).json({ msg: "Reset link sent if email exists" });
   }

   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
   const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

   user.resetToken = token;
   user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
   await user.save();

   await sendPasswordResetEmail({
      to: user.email,
      userName: user.username || "User",
      resetLink,
   });

   res.status(200).json({ msg: "Reset link sent if email exists" });
});

// Reset Password (handle submission)
router.post('/reset-password',
   [
      body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ msg: errors.array()[0].msg });
      }

      const { token, newPassword } = req.body;

      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         const user = await User.findById(decoded.userId);

         if (
            !user || !user.resetToken || !user.resetTokenExpiry ||
            user.resetToken !== token ||
            user.resetTokenExpiry < Date.now()
         ) {
            return res.status(400).json({ msg: "Invalid or expired token" });
         }

         const hashed = await bcrypt.hash(newPassword, 12);
         user.password = hashed;
         user.resetToken = undefined;
         user.resetTokenExpiry = undefined;
         user.tokenVersion += 1;
         await user.save();

         res.status(200).json({ msg: "Password has been reset successfully" });
      } catch (err) {
         return res.status(400).json({ msg: "Token is invalid or expired"});
      }
   });

module.exports = router;