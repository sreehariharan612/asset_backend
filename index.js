const { sequelize } = require("./models");
const express = require("express");
var cors = require("cors");
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
} = require("./controllers/itementry_apis");

const {
  user_post,
  user_delete,
  user_get,
  // user_update,
  login_post,
  user_getaccesstoken,
} = require("./controllers/user_apis");

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
app.post("/entry", itementry_post);
app.get("/entry", itementry_get);
app.get("/entry/:id", itementry_getone);
app.delete("/entry/:id", itementry_delete);

//user
app.post("/user", user_post);
app.post("/user/login", login_post);
app.get("/user", user_get);
app.get("/getaccesstoken", user_getaccesstoken);
// app.get("/user/:id", user_update);
app.delete("/user/:id", user_delete);

app.listen({ port: 5000 }, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
