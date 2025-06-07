import jwt from "jsonwebtoken";
import User from "../models/User.js";

// verify token
export const verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user ID and user object to request
      req.userId = decoded.id;
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      res.status(401).json({ message: "Unauthorized: Token failed" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized: No token provided" });
  }
};

// check admin role
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

export const protect = verifyToken;
