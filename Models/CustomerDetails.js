import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
 firstName: {  type: String, required: true }, // Guest's first name
  lastName: { type: String,  required: true  }, // Guest's last name
  gender: { type: String }, // Gender of the guest
  countryCode: { type: String, required: true }, // Country code for the contact number
  mobileNo: {  type: String,  required: true  }, // Guest's mobile number
  email: {  type: String,  required: true }, // Guest's email address
  requiresAccessibility: {  type: Boolean,  default: false   }, // Whether the guest needs accessible accommodation
  specialRequests: {   type: String,  default: ""  }, // Any special requests (e.g., vegetarian meals, early check-in)
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
