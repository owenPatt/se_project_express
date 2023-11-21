// controllers/userController.js
const User = require("../models/user");
const { INVALID_DATA, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// Controller to get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(SERVER_ERROR).send({ message: "Internal server error" });
  }
};

// Controller to get a user by _id
const getUser = async (req, res) => {
  const { userId } = req.params.userId;
  try {
    const user = await User.findById(userId).orFail();
    res.json(user);
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
  return res.send();
};

// Controller to create a new user
const createUser = async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const newUser = new User({
      name,
      avatar,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res
        .status(INVALID_DATA)
        .send({ message: "Invalid request was sent to server" });
    }
    return res.status(SERVER_ERROR).send({ message: "Internal server error" });
  }
  return res.send();
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
