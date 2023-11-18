// routes/clothingItemRoutes.js
const express = require("express");
const clothingItemController = require("../controllers/clothingItems");

const router = express.Router();

router.get("/items", clothingItemController.getClothingItems);
router.post("/items", clothingItemController.createClothingItem);
router.delete("/items/:itemId", clothingItemController.deleteClothingItem);

// Middleware to handle non-existent resource
router.use((req, res, next) => {
  // If the response status is 404 (Not Found), send a custom error message
  if (res.statusCode === 404) {
    return res.status(404).json({ message: "Requested resource not found" });
  }

  // For other status codes, proceed to the next middleware or route
  next();
});

module.exports = router;
