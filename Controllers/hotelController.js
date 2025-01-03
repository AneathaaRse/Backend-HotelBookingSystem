import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Hotel from '../Models/Hotel.js';
import nodemailer from 'nodemailer';
import CustomerDetails from '../Models/CustomerDetails.js';
import Booking from '../Models/Booking.js';

dotenv.config();

let cachedToken = null;
let tokenExpiry = null;
const BUFFER_TIME = 30000;
let isFetchingToken = false;

// Helper function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAccessToken = async () => {
  if (cachedToken && tokenExpiry > Date.now() + BUFFER_TIME) {
    return cachedToken; // Use cached token if still valid
  }

  if (isFetchingToken) {
    while (isFetchingToken) {
      await delay(500); 
    }
    return cachedToken; // Use the newly fetched token
  }

  try {
    isFetchingToken = true; // Mark fetching as in progress
    console.log('Fetching new access token...');

    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      'grant_type=client_credentials',
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: {
          username: process.env.AMADEUS_API_KEY,
          password: process.env.AMADEUS_API_SECRET,
        },
      }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;

    console.log(`New token fetched. Expires at: ${new Date(tokenExpiry).toLocaleString()}`);
    return cachedToken;
  } catch (error) {
    if (error.response?.status === 429) {
      const retryAfter = parseInt(error.response.headers['retry-after'], 10) || 1;
      console.warn(`Rate limit exceeded. Retrying after ${retryAfter} seconds...`);
      await delay(retryAfter * 1000);
      return getAccessToken(); // Retry after delay
    }
    console.error('Error fetching access token:', error.response?.data || error.message);
    throw new Error('Failed to fetch access token');
  } finally {
    isFetchingToken = false; 
  }
};

const hotelCache = {};

const MAX_RETRY_ATTEMPTS = 3;

// Fetch multiple names in one request
const getHotelNames = async (carrierCodes, token, attempt = 1) => {
  const uncachedCodes = carrierCodes.filter((code) => !hotelCache[code]);

  if (uncachedCodes.length === 0) {
    return carrierCodes.reduce((acc, code) => {
      acc[code] = hotelCache[code];
      return acc;
    }, {});
  }

  try {
    const response = await axios.get(
      'https://test.api.amadeus.com/v1/reference-data/hotel',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { hotelCodes: uncachedCodes.join(',') },
      }
    );
    response.data.data.forEach((hotel) => {
      hotelCache[hotel.iataCode] = hotel.commonName || hotel.businessName;
    });

    return carrierCodes.reduce((acc, code) => {
      acc[code] = hotelCache[code] || code;
      return acc;
    }, {});
  } catch (error) {
    if (error.response?.status === 429 && attempt <= MAX_RETRY_ATTEMPTS) {
      console.warn(`Rate limit exceeded, retrying in ${attempt} second(s)...`);
      const retryAfter = parseInt(error.response.headers['retry-after'], 10) || attempt;
      await delay(retryAfter * 1000);
      return getHotelNames(carrierCodes, token, attempt + 1);
    }

    console.error('Error fetching hotel names:', error.message);
    return carrierCodes.reduce((acc, code) => {
      acc[code] = code;
      return acc;
    }, {});
  }
};

// Format hotel price with currency
const formatPrice = (price, currency) => `${currency} ${price}`;

// Search for available hotels
export const searchHotels = async (req, res) => {
  const { cityCode, checkInDate, checkOutDate, guests, rooms } = req.query;

  if (!cityCode || !checkInDate || !checkOutDate || !guests || !rooms) {
    return res.status(400).json({
      error: "All parameters (cityCode, checkInDate, checkOutDate, guests, rooms) are required.",
    });
  }

  try {
    const token = await getAccessToken(); // Use the token-fetching function
    const hotelResponse = await axios.get(
      'https://test.api.amadeus.com/v2/shopping/hotel-offers',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          cityCode,
          checkInDate,
          checkOutDate,
          adults: guests,
          roomQuantity: rooms,
          currency: 'INR',
        },
      }
    );

    const hotelData = hotelResponse.data.data;

    // Map hotel details
    const hotels = hotelData.map((hotel) => {
      const offer = hotel.offers[0]; // Get the first offer as an example
      return {
        hotelName: hotel.hotel.name,
        address: `${hotel.hotel.address.lines.join(', ')}, ${hotel.hotel.address.cityName}`,
        rating: hotel.hotel.rating || 'Not Rated',
        price: formatPrice(offer.price.total, offer.price.currency),
        checkIn: offer.checkInDate,
        checkOut: offer.checkOutDate,
        roomType: offer.room.type,
        amenities: hotel.hotel.amenities || [],
      };
    });

    res.status(200).json({
      message: `Hotels available in ${cityCode} from ${checkInDate} to ${checkOutDate}`,
      hotels,
    });
  } catch (error) {
    console.error('Error fetching hotel data:', error.message);
    res.status(500).json({ error: 'Failed to fetch hotel data' });
  }
};

export const bookhotel = async (req, res) => {
  try {
    console.log(req.body);
    const hotel = req.body;

    /*if (!hotel || !Array.isArray(customerDetails)) {
      return res.status(400).json({ error: "Invalid booking Payload" });
    }

    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ error: "Authorization token is required" });
    }
    const token = authHeader.split(" ")[1];
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
      if (!user.name || !user.email) {
        return res.status(400).json({ error: "User details missing in token." });
      }
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }*/
      console.log(hotel);
    // Check if hotel exists or save a new one
    let storedHotel = await Hotel.findOne({
      hotelName: hotel.hotelName,
      city: hotel.city,
      address: hotel.address,
      checkInDate: new Date(hotel.checkInDate),
      checkOutDate: new Date(hotel.checkOutDate),
    });

    if (!storedHotel) {
      storedHotel = new Hotel({
        hotelName: hotel.hotelName,
        city: hotel.city,
        address: hotel.address,
        checkInTime: hotel.checkIn,
        checkOutTime: hotel.checkOut,
        price: parseFloat(hotel.price),
        rating: hotel.rating,
        amenities: hotel.amenities,
        roomType: hotel.roomType,
        availableRooms: 10,
        numberOfRooms:2,
        checkInTime:10,
        checkOutTime:10,
        pricePerNight:100,
        location: "chennai"
      });
      await storedHotel.save();
    }

    let user = await CustomerDetails.findOne({
        firstName: hotel.firstName,
        lastName: hotel.lastName,
        gender: hotel.gender,
        countryCode: hotel.countryCode,
        mobileNo: hotel.phone,
        email: hotel.email,
      });

      if (!user) {
        user = new CustomerDetails({
            firstName: hotel.firstName,
            lastName: hotel.lastName,
            gender: hotel.gender,
            countryCode: "IND",
            mobileNo: hotel.phone,
            email: hotel.email,
        
        });
        await user.save();
      }

    
    

    // Save guests
   /* const guestIds = [];
    for (const guest of customerDetails) {
      const newGuest = new CustomerDetails(guest); // Assuming a 'CustomerDetails' model exists
      const savedGuest = await newGuest.save();
      guestIds.push(savedGuest._id);
    }*/

    // Create booking
    const newBooking = new Booking({
      user: user._id, // Assuming the user's ID is available
      hotel: storedHotel._id, // The hotel information saved earlier
      //guests: guestIds, // List of guest IDs
      bookingId: `BOOKING-${Math.floor(Math.random() * 1000000)}`, // Unique booking ID
      hotelName: hotel.hotelName,
      city: hotel.city,
      address: hotel.address,
      checkInDate: hotel.checkIn,
      checkOutDate: hotel.checkOut,
      price: parseFloat(hotel.price),
      roomType: hotel.roomType,
      amenities: hotel.amenities,
      status: "Confirmed",
    });

    await newBooking.save();

    // Send Confirmation Email
    /*const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.PASS_MAIL,
        pass: process.env.PASS_KEY,
      },
    });

    const mailOptions = {
      from: process.env.PASS_MAIL,
      to: user.email,
      subject: "Hotel Booking Confirmation",
      text: `Dear ${user.name},\n\nYour hotel booking is confirmed.\n\nBooking ID: ${newBooking.bookingId}\nHotel Name: ${newBooking.hotelName}\nCheck-in Date: ${new Date(newBooking.checkInDate).toDateString()}\nCheck-out Date: ${new Date(newBooking.checkOutDate).toDateString()}\nStatus: Confirmed\n\nThank you for choosing our service!\n\nBest Regards,\nHotel Booking Team`,
    };

    await transporter.sendMail(mailOptions);*/

    // Respond with booking details
    res.status(200).json({
      message: "Booking confirmed and email sent",
      bookingId: newBooking.bookingId, // Use the correct booking ID here
      status: newBooking.status,
    });
  } catch (error) {
    console.error("Booking Error:", error.message);
    res.status(500).json({ error: "An error occurred while processing your booking." });
  }
};


// Get booking history for a user
export const getBookingHistory = async (req, res) => {
   /* const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ error: "Authorization token is required" });
    }
  
    const token = authHeader.split(" ")[1];
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
      if (!user._id) {
        return res.status(400).json({ error: "User ID missing in token." });
      }
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }*/
  
    try {
      const bookings = await Booking.find({}).populate("hotel").populate("user");
  
      if (!bookings.length) {
        return res.status(404).json({ message: "No booking history found" });
      }
  
      res.status(200).json({ bookings });
    } catch (error) {
      console.error("Error fetching booking history:", error.message);
      res.status(500).json({ error: "Failed to fetch booking history" });
    }
  };

export const getHotelSuggestions = async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  try {
    const token = await getAccessToken();
    const response = await axios.get("https://test.api.amadeus.com/v1/reference-data/locations/hotels", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        keyword,
      },
    });

    console.log("Amadeus API Response:", response.data); // Log the full response
    const hotels = response.data.data.map((hotel) => ({
      name: hotel.hotelName,
      address: hotel.address.lines ? hotel.address.lines.join(", ") : "",
      city: hotel.address.cityName,
    }));

    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching hotel suggestions:", error.message);
    res.status(500).json({ error: "Failed to fetch hotel suggestions" });
  }
};

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params; // Assuming the bookingId is passed in the URL
        const booking = await Booking.findOne({
            bookingId: bookingId,
          });

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        await booking.deleteOne();

        // Your code to cancel the booking goes here
        // Example: booking.status = "Cancelled"; await booking.save();

        return res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

    