import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  placeOrderCOD,
  placeOrderStripe,
  stripeWebhooks,
  getUserOrders,
  getAllOrders,
} from "../controllers/orderController.js";
import authSeller from "../middlewares/authSeller.js";

const router = express.Router();

router.post("/cod", authUser, placeOrderCOD);
router.post("/stripe", authUser, placeOrderStripe);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

router.get("/user", authUser, getUserOrders);
router.get("/seller",authSeller, getAllOrders);

export default router;
