const { sequelize, User } = require("../models");
const bcrypt = require("bcrypt");
const { accessToken, jwtTokens } = require("../utils/helpers.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const firstuser_post = async (req, res) => {
  try {
    const hashpassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashpassword,
      role: "HOD",
    });
    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const user_post = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let generated_password = uuidv4().slice(0, 8);

    const hashpassword = await bcrypt.hash(generated_password, 10);

    // need to be done in transaction between create user and email generation

    const user = await User.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: hashpassword, // password need to be generate randomly and hashed
        role: req.body.role,
      },
      { transaction: t }
    );

    var smtpConfig = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: "sreeharan612@gmail.com", // generated ethereal user
        pass: "6382574527",
      },
    };
    var transporter = nodemailer.createTransport(smtpConfig);
    let mailOptions = {
      from: "sreeharan612@gmail.com", // sender address
      to: req.body.email, // list of receivers
      subject: `Department Of Mathematics - ${req.body.role}`, // Subject line
      html:
        `<h2>Hi ${req.body.name}, </h2> ` +
        `<p><b> You are now assigned as the ${req.body.role} of our department asset management.</b></p>` +
        `<p>The password for your login has been attached here.. </p>` +
        `<p><b> ${generated_password} </b></p>` +
        "<p>Use this password for first time login. After successfull login, kindly change your password.</p>" +
        "<p>Thank you,</p>" + // html tent need to be changed
        "<p><b>Department Of Mathematics</b></p>" +
        "<p>CEG, ANNA UNIVERSITY</p>",
    };
    transporter.sendMail(
      mailOptions,
      (error, info) => {
        if (error) {
          t.rollback();
          return res.status(500).json({ message: "user not created" });
        } else {
          t.commit();
          return res
            .status(200)
            .json({ message: "user created sucessfully and mail is send" });
        }
      },
      {
        transaction: t,
      }
    );
  } catch (err) {
    await t.rollback();
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

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });

    if (user == null) {
      return res.status(500).json({ error: "Email is not exists" });
    } else {
      const t = await sequelize.transaction();
      let generated_password = uuidv4().slice(0, 8);
      const hashpassword = await bcrypt.hash(generated_password, 10);

      await user.update(
        {
          password: hashpassword,
        },
        { transaction: t }
      );

      var smtpConfig = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          user: "sreeharan612@gmail.com", // generated ethereal user
          pass: "6382574527",
        },
      };
      var transporter = nodemailer.createTransport(smtpConfig);
      let mailOptions = {
        from: "sreeharan612@gmail.com", // sender address
        to: req.body.email, // list of receivers
        subject: `Department Of Mathematics - ${user.role}`, // Subject line
        html:
          `<h2>Hi ${user.name}, </h2> ` +
          `<p><b>As per your request new password for login is generated.</b></p>` +
          `<p>The password for your login has been attached here.. </p>` +
          `<p><b> ${generated_password} </b></p>` +
          "<p>Use this password for login. After successfull login, kindly change your password.</p>" +
          "<p>Thank you,</p>" + // html tent need to be changed
          "<p><b>Department Of Mathematics</b></p>" +
          "<p>CEG, ANNA UNIVERSITY</p>",
      };
      transporter.sendMail(
        mailOptions,
        (error, info) => {
          if (error) {
            t.rollback();
            return res.status(500).json({ message: "mail is not sent" });
          } else {
            t.commit();
            return res.status(200).json({ message: "forgot mail is sent" });
          }
        },
        {
          transaction: t,
        }
      );
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const user_update = async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  try {
    const user = await User.findOne({
      where: { id: id },
    });

    await user.update({
      name,
      email,
    });
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

const changepassword = async (req, res) => {
  const id = req.params.id;
  const { email, oldpassword, newpassword } = req.body;

  try {
    const user = await User.findOne({
      where: { id: id },
    });
    const validPassword = await bcrypt.compare(oldpassword, user.password);
    if (!validPassword) {
      return res
        .status(500)
        .json({ error: "Pls enter old password correctly" });
    } else {
      const hashpassword = await bcrypt.hash(newpassword, 10);
      await user.update(
        {
          password: hashpassword,
        },
        { transaction: t }
      );

      var smtpConfig = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          user: "sreeharan612@gmail.com", // generated ethereal user
          pass: "6382574527",
        },
      };
      var transporter = nodemailer.createTransport(smtpConfig);
      let mailOptions = {
        from: "sreeharan612@gmail.com", // sender address
        to: email, // list of receivers
        subject: `Department Of Mathematics - ${user.role}`, // Subject line
        html:
          `<h2>Hi ${user.name}, </h2> ` +
          `<p><b>As per your request, your password has been changed successfully for your login.</b></p>` +
          `<p>your new password for login is ${newpassword}</p>` +
          "<p>Thank you,</p>" + // html tent need to be changed
          "<p><b>Department Of Mathematics</b></p>" +
          "<p>CEG, ANNA UNIVERSITY</p>",
      };
      transporter.sendMail(
        mailOptions,
        (error, info) => {
          if (error) {
            t.rollback();
            return res.status(500).json({ message: "Password not changed" });
          } else {
            t.commit();
            return res
              .status(200)
              .json({ message: "Password changed successfully" });
          }
        },
        {
          transaction: t,
        }
      );
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  user_post,
  user_get,
  user_update,
  user_delete,
  login_post,
  user_getaccesstoken,
  firstuser_post,
  forgotpassword,
  changepassword,
};
