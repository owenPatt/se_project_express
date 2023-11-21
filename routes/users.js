const express = require("express");
const { getUsers, getUser, createUser } = require("../controllers/users");
const { INVALID_DATA, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const router = express.Router();

router.get("/:userId", getUser);
router.get("/", getUsers);
router.post("/", createUser);

// Middleware to handle error messages being sent
router.use((req, res, next) => {
  console.log("here2");
  console.log(res.statusCode);
  if (res.statusCode === INVALID_DATA) {
    res.json({ message: "Invalid request was sent to server" });
  } else if (res.statusCode === NOT_FOUND) {
    res.json({ message: "Requested resource not found" });
  } else if (res.statusCode === SERVER_ERROR) {
    res.json({ message: "Internal server error" });
  }
  res.send();
});

module.exports = router;
