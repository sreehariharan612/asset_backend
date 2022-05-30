const { sequelize, Itementry, Ledger, Item, Category } = require("../models");
const { Op } = require("sequelize");

const itementry_post = async (req, res) => {
  const {
    brand,
    quantity,
    totalprice,
    itemid,
    volumeno,
    pageno,
    sno,
    consumetype,
  } = req.body;

  try {
    const result = await sequelize.transaction(async (t) => {
      const itementry = await Itementry.create(
        { brand, quantity, totalprice, itemid },
        { transaction: t }
      ).then(async (insertedentry) => {
        const itementryid = insertedentry.dataValues.id;
        await Ledger.create(
          { volumeno, pageno, sno, consumetype, itementryid },
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
      order: [["id", "DESC"]],

      // // include: { all: true, nested: true },
      //  include:[ Item, Category]
      include: [
        {
          model: Item,
          attributes: ["name"],
          include: [{ model: Category, attributes: ["name"] }],
        },
      ],
      attributes: { exclude: ["itemid","updatedAt"] },
    });
    // const itementryprice = await Itementry.findAll({
    //   attributes: [[sequelize.fn("sum", sequelize.col("totalprice")), "total"]],
    // });
    // console.log("sds",itementryprice[0].dataValues.total);
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
      include: [
        {
          model: Ledger,
          attributes: {
            exclude: [
              "id",
              "itementryid",
              "createdAt",
              "updatedAt",
              "hasitemstatusentry",
            ],
          },
        },
        {
          model: Item,
          attributes: ["name"],
          include: [{ model: Category, attributes: ["name"] }],
        },
      ],
      attributes: { exclude: ["itemid","updatedAt"] },
    });
    return res.json(itementry);
  } catch (err) {
    return res.status(500).json(err);
  }
};



const itementry_nonconsumable = async (req, res) => {
  try {
    const itementry = await Ledger.findAll({
      order: [["id", "DESC"]],
      where: {
        [Op.and]: [
          { consumetype: "nonconsumable" },
          { hasitemstatusentry: false },
        ],
      },
      include: [
        {
          model: Itementry,
          attributes: [
            "id",
            "brand",
            "quantity",
            "totalprice",
            "createdAt",
          ],
          include: [
            {
              model: Item,
              attributes: ["name"],
              include: [{ model: Category, attributes: ["name"] }],
            },
          ],
        },
      ],
      attributes: ["id", "volumeno", "pageno", "sno"],
    });
    return res.json(itementry);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const itementry_yearfilter = async (req, res) => {
  console.log("from", req.query.from);
  console.log("to", req.query.to);
  const fromdate = req.query.from;
  const todate = req.query.to;
  try {
    const itementry = await Itementry.findAll({
      order: [["id", "DESC"]],
      where: {
        createdAt: {
          [Op.between]: [fromdate, todate],
        },
      },
      include: [
        {
          model: Item,
          attributes: ["name"],
          include: [{ model: Category, attributes: ["name"] }],
        },
      ],
            attributes: { exclude: ["itemid","updatedAt"] },
    });

    return res.json(itementry);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const itementry_itemname = async (req, res) => {
  console.log(" iam in ",req.query.itemname);
  const itemname = req.query.itemname;
  try{
    const itementry = await Itementry.findAll({
      order: [["id", "DESC"]],
     
      include: [
        {
          model: Item,
          attributes: ["name"],
          where: {
              name :{
                [Op.eq]: itemname
              }
          },
          include: [{ model: Category, attributes: ["name"] }],
        },
      ],
      attributes: { exclude: ["itemid","updatedAt"] },
    });

    return res.json(itementry);


  }
  catch(err){
    return res.status(500).json(err);
  }
}

module.exports = {
  itementry_post,
  itementry_getone,
  itementry_get,
  itementry_nonconsumable,
  itementry_yearfilter,
  itementry_itemname
};
