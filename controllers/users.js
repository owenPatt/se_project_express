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
const getCurrentUser = async (req, res, next) => {
  const userId = req.user;
  try {
    const user = await User.findById(userId).orFail();
    return res.send(user);
  } catch (error) {
    if (error.name === "DocumentNotFoundError") {
      error.errorCode(NOT_FOUND);
      error.message = "Requested resource not found";
      next(new Error(error));
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      error.errorCode(INVALID_DATA);
      error.message = "Invalid request was sent to server";
      next(new Error(error));
    }
    error.errorCode(SERVER_ERROR);
    error.message = "Internal server error";
    return next(new Error(error));
  }
};

const updateUser = async (req, res, next) => {
  const userId = req.user;
  const { name, avatar } = req.body;
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
    if (error.name === "DocumentNotFoundError") {
      error.errorCode(NOT_FOUND);
      error.message = "Requested resource not found";
      next(new Error(error));
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      error.errorCode(INVALID_DATA);
      error.message = "Invalid request was sent to server";
      next(new Error(error));
    }
    error.errorCode(SERVER_ERROR);
    error.message = "Internal server error";
    return next(new Error(error));
  }
};

const createUser = async (req, res, next) => {
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
    if (error.name === "ValidationError" || error.name === "CastError") {
      error.errorCode(INVALID_DATA);
      error.message = "Invalid request was sent to server";
      next(new Error(error));
    }
    if (error.code === 11000) {
      error.errorCode(CONFLICT);
      error.message = "Email already exists";
      next(new Error(error));
    }
    error.errorCode(SERVER_ERROR);
    error.message = "Internal server error";
    return next(new Error(error));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((error) => {
      error.errorCode(INVALID_DATA);
      next(new Error(error));
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
