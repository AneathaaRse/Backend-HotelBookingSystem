import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId,  ref: "User", required: true }, 
  // Link to the user
  hotel: { type: mongoose.Schema.Types.ObjectId,  ref: "Hotel",  required: true }, 
  bookingId: {  type: String,  required: true  },

  hotelName: { type: String,  required: true  },
  roomType: { type: String, required: true }, // Type of room booked (e.g., Single, Double, Suite)
  checkInDate: {  type: String, required: true  }, // Check-in date
  checkOutDate: {   type: String,  required: true }, // Check-out date
  numberOfGuests: {  type: Number }, // Number of guests
  status: { type: String, default: "Confirmed" }, // Booking status (e.g., Confirmed, Cancelled)
  totalPrice: {  type: Number}, // Total price for the booking
  specialRequests: {  type: String }, // Any special requests from the user
  paymentStatus: { type: String, default: "Pending" }, // Payment status (e.g., Paid, Pending)
 }, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
