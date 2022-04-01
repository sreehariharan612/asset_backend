const { sequelize } = require("./models");
const express = require("express");
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

const app = express();

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

app.listen({ port: 5000 }, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
