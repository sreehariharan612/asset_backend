const { sequelize, Category } = require("../models");

const category_post = async (req, res) => {
  const { name } = req.body;

  try {
    const category = await Category.create({ name });
    return res.json(category);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const category_get = async (req, res) => {
  try {
    const category = await Category.findAll({
      order: [['id', 'DESC']],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    return res.json(category);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const category_delete = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await Category.findOne({
      where: { id: id },
    });
    await category.destroy();
    return res.json(category);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const category_update = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  try {
    const category = await Category.findOne({
      where: { id: id },
    });
    category.name = name;
    await category.save();
    return res.json(category);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  category_post,
  category_update,
  category_get,
  category_delete,
};
