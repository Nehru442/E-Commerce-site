import express from "express"
import authUser from "../middlewares/authUser.js";
import authSeller from '../middlewares/authSeller.js'
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe, stripeWebhooks } from "../controllers/orderController.js";

export const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/seller', authSeller,getAllOrders);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/webhook', express.raw({type: "application/json"}), stripeWebhooks);

export default orderRouter;