const mongoose = require("mongoose");
const crypto = require("crypto");
const Joi = require("joi");

// SCHEMA FOR USER DATA
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 25,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 25,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randombytes(20).toString("hex");

  this.resetPasswordToken.crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// JOI VALIDATION
const validate = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

// MODEL
const UserModel = mongoose.model("UserModelAssignment", UserSchema);

module.exports = { UserModel, validate };
