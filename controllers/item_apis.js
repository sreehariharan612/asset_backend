const { sequelize, Item, Category } = require("../models");

const item_post = async (req, res) => {
  const { name, categoryid } = req.body;

  try {
    const item = await Item.create({ name, categoryid });
    return res.json(item);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const item_get = async (req, res) => {
  try {
    const item = await Item.findAll({
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
      ],
      attributes: { exclude: ["categoryid", "createdAt", "updatedAt"] },
    });
    return res.json(item);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const item_delete = async (req, res) => {
  const id = req.params.id;
  try {
    const item = await Item.findOne({
      where: { id: id },
    });
    await item.destroy();
    return res.json(item);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const item_update = async (req, res) => {
  const id = req.params.id;
  const { name, categoryid } = req.body;
  try {
    const item = await Item.findOne({
      where: { id: id },
    });
    item.name = name;
    item.categoryid = categoryid;
    await item.save();
    return res.json(item);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { item_post, item_update, item_get, item_delete };
