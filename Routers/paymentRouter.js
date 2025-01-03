import express from "express";
import {  createPaymentSession} from "../Controllers/paymentController.js";

const router = express.Router();

// Route to create a  payment order
router.post("/create", createPaymentSession);

// Route to capture  payment after approval
//router.post("/confirm", verifyPayment);

export default router;