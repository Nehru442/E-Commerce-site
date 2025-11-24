import Product from "../models/Product.js";
import Stripe from "stripe";
import User from "../models/User.js";
import Order from "../models/Order.js";

// ======================
// PLACE ORDER (COD)
// ======================
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid address or items data" });
    }

    // calculate total amount
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax 2%
    amount += Math.floor(amount * 0.02);

    // ✅ FIXED — use model "Order" (not "orders")
    await Order.create({ userId, items, amount, address, paymentType: "COD" });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ======================
// PLACE ORDER (STRIPE)
// ======================
export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const { origin } = req.headers;
    const userId = req.userId;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid address or items data" });
    }

    let productData = [];

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax 2%
    unit_amount : Math.round((items.price + items.price * 0.02) * 100) ;

    // ✅ FIXED — use different variable name (order)
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    // stripe payment initialization
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ======================
// STRIPE WEBHOOK
// ======================
export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Use the session object directly
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { orderId, userId } = session.metadata || {};

    try {
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          paymentType: "Online",
          status: "Order Placed",
        });
      }

      if (userId) {
        await User.findByIdAndUpdate(userId, { cartItems: {} });
      }

    } catch (err) {
      console.error("Error updating order / clearing cart:", err);
      // don't return error to Stripe — still ack so Stripe doesn't retry indefinitely
    }
  }

  // handle failed payments optionally
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Optionally find and delete the order linked to this payment
    try {
      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const session = sessions.data[0];
      const { orderId } = session?.metadata || {};
      if (orderId) {
        await Order.findByIdAndDelete(orderId);
      }
    } catch (err) {
      console.error("Error handling payment_failed:", err);
    }
  }

  res.json({ received: true });
};




// ======================
// GET USER ORDERS
// ======================
export const getUserOrders = async (req, res) => {
  try {
    // ✅ FIXED
    const userId = req.userId;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ======================
// GET ALL ORDERS (ADMIN)
// ======================
export const getAllOrders = async (req, res) => {
  try {
    // ✅ FIXED — use Order model, not "orders"
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate("items.product address");

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default stripeWebhooks;
