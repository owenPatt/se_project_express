const jwt = require("jsonwebtoken");

// Error codes
const { UNAUTHORIZED } = require("../utils/errors");

// JWT secret
const JWT_SECRET = require("../utils/config");

const authMiddleware = (req, res, next) => {
  // Get the token from the headers
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Unauthorized" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  req.user = payload;

  next();

  return -1;
};

module.exports = authMiddleware;
