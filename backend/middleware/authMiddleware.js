const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get token from request header
    // Get Authorization header
const authHeader = req.header("Authorization");

if (!authHeader) {
  return res.status(401).json({
    message: "Access Denied. No Token Provided."
  });
}

// Remove "Bearer " from the token
const token = authHeader.replace("Bearer ", "");

// Verify JWT token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Save user details in request
    req.user = decoded;

    // Continue to next API
    next();

  } catch (error) {
    res.status(401).json({
      message: "Invalid Token"
    });
  }
};

module.exports = authMiddleware;