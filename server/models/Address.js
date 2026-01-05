import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstName: String,
  lastName: String,
  email: String,
  street: String,
  city: String,
  state: String,
  zipcode: String,
  country: String,
  phone: String
});

export default mongoose.model("Address", addressSchema);
