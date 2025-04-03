require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 5000;

// Middleware for JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB using the URL from the .env file
mongoose
    .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define User Schema & Model
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Helper function to hash a password using SHA-256
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// -------------------------
// HTML Routes
// -------------------------

// Redirect root to login page
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Render Login Page
app.get('/login', (req, res) => {
    const error = req.query.error ? `<p style="color:red;">${req.query.error}</p>` : '';
    res.send(`
    <h1>Login</h1>
    ${error}
    <form method="POST" action="/login">
      <div>
        <label>Username:</label>
        <input name="username" placeholder="Enter username" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" placeholder="Enter password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p>Don't have an account? <a href="/signup">Signup here</a></p>
  `);
});

// Render Signup Page
app.get('/signup', (req, res) => {
    const error = req.query.error ? `<p style="color:red;">${req.query.error}</p>` : '';
    res.send(`
    <h1>Signup</h1>
    ${error}
    <form method="POST" action="/signup">
      <div>
        <label>Username:</label>
        <input name="username" placeholder="Choose username" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" placeholder="Choose password" required />
      </div>
      <button type="submit">Signup</button>
    </form>
    <p>Already have an account? <a href="/login">Login here</a></p>
  `);
});

// Render Home Page (welcome page)
app.get('/home', (req, res) => {
    const message = req.query.message || 'Welcome to the App!';
    res.send(`
    <h1>Home</h1>
    <p>${message}</p>
    <p><a href="/logout">Logout</a></p>
  `);
});

// Logout route (for now, simply redirects to login)
app.get('/logout', (req, res) => {
    res.redirect('/login');
});

// -------------------------
// API Routes (for form submission)
// -------------------------

// Signup Route
app.post('/signup', async (req, res) => {
    console.log("Signup attempt:", req.body.username);
    const { username, password } = req.body;

    // Hash the password
    const passwordHash = hashPassword(password);

    try {
        const newUser = new User({ username, passwordHash });
        await newUser.save();
        console.log("User created successfully:", username);
        // Redirect to home page after successful signup
        res.redirect('/home?message=User created successfully!');
    } catch (err) {
        console.error("Signup error:", err);
        res.redirect('/signup?error=Username already exists or invalid data provided.');
    }
});

// Login Route
app.post('/login', async (req, res) => {
    console.log("Login attempt:", req.body.username);
    const { username, password } = req.body;
    const passwordHash = hashPassword(password);
    console.log("Computed password hash:", passwordHash);

    try {
        const user = await User.findOne({ username });
        console.log("User found:", user);
        if (user && user.passwordHash === passwordHash) {
            console.log("Login successful for:", username);
            res.redirect('/home?message=Login successful!');
        } else {
            console.log("Invalid credentials for:", username);
            res.redirect('/login?error=Invalid credentials');
        }
    } catch (err) {
        console.error("Login error:", err);
        res.redirect('/login?error=Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
