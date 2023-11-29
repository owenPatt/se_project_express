const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// controllers/userController.js
const User = require("../models/user");

// Utils
const { INVALID_DATA, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");
const JWT_SECRET = require("../utils/config");

// Controller to get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (error) {
    console.error(error);
    return res.status(SERVER_ERROR).send({ message: "Internal server error" });
  }
};

// Controller to get a user by _id
const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).orFail();
    return res.send(user);
  } catch (error) {
    console.error(error);
    if (error.name === "DocumentNotFoundError") {
      return res
        .status(NOT_FOUND)
        .send({ message: "Requested resource not found" });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res
        .status(INVALID_DATA)
        .send({ message: "Invalid request was sent to server" });
    }
    return res.status(SERVER_ERROR).send({ message: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });
    return res.status(201).send({
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      _id: newUser._id,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res
        .status(INVALID_DATA)
        .send({ message: "Invalid request was sent to server" });
    }
    if (error.code === 11000) {
      return res.status(INVALID_DATA).send({ message: "Email already exists" });
    }
    return res.status(SERVER_ERROR).send({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(INVALID_DATA).send({ message: "Invalid login" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(INVALID_DATA).send({ message: "Invalid login" });
    }

    // Generate a JWT token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.send({ token });
  } catch (error) {
    console.error(error);
    return res.status(SERVER_ERROR).send({ message: "Internal server error" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
};
