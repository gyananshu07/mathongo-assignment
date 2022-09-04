const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel, validate } = require("../models/userModel");
const { generateOTP } = require("../services/otp");
const { sendMailTo, sendResetMail } = require("../services/mail");
const Joi = require("joi");
const crypto = require("crypto");
const TokenModel = require("../models/token");

// SIGNUP
module.exports.signup = async (req, res) => {
  try {
    let { value: data, error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (data) {
      const otpGenerated = generateOTP();

      //HASHING PASSWORD
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(data.password, salt);

      data.password = hashedPassword;
      data.otp = otpGenerated;

      // ADDING DATA WITH HASHED PASSWORD & OTP
      const newUser = new UserModel(data);

      try {
        await sendMailTo({
          to: data.email,
          OTP: otpGenerated,
        });

        const savedUser = await newUser.save();

        res
          .status(200)
          .json({ message: "User SuccessFully Registered", data: savedUser });
      } catch (error) {
        res.status(500).json("User Exists!");
      }
    } else {
      res.status(500).json("Error Occurred due to missing data!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// VERIFY OTP
module.exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  const user = await UserModel.findOne({
    email,
  });
  if (!user) {
    res.send({
      message: "NOT VERIFIED",
    });
  }
  if (user && user.otp !== otp) {
    res.send({
      message: "NOT VERIFIED! INCORRECT OTP!",
    });
  } else {
    await UserModel.updateOne({ email: email }, { verified: true }).then(
      res.send({
        message: "SUCCESSFULLY VERIFIED",
        data: user,
      })
    );
  }
};

// LOGIN
module.exports.login = async (req, res, next) => {
  try {
    let { email, password: userPassword } = req.body;
    const currentUser = await UserModel.findOne({ email });

    // CHECK FOR USER
    if (!currentUser) return res.status(404).json("User Not Found!");

    // COMPARE PASSWORD TO LOGIN
    const comparedPassword = await bcrypt.compare(
      userPassword,
      currentUser.password
    );

    // IF NOT VERIFIED
    if (!comparedPassword)
      return res.status(400).json("Wrong Credentials! Please re-try!");

    // IF VERIFIED
    const token = jwt.sign({ id: currentUser._id }, process.env.JWT_SECRET);

    const { password, ...otherDetails } = currentUser._doc;

    // JWT AS TOKEN
    res
      .cookie("access_token", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails } });
  } catch (error) {
    res.status(500).json(error);
  }
};

// LOGOUT
module.exports.logout = async (req, res) => {
  res.clearCookie("access_token");
  return res.status(200).redirect("/");
};

// RESET PASSWORD LINK GENERATE
module.exports.resetPassword = async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { value: data, error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await UserModel.findOne({ email: data.email });
    if (!user)
      return res.status(400).send("User with given email doesn't exist");

    let token = await TokenModel.findOne({ userId: user._id });
    if (!token) {
      token = await new TokenModel({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.BASE_URL}/auth/reset/${user._id}/${token.token}`;
    await sendResetMail({ to: user.email, link });

    res.send("Password reset link sent to your email account!");
  } catch (error) {
    res.send("An error occurred!");
    console.log(error);
  }
};

// PASSWORD RESET
module.exports.newResetPasswordToken = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await UserModel.findById(req.params.userId);

    if (!user) return res.status(400).send("Invalid link or expired");

    const token = await TokenModel.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send("Invalid link or expired");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;

    await user.save();
    await token.delete();

    res.send("Password reset successfully!");
  } catch (error) {
    res.send("An error occurred!");
    console.log(error);
  }
};
