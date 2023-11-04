import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name"] },
    description: { type: String, required: [true, "description"] },
    category: { type: String, required: [true, "category"] },
    address: { type: String, required: [true, "address"] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
