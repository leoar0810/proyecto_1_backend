import { Router } from "express";
import RestaurantModel from "./restaurant_model.js";
const router = Router();

// Create restaurant
router.post("/", async (req, res) => {
  try {
    const { name, category, description, address } = req.body;

    const newRestaurant = new RestaurantModel({
      name,
      description,
      category,
      address,
    });
    const savedRestaurant = await newRestaurant.save();

    res.status(201).json(savedRestaurant);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get restaurant by id
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findById(req.params.id);
    if (restaurant && restaurant.active) {
      res.status(200).json(restaurant);
    } else {
      res.status(404).json({ message: "The restaurant was not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get restaurants with regex
router.get("/", async (req, res) => {
  try {
    const { category, name } = req.query;
    const query = { active: true };

    if (category) query.category = category;
    if (name) query.name = { $regex: new RegExp(name, "i") };

    const restaurants = await RestaurantModel.find(query);

    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update restaurant
router.patch("/:id", async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findById(req.params.id);
    if (!restaurant || !restaurant.active) {
      res.status(404).json({ message: "The restaurant was not found" });
      return;
    }

    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedRestaurant);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete restaurant
router.delete("/:id", async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findById(req.params.id);
    if (!restaurant || !restaurant.active) {
      res.status(404).json({ message: "The restaurant was not found" });
      return;
    }

    const deletedRestaurant = await RestaurantModel.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    res.status(200).json({ message: "Restaurant deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
