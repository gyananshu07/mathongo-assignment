const { UserModel, validate } = require("../models/userModel.js");

// CREATE USER
module.exports.createUser = async (req, res) => {
  let { value: data, error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = new UserModel(data);

  try {
    const newUser = await user.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET USER
module.exports.getUser = async (req, res) => {
  try {
    let uid = req.params.id;
    const user = await UserModel.findById(uid);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET USERS
module.exports.getUsers = async (req, res, next) => {
  try {
    const Users = await UserModel.find();
    res.status(200).json(Users);
  } catch (error) {
    res.status(500).json(error);
  }
};
