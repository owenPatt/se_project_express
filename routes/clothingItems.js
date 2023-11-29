// routes/clothingItemRoutes.js
const express = require("express");
const {
  likeClothingItem,
  unlikeClothingItem,
  deleteClothingItem,
  getClothingItems,
  createClothingItem,
} = require("../controllers/clothingItems");

// Middleware
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.put("/:itemId/likes", authMiddleware, likeClothingItem);
router.delete("/:itemId/likes", authMiddleware, unlikeClothingItem);
router.delete("/:itemId", authMiddleware, deleteClothingItem);
router.get("/", getClothingItems);
router.post("/", authMiddleware, createClothingItem);

module.exports = router;
