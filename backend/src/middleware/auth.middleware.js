// middleware/auth.middleware.js (or wherever your protectRoute is)
import { clerkClient } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Try to get token from Authorization header first
    const authHeader = req.headers.authorization;
    let clerkId;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = await clerkClient.verifyToken(token);
        clerkId = decoded.sub;
      } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - User not found" });
  }

  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Forbidden - Admin access only" });
  }

  next();
};