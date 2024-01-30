const jwt = require("jsonwebtoken");

// Error codes
const UnauthorizedError = require("../errors/unauthorized-error");

// JWT secret
const JWT_SECRET =
  process.env.MODE_ENV === "production"
    ? process.env.JWT_SECRET
    : require("../utils/config");

const authMiddleware = (req, res, next) => {
  // Get the token from the headers
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("incorrect email or password"));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("incorrect email or password"));
  }

  req.user = payload;

  return next();
};

module.exports = authMiddleware;
