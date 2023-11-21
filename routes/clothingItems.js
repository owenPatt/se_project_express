// routes/clothingItemRoutes.js
const express = require("express");
const {
  likeClothingItem,
  unlikeClothingItem,
  deleteClothingItem,
  getClothingItems,
  createClothingItem,
} = require("../controllers/clothingItems");

const router = express.Router();

router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", unlikeClothingItem);
router.delete("/:itemId", deleteClothingItem);
router.get("/", getClothingItems);
router.post("/", createClothingItem);

module.exports = router;
