const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");

// ============ SIGNUP CONTROLLER ============
const signupUser = async (req, res) => {
  // Step 1: Extract email and password from request body
  const { email, password } = req.body;

  try {
    // ===== VALIDATION =====
    
    // Check if fields are empty
    if (!email || !password) {
      throw Error("All fields must be filled");
    }

    // Validate email format using validator library
    if (!validator.isEmail(email)) {
      throw Error("Email not valid");
    }

    // Validate password strength
    // Must have: 8+ chars, uppercase, lowercase, number, symbol
    if (!validator.isStrongPassword(password)) {
      throw Error("Password not strong enough");
    }

    // Check if email already exists in database
    const exists = await User.findOne({ email });
    if (exists) {
      throw Error("Email already in use");
    }

    // ===== HASH PASSWORD =====
    
    // Generate salt (cost factor = 10)
    const salt = await bcrypt.genSalt(10);
    
    // Hash password with salt
    const hash = await bcrypt.hash(password, salt);

    // ===== CREATE USER =====
    
    // Store user with hashed password (NOT plain password!)
    const user = await User.create({ 
      email, 
      password: hash  // ← Hashed password!
    });

    // Send success response
    res.status(200).json({ user });

  } catch (error) {
    // Send error response
    res.status(400).json({ error: error.message });
  }
};

// ============ LOGIN CONTROLLER ============
const loginUser = async (req, res) => {
  // Step 1: Extract email and password from request body
  const { email, password } = req.body;

  try {
    // ===== VALIDATION =====
    
    // Check if fields are empty
    if (!email || !password) {
      throw Error("All fields must be filled");
    }

    // Find user by email in database
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("Incorrect email");
    }

    // ===== COMPARE PASSWORD =====
    
    // Compare plain password with hashed password
    // bcrypt.compare() returns true/false
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      throw Error("Incorrect password");
    }

    // ===== SUCCESS =====
    
    // Send success response with user data
    res.status(200).json({ user });

  } catch (error) {
    // Send error response
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };