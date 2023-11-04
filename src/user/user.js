import { Router } from "express";
import UserModel from "./user_model.js";

const router = Router();

// Create user
router.post("/", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const newUser = new UserModel({ name, email, password, phone, address });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get user by credentials
router.post("/credentials", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password, active: true });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "The user was not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (user && user.active) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "The user was not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update user
router.patch("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user || !user.active) {
      res.status(404).json({ message: "The user was not found" });
      return;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user || !user.active) {
      res.status(404).json({ message: "The user was not found" });
      return;
    }

    const deletedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (deletedUser) {
      res.status(200).json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "The user was not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
