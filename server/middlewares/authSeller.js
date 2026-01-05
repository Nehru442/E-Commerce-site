import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "seller") {
      return res.status(401).json({ success: false, message: "Invalid Seller Token" });
    }

    req.seller = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export default authSeller;
