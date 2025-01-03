import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
    },
  hotelName: {  type: String, required: true }, // Name of the hotel
  location: {  type: String, required: true  }, // Location of the hotel
  roomType: { type: String, required: true }, // Type of room (e.g., Single, Double, Suite)
  pricePerNight: { type: Number,  required: true }, // Price per night
  amenities: {  type: [String],  required: true }, // List of amenities (e.g., Wi-Fi, Pool, Gym)
  checkInTime: {  type: String,  required: true  }, // Standard check-in time
  checkOutTime: { type: String, required: true  }, // Standard check-out time
  rating: {  type: Number,  default: 0 }, // Rating of the hotel
  numberOfRooms: {  type: Number,  required: true  }, // Total number of rooms available
  availableRooms: {   type: Number,   required: true  }, // Number of rooms currently available
});

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
