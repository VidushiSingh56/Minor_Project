require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
// const sha256 = require('./sha256');
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Helper function to hash a password using SHA-256
// const hashPassword = (username, password) => {
//   const salt = username;  // You can use username or generate a random salt
//   const combined = username + password + salt; // Combine username, password, and salt
//   const hash = sha256(combined);  // Hash the combined string
//   return hash;
// };
const crypto = require('crypto');

const sha256 = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

const hashPassword = (username, password) => {
  const combined = username + password;
  return sha256(combined);
};

// console.log(hashPassword('a2', 'a1')); // Should produce a valid hash.

// Generate JWT Token
const generateToken = (username) => {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
}
// console.log(hashPassword('a1','a1'));

// Signup Route
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const passwordHash = hashPassword(username, password);
  console.log(passwordHash)

  try {
    const newUser = new User({ username, passwordHash });
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Username already exists or invalid data provided." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const passwordHash = hashPassword(username, password);

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.passwordHash !== passwordHash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(username);
    res.json({ message: "Login successful!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }
    req.user = decoded;
    next();
  });
};

// Protected Home Route
app.get("/home", verifyToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!` });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
