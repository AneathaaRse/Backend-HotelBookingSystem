import express from 'express';
import { 
  bookhotel, 
  cancelBooking, 
  getBookingHistory, 
  getHotelSuggestions, 
  searchHotels 
} from '../Controllers/hotelController.js';
import { authMiddleware } from '../Middleware/userMiddleware.js';

const router = express.Router();

// Search for hotels
router.get('/search', authMiddleware, searchHotels);

// Book a hotel room
router.post('/book', bookhotel);

// Get location-based hotel suggestions
router.get('/locations', getHotelSuggestions);

// Get booking history for the user
router.get('/history', getBookingHistory);

// Cancel a booking by booking ID
router.delete('/cancel/:bookingId', cancelBooking);

export default router;

