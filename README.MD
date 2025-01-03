# Hotel Booking and Reservation System

A comprehensive Hotel Booking and Reservation System built using the MERN stack with features for searching hotels, managing bookings, secure payments, real-time updates, and user account management. This project implements modern web technologies for enhanced user experience and functionality.

## Tech Stack

- **Frontend:** React.js, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

## API Endpoints

### Hotels
- **GET /api/hotels**: Retrieve all hotels.
- **POST /api/hotels/search**: Search hotels based on criteria (e.g., location, availability).
- **GET /api/hotels/:hotelId**: Retrieve details of a specific hotel.

### Bookings
- **GET /api/bookings/:userId**: Retrieve all bookings for a user.
- **POST /api/bookings**: Create a new booking for a selected hotel.
- **PATCH /api/bookings/:bookingId**: Update booking details (e.g., check-in, check-out dates).
- **DELETE /api/bookings/:bookingId**: Cancel a booking.

### Payments
- **POST /api/payments**: Process payments using Stripe or PayPal for hotel bookings.

### Users
- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Log in a user.
- **GET /api/users/profile**: Retrieve user profile details.

## Example Use Case

1. User searches for hotels in a specified location and views availability.
2. User selects a hotel, chooses a room type, and confirms a booking.
3. User proceeds to secure payment and receives real-time booking confirmation.

This system is designed to simplify hotel bookings while ensuring security and reliability for users.

## Additional Resources

### Postman Collections
Access the Postman collection for API testing:
https://documenter.getpostman.com/view/39168679/2sAYJ98x9m

### Documentation for Backend Details
Detailed documentation for backend implementation can be found here:
https://docs.google.com/document/d/1vbbBGNKq4GhZM5hxhN-bqv9uMdS8RRFmMcKSUCka6Q4/edit?tab=t.0

