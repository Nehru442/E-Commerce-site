import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
