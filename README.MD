
Hotel Booking and Reservation System 

A comprehensive Hotel Booking and Reservation System built using the MERN stack with features for searching hotels, managing bookings, secure payments, real-time updates, and user account management. This project implements modern web technologies for enhanced user experience and functionality.
_______________________________________________________________________________________________________________________

Tech Stack

Frontend: React.js, TailwindCSS
Backend: Node.js, Express.js
Database: MongoDB
________________________________________________________________________________________________________________________

API Endpoints

1. Hotels
GET /api/hotels: Retrieve all hotels.
POST /api/hotels/search: Search hotels based on criteria (e.g., location, availability).
GET /api/hotels/:hotelId: Retrieve details of a specific hotel.

2. Bookings
GET /api/bookings/:userId: Retrieve all bookings for a user.
POST /api/bookings: Create a new booking for a selected hotel.
PATCH /api/bookings/:bookingId: Update booking details (e.g., check-in, check-out dates).
DELETE /api/bookings/:bookingId: Cancel a booking.

3. Payments
POST /api/payments: Process payments using Stripe or PayPal for hotel bookings.

4. Users
POST /api/auth/register: Register a new user.
POST /api/auth/login: Log in a user.
GET /api/users/profile: Retrieve user profile details.
_________________________________________________________________________________________________________________________

Example Use Case
User searches for hotels in a specified location and views availability.
User selects a hotel, chooses a room type, and confirms a booking.
User proceeds to secure payment and receives real-time booking confirmation.

This system is designed to simplify hotel bookings while ensuring security and reliability for users.
_________________________________________________________________________________________________________________________

## Postman Collections
https://documenter.getpostman.com/view/39168679/2sAYJ98x9m

## Documentation for Backend Details
https://docs.google.com/document/d/1vbbBGNKq4GhZM5hxhN-bqv9uMdS8RRFmMcKSUCka6Q4/edit?tab=t.0

