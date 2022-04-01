const { sequelize, Itementry, Ledger } = require("../models");

const itementry_post = async (req, res) => {
  const { brand, quantity, totalprice, itemid, volumeno, pageno, sno } =
    req.body;

  try {
    const result = await sequelize.transaction(async (t) => {
      const itementry = await Itementry.create(
        { brand, quantity, totalprice, itemid },
        { transaction: t }
      ).then(async (insertedentry) => {
        const itementryid = insertedentry.dataValues.id;
        await Ledger.create(
          { volumeno, pageno, sno, itementryid },
          { transaction: t }
        );
      });
    });
    return res.status(200).json({ message: "record inserted sucessfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const itementry_get = async (req, res) => {
  try {
    const itementry = await Itementry.findAll({
      include: { all: true, nested: true },
      attributes: { exclude: ["itemid"] },
    });
    return res.json(itementry);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const itementry_getone = async (req, res) => {
  const id = req.params.id;
  try {
    const itementry = await Itementry.findOne({
      where: { id: id },
      include: { all: true, nested: true },
      attributes: { exclude: ["itemid"] },
    });
    return res.json(itementry);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const itementry_delete = async (req, res) => {
  const id = req.params.id;
  try {
    const itementry = await Itementry.findOne({
      where: { id: id },
    });
    await itementry.destroy();
    return res.json(itementry);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  itementry_post,
  itementry_getone,
  itementry_get,
  itementry_delete,
};
