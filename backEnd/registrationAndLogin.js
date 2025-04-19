const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/safewalk_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Create User Schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contactNo: {
    type: String,
    required: true
  },
  emergencyContact: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create User model
const User = mongoose.model('User', userSchema);

// Register a new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { fullName, age, email, contactNo, emergencyContact, password } = req.body;
    
    // Validate input
    if (!fullName || !age || !email || !contactNo || !emergencyContact || !password) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = new User({
      fullName,
      age,
      email,
      contactNo,
      emergencyContact,
      password: hashedPassword
    });
    
    // Save user to database
    await newUser.save();
    console.log('User registered successfully:', newUser._id);
    
    return res.status(201).json({ 
      success: true, 
      message: 'Registration successful',
      userId: newUser._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'YOUR_SECRET_KEY', // replace with a secure secret key
      { expiresIn: '24h' }
    );
    
    console.log('User logged in successfully:', user._id);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  
  jwt.verify(token, 'YOUR_SECRET_KEY', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Protected route example
router.get('/user-profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;