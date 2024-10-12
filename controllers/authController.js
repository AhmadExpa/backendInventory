const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role, user.name, user.email),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT token
const generateToken = (id, role, name, email) => {
  const payload = {
    id: id,
    name: name,
    email: email,
    role: role,
    // You can add more fields as needed
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// verifyToken
exports.getUserDetails = (req, res) => {
  const token = req.body.authorization; // Assuming the token is passed in the Authorization 
  console.log(token);
  if (!token) {
    returnres.status(401).json({ message: "Authentication failed!" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Send back user details from the decoded token
    console.log(decodedToken);
    res.status(200).json({
      id: decodedToken.id,
      name: decodedToken.name,
      role: decodedToken.role,
      email: decodedToken.email,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token!" });
  }
};
