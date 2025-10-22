import User from "../models/User.js";

export const updateCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from middleware
    const { cartItems } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID not found" });
    }

    await User.findByIdAndUpdate(userId, { cartItems });
    res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error("Update cart error:", error);
    res.json({ success: false, message: error.message });
  }
};
