// Imports
const ClothingItem = require("../models/clothingItem");
const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

// Controller to get all clothing items
const getClothingItems = async (req, res, next) => {
  try {
    const clothingItems = await ClothingItem.find();
    return res.json(clothingItems);
  } catch (error) {
    error.errorCode(SERVER_ERROR);
    error.message = "Internal server error";
    return next(new Error(error));
  }
};

// Controller to create a new clothing item
const createClothingItem = async (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const ownerId = req.user._id;

  try {
    // Creates a new item and saves it
    const newClothingItem = new ClothingItem({
      name,
      weather,
      imageUrl,
      owner: ownerId,
    });
    await newClothingItem.save();

    return res.status(201).send(newClothingItem);
  } catch (error) {
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

// Controller to delete a clothing item by _id
const deleteClothingItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  try {
    // Find the item to compare the owner and logged in user
    const item = await ClothingItem.findById(itemId).orFail();
    if (item.owner.toString() !== userId) {
      return res.status(FORBIDDEN).send({ message: "Forbidden" });
    }

    const deletedItem = await ClothingItem.findByIdAndDelete(itemId).orFail();
    return res.send(deletedItem);
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

// Liking an item
const likeClothingItem = async (req, res, next) => {
  const { itemId } = req.params;
  try {
    const updatedClothingItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail();

    return res.send(updatedClothingItem);
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

// Unlike an item
const unlikeClothingItem = async (req, res, next) => {
  const { itemId } = req.params;
  try {
    const updatedClothingItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail();

    return res.send(updatedClothingItem);
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

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
