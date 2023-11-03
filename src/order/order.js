import { Router } from "express";
import OrderModel from "./order_model.js";
const router = Router();

// Create order
router.post("/", async (req, res) => {
  try {
    const { user, restaurant, products } = req.body;
    const newOrder = new OrderModel({ user, restaurant, products });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get order by id
router.get("/:id", async (req, res) => {
  try {
    const order = await OrderModel.findOne({
      _id: req.params.id,
      active: true,
    });
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "The order was not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Orders sent but not accepted
router.get("/", async (req, res) => {
  try {
    const { user, restaurant, fromDate, toDate, status } = req.query;
    const query = { active: true };

    if (user) query.user = user;
    if (restaurant) query.restaurant = restaurant;
    if (status) query.status = status;
    if (fromDate && toDate) {
      query.createdAt = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    }

    const orders = await OrderModel.find(query);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Order sent but not accepted
router.get("/sent", async (req, res) => {
  try {
    const query = { status: "created" };
    const orders = await OrderModel.find(query);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update order
router.patch("/:id", async (req, res) => {
  try {
    const order = await OrderModel.findOne({
      _id: req.params.id,
      active: true,
    });

    if (!order) {
      res.status(404).json({ message: "The order was not found" });
      return;
    }

    if (order.status === "created" || order.status === "in_progress") {
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedOrder);
    } else {
      res.status(403).json({
        message:
          "The order cannot be modified because it has already been sent",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete order
router.delete("/:id", async (req, res) => {
  try {
    const order = await OrderModel.findOne({
      _id: req.params.id,
      active: true,
    });
    if (!order) {
      res.status(404).json({ message: "The order was not found" });
      return;
    }

    const deletedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
