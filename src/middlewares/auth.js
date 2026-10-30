const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = "xyz1"; // Temporary token for learning
  const authenticated = token === "xyz";

  if (!authenticated) {
    return res.status(401).send("Unauthorized");
  }

  next();
};

const userAuth = (req, res, next) => {
  try {
    // Get token from cookies
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user information to request
    req.user = decoded;

    // Allow request to continue
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Unauthorized: Token expired");
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Unauthorized: Invalid token");
    }

    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
