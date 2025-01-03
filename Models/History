import mongoose from "mongoose";

// Guest Schema
const GuestSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  countryCode: { type: String },
  mobileNo: { type: String, required: true },
  email: { type: String, required: true },
  requiresAccessibility: { type: Boolean, default: false },
  specialRequests: { type: String, default: "" }, // Optional special requests
});

// Room Schema
const RoomSchema = new mongoose.Schema({
  roomType: { type: String, required: true }, // e.g., Single, Double, Suite
  bedType: { type: String, required: true }, // e.g., King, Queen, Twin
  pricePerNight: { type: Number, required: true },
  amenities: { type: [String], default: [] }, // e.g., Wi-Fi, TV, Mini-Bar
});

// Hotel Booking Schema
const BookingHistorySchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  hotelName: { type: String, required: true },
  location: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  roomDetails: { type: [RoomSchema], required: true },
  guestDetails: { type: [GuestSchema], required: true },
  totalPrice: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
});

export default mongoose.model("BookingHistory", BookingHistorySchema);
