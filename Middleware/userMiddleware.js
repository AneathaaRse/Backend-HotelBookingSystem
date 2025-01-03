import jwt from "jsonwebtoken";
import User from "../Models/userSchema.js";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // Extract the token
  
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Fetch the user associated with the token
      const user = await User.findById(decoded._id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      req.user = user; // Attach user to the request object
      next(); // Pass control to the next middleware or route
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired. Please log in again." });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token." });
      } else {
        console.error("Error in authMiddleware:", error);
        res.status(500).json({ message: "An internal error occurred." });
      }
    }
  };