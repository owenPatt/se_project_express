// routes/clothingItemRoutes.js
const express = require("express");
const {
  likeClothingItem,
  unlikeClothingItem,
  deleteClothingItem,
  getClothingItems,
  createClothingItem,
} = require("../controllers/clothingItems");

const {
  validateClothingItem,
  validateIDs,
} = require("../middlewares/validation");
// Middleware
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.put("/:id/likes", validateIDs, authMiddleware, likeClothingItem);
router.delete("/:id/likes", validateIDs, authMiddleware, unlikeClothingItem);
router.delete("/:id", validateIDs, authMiddleware, deleteClothingItem);
router.get("/", getClothingItems);
router.post("/", validateClothingItem, authMiddleware, createClothingItem);

module.exports = router;
