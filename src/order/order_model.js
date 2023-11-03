import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    status: {
      type: String,
      enum: ["created", "in_progress", "on_the_way", "delivered"],
      default: "created",
    },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
