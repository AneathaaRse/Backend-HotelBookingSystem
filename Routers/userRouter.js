import express from "express";
import { forgotPassword, loginUser, registerUser, resetPassword,userProfile,updateProfile } from "../Controllers/userController.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:userId", userProfile);
router.put("/update-profile/:userId", updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword)

export default router;
