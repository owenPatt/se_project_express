const jwt = require("jsonwebtoken");

// Error codes
const { UNAUTHORIZED } = require("../utils/errors");

// JWT secret
const { JWT_SECRET } = require("../utils/config");

const authMiddleware = (req, res, next) => {
  // Get the token from the headers
  const token = req.headers.authorization;

  // Check if token exists
  if (!token) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded token to the request object
    req.user = decoded;

    // Call the next middleware
    next();

    return req;
  } catch (error) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
