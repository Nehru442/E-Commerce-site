import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import 'dotenv/config.js';
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import cartRouter from "./routes/cartRoute.js";
import productRouter from './routes/productRoute.js'
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import  stripeWebhooks from './controllers/orderController.js'

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

app.post('/stripe' , express.raw({type: "application/json"}), stripeWebhooks)

// ✅ Allow frontend origin with credentials
const allowedOrigins = [
  "http://localhost:5173",   // React dev
  "https://orgcart.vercel.app"  
];

app.use(express.json());
app.use(cookieParser());

// ✅ More flexible CORS setup
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => res.send("API is running..."));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
