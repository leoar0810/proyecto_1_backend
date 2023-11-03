import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name"] },
    description: { type: String, required: [true, "description"] },
    category: { type: String, required: [true, "category"] },
    price: { type: Number, required: [true, "price"] },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
