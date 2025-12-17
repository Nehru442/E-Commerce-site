import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    // ✅ READ TOKEN FROM COOKIE
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id; // ✅ used everywhere
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default authUser;
