const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// controllers/userController.js
const User = require("../models/user");

// Utils
const JWT_SECRET = require("../utils/config");

// Error imports
const BadRequestError = require("../errors/bad-request-error");
const ConflictError = require("../errors/conflict-error");
const NotFoundError = require("../errors/not-found-error");

// Controller to get a user by _id
const getCurrentUser = (req, res, next) => {
  const userId = req.user;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      if (error.name === "ValidationError" || error.name === "CastError") {
        return next(new BadRequestError("Invalid request was sent to server"));
      }
      return next(new Error("Internal server error"));
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user;
  const { name, avatar } = req.body;

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
  User.findOneAndUpdate({ _id: userId }, update, options)
    .then((updatedUser) => {
      res.send({
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        _id: updatedUser._id,
      });
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      } else if (
        error.name === "ValidationError" ||
        error.name === "CastError"
      ) {
        next(new BadRequestError("Invalid request was sent to server"));
      } else {
        next(new Error("Internal server error"));
      }
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        name,
        email,
        password: hashedPassword,
        avatar,
      }),
    )
    .then((newUser) => {
      res.status(201).send({
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        _id: newUser._id,
      });
    })
    .catch((error) => {
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("Invalid request was sent to server"));
      } else if (error.code === 11000) {
        next(new ConflictError("Email already exists"));
      } else {
        next(new Error("Internal server error"));
      }
    });
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
    .catch(() =>
      next(new BadRequestError("Invalid request was sent to server")),
    );
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
