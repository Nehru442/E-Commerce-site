import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }

    req.userId = decoded.id;
     next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized" });
  }
};

export default authUser;
