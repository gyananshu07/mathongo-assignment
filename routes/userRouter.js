const express = require("express");
const userRoute = express.Router();

const {
  createUser,
  getUser,
  getUsers,
} = require("../controllers/userController");

// CREATE
userRoute.post("/", createUser);

// GET USER
userRoute.get("/:id", getUser);

// GET ALL USERS
userRoute.get("/", getUsers);

module.exports = userRoute;
