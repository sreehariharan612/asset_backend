const { sequelize, Location } = require("../models");

const location_post = async (req, res) => {
  const { name } = req.body;

  try {
    const location = await Location.create({ name });
    return res.json(location);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const location_get = async (req, res) => {
  try {
    const location = await Location.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    return res.json(location);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const location_delete = async (req, res) => {
  const id = req.params.id;
  try {
    const location = await Location.findOne({
      where: { id: id },
    });
    await location.destroy();
    return res.json(location);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const location_update = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  try {
    const location = await Location.findOne({
      where: { id: id },
    });
    location.name = name;
    await location.save();
    return res.json(location);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  location_post,
  location_update,
  location_get,
  location_delete,
};
