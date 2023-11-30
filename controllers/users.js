const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// controllers/userController.js
const User = require("../models/user");

// Utils
const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
} = require("../utils/errors");
const JWT_SECRET = require("../utils/config");

// Controller to get a user by _id
const getCurrentUser = async (req, res) => {
  const userId = req.user;
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

const updateUser = async (req, res) => {
  const userId = req.user;
  const { name, avatar, email, password } = req.body;
  try {
    // Create update object
    const update = {};

    // Options
    const options = {
      runValidators: true,
      new: true,
    };

    // Update the user properties
    if (name) {
      update.name = name;
    }
    if (avatar) {
      update.avatar = avatar;
    }
    if (email) {
      update.email = email;
    }

    // Hash the new password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      update.password = hashedPassword;
    }

    // Save the updated user
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      update,
      options,
    );

    return res.send({
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      _id: updatedUser._id,
    });
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
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }
    return res.status(SERVER_ERROR).send({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((error) => {
      res.status(INVALID_DATA).send({ message: error.message });
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
