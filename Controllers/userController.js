import User from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashPassword });

    await newUser.save();
    res.status(200).json({ message: "User Registered Successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const userProfile = async (req, res) => {
    try {
        // Get user ID from the JWT token payload
        const userId  = req.params.userId;
        console.log(userId);
    
        // Find the user by ID and exclude the password field
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
  };

  export const updateProfile = async (req, res) => {
    try {
      // Get user ID from the JWT token payload
      const userId  = req.params.userId;
        console.log(userId);
  
      // Get the updated user data from the request body
      const { name, email } = req.body;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's details
      user.name = name || user.name;
      user.email = email || user.email;
  
      // Save the updated user data
      await user.save();
  
      res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.PASS_MAIL, pass: process.env.PASS_KEY },
    });

    const mailOptions = {
      from: process.env.PASS_MAIL,
      to: user.email,
      subject: "Password Reset Link",
      text: `Please click the link to reset your password:
https://frontend-hotel-booking-system.vercel.app/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Email Error:", error.message);
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({ message: "Email sent successfully" });
    });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;  // Ensure password is sent in the request body

        // Check if the password was provided
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.error("JWT Error:", err.message);  // Log error message
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);  // Correctly hash password with salt rounds

            user.password = hashedPassword;

            // Save the user with the new password
            await user.save();

            return res.status(200).json({ message: "Password reset successfully" });
        });

    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: error.message });
    }
};


