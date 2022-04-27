const { sequelize, User } = require("../models");
const bcrypt = require("bcrypt");
const { accessToken, jwtTokens } = require("../utils/helpers.js");
const jwt = require("jsonwebtoken");

const user_post = async (req, res) => {
  try {
    const hashpassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hashpassword,
      role: req.body.role,
    });
    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const login_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });

    if (user == null) {
      return res.status(500).json({ error: "Email is incorrect" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(500).json({ error: "Incorrect password" });
    }
    let tokens = jwtTokens(user.dataValues);
    return res.json(tokens);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const user_get = async (req, res) => {
  try {
    const user = await User.findAll();
    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const user_getaccesstoken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      return res.status(500).json({ error: "Null token" });
    }
    jwt.verify(token, "hwhjdfvwgewvejw7w75b348r4h3iu4f", (error, user) => {
      if (error) return res.status(403).json({ error: error.message });
      res.json(accessToken(user));
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const user_delete = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({
      where: { id: id },
    });
    await user.destroy();
    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// const user_update = async (req, res) => {
//   const id = req.params.id;
//   const { name ,  } = req.body;
//   try {
//     const user = await User.findOne({
//       where: { id: id },
//     });
//     user.name = name;
//     await user.save();
//     return res.json(user);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// };

module.exports = {
  user_post,
  //   user_update,
  user_get,
  user_delete,
  login_post,
  user_getaccesstoken,
};
