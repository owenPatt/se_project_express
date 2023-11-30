// Imports
const ClothingItem = require("../models/clothingItem");
const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

// Controller to get all clothing items
const getClothingItems = async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find();
    return res.json(clothingItems);
  } catch (error) {
    console.error(error);
    return res.status(SERVER_ERROR).send({ message: "Internal server error" });
  }
};

// Controller to create a new clothing item
const createClothingItem = async (req, res) => {
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
    console.error(error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res
        .status(INVALID_DATA)
        .send({ message: "Invalid request was sent to server" });
    }
    return res.status(SERVER_ERROR).send({ message: "Internal server error" });
  }
};

// Controller to delete a clothing item by _id
const deleteClothingItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user;

  try {
    // Find the item to compare the owner and logged in user
    const item = await ClothingItem.findById(itemId).orFail();

    if (item.owner.toString() !== userId) {
      return res.status(FORBIDDEN).send({ message: "Forbidden" });
    }

    const deletedItem = await ClothingItem.findByIdAndDelete(itemId).orFail();
    return res.send(deletedItem);
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

// Liking an item
const likeClothingItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    const updatedClothingItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail();

    return res.send(updatedClothingItem);
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

// Unlike an item
const unlikeClothingItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    const updatedClothingItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail();

    return res.send(updatedClothingItem);
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

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
