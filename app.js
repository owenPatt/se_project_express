const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const clothingItemRoutes = require("./routes/clothingItems");

const app = express();
const { PORT = 3001 } = process.env;

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

app.use((req, res, next) => {
  req.user = {
    _id: "655bde669a43d81430c0719a",
  };
  next();
});

// Routes
app.use("/users", userRoutes);
app.use("/items", clothingItemRoutes);

// Unknown route
app.get("/", (req, res) => {
  res.status(404).send("Page not found: 404");
});

// Start the server on port 3001
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
