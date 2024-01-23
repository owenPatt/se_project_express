const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");

// Errors
const { NOT_FOUND } = require("./utils/errors");

// Routes
const clothingItemRoutes = require("./routes/clothingItems");
const userRoutes = require("./routes/users");

// Controllers
const { login, createUser } = require("./controllers/users");

// Middleware
const authMiddleware = require("./middlewares/auth");
const errorHandler = require("./middlewares/error-handler");
const {
  validateUserInfo,
  validateAuthentication,
} = require("./middlewares/validation");

const app = express();
const { PORT = 3001 } = process.env;

// Security
// Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Check Connection
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Middleware
app.use(express.json());

// Login routes
app.post("/signin", validateAuthentication, login);
app.post("/signup", validateUserInfo, createUser);

// Routes
app.use("/items", clothingItemRoutes);
app.use("/users", authMiddleware, userRoutes);

// Unknown route
app.use("/", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Page not found: 404" });
});

// celebrate error handler
app.use(errors());

// Error handler
app.use(errorHandler);

// Start the server on port 3001
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
