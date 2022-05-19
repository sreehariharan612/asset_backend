const {
  sequelize,
  Itemstatus,
  Ledger,
  Itementry,
  Location,
  Item,
  Staff,
  Category,
  History,
} = require("../models");
const { Op } = require("sequelize");

const history_staff = async (req, res) => {
  const staffid = req.params.id;
  try {
    const itemstatus = await History.findAll({
      order: [["id", "DESC"]],
      where: { paststaffid: staffid },
      include: [
        {
          model: Location,
          attributes: ["name"],
        },
        {
          model: Staff,
          attributes: ["regid","name", "designation"],
        },
        {
          model: Itemstatus,
          attributes: ["itemno","createdAt"],
          include: [
            {
              model: Itementry,
              attributes: ["quantity"],
              include: [
                {
                  model: Ledger,
                  attributes: ["sno", "pageno", "volumeno", "consumetype"],
                },
                {
                  model: Item,
                  attributes: ["name"],
                  include: [{ model: Category, attributes: ["name"] }],
                },
              ],
            },
          ],
        },
      ],
      attributes: {
        exclude: [
          "pastlocationid",
          "itemstatusid",
          "paststaffid",
          "createdAt",
        ],
      },
    });
    return res.json(itemstatus);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const history_item = async (req, res) => {
  // should pass id(autogenerate) of the itemstatus table
  const itemid = req.params.id;
  try {
    const itemstatus = await History.findAll({
      order: [["id", "DESC"]],
      where: { itemstatusid: itemid },
      include: [
        {
          model: Location,
          attributes: ["name"],
        },
        {
          model: Staff,
          attributes: ["regid","name", "designation"],
        },
        {
          model: Itemstatus,
          attributes: ["itemno","createdAt"],
          include: [
            {
              model: Itementry,
              attributes: ["quantity"],
              include: [
                {
                  model: Ledger,
                  attributes: ["sno", "pageno", "volumeno", "consumetype"],
                },
                {
                  model: Item,
                  attributes: ["name"],
                  include: [{ model: Category, attributes: ["name"] }],
                },
              ],
            },
          ],
        },
      ],
      attributes: {
        exclude: [
          "pastlocationid",
          "itemstatusid",
          "paststaffid",
          "createdAt",
        ],
      },
    });
    return res.json(itemstatus);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  history_item,
  history_staff,
};
