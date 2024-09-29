const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://mongo:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to MongoDB");
});

// Route for homepage
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Homepage</h1>
    <p><a href="/login">Login</a></p>
    <p><a href="/register">Register</a></p>
  `);
});

// Route for login page
app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="post">
      <label>Username:</label>
      <input type="text" name="username" required/><br/>
      <label>Password:</label>
      <input type="password" name="password" required/><br/>
      <button type="submit">Login</button>
    </form>
    <p>Don't have an account? <a href="/register">Register here</a></p>
  `);
});

// Route for register page
app.get('/register', (req, res) => {
  res.send(`
    <h1>Register</h1>
    <form action="/register" method="post">
      <label>Username:</label>
      <input type="text" name="username" required/><br/>
      <label>Password:</label>
      <input type="password" name="password" required/><br/>
      <button type="submit">Register</button>
    </form>
    <p>Already have an account? <a href="/login">Login here</a></p>
  `);
});

// Handle user registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.send('User registered successfully!');
  } catch (err) {
    res.send('Error registering user.');
  }
});

// Handle user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.send('Invalid username or password');
    }
    res.send('Login successful!');
  } catch (err) {
    res.send('Error during login.');
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
