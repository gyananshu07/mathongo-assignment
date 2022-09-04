// REQUIRED IMPORTS
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
var cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();

// CONNECTION TO MongoDB
const port = process.env.PORT || 8080;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

// IMPORT ROUTE
const authRoute = require("./routes/authRouter");
const userRoute = require("./routes/userRouter");

// MIDDLEWARE
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// ROUTER
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

// PORT
connect();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
