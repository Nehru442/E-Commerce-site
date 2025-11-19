import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],

    amount: { type: Number, required: true },

    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },

    paymentType: { type: String, enum: ["COD", "Online"], required: true },

    isPaid: { type: Boolean, default: false },

    status: { type: String, default: "Order Placed" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
