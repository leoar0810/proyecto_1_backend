import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: [true, "email"] },
    name: { type: String, required: [true, "name"] },
    password: { type: String, required: [true, "password"] },
    phone: { type: String, required: [true, "phone"] },
    address: { type: String, required: [true, "address"] },
    option: {
      type: String,
      enum: ["client", "delivery", "admin"],
      default: "client",
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
