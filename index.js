const { sequelize } = require("./models");
const express = require("express");
var cors = require("cors");
const { authenticate_Token } = require("./middleware/authorization");

const {
  category_post,
  category_delete,
  category_get,
  category_update,
} = require("./controllers/category_apis");

const {
  item_post,
  item_delete,
  item_get,
  item_update,
} = require("./controllers/item_apis");

const {
  itementry_post,
  itementry_delete,
  itementry_get,
  itementry_getone,
  itementry_nonconsumable,
  itementry_yearfilter,
  itementry_itemname
} = require("./controllers/itementry_apis");

const {
  user_post,
  user_delete,
  user_get,
  // user_update,
  login_post,
  user_getaccesstoken,
} = require("./controllers/user_apis");

const {
  itemstatus_post,
  based_on_itemstatus,
  itemstatus_decline,
  status_update,
} = require("./controllers/itemstatus_apis");

const {
  location_post,
  location_delete,
  location_get,
  location_update,
} = require("./controllers/location_apis");

const {
  staff_post,
  staff_delete,
  staff_get,
  staff_update,
} = require("./controllers/staff_apis");

const { history_item, history_staff } = require("./controllers/history_apis");

const { card_api } = require("./controllers/chart_apis");

const app = express();
app.use(cors());
app.use(express.json());

//category

app.post("/category", category_post);
app.get("/category", category_get);
app.put("/category/:id", category_update);
app.delete("/category/:id", category_delete);

//items
app.post("/item", item_post);
app.get("/item", item_get);
app.put("/item/:id", item_update);
app.delete("/item/:id", item_delete);

//items_entry
app.post("/item/entry", itementry_post);
app.get("/item/entry", itementry_get);
app.get("/item/entry/:id", itementry_getone);
app.delete("/item/entry/:id", itementry_delete);
app.get("/entry/nonconsumable", itementry_nonconsumable);
// changes made on api path from last commit
app.get("/entry/year", itementry_yearfilter);
app.get("/entry/item",itementry_itemname);

//itemstatus
app.post("/item/status/accept", itemstatus_post);
app.put("/item/status/decline", itemstatus_decline);
app.put("/item/status/:id", status_update);
app.get("/item/status", based_on_itemstatus);

//location
app.post("/location", location_post);
app.get("/location", location_get);
app.put("/location/:id", location_update);
app.delete("/location/:id", location_delete);

//staff
app.post("/staff", staff_post);
app.get("/staff", staff_get);
app.put("/staff/:id", staff_update);
app.delete("/staff/:id", staff_delete);

//history
app.get("/history/item/:id", history_item);
app.get("/history/staff/:id", history_staff);

//user
app.post("/user", user_post);
app.post("/user/login", login_post);
app.get("/user", user_get);
app.get("/getaccesstoken", user_getaccesstoken);
// app.get("/user/:id", user_update);
app.delete("/user/:id", user_delete);

// hod charts
app.get("/hod/charts", card_api);

app.listen({ port: 5000 }, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
