const { sequelize, Staff } = require("../models");

const staff_post = async (req, res) => {
  const { regid, name, designation } = req.body;

  try {
    const staff = await Staff.create({ regid, name, designation });
    return res.json(staff);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const staff_get = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      order: [["id", "DESC"]],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    return res.json(staff);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const staff_delete = async (req, res) => {
  const id = req.params.id;
  try {
    const staff = await Staff.findOne({
      where: { id: id },
    });
    await staff.destroy();
    return res.json(staff);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const staff_update = async (req, res) => {
  const id = req.params.id;
  const { regid, name, designation } = req.body;
  try {
    const staff = await Staff.findOne({
      where: { id: id },
    });
    staff.regid = regid;
    staff.name = name;
    staff.designation = designation;
    await staff.save();
    return res.json(staff);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  staff_post,
  staff_update,
  staff_get,
  staff_delete,
};
