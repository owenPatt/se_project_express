// Imports
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");
const NotFoundError = require("../errors/not-found-error");

// Controller to get all clothing items
const getClothingItems = (req, res, next) => {
  ClothingItem.find()
    .then((clothingItems) => res.json(clothingItems))
    .catch(() => {
      next(new Error("Internal Server Error"));
    });
};

// Controller to create a new clothing item
const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const ownerId = req.user._id;

  // Creates a new item and saves it
  const newClothingItem = new ClothingItem({
    name,
    weather,
    imageUrl,
    owner: ownerId,
  });

  newClothingItem
    .save()
    .then((savedItem) => res.status(201).send(savedItem))
    .catch((error) => {
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("Invalid request was sent to server"));
      } else {
        next(new Error("Internal server error"));
      }
    });
};

// Controller to delete a clothing item by _id
const deleteClothingItem = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(id)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Requested resource not found");
      }
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("Forbidden");
      }
      return ClothingItem.findByIdAndDelete(id);
    })
    .then((deletedItem) => res.send(deletedItem))
    .catch((error) => {
      if (
        error.name === "DocumentNotFoundError" ||
        error.name === "NotFoundError"
      ) {
        next(new NotFoundError("Requested resource not found"));
      } else if (
        error.name === "ValidationError" ||
        error.name === "CastError"
      ) {
        next(new BadRequestError("Invalid request was sent to server"));
      } else if (error.name === "ForbiddenError") {
        next(error);
      } else {
        next(new Error("Internal server error"));
      }
    });
};

// Liking an item
const likeClothingItem = (req, res, next) => {
  const { id } = req.params;
  ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((updatedClothingItem) => {
      res.send(updatedClothingItem);
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

// Unlike an item
const unlikeClothingItem = (req, res, next) => {
  const { id } = req.params;
  ClothingItem.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((updatedClothingItem) => {
      res.send(updatedClothingItem);
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

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
