// controllers/clothingItemController.js
const ClothingItem = require("../models/clothingItem");

// Controller to get all clothing items
const getClothingItems = async (req, res) => {
  try {
    // Fetch all clothing items from the database
    const clothingItems = await ClothingItem.find();
    res.json(clothingItems);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Controller to create a new clothing item
const createClothingItem = async (req, res) => {
  // Extracting data from the request body
  const { name, weather, imageUrl, ownerId } = req.body;

  try {
    // Create a new ClothingItem instance
    const newClothingItem = new ClothingItem({
      name,
      weather,
      imageUrl,
      owner: ownerId,
    });

    // Save the new clothing item to the database
    await newClothingItem.save();

    // Respond with the created clothing item
    res.status(201).json(newClothingItem);
  } catch (error) {
    // Handle errors and respond with a 500 status code
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Controller to delete a clothing item by _id
const deleteClothingItem = async (req, res) => {
  // Extracting the item ID from the request parameters
  const itemId = req.params.itemId;

  try {
    // Find and delete the clothing item by _id
    const deletedItem = await ClothingItem.findByIdAndDelete(itemId);

    // If the item doesn't exist, respond with a 404 status code
    if (!deletedItem) {
      return res.status(404).send("Clothing item not found");
    }

    // Respond with the deleted clothing item
    res.json(deletedItem);
  } catch (error) {
    // Handle errors and respond with a 500 status code
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
};
