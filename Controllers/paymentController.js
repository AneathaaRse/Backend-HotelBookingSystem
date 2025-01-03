import Booking from '../Models/Booking.js';
import Payment from '../Models/Payment.js'; // MongoDB payment schema

// Store payment details
export const createPaymentSession = async (req, res) => {
  try {
    const { bookingId, cardDetails } = req.body;

    if (!bookingId || !cardDetails) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and card details are required.",
      });
    }

    // You would normally process the card details through a payment gateway (e.g., Stripe, PayPal, etc.)
    // For now, we just store the details in MongoDB

    const paymentRecord = new Payment({
      bookingId,
      cardNumber: cardDetails.cardNumber,
      expiryDate: cardDetails.expiryDate,
      cvv: cardDetails.cvv,
      status: "success", // Set the status to success (as per the requirements)
      paymentDate: new Date(),
    });

    await paymentRecord.save();

    let booking = await Booking.findOne({
        bookingId: bookingId,
      });

    if(booking){
        booking.paymentStatus="success"
        await booking.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment details stored successfully.",
      paymentDetails: paymentRecord,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Error storing payment details",
      error: error.message,
    });
  }
};
