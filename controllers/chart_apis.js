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
  const currentyear = req.params.year;
  console.log(currentyear)
  try {

    const expenses = await Itementry.findAll({
      where:[
        sequelize.where(sequelize.fn("date_part",'year',sequelize.col('createdAt')), currentyear)
      ],
      attributes: [
        [sequelize.fn("sum", sequelize.col("totalprice")), "total"],
      ],
    });

    const nonconsumableentries = await Ledger.findAll({

      where:[
        sequelize.where(sequelize.fn("date_part",'year',sequelize.col('Itementry.createdAt')), currentyear)
      ],
      attributes: [
        "consumetype",
        [sequelize.fn("sum", sequelize.col("Itementry.totalprice")), "total"],
      ],
      include: [
        {
          model: Itementry,
          attributes: [],
        },
      ],
      group: ["Ledger.consumetype"],

    });

    if (nonconsumableentries.length == 0 ){
      var value = {
        nonconsumable : 0,
        consumable: 0
    }
  }else if(nonconsumableentries.length == 1){
    if (nonconsumableentries[0].dataValues.consumetype == "nonconsumable"){
      var value = {
        nonconsumable : nonconsumableentries[0].dataValues.total,
        consumable: 0
    }
    }
    else if (nonconsumableentries[0].dataValues.consumetype == "consumable"){
      var value = {
        nonconsumable : 0,
        consumable: nonconsumableentries[0].dataValues.total
    }
    }
  }else{
    var value = {
      consumable : nonconsumableentries[0].dataValues.total,
      nonconsumable: nonconsumableentries[1].dataValues.total
  }

  }

  const itementry = await Itementry.findAll({
    order: [["id", "DESC"]],
    limit: 5,

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


  const yearexpenses = await Itementry.findAll({

    attributes: [
      [sequelize.fn("date_part",'year',sequelize.col('createdAt')),"year"],
      [sequelize.fn("sum", sequelize.col("totalprice")), "total"],
    ],
    group: ["year"],
  
  });

  const statuscount = await Itemstatus.findAll({

    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('status')), 'total'],
    ],
    group: ["status"],

  
  });

 



    return res.json({

      totalprice: expenses[0].dataValues.total,
      partexpenses: value,
      recentdata: itementry,
      yearwisedata: yearexpenses,
      statuswisedata: statuscount

    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  card_api,
};
