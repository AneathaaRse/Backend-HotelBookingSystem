import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
  status: { type: String, default: "success" },
  paymentDate: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
