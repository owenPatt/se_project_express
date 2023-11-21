const express = require("express");
const { getUsers, getUser, createUser } = require("../controllers/users");

const router = express.Router();

router.get("/:userId", getUser);
router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;
