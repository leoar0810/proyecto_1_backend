import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(``, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "backend",
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

// import routes

import user from "./src/user/user.js";
import restaurant from "./src/restaurant/restaurant.js";
import product from "./src/product/product.js";
import order from "./src/order/order.js";

// routes
app.use("/user", user);
app.use("/restaurant", restaurant);
app.use("/product", product);
app.use("/order", order);

// User login route
app.post("/login", async (req, res) => {
  res.redirect("/user/credentials");
});

// Route not found
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(4000);
