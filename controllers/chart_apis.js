const {
  sequelize,
  Itemstatus,
  Ledger,
  Itementry,
  Location,
  Item,
  Category,
} = require("../models");
const { Op } = require("sequelize");

const card_api = async (req, res) => {
  try {
    const expenses = await Itementry.findAll({
      attributes: [
        [sequelize.fn("sum", sequelize.col("totalprice")), "total"],
        [sequelize.fn("COUNT", sequelize.col("id")), "entries"],
      ],
    });

    const nonconsumableentries = await Ledger.findAll({
      attributes: [
        "consumetype",
        [sequelize.fn("sum", sequelize.col("Itementry.totalprice")), "total"],
        [sequelize.fn("COUNT", sequelize.col("Itementry.id")), "entries"],
      ],
      include: [
        {
          model: Itementry,
          attributes: [],
        },
      ],
      group: ["Ledger.consumetype"],

      // raw:true,
    });
    // console.log(nonconsumable);
    // console.log("sds",itementryprice[0].dataValues.total);

    return res.json({
      totalexpenses: {
        totalprice: expenses[0].dataValues.total,
        totalentries: expenses[0].dataValues.entries,
      },
      expensesontype: {
        data: nonconsumableentries,
        // totalprice: nonconsumable[0].dataValues.total,
        // totalentries:nonconsumable[0].dataValues.entries
      },
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  card_api,
};
