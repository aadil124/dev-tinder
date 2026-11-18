const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Admin authentication
const adminAuth = (req, res, next) => {
  const token = "xyz1"; // Temporary token for learning

  const authenticated = token === "xyz";

  if (!authenticated) {
    return res.status(401).json({
      message: "Unauthorized: Admin access denied",
    });
  }

  next();
};

// User authentication
const userAuth = async (req, res, next) => {
  try {
    // Check token cookie
    const { token } = req.cookies || {};

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from MongoDB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
      });
    }

    // Attach Mongoose document to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        message: "Unauthorized: Invalid or expired token",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
