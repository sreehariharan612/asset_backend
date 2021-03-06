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

const itemstatus_post = async (req, res) => {
  const { status, itementryid, quantity } = req.body;
  const t = await sequelize.transaction();
  try {
    for (let itemno = 1; itemno <= quantity; itemno++) {
      const item = await Itemstatus.create(
        { status, itementryid, itemno },
        { transaction: t }
      );
    }
    const ledger = await Ledger.findOne(
      {
        where: { itementryid: itementryid },
      },
      { transaction: t }
    );
    ledger.hasitemstatusentry = true;
    await ledger.save();
    await t.commit();
    return res.json("record created");
  } catch (err) {
    await t.rollback();
    return res.status(500).json(err);
  }
};

const itemstatus_decline = async (req, res) => {
  const { itementryid } = req.body;
  try {
    const ledger = await Ledger.findOne({
      where: { itementryid: itementryid },
    });
    ledger.hasitemstatusentry = true;
    await ledger.save();
    return res.json("record updated");
  } catch (err) {
    return res.status(500).json(err);
  }
};

const based_on_itemstatus = async (req, res) => {
  const stat = req.query.itemstatus;
  try {
    const itemstatus = await Itemstatus.findAll({
      order: [["id", "DESC"]],
      where: { status: stat },
      include: [
        {
          model: Location,
          attributes: ["name", "id"],
        },
        {
          model: Staff,
          attributes: ["name", "id", "designation"],
        },
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
      attributes: { exclude: ["locationid", "itementryid", "staffid","createdAt"] },
    });
    return res.json(itemstatus);
  } catch (err) {
    return res.status(500).json(err);
  }
};


const itemstatus_all = async (req, res) => {
  try {
    const itemstatus = await Itemstatus.findAll({
      order: [["id", "DESC"]],
      include: [
        
        {
          model: Itementry,
          attributes: [
            "quantity",    
            "createdAt"
          ],
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
      attributes: { exclude: ["locationid", "itementryid", "staffid","status","createdAt","updatedAt"] },
    });
    return res.json(itemstatus);
  } catch (err) {
    return res.status(500).json(err);
  }
};


const status_update = async (req, res) => {
  const id = req.params.id;
  const { status, locationid, staffid } = req.body;
  const t = await sequelize.transaction();

  try {
    const itemstatus = await Itemstatus.findOne({
      where: { id: id },
    });
    // itemstatus.status = status;
    // itemstatus.locationid = locationid;
    // itemstatus.staffid = staffid;
    // await itemstatus.save();
    await itemstatus.update(
      { status, locationid, staffid },
      { transaction: t }
    );

    const history = await History.create(
      {
        paststatus: status,
        itemstatusid: id,
        pastlocationid: locationid,
        paststaffid: staffid,
      },
      { transaction: t }
    );
    await t.commit();

    return res.json(itemstatus);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  itemstatus_post,
  based_on_itemstatus,
  itemstatus_decline,
  status_update,
  itemstatus_all
};
