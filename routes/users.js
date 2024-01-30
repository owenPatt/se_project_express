const express = require("express");

const router = express.Router();

// Validation
const { validateUpdatedUser } = require("../middlewares/validation");

// Controllers
const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", validateUpdatedUser, updateUser);

module.exports = router;
