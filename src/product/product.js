import { Router } from "express";
import ProductModel from "./product_model.js";
const router = Router();

// Create product
router.post("/", async (req, res) => {
  try {
    const { name, description, category, price, restaurant } = req.body;
    const newProduct = new ProductModel({
      name,
      description,
      category,
      price,
      restaurant,
    });
    const SavedProduct = await newProduct.save();
    res.status(201).json(SavedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      _id: req.params.id,
      active: true,
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "The product was not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get prodcut by restarant or category
router.get("/", async (req, res) => {
  try {
    const { category, restaurant } = req.query;
    const query = { active: true };

    if (category) query.category = category;
    if (restaurant) query.restaurant = restaurant;

    const products = await ProductModel.aggregate([
      { $match: query },
      { $sort: { category: 1 } },
      {
        $group: {
          _id: "$category",
          products: { $push: "$$ROOT" },
        },
      },
    ]);

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update product
router.patch("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      _id: req.params.id,
      active: true,
    });
    if (!product) {
      res.status(404).json({ message: "The product was not found" });
      return;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findOne({
      _id: req.params.id,
      active: true,
    });
    if (!product) {
      res.status(404).json({ message: "The product was not found" });
      return;
    }

    const deletedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (deletedProduct) {
      res.status(200).json({ message: "Product deleted" });
    } else {
      res.status(404).json({ message: "The product was not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
