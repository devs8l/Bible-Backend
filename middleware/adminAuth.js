import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
    }

    const token = authHeader.split(" ")[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ success: false, message: "Forbidden: Not an admin." });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;
